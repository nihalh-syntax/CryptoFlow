import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { animate } from "motion"
import Dashboard from "./Dashboard"

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
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin,ethereum,tether,solana,dogecoin")
        .then(response => response.json())
        .then(data => setCoins(data))
        .catch(error => console.error("Error loading coins:", error))
    }
    useEffect(() => {
        loadData()
    }, [])
    const dashboardRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to dashboard when landing with hash #dashboard
  useEffect(() => {
    if (window.location.hash !== "#homepage") return
    const el = scrollContainerRef.current
    if (el) {
      el.scrollTo({ top: el.clientHeight, behavior: "smooth" })
    }
  }, [])

  const scrollToDashboard = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const targetY = el.clientHeight
    animate(el.scrollTop, targetY, {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => { el.scrollTop = v },
    })
  }

  return (
    <div className="scroll-container h-full" ref={scrollContainerRef}>
      {/* Section 1: Welcome – full viewport, entrance animation */}
      <motion.section
        className="scroll-section flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="text-center px-4">
          <h1 className="text-6xl sm:text-8xl font-bold bg-linear-to-r from-cyan-600 to-red-700 bg-clip-text text-transparent">
            Welcome to CryptoFlow
          </h1>
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg">
            Experience the future of crypto with our advanced analytics and insights,
            real-time data visualization, and seamless integration with your favorite exchanges.
          </p>
          <div className="flex gap-4 mt-10 justify-center flex-wrap">
            <button
              onClick={scrollToDashboard}
              className="py-3 bg-linear-to-r from-cyan-600 to-red-800 text-white font-semibold px-8 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Start Trading Now →
            </button>
            <button className="py-3 px-8 border border-gray-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer">
              Watch Demo
            </button>
          </div>
        </div>

        <div className='w-full max-w-7xl ml-30 px-4 py-12'>
        <h2 className='text-3xl font-bold bg-linear-to-r from-cyan-500 to-red-600 bg-clip-text text-transparent text-center mb-8 -ml-30 mt-10'>Top Trending Coins</h2>
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
      </motion.section>

      {/* Section 2: Dashboard – smooth transition on first scroll */}
      <motion.section
        id="homepage"
        ref={dashboardRef}
        className="scroll-section flex flex-col items-center justify-center py-12"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <Dashboard />
        </div>
      </motion.section>
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