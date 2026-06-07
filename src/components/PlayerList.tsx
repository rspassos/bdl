"use client";

import { RefreshCw, List, Loader2 } from "lucide-react";
import { Player } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface PlayerListProps {
  players: Player[];
  lastSync: Date | null;
  onRefresh: () => void;
  refreshing: boolean;
  loading: boolean;
}

export default function PlayerList({ players, lastSync, onRefresh, refreshing, loading }: PlayerListProps) {
  const syncText = lastSync
    ? `Última atualização: ${lastSync.toLocaleTimeString("pt-BR")}`
    : "";

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
        <h2 className="font-['Rajdhani'] text-base font-semibold text-white flex items-center gap-2">
          <List size={18} className="text-[var(--color-gold)]" />
          Players Inscritos
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] hover:text-white transition-all duration-150"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin-slow" : ""} />
          atualizar
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 py-8 text-[var(--color-text-muted)] text-sm"
            >
              <Loader2 size={16} className="animate-spin" />
              Carregando inscritos...
            </motion.div>
          ) : players.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-[var(--color-text-muted)] text-sm"
            >
              Nenhum inscrito ainda. Seja o primeiro!
            </motion.div>
          ) : (
            players.map((p, i) => (
              <motion.div
                key={p.nick + p.whatsapp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="flex items-center gap-3 px-3 py-2.5 bg-[var(--color-background)] rounded-lg group hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <span className="font-['Rajdhani'] font-bold text-sm text-[var(--color-text-muted)] min-w-[24px] text-center">
                  {i + 1}
                </span>
                <span className="font-semibold text-sm text-white flex-1 truncate">
                  {p.nick}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] max-w-[160px] truncate">
                  {p.discord}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {syncText && (
        <div className="text-[11px] text-[var(--color-text-muted)] text-center mt-3">
          {syncText}
        </div>
      )}
    </div>
  );
}
