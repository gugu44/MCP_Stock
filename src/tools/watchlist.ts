import { getStore } from "@netlify/blobs";

const store = getStore({ name: "watchlist", consistency: "strong" });

export async function add(userId: string, ticker: string) {
  const key = `wl:${userId}`;
  const curr = (await store.getJSON<string[]>(key)) || [];
  const next = Array.from(new Set([...(curr || []), ticker].filter(Boolean)));
  await store.setJSON(key, next);
  return { ok: true, size: next.length };
}

export async function list(userId: string) {
  const key = `wl:${userId}`;
  return (await store.getJSON<string[]>(key)) || [];
}

export async function remove(userId: string, ticker: string) {
  const key = `wl:${userId}`;
  const curr = (await store.getJSON<string[]>(key)) || [];
  const next = curr.filter((t) => t !== ticker);
  await store.setJSON(key, next);
  return { ok: true, size: next.length };
}