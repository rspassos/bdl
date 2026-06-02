"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { MIN_PLAYERS } from "@/lib/api";

ChartJS.register(ArcElement, Tooltip);

interface ProgressChartProps {
  inscritos: number;
}

export default function ProgressChart({ inscritos }: ProgressChartProps) {
  const faltam = Math.max(0, MIN_PLAYERS - inscritos);
  const pct = Math.min(100, Math.round((inscritos / MIN_PLAYERS) * 100));

  const data = {
    datasets: [
      {
        data: inscritos === 0 ? [0.001, MIN_PLAYERS] : [inscritos, faltam],
        backgroundColor: ["#2ea855", "#c8a020"],
        borderColor: ["#1a6a35", "#8a6a10"],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: {
      animateRotate: true,
      duration: 700,
    },
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
      {/* Chart */}
      <div className="relative w-40 h-40 flex-shrink-0">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-['Rajdhani'] text-3xl font-bold text-white">
            {pct}%
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] tracking-wide">
            do mínimo
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-3 h-3 rounded-sm bg-[#2ea855] flex-shrink-0" />
          <span className="text-sm text-[var(--color-text-muted)]">Inscritos</span>
          <span className="ml-auto font-semibold text-sm text-white">
            {inscritos} player{inscritos !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-sm bg-[#c8a020] flex-shrink-0" />
          <span className="text-sm text-[var(--color-text-muted)]">Vagas abertas</span>
          <span className="ml-auto font-semibold text-sm text-white">
            {faltam} vaga{faltam !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="text-[11px] text-[var(--color-text-muted)] mb-1.5 tracking-wide">
            Progresso até o mínimo ({MIN_PLAYERS} players)
          </div>
          <div className="h-2 bg-[var(--color-background)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1a8c3e] to-[#2ea855] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
