# Plan: Math-to-Manim Single-Agent Pipeline

## Overview

A single API endpoint that takes a topic, runs one LLM agent call (with tool-use loop),
and outputs working Manim Python code. The agent reads skill reference files, builds a
knowledge tree, composes a verbose prompt, generates code, and validates it -- all
autonomously in one `generateText` call with tools.

## Architecture

```
POST /api/generate { topic: "heap sort" }
        │
        ▼
┌─────────────────────────────┐
│  Vercel AI SDK generateText │
│  model: gateway("anthropic/claude-sonnet-4-5")│
│  system: <math-to-manim-prompt>          │
│  tools: str_replace_editor, bash         │
│  maxSteps: 20                            │
│                                          │
│  Agent autonomously (full autonomy):     │
│  1. Views reference files via editor     │
│  2. Creates tree JSON via editor         │
│  3. Creates verbose prompt via editor    │
│  4. Creates animation.py via editor      │
│  5. Validates via bash (any commands)    │
│  6. Fixes errors autonomously, iterates  │
└─────────────────────────────┘
        │
        ▼
Response: { code: "from manim import *\n...", files: {...} }
```

## Tech Stack

| Component     | Technology                                |
| ------------- | ----------------------------------------- |
| Runtime       | Node.js / TypeScript                      |
| Framework     | Hono (standalone HTTP server)             |
| AI SDK        | Vercel AI SDK (`ai` package)              |
| AI Gateway    | `@ai-sdk/gateway`                         |
| Anthropic SDK | `@ai-sdk/anthropic` (for MCP tools)       |
| Default Model | `anthropic/claude-sonnet-4-5` via gateway |
| Validation    | Python 3 + Manim (pre-installed on host)  |

## Project Structure

```
manim-agent/
├── package.json
├── tsconfig.json
├── .env                        # GATEWAY_API_KEY, etc.
├── template/                   # Pre-bundled reference files (the "cloned repo")
│   └── math-to-manim/
│       ├── agent-system-prompts.md
│       ├── manim-code-patterns.md
│       ├── reverse-knowledge-tree.md
│       └── verbose-prompt-format.md
├── generated/                  # Output directory (per-request subdirs)
│   └── .gitkeep
├── src/
│   ├── index.ts                # Entry point (Hono server)
│   ├── agent/
│   │   ├── system-prompt.ts    # The complete system prompt string
│   │   └── tools.ts            # Tool definitions (str_replace_editor, bash)
│   ├── api/
│   │   └── generate.ts         # POST /api/generate handler
│   └── lib/
│       └── utils.ts            # Helpers (ID generation, path sanitization)
```

## Implementation Steps

### Step 1: Project Scaffold


- Install dependencies:
  ```
  ai @ai-sdk/gateway @ai-sdk/anthropic hono @hono/node-server zod uuid
  ```
  Plus dev deps: `typescript tsx @types/node @types/uuid`
- Create `tsconfig.json` with `"module": "ESNext"`, `"moduleResolution": "bundler"`
- Create directory structure

### Step 2: Copy Template Reference Files

- Copy the 4 reference files from `.github/skills/math-to-manim/references/` into
  `template/math-to-manim/`
- These are the files the agent will read at runtime via tool calls

### Step 3: Build the System Prompt (`src/agent/system-prompt.ts`)

The system prompt tells the LLM to behave exactly as I did in the conversation above.
It should include:

```
You are an expert Manim animator that follows the Math-to-Manim pipeline.

When given a topic, you MUST:
1. View reference files using the str_replace_editor tool to understand patterns:
   - Use command 'view' with path: template/math-to-manim/reverse-knowledge-tree.md
   - Use command 'view' with path: template/math-to-manim/agent-system-prompts.md
   - Use command 'view' with path: template/math-to-manim/verbose-prompt-format.md
   - Use command 'view' with path: template/math-to-manim/manim-code-patterns.md

2. Execute the 6-agent pipeline IN YOUR REASONING (single pass):
   a. ConceptAnalyzer: Parse the topic → concept, domain, level, goal
   b. PrerequisiteExplorer: Build knowledge tree (depth 3-4)
   c. MathematicalEnricher: Add LaTeX equations to each node
   d. VisualDesigner: Design colors, animations, positions
   e. NarrativeComposer: Write verbose scene-by-scene prompt
   f. CodeGenerator: Produce working Manim CE Python code

3. Create output files using str_replace_editor tool:
   - Use command 'create' for {topic}_tree.json (knowledge tree)
   - Use command 'create' for {topic}_prompt.txt (verbose prompt)
   - Use command 'create' for {topic}_animation.py (Manim Python code)

4. Validate the Python code using bash tool:
   - Run: python3 -m py_compile {topic}_animation.py
   - If errors, fix using str_replace_editor (str_replace or edit commands)
   - Continue iterating until validation succeeds
   - You have full autonomy to run any commands needed

5. Return the final Python code in your last message.

CRITICAL RULES:
- All LaTeX must use raw strings: r"\frac{a}{b}"
- Use Manim Community Edition (from manim import *)
- Always validate before finishing
- Fix and retry autonomously until success (no retry limits)
```

### Step 4: Define Tools (`src/agent/tools.ts`)

**Use Anthropic's MCP tools (text editor + bash) with full autonomy.** Test if they work via AI Gateway first. If provider-defined tools don't work with the gateway, fall back to custom tool implementations with identical schemas.

#### Approach A: Anthropic MCP Tools (Recommended)

```ts
import { anthropic } from "@ai-sdk/anthropic";
import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, resolve, dirname } from "path";

// Text Editor Tool - handles view, create, str_replace, insert operations
export const getTextEditorTool = (outputDir: string) => {
  return anthropic.tools.textEditor_20250728({
    maxCharacters: 50000,
    execute: async ({
      command,
      path,
      file_text,
      old_str,
      new_str,
      insert_line,
      insert_text,
      view_range,
    }) => {
      const fullPath = resolve(path);

      switch (command) {
        case "view":
          if (!existsSync(fullPath)) return `Error: File ${path} not found`;
          const content = readFileSync(fullPath, "utf-8");
          if (view_range) {
            const lines = content.split("\n");
            return lines.slice(view_range[0] - 1, view_range[1]).join("\n");
          }
          return content;

        case "create":
          mkdirSync(dirname(fullPath), { recursive: true });
          writeFileSync(fullPath, file_text, "utf-8");
          return `File created: ${path}`;

        case "str_replace":
          const current = readFileSync(fullPath, "utf-8");
          const updated = current.replace(old_str, new_str);
          writeFileSync(fullPath, updated, "utf-8");
          return `File updated: ${path}`;

        case "insert":
          const lines = readFileSync(fullPath, "utf-8").split("\n");
          lines.splice(insert_line, 0, insert_text);
          writeFileSync(fullPath, lines.join("\n"), "utf-8");
          return `Text inserted at line ${insert_line}`;

        default:
          return `Unknown command: ${command}`;
      }
    },
  });
};

// Bash Tool - full autonomy, no restrictions
export const getBashTool = () => {
  return anthropic.tools.bash_20250124({
    execute: async ({ command, restart }) => {
      if (restart) {
        return "Bash session restarted";
      }
      try {
        const result = execSync(command, {
          timeout: 30000,
          encoding: "utf-8",
          maxBuffer: 1024 * 1024, // 1MB
        });
        return result || "Command executed successfully";
      } catch (error: any) {
        return `Error: ${error.message}\nStderr: ${error.stderr || ""}\nStdout: ${error.stdout || ""}`;
      }
    },
  });
};
```

#### Approach B: Custom Tools (Fallback if Gateway Doesn't Support Provider Tools)

```ts
import { tool } from "ai";
import { z } from "zod";
import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

// Custom text editor tool matching Anthropic's schema
export const textEditor = tool({
  description:
    "View and edit text files. Supports view, create, str_replace, insert commands.",
  parameters: z.object({
    command: z.enum(["view", "create", "str_replace", "insert"]),
    path: z.string().describe("Absolute path to file"),
    file_text: z.string().optional().describe("Content for 'create' command"),
    old_str: z
      .string()
      .optional()
      .describe("String to replace for 'str_replace'"),
    new_str: z
      .string()
      .optional()
      .describe("Replacement string for 'str_replace'"),
    insert_line: z.number().optional().describe("Line number for 'insert'"),
    insert_text: z.string().optional().describe("Text to insert"),
    view_range: z
      .array(z.number())
      .optional()
      .describe("[start_line, end_line] for 'view'"),
  }),
  execute: async ({
    command,
    path,
    file_text,
    old_str,
    new_str,
    insert_line,
    insert_text,
    view_range,
  }) => {
    // Same implementation as Approach A
  },
});

// Custom bash tool with full autonomy
export const bash = tool({
  description: "Execute bash commands with full autonomy",
  parameters: z.object({
    command: z.string().describe("Bash command to execute"),
    restart: z.boolean().optional().describe("Restart the bash session"),
  }),
  execute: async ({ command, restart }) => {
    // Same implementation as Approach A
  },
});
```

**Recommendation:** Start with Approach A. Test if Anthropic's MCP tools work via AI Gateway. If they fail, switch to Approach B (custom implementations with matching schemas).

### Step 5: API Endpoint (`src/api/generate.ts`)

```ts
import { generateText, createGateway } from "ai";
import { SYSTEM_PROMPT } from "../agent/system-prompt";
import { getTextEditorTool, getBashTool } from "../agent/tools";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import { join } from "path";

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
});

// POST /api/generate
// Body: { topic: string, model?: string }
// Response: { code: string, text: string, requestId: string, usage: object }

export async function handleGenerate(req: any) {
  const { topic, model } = req.body;
  const requestId = randomUUID();
  const outputDir = join(process.cwd(), "generated", requestId);

  // Create output directory for this request
  mkdirSync(outputDir, { recursive: true });

  const result = await generateText({
    model: gateway(model || "anthropic/claude-sonnet-4-5"),
    system: SYSTEM_PROMPT,
    prompt: `Create a Manim animation for the topic: ${topic}`,
    tools: {
      str_replace_editor: getTextEditorTool(outputDir),
      bash: getBashTool(),
    },
    maxSteps: 20, // Higher limit for full autonomy
  });

  return {
    requestId,
    code: result.text,
    text: result.text,
    usage: result.usage,
    steps: result.steps?.length || 0,
  };
}
```

### Step 6: Server Entry Point (`src/index.ts`)

Using Hono for lightweight HTTP server:

```ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { handleGenerate } from "./api/generate";

const app = new Hono();

app.post("/api/generate", async (c) => {
  try {
    const body = await c.req.json();
    const result = await handleGenerate({ body });
    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.get("/health", (c) => c.json({ status: "ok" }));

console.log("Server starting on http://localhost:3000");
serve({ fetch: app.fetch, port: 3000 });
```

### Step 7: Validation & Error Recovery

The agent has full autonomy to:

1. Execute any bash commands needed for validation (python3 -m py_compile, pytest, etc.)
2. View files to inspect errors using the text editor tool
3. Fix errors using str_replace or insert commands in the text editor
4. Re-validate after fixes
5. Iterate until success - no retry limits imposed
6. The bash tool returns full error output (stderr, stdout) for the agent to debug

### Step 8: Test End-to-End

#### Phase 1: Test Anthropic MCP Tools with Gateway (Quick Validation)

Create a simple test script to verify if Anthropic's MCP tools work via the AI Gateway:

```ts
// test-gateway-tools.ts
import { generateText, createGateway } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { execSync } from "child_process";

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
});

const testMCPToolsWithGateway = async () => {
  try {
    const result = await generateText({
      model: gateway("anthropic/claude-sonnet-4-5"),
      prompt:
        'Create a file called test.txt with content "Hello World", then run "cat test.txt" to verify',
      tools: {
        str_replace_editor: anthropic.tools.textEditor_20250728({
          execute: async ({ command, path, file_text }) => {
            console.log(`Text editor called: ${command} ${path}`);
            if (command === "create") {
              require("fs").writeFileSync(path, file_text);
              return `File created: ${path}`;
            }
            return `OK`;
          },
        }),
        bash: anthropic.tools.bash_20250124({
          execute: async ({ command }) => {
            console.log("Bash tool called:", command);
            return execSync(command, { encoding: "utf-8" });
          },
        }),
      },
      maxSteps: 5,
    });
    console.log("✅ Anthropic MCP tools work with gateway");
    console.log("Result:", result.text);
    return true;
  } catch (error: any) {
    console.log(
      "❌ Anthropic MCP tools don't work with gateway, will use custom tools",
    );
    console.error(error.message);
    return false;
  }
};

testMCPToolsWithGateway();
```

If the test succeeds, use Approach A. If it fails, update `tools.ts` to use Approach B (custom tools).

#### Phase 2: Full End-to-End Test

1. Start server: `npx tsx src/index.ts`
2. Send request:
   ```bash
   curl -X POST http://localhost:3000/api/generate \
     -H "Content-Type: application/json" \
     -d '{"topic": "heap sort"}'
   ```
3. Verify response contains valid Python code
4. Run: `python3 -m py_compile generated/{id}/*_animation.py`
5. Render: `manim -ql generated/{id}/*_animation.py`

## Security Considerations

- **Path traversal**: Text editor tool should validate paths (restrict to `template/` and `generated/` directories)
- **Command execution**: Bash tool has full autonomy but runs with limited OS permissions. Consider containerization (Docker) for production
- **Timeout**: Set 30s timeout on bash execSync to prevent hanging processes
- **Output size**: Cap text editor maxCharacters to 50KB to prevent memory issues
- **Request timeout**: Set overall request timeout to 120s at the HTTP layer
- **Environment isolation**: Run in isolated environment (container/VM) to limit damage from arbitrary commands

## Key Design Decisions

1. **Use Anthropic's MCP tools (text editor + bash)** — Leverage `anthropic.tools.textEditor_20250728()`
   and `anthropic.tools.bash_20250124()` via AI Gateway. These tools are specifically trained
   into Claude models. If they don't work with the gateway, fall back to custom `tool()`
   definitions that match the same schema.

2. **Full autonomy - no command restrictions** — The bash tool can execute any command,
   the text editor can view/create/edit any file. Security is handled via OS-level permissions
   and containerization, not artificial restrictions. The agent can debug and fix issues
   autonomously without hitting validation barriers.

3. **Single `generateText` call with `maxSteps: 20`** — The Vercel AI SDK handles the
   tool-use loop automatically. Higher maxSteps allows for multiple fix-validate cycles.
   No multi-agent orchestration needed - all happens in one autonomous call.

4. **Text Editor over separate read/write tools** — Anthropic's `textEditor` tool is more
   powerful than separate read/write tools. Supports view, create, str_replace, insert
   operations in one unified interface. Model is trained to use it effectively.

5. **Hono-only approach** — Simple, lightweight HTTP server without Next.js overhead.
   Perfect for a standalone API service. Clean separation of concerns.

6. **AI Gateway only** — Single provider configuration via `createGateway()`. No direct
   Anthropic SDK provider. Model can be swapped via request body (e.g., `anthropic/claude-sonnet-4-5`,
   `anthropic/claude-opus-4`).

7. **Reference files bundled in `template/`** — The 4 reference markdown files ship with
   the server. Agent views them via text editor tool's `view` command, just like reading
   any other file.
