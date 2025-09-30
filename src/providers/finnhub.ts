import { request } from "undici";
import type { Candle } from "./types";

const FINNHUB = process.env.FINNHUB_TOKEN!;
const BASE = "https://finnhub.io/api/v1";

async function fetchJSON(url: URL) {
  const { statusCode, body } = await request(url);
  if (statusCode !== 200) throw new Error(`Finnhub error ${statusCode}`);
  return body.json();
}

export async function candles(symbol: string, resolution = "D", fromSec: number, toSec: number): Promise<Candle> {
  const url = new URL(`${BASE}/stock/candle`);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("resolution", resolution);
  url.searchParams.set("from", String(fromSec));
  url.searchParams.set("to", String(toSec));
  url.searchParams.set("token", FINNHUB);
  return await fetchJSON(url) as Candle;
}

export async function companyNews(symbol: string, fromISO: string, toISO: string) {
  const url = new URL(`${BASE}/company-news`);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("from", fromISO);
  url.searchParams.set("to", toISO);
  url.searchParams.set("token", FINNHUB);
  return await fetchJSON(url);
}