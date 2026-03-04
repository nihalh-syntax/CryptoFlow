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

  const updateChart = useCallback(async () => {
    setStatus("📡 Lade Kursdaten...");
    const tempDatasets: Dataset[] = [];
    let tempLabels: string[] = [];

    for (const coin of coins) {
      let data: CoinMarketChart | null = null;

      try {
        data = await fetchCoinData(coin, days, currency);
      } catch (err) {
        console.warn("API Fehler:", err);
      }

      // Wenn API leer oder fehlerhaft → Dummy-Daten verwenden
      if (!data?.prices?.length) {
        console.warn(`Keine Daten für ${coin}, benutze Dummy-Daten`);
        data = {
          prices: Array.from({ length: days }, (_, i) => [
            Date.now() - i * 86400000,
            Math.random() * 50000,
          ]),
        };
        setStatus("⚠️ API Limit oder Fehler – Dummy-Daten werden angezeigt");
      }

      // Labels nur einmal setzen
      if (!tempLabels.length) {
        tempLabels = data.prices.map((p) =>
          new Date(p[0]).toLocaleDateString()
        );
      }

      tempDatasets.push({
        label: coin.toUpperCase(),
        data: data.prices.map((p) => p[1]),
        borderWidth: 2,
      });
    }

    setLabels(tempLabels);
    setDatasets(tempDatasets);

    // Status leeren, wenn echte Daten vorhanden
    if (!status.includes("Dummy")) setStatus("");
  }, [coins, days, currency, status]);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Siehe Kursverlauf des Bitcoins und anderer Coins</h1>

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

      {/* Chart nur rendern, wenn Labels/Datasets existieren */}
      {datasets.length > 0 && labels.length > 0 && (
        <ChartDisplay labels={labels} datasets={datasets} />
      )}
    </div>
  );
}