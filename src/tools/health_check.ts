export async function health_check({ market = "KRX" }: { market?: "KRX" | "US" }) {
  // 간단 데모 리턴 (실전: 지수 캔들, 변동성, ADX 등 추가)
  return {
    market,
    summary: market === "KRX" ? "KOSPI/KOSDAQ 관망 구간 가정(데모)" : "S&P/Nasdaq 강세 가정(데모)",
    indices: market === "KRX" ? ["KOSPI", "KOSDAQ"] : ["S&P 500", "NASDAQ 100"]
  };
}