import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import type { Chart as ChartJS, ChartData, ChartDataset } from "chart.js";

type ChartDisplayProps = {
  labels: string[];
  datasets: ChartDataset<"line", number[]>[];
};

export default function ChartDisplay({ labels, datasets }: ChartDisplayProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: { labels, datasets } as ChartData<"line">,
      options: {
        responsive: true,
        interaction: { mode: "index", intersect: false },
      },
    });

    return () => chartInstance.current?.destroy();
  }, [labels, datasets]);

  return <canvas ref={chartRef} />;
}