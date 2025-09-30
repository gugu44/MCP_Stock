import type { Handler } from "@netlify/functions";
import { ReadableStream } from "node:stream/web";
import { json, rpcOk, rpcErr } from "./utils";
import { route } from "./mcp-router";

export const handler: Handler = async (event) => {
  const path = event.path || "";

  // SSE (옵션)
  if (event.httpMethod === "GET" && path.endsWith("/mcp/stream")) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("data: online\n\n"));
        controller.close();
      }
    });
    return new Response(stream, { headers: { "content-type": "text/event-stream" } });
  }

  if (event.httpMethod !== "POST") return json({ error: "POST only" }, 405);

  const auth = process.env.MCP_BEARER;
  if (auth) {
    const header = (event.headers["authorization"] || event.headers["Authorization"])
    if (!header || !header.startsWith("Bearer ") || header.slice(7) !== auth) {
      return json({ error: "Unauthorized" }, 401);
    }
  }

  const body = JSON.parse(event.body || "{}");
  const { id, method, params } = body;
  const userId = String(event.headers["x-user-id"] || "anon");

  try {
    const result = await route(method, params, userId);
    return json(rpcOk(id ?? null, result));
  } catch (e: any) {
    return json(rpcErr(id ?? null, -32000, e?.message || "Server error"), 500);
  }
};