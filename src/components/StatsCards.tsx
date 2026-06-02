"use client";

import { Users, Target } from "lucide-react";
import { MIN_PLAYERS } from "@/lib/api";

interface StatsCardsProps {
  inscritos: number;
}

export default function StatsCards({ inscritos }: StatsCardsProps) {
  const faltam = Math.max(0, MIN_PLAYERS - inscritos);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 text-center group hover:border-[#2ea855]/40 transition-colors duration-200">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Users size={14} className="text-[var(--color-text-muted)]" />
          <span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
            Inscritos
          </span>
        </div>
        <div className="font-['Rajdhani'] text-4xl font-bold text-[#2ea855] leading-none">
          {inscritos}
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 text-center group hover:border-[#c8a020]/40 transition-colors duration-200">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Target size={14} className="text-[var(--color-text-muted)]" />
          <span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
            Faltam
          </span>
        </div>
        <div className="font-['Rajdhani'] text-4xl font-bold text-[#c8a020] leading-none">
          {faltam}
        </div>
      </div>
    </div>
  );
}
