import { useEffect, useState,useRef } from "react";
//import CoinSelector from "./CoinSelector 2";
import ChartDisplay from "./ChartDisplay 2";
import Status from "./Status 2";
import { fetchCoinData } from "./api 2";
import type { CoinMarketChart } from "./api 2";
import { Chart,} from "chart.js";


type Dataset = {
  label: string;
  data: number[];
  borderWidth: number;
  tension: number;
  borderColor: string;
  backgroundColor?: string;
  pointRadius: number;
  hidden?: boolean;
};

const COLOR_MAP: Record<string, string> = {
  bitcoin: "#22d3ee",
  ethereum: "#f87171",
  solana: "#facc15",
  dogecoin: "#34d399",
  "falcon-finance": "#a78bfa",
};

const AVAILABLE_COINS = ["bitcoin", "ethereum", "solana", "dogecoin", "falcon-finance"];

const COIN_NAMES: Record<string, string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  dogecoin: "Dogecoin",
  "falcon-finance": "Falcon Finance",
};

const COIN_SIMULATION = {
  bitcoin: { base: 65000, volatility: 0.02, trend: 1.001 },
  ethereum: { base: 3200, volatility: 0.025, trend: 1.0012 },
  solana: { base: 140, volatility: 0.04, trend: 1.002 },
  dogecoin: { base: 0.15, volatility: 0.06, trend: 1.0015 },
  "falcon-finance": { base: 5, volatility: 0.05, trend: 1.001 },
};

function generateFakePrices(coin: string, days: number) {
  const config = COIN_SIMULATION[coin as keyof typeof COIN_SIMULATION];
  let price = config.base;

  const prices = [];

  for (let i = 0; i < days; i++) {

    const randomChange =
      (Math.random() - 0.5) * config.volatility * price;

    price = price * config.trend + randomChange;

    prices.push([
      Date.now() - i * 86400000,
      Number(price.toFixed(2)),
    ]);
  }

  return prices;
}

export default function Dashboard() {
  const [selectedCoins] = useState<string[]>(AVAILABLE_COINS);
  const [visibleCoins, setVisibleCoins] = useState<Record<string, boolean>>(
    AVAILABLE_COINS.reduce((acc, c) => ({ ...acc, [c]: true }), {})
  );

  const [days] = useState<number>(30);
  const [currency] = useState<string>("eur");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");

  const chartRef = useRef<Chart | null>(null);

  const updateChart = async () => {
    setStatus("📡 Lade Kursdaten...");
    const tempDatasets: Dataset[] = [];
    let tempLabels: string[] = [];

    for (const coinRaw of selectedCoins) {
      const coin = coinRaw.toLowerCase();
      let data: CoinMarketChart | null = null;

      try {
        data = await fetchCoinData(coin, days, currency);
      } catch (err) {
        console.warn("API Fehler:", err);
      }

      
      if (!data?.prices?.length) {
        data = {
          prices: generateFakePrices(coin, days),
        } as CoinMarketChart;
        setStatus("⚠️ API Fehler – Dummy-Daten werden angezeigt");
      }

     
      if (!tempLabels.length) {
        tempLabels = data.prices
          .map((p) =>
            new Date(p[0]).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
          )
          .reverse();
      }

  

      tempDatasets.push({
         label: COIN_NAMES[coin] || coin,
        data: data.prices.map((p) => p[1]).reverse(),
        borderWidth: 2,
        tension: 0.4,
        borderColor: COLOR_MAP[coin] || "#ffffff", 
        backgroundColor: COLOR_MAP[coin] || "#ffffff",
        pointRadius: 0,
        hidden: !visibleCoins[coin],
      });
    }

    setLabels(tempLabels);
    setDatasets(tempDatasets);

    if (chartRef.current) chartRef.current.update();
    if (!status.includes("Dummy")) setStatus("");
  };

  useEffect(() => {
    updateChart(); 
  }, [visibleCoins]);

  return (
    <div className="max-w-5xl mx-auto mt-20 text-white">
      <h1 className="text-4xl font-bold text-center bg-linear-to-r from-cyan-600 to-red-600 bg-clip-text text-transparent mb-10">
        Crypto Kurs Dashboard
      </h1>

     
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {AVAILABLE_COINS.map((coin) => (
          <label key={coin} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={visibleCoins[coin]}
              onChange={(e) =>
                setVisibleCoins((prev) => ({ ...prev, [coin]: e.target.checked }))
              }
            />
            
            {COIN_NAMES[coin]}
          </label>
        ))}
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={updateChart}
          className="py-3 bg-linear-to-r from-cyan-600 to-red-800 text-white font-semibold px-8 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
        >
          Aktualisieren
        </button>
      </div>

      <Status message={status} />

      <ChartDisplay labels={labels} datasets={datasets} ref={chartRef} />
    </div>
  );
}
