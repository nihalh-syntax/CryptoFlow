import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const COINS = [
  { id: "bitcoin",     label: "Bitcoin",  symbol: "BTC", color: "var(--chart-1)" },
  { id: "ethereum",    label: "Ethereum", symbol: "ETH", color: "var(--chart-2)" },
  { id: "solana",      label: "Solana",   symbol: "SOL", color: "var(--chart-3)" },
  { id: "binancecoin", label: "BNB",      symbol: "BNB", color: "var(--chart-4)" },
  { id: "cardano",     label: "Cardano",  symbol: "ADA", color: "var(--chart-5)" },
] as const

type PricePoint = {
  date: string
  price: number
}

async function fetchMarketChart(coinId: string, days: number): Promise<PricePoint[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  )
  if (!res.ok) throw new Error(`CoinGecko responded with status ${res.status}`)
  const json = await res.json() as { prices: [number, number][] }
  return json.prices.map(([ts, price]) => ({
    date: new Date(ts).toISOString(),
    price,
  }))
}

const REFRESH_MS = 60_000

export default function CryptoChart() {
  const [coinId, setCoinId] = React.useState("bitcoin")
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState<PricePoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null)

  const coin = COINS.find((c) => c.id === coinId) ?? COINS[0]
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 91

  const fetchData = React.useCallback(async () => {
    try {
      setError(null)
      const data = await fetchMarketChart(coinId, days)
      setChartData(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }, [coinId, days])

  React.useEffect(() => {
    setLoading(true)
    setChartData([])
    fetchData()
    const timer = setInterval(fetchData, REFRESH_MS)
    return () => clearInterval(timer)
  }, [fetchData])

  const chartConfig = React.useMemo<ChartConfig>(
    () => ({ price: { label: `${coin.label} (USD)`, color: coin.color } }),
    [coin]
  )

  const currentPrice = chartData.at(-1)?.price
  const firstPrice = chartData[0]?.price
  const priceChange =
    currentPrice != null && firstPrice != null
      ? ((currentPrice - firstPrice) / firstPrice) * 100
      : null
  const isPositive = priceChange != null && priceChange >= 0

  const formatPrice = (price: number) =>
    price >= 1
      ? `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`

  const formatTick = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex flex-wrap items-center gap-3">
            <span>
              {coin.label}
              <span className="ml-1.5 text-muted-foreground font-normal text-sm">
                {coin.symbol}
              </span>
            </span>
            {currentPrice != null && (
              <span className="text-2xl tabular-nums">{formatPrice(currentPrice)}</span>
            )}
            {priceChange != null && (
              <span
                className={`text-sm font-semibold ${
                  isPositive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {isPositive ? "▲" : "▼"} {Math.abs(priceChange).toFixed(2)}%
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {loading && !chartData.length
              ? "Loading chart data…"
              : error
              ? `Error: ${error}`
              : `Live · Auto-refresh every 60s · Last Updated: ${lastUpdated?.toLocaleTimeString()}`}
          </CardDescription>
        </div>

        <div className="flex gap-2">
          <Select value={coinId} onValueChange={setCoinId}>
            <SelectTrigger
              className="hidden w-[140px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select coin"
            >
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {COINS.map((c) => (
                <SelectItem key={c.id} value={c.id} className="rounded-lg">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[140px] rounded-lg sm:flex"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {error && !chartData.length ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Failed to load chart data — check your connection or CoinGecko rate limits.
          </div>
        ) : loading && !chartData.length ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground animate-pulse">
            Fetching live prices…
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-price)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatTick}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatTick(value as string)}
                    formatter={(value) => [formatPrice(value as number)]}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="price"
                type="monotone"
                fill="url(#fillPrice)"
                stroke="var(--color-price)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
