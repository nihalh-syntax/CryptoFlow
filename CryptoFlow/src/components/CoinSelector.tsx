import React from "react";

type CoinSelectorProps = {
  coins: string[];
  setCoins: React.Dispatch<React.SetStateAction<string[]>>;
  days: number;
  setDays: React.Dispatch<React.SetStateAction<number>>;
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
};

export default function CoinSelector({
  coins,
  setCoins,
  days,
  setDays,
  currency,
  setCurrency,
}: CoinSelectorProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
    
      <select
        value={coins}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setCoins([...e.target.selectedOptions].map((o) => o.value))
        }
      >
        <option value="bitcoin">Bitcoin</option>
        <option value="ethereum">Ethereum</option>
        <option value="solana">Solana</option>
        <option value="ripple">Ripple</option>
        <option value="cardano">Cardano</option>
      </select>

     
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <p>letzte Tage</p>
        <input
          type="number"
          min={1}
          max={365}
          value={days}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDays(Number(e.target.value))
          }
        />
      </div>

      
      <select
        value={currency}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setCurrency(e.target.value)
        }
      >
        <option value="eur">EUR</option>
        <option value="usd">USD</option>
      </select>
    </div>
  );
}