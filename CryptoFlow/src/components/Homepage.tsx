import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { animate } from "motion"
import Dashboard from "./Dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Coin = {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
}

const HERO_TEXT = ["Welcome to CryptoFlow", "Track, Analyze and Trade", "Real-Time Data and Insights"]

const Homepage = () => {
    const [coins, setCoins] = useState<Coin[]>([])
    const [displayText, setDisplayText] = useState("")
    const [cursorBlink, setCursorBlink] = useState(false)
    const phraseIdxRef = useRef(0)
    const charIdxRef = useRef(0)
    const isDeletingRef = useRef(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    const loadData = () => {
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin,ethereum,tether,solana,dogecoin")
        .then(response => response.json())
        .then(data => setCoins(data))
        .catch(error => console.error("Error loading coins:", error))
    }
    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
      const type = () => {
        const phrase = HERO_TEXT[phraseIdxRef.current]

        if (!isDeletingRef.current) {
          charIdxRef.current = Math.min(charIdxRef.current + 1, phrase.length)
          setDisplayText(phrase.slice(0, charIdxRef.current))

          if (charIdxRef.current === phrase.length) {
            setCursorBlink(true)
            timeoutRef.current = setTimeout(() => {
              setCursorBlink(false)
              isDeletingRef.current = true
              timeoutRef.current = setTimeout(type, 40)
            }, 1800)
            return
          }

          // Slight natural variation in typing speed
          timeoutRef.current = setTimeout(type, 55 + Math.random() * 45)
        } else {
          charIdxRef.current = Math.max(charIdxRef.current - 1, 0)
          setDisplayText(phrase.slice(0, charIdxRef.current))

          if (charIdxRef.current === 0) {
            isDeletingRef.current = false
            phraseIdxRef.current = (phraseIdxRef.current + 1) % HERO_TEXT.length
            setCursorBlink(true)
            timeoutRef.current = setTimeout(() => {
              setCursorBlink(false)
              timeoutRef.current = setTimeout(type, 10)
            }, 400)
            return
          }

          timeoutRef.current = setTimeout(type, 30 + Math.random() * 20)
        }
      }

      timeoutRef.current = setTimeout(type, 700)
      return () => clearTimeout(timeoutRef.current)
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
          <h1 className="text-6xl sm:text-8xl font-bold inline-flex items-center justify-center flex-wrap gap-x-2 min-h-[1.2em]">
            <span className="bg-linear-to-r from-cyan-600 to-red-700 bg-clip-text text-transparent">
              {displayText}
            </span>
            <motion.span
              className="inline-block w-[4px] rounded-sm bg-cyan-500 self-stretch"
              animate={{ opacity: cursorBlink ? [1, 0] : 1 }}
              transition={
                cursorBlink
                  ? { duration: 0.55, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                  : { duration: 0 }
              }
            />
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
            <button className="py-3 px-8 border border-gray-600 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer">
              Watch Demo
            </button>
          </div>
        </div>

        <div className='w-full max-w-5xl mx-auto px-4 py-12'>
          <h2 className='text-3xl font-bold bg-linear-to-r from-cyan-500 to-red-600 bg-clip-text text-transparent text-center mb-12 mt-10'>
            Top Trending Coins
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {coins.map((coin) => {
              const isPositive = coin.price_change_percentage_24h > 0
              return (
                <motion.div
                  key={coin.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Card className="h-full gap-2 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-0">
                      <div className="flex items-center gap-2">
                        <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                        <div>
                          <CardTitle className="text-sm font-semibold leading-tight">{coin.name}</CardTitle>
                          <span className="text-[11px] font-medium uppercase text-muted-foreground tracking-wide">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-1">
                      <p className="text-base font-bold text-foreground">
                        €{coin.current_price.toLocaleString()}
                      </p>
                      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isPositive
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-red-500/15 text-red-500"
                      }`}>
                        {isPositive ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
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
