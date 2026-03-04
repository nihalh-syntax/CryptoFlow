import { useEffect, useState } from "react";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
};

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);

  const loadData = () => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={page}>

      <div style={header}>
        <h1 style={{ margin: 0 }}>Crypto Dashboard</h1>

        <button style={button} onClick={loadData}>
          Refresh Prices
        </button>
      </div>

      <div style={grid}>
        {coins.map((coin) => (
          <div key={coin.id} style={card}>

            <h2 style={{ marginBottom: "10px" }}>
              {coin.name}
            </h2>

            <p style={price}>
              ${coin.current_price}
            </p>

            <p
              style={{
                color:
                  coin.price_change_percentage_24h > 0
                    ? "#16c784"
                    : "#ea3943",
              }}
            >
              {coin.price_change_percentage_24h.toFixed(2)} %
            </p>

          </div>
        ))}
      </div>

    </div>
  );
}

const page = {
  background: "#0f172a",
  minHeight: "100vh",
  padding: "40px",
  color: "white",
  fontFamily: "Arial",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
};

const button = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const grid = {
  display: "flex",
  gap: "25px",
  flexWrap: "wrap" as const,
};

const card = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "12px",
  width: "200px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
};

const price = {
  fontSize: "22px",
  fontWeight: "bold",
};

export default App;