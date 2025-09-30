export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  });
}

export function rpcOk(id: string | number | null, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

export function rpcErr(id: string | number | null, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

export const sec = (ms: number) => Math.floor(ms / 1000);