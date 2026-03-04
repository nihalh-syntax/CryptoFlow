export type CoinMarketChart = {
  prices: [number, number][];
  market_caps?: [number, number][];
  total_volumes?: [number, number][];
};

const cache: Record<string, CoinMarketChart> = {};

export async function fetchCoinData(
  coin: string,
  days: number,
  currency: string
): Promise<CoinMarketChart | null> {

  const key = `${coin}_${days}_${currency}`;
  if (cache[key]) return cache[key];

  const interval = days > 90 ? "daily" : "hourly";

  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${currency}&days=${days}&interval=${interval}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(res.status.toString());
    }

    const data: CoinMarketChart = await res.json();

    cache[key] = data;
    return data;

  } catch (err) {
    console.error("API Fehler:", err);
    return null;
  }
}