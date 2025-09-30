import { recommend } from "./tools/recommend";
import { health_check } from "./tools/health_check";
import { news_summarize } from "./tools/news_summarize";
import { backtest_simple } from "./tools/backtest_simple";
import * as wl from "./tools/watchlist";

export async function route(method: string, params: any, userId: string) {
  if (method !== "tools/call") throw new Error("Unsupported method");
  const name = params?.name;
  const args = params?.arguments || {};

  switch (name) {
    case "recommend_stocks":
      return await recommend(args);
    case "health_check":
      return await health_check(args);
    case "news_summarize":
      return await news_summarize(args);
    case "backtest_simple":
      return await backtest_simple(args);
    case "watchlist_add":
      return await wl.add(userId, args.ticker);
    case "watchlist_list":
      return await wl.list(userId);
    case "watchlist_remove":
      return await wl.remove(userId, args.ticker);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}