import { useState, useCallback } from "react";
import CoinSelector from "./CoinSelector";
import ChartDisplay from "./ChartDisplay";
import Status from "./Status";
import { fetchCoinData } from "./api"; 
import type { CoinMarketChart } from "./api"; 

type Dataset = {
  label: string;
  data: number[];
  borderWidth: number;
};

export default function Dashboard() {
  const [coins, setCoins] = useState<string[]>(["bitcoin"]);
  const [days, setDays] = useState<number>(30);
  const [currency, setCurrency] = useState<string>("eur");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [lastCall, setLastCall] = useState<number>(0);
  const [lastValidDatasets, setLastValidDatasets] = useState<Dataset[] | null>(null);

  const updateChart = useCallback(async () => {
    const now = Date.now();
    if (now - lastCall < 10000) { 
      setStatus("⏳ Bitte 10 Sekunden warten, API Limit schützen");
      return;
    }
    setLastCall(now);

    if (!coins.length) {
      alert("Bitte mindestens einen Coin auswählen");
      return;
    }

    setStatus("📡 Lade Kursdaten...");
    const tempDatasets: Dataset[] = [];
    let tempLabels: string[] = [];

    for (const coin of coins) {
      const data: CoinMarketChart | null = await fetchCoinData(coin, days, currency);
      if (!data?.prices?.length) {
        setStatus("⚠️ API Limit erreicht – letzte Daten werden angezeigt");
        if (lastValidDatasets) {
          setLabels(tempLabels);
          setDatasets(lastValidDatasets);
        }
        return;
      }

      if (!tempLabels.length) {
        tempLabels = data.prices.map(p => new Date(p[0]).toLocaleDateString());
      }

      tempDatasets.push({
        label: coin.toUpperCase(),
        data: data.prices.map(p => p[1]),
        borderWidth: 2,
      });
    }

    setLabels(tempLabels);
    setDatasets(tempDatasets);
    setLastValidDatasets(tempDatasets);
    setStatus("");
  }, [coins, days, currency, lastCall, lastValidDatasets]);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>📈 Krypto Dashboard</h1>
      <CoinSelector
        coins={coins}
        setCoins={setCoins}
        days={days}
        setDays={setDays}
        currency={currency}
        setCurrency={setCurrency}
      />
      <button
        onClick={updateChart}
        style={{ padding: "5px 10px", marginBottom: "10px" }}
      >
        Aktualisieren
      </button>
      <Status message={status} />
      <ChartDisplay labels={labels} datasets={datasets} />
    </div>
  );
}