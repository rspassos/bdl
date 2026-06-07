"use client";

import { useState, useEffect, useCallback } from "react";
import { Player, fetchPlayers } from "@/lib/api";
import Hero from "@/components/Hero";
import StatsCards from "@/components/StatsCards";
import ProgressChart from "@/components/ProgressChart";
import InscricaoForm from "@/components/InscricaoForm";
import PlayerList from "@/components/PlayerList";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadPlayers = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const data = await fetchPlayers();
      setPlayers(data);
      setLastSync(new Date());
    } catch {
      // silently fail on auto-refresh
    } finally {
      setInitialLoading(false);
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const firstLoad = window.setTimeout(() => loadPlayers(), 0);
    const interval = setInterval(() => loadPlayers(), 30000);
    return () => {
      window.clearTimeout(firstLoad);
      clearInterval(interval);
    };
  }, [loadPlayers]);

  function handleInscricaoSuccess(newPlayer: Player) {
    setPlayers((prev) => [...prev, newPlayer]);
    setTimeout(() => loadPlayers(), 3000);
  }

  return (
    <main className="flex-1">
      <Hero />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <StatsCards inscritos={players.length} />
        <ProgressChart inscritos={players.length} />
        <InscricaoForm players={players} onSuccess={handleInscricaoSuccess} />
        <PlayerList
          players={players}
          lastSync={lastSync}
          onRefresh={() => loadPlayers(true)}
          refreshing={refreshing}
          loading={initialLoading}
        />
      </div>
    </main>
  );
}
