import { companyNews } from "../providers/finnhub";

export async function news_summarize({ tickers = [] as string[] }) {
  const to = new Date();
  const from = new Date(Date.now() - 7 * 86400_000);
  const toISO = to.toISOString().slice(0, 10);
  const fromISO = from.toISOString().slice(0, 10);

  const out: Record<string, { title: string; url: string }[]> = {};
  for (const t of tickers) {
    try {
      const list = await companyNews(t, fromISO, toISO);
      out[t] = (list || []).slice(0, 5).map((n: any) => ({ title: n.headline, url: n.url }));
    } catch (e) {
      out[t] = [];
    }
  }
  return out;
}