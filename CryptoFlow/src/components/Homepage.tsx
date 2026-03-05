import { useEffect, useState } from "react"

type Coin = {
    id: string
    name: string
    symbol: string
    image: string
    current_price: number
    market_cap: number
    price_change_percentage_24h: number
  }
const Homepage = () => {
    const [coins, setCoins] = useState<Coin[]>([])

  const loadData = () => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,dogecoin,falcon-finance')
    .then(response => response.json())
    .then(data => setCoins(data))
    .catch(error => console.error('Error loading data:', error))
  }

  useEffect(() => {
    loadData()
  }, [])
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
    <div>
       <h1 className='text-8xl font-bold bg-linear-to-r from-cyan-600 to-red-700 bg-clip-text text-transparent ml-25'>Welcome to CryptoFlow</h1>
       <p className='text-gray-500 text-center px-7 justify-left py-4 w-3/4 ml-20'>Experience the future of crypto with our advanced analytics and insights,
         real-time data visualization, and seamless integration with your favorite exchanges all in one stunning 
         platform.</p>
       <div className='flex gap-4 mt-7 items-center justify-center -ml-70'>
        <button className='py-3 bg-linear-to-r from-cyan-600 to-red-800 text-white font-semibold px-8 rounded-full hover:opacity-90 transition-opacity cursor-pointer'>
          Start Trading Now →
        </button>
        <button className='py-3 px-8 border border-gray-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer'>
          Watch Demo
        </button>
      </div>
    </div>

    <section className='w-full max-w-7xl mx-auto px-4 py-12'>
        <h2 className='text-3xl font-bold bg-linear-to-r from-cyan-600 to-red-700 bg-clip-text text-transparent text-center mb-8 -ml-50 mt-10'>Top Trending Coins</h2>
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
    </section>
    </div>
  );
};

export default Homepage;

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