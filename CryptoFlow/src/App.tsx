import { useEffect, useState } from "react";
type Coin = {
  id: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
};
function App() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data));
  }, []);

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Crypto Preise</h1>
{coins.map((coin) => (
  <div key={coin.id}>
    <h2>{coin.name}</h2>
    <p>Preis: ${coin.current_price}</p>
    <p
      style={{
        color:
          coin.price_change_percentage_24h > 0 ? "lime" : "red",
      }}
    >
      24h: {coin.price_change_percentage_24h.toFixed(2)}%
    </p>
  </div>
))}
      
    </div>
  );
}

export default App;