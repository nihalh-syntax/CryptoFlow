import { forwardRef, useEffect } from "react";
import { type ChartConfiguration } from "chart.js";

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

type Dataset = {
  label: string;
  data: number[];
  borderWidth: number;
  tension: number;
  borderColor: string;
  backgroundColor?: string;
  pointRadius: number;
  hidden?: boolean;
};

type ChartDisplayProps = {
  labels: string[];
  datasets: Dataset[];
};

const ChartDisplay = forwardRef<Chart, ChartDisplayProps>(({ labels, datasets }, ref) => {
  useEffect(() => {
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        animation: { duration: 500 },
        plugins: { legend: { display: true } },
        scales: { x: { display: true }, y: { display: true } },
      },
    };

    const chartInstance = new Chart(ctx, config);

    if (ref) {
      if (typeof ref === "function") {
        ref(chartInstance);
      } else {
        (ref as React.MutableRefObject<Chart | null>).current = chartInstance;
      }
    }

    return () => chartInstance.destroy();
  }, [labels, datasets]);

  return <canvas id="myChart" />;
});

export default ChartDisplay;