import { candles } from "../providers/finnhub";

export async function backtest_simple({ ticker, rule }: { ticker: string; rule: "SMA20>SMA60" | "MOM60>0" }) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 200 * 86400; // 200일
  const c = await candles(ticker, "D", from, to);
  const px = c.c ?? [];

  const sma = (arr: number[], w: number, i: number) => {
    if (i + 1 < w) return NaN;
    let s = 0; for (let k = i - w + 1; k <= i; k++) s += arr[k];
    return s / w;
  };

  let pos = false; let equity = 1;
  for (let i = 1; i < px.length; i++) {
    const r = px[i] / px[i - 1] - 1;
    let sig = false;
    if (rule === "MOM60>0") sig = px[i] / px[Math.max(0, i - 60)] - 1 > 0;
    if (rule === "SMA20>SMA60") sig = sma(px, 20, i) > sma(px, 60, i);
    if (pos) equity *= 1 + r;
    pos = !!sig;
  }
  return { ticker, rule, equity };
}