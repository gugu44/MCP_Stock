import { candles } from "../providers/finnhub";

export type RecommendInput = {
  universe?: "KRX" | "US";
  n?: number;
  lookback_days?: number;
  weights?: { momentum?: number; volatility?: number; turnover?: number };
};

const DEFAULTS = { n: 6, lookback_days: 60, weights: { momentum: 0.6, volatility: -0.2, turnover: 0.2 } } as const;

// 데모 유니버스 — 실전에선 KV/Blobs로 대체하고 스케줄러로 동기화
const KRX = ["005930.KS","000660.KS","035420.KS","051910.KS","068270.KS","207940.KS","012330.KS"]; // 삼성전자, 하이닉스, 네이버...
const US  = ["AAPL","MSFT","NVDA","AMZN","META","AVGO","TSLA"];

export async function recommend(args: RecommendInput) {
  const cfg = { ...DEFAULTS, ...args };
  const tickers = cfg.universe === "US" ? US : KRX;
  const to = Math.floor(Date.now() / 1000);
  const from = to - (cfg.lookback_days! + 1) * 86400;

  const scored: { ticker: string; score: number; mom: number; vol: number; tov: number }[] = [];

  for (const t of tickers) {
    const c = await candles(t, "D", from, to);
    if (!c?.c?.length) continue;
    const close = c.c;
    const vol = c.v;
    const mom = close.at(-1)! / close[0] - 1; // 단순 모멘텀
    const ret = close.map((v, i) => (i ? v / close[i - 1] - 1 : 0)).slice(1);
    const stdev = Math.sqrt(ret.reduce((s, r) => s + r * r, 0) / Math.max(ret.length, 1));
    const turnover = (vol.at(-1) ?? 0) * (close.at(-1) ?? 0);
    const w = cfg.weights!;
    const score = (w.momentum ?? 0.6) * mom + (w.volatility ?? -0.2) * stdev + (w.turnover ?? 0.2) * Math.log10(turnover + 1);
    scored.push({ ticker: t, score, mom, vol: stdev, tov: turnover });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, cfg.n);
}