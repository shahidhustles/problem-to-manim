import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { handleGenerate } from "./api/generate.js";

const app = new Hono();

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Main generation endpoint
app.post("/api/generate", async (c) => {
  console.log("\n📥 Received POST request to /api/generate");
  try {
    const body = await c.req.json();
    console.log("📋 Request body:", JSON.stringify(body, null, 2));

    const result = await handleGenerate(body);

    console.log("✅ Generation completed successfully");
    console.log("📊 Result summary:", {
      requestId: result.requestId,
      steps: result.steps,
      usageTokens: result.usage?.totalTokens,
    });

    return c.json(result);
  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    return c.json(
      {
        error: error.message || "Internal server error",
        details: error.stack,
      },
      500,
    );
  }
});

// Global error handler
app.onError((err, c) => {
  console.error("Uncaught error:", err);
  return c.json(
    {
      error: "Internal server error",
      message: err.message,
    },
    500,
  );
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Start server
const port = Number(process.env.PORT) || 3001;
const server = serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 Server running on http://localhost:${port}`);
console.log(`📡 Health check: http://localhost:${port}/health`);
console.log(`🎬 Generate endpoint: http://localhost:${port}/api/generate`);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n⏸️  Shutting down gracefully...");
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n⏸️  Shutting down gracefully...");
  server.close((err) => {
    if (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
    process.exit(0);
  });
});
