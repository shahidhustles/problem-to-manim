# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Math-to-Manim AI: A TypeScript API server that transforms any topic into professional Manim (Python math animation library) code using a single LLM call with tool-use loops.

## Commands

```bash
# Development (hot reload)
npm run dev

# Build TypeScript
npm run build

# Production
npm run start

# Test the API
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "heap sort"}'

# Validate generated Manim code
python3 -m py_compile generated/{requestId}/*_animation.py
```

## Environment Variables

Requires `.env` with:
- `AI_GATEWAY_API_KEY` - Vercel AI Gateway API key (or provider-specific key)
- `PORT` (optional) - Server port, defaults to 3000

## Architecture

### Request Flow
```
POST /api/generate { topic } 
  → generateText() with Anthropic Claude via AI Gateway
  → Agent reads template skill files via text editor tool
  → Agent executes six-agent pipeline in reasoning (single LLM call)
  → Agent creates output files via text editor tool
  → Agent validates Python via bash tool
  → Returns generated code
```

### Key Components

- `src/index.ts` - Hono HTTP server entry point
- `src/api/generate.ts` - Main generation endpoint handler using Vercel AI SDK `generateText()`
- `src/agent/system-prompt.ts` - System prompt instructing the LLM on the six-agent workflow
- `src/agent/tools.ts` - Anthropic MCP tools: `textEditor_20250728` and `bash_20250124`

### Six-Agent Pipeline (Conceptual)

The system prompt guides the LLM to act as six sequential "agents" in one pass:
1. **ConceptAnalyzer** - Parse topic into concept/domain/level/goal
2. **PrerequisiteExplorer** - Build knowledge tree via recursive prerequisite discovery
3. **MathematicalEnricher** - Add LaTeX equations to each tree node
4. **VisualDesigner** - Specify colors, animations, camera movements
5. **NarrativeComposer** - Generate verbose scene-by-scene prompt (2000+ tokens)
6. **CodeGenerator** - Produce working Manim CE Python code

### Template/Skill Files

Located in `template/math-to-manim/`:
- `SKILL.md` - Pipeline overview (read first by the agent)
- `reverse-knowledge-tree.md` - Prerequisite discovery algorithm
- `agent-system-prompts.md` - Detailed prompts for each conceptual agent
- `verbose-prompt-format.md` - Scene prompt structure
- `manim-code-patterns.md` - Manim code patterns and anti-patterns
- `examples/pythagorean-theorem/` - Complete worked example

### Output Directory

Generated files go to `generated/{requestId}/`:
- `{topic}_tree.json` - Knowledge tree
- `{topic}_prompt.txt` - Verbose narrative prompt  
- `{topic}_animation.py` - Manim Python code

## Code Patterns

### LaTeX in Manim
Always use raw strings:
```python
MathTex(r"\frac{a}{b}")  # Correct
MathTex("\\frac{a}{b}")  # Wrong - escape issues
```

### Tool Definitions
Tools use Anthropic's MCP tool wrappers with custom `execute` implementations:
```typescript
anthropic.tools.textEditor_20250728({ execute: async (...) => {...} })
anthropic.tools.bash_20250124({ execute: async (...) => {...} })
```

### AI SDK Usage
Uses `gateway()` from `ai` package for model routing:
```typescript
model: gateway("anthropic/claude-sonnet-4.5")
```

## Dependencies

- **Hono** - Lightweight HTTP framework
- **Vercel AI SDK** (`ai`, `@ai-sdk/gateway`, `@ai-sdk/anthropic`) - LLM orchestration
- **Manim CE** - Required on host for validation/rendering (Python)
