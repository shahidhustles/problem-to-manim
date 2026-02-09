import { anthropic } from "@ai-sdk/anthropic";
import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

export const getTextEditorTool = () => {
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
        case "view": {
          if (!existsSync(fullPath)) return `Error: File ${path} not found`;
          const content = readFileSync(fullPath, "utf-8");
          if (view_range) {
            const lines = content.split("\n");
            return lines.slice(view_range[0] - 1, view_range[1]).join("\n");
          }
          return content;
        }

        case "create": {
          mkdirSync(dirname(fullPath), { recursive: true });
          writeFileSync(fullPath, file_text!, "utf-8");
          return `File created: ${path}`;
        }

        case "str_replace": {
          if (!existsSync(fullPath))
            return `Error: File ${path} not found for str_replace`;
          const current = readFileSync(fullPath, "utf-8");
          if (!current.includes(old_str!)) {
            return `Error: old_str not found in ${path}`;
          }
          const updated = current.replace(old_str!, new_str!);
          writeFileSync(fullPath, updated, "utf-8");
          return `File updated: ${path}`;
        }

        case "insert": {
          if (!existsSync(fullPath))
            return `Error: File ${path} not found for insert`;
          const lines = readFileSync(fullPath, "utf-8").split("\n");
          lines.splice(insert_line!, 0, insert_text!);
          writeFileSync(fullPath, lines.join("\n"), "utf-8");
          return `Text inserted at line ${insert_line} in ${path}`;
        }

        default:
          return `Unknown command: ${command}`;
      }
    },
  });
};

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
          maxBuffer: 1024 * 1024,
        });
        return result || "Command executed successfully (no output)";
      } catch (error: any) {
        return `Error: ${error.message}\nStderr: ${error.stderr || ""}\nStdout: ${error.stdout || ""}`;
      }
    },
  });
};
