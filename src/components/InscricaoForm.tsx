"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { Player, normalizeWpp, submitInscricao, MIN_PLAYERS } from "@/lib/api";

interface InscricaoFormProps {
  players: Player[];
  onSuccess: (player: Player) => void;
}

export default function InscricaoForm({ players, onSuccess }: InscricaoFormProps) {
  const [nome, setNome] = useState("");
  const [wpp, setWpp] = useState("");
  const [discord, setDiscord] = useState("");
  const [nick, setNick] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  function showMsg(text: string, type: "success" | "error") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 7000);
  }

  function formatWhatsapp(value: string) {
    const digits = normalizeWpp(value).slice(0, 11);

    if (digits.length <= 2) {
      return digits ? `(${digits}` : "";
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimNome = nome.trim();
    const trimWpp = wpp.trim();
    const trimDiscord = discord.trim();
    const trimNick = nick.trim();

    if (!trimNome || !trimWpp || !trimDiscord || !trimNick) {
      showMsg("Preencha todos os campos para se inscrever.", "error");
      return;
    }

    const wppNorm = normalizeWpp(trimWpp);
    if (wppNorm.length < 10) {
      showMsg("Digite um WhatsApp válido com DDD.", "error");
      return;
    }

    const wppDup = players.find((p) => normalizeWpp(p.whatsapp) === wppNorm);
    if (wppDup) {
      showMsg(
        `Este WhatsApp já está inscrito com o nick "${wppDup.nick}". Cada jogador pode se inscrever apenas uma vez.`,
        "error"
      );
      return;
    }

    const nickDup = players.find((p) => p.nick.toLowerCase() === trimNick.toLowerCase());
    if (nickDup) {
      showMsg(`O nick "${trimNick}" já está em uso. Escolha outro nick.`, "error");
      return;
    }

    setLoading(true);

    try {
      await submitInscricao({
        nome: trimNome,
        whatsapp: trimWpp,
        discord: trimDiscord,
        nick: trimNick,
        ts: new Date().toISOString(),
      });

      const newPlayer: Player = {
        nome: trimNome,
        whatsapp: trimWpp,
        discord: trimDiscord,
        nick: trimNick,
      };

      setNome("");
      setWpp("");
      setDiscord("");
      setNick("");

      onSuccess(newPlayer);

      const falt = MIN_PLAYERS - (players.length + 1);
      showMsg(
        falt <= 0
          ? `${trimNick} inscrito! Mínimo atingido — campeonato pode começar!`
          : `${trimNick} inscrito com sucesso! Faltam ${falt} players.`,
        "success"
      );
    } catch {
      showMsg("Erro ao enviar inscrição. Tente novamente.", "error");
    }

    setLoading(false);
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
      <h2 className="font-['Rajdhani'] text-base font-semibold text-white mb-4 pb-3 border-b border-[var(--color-border)] flex items-center gap-2">
        <UserPlus size={18} className="text-[var(--color-gold)]" />
        Faça sua inscrição
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inp-name" className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
              Nome completo
            </label>
            <input
              type="text"
              id="inp-name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              maxLength={80}
              className="w-full px-3 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:border-[var(--color-gold)]/50 focus:ring-1 focus:ring-[var(--color-gold)]/20 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inp-wpp" className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
              WhatsApp
            </label>
            <input
              type="tel"
              id="inp-wpp"
              value={wpp}
              onChange={(e) => setWpp(formatWhatsapp(e.target.value))}
              placeholder="(00) 00000-0000"
              inputMode="numeric"
              maxLength={15}
              className="w-full px-3 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:border-[var(--color-gold)]/50 focus:ring-1 focus:ring-[var(--color-gold)]/20 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inp-discord" className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
              Discord
            </label>
            <input
              type="text"
              id="inp-discord"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="usuário ou @usuário"
              maxLength={60}
              className="w-full px-3 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:border-[var(--color-gold)]/50 focus:ring-1 focus:ring-[var(--color-gold)]/20 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inp-nick" className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">
              Nick no campeonato
            </label>
            <input
              type="text"
              id="inp-nick"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              placeholder="Ex: Swensteiger"
              maxLength={40}
              className="w-full px-3 py-2.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-text-muted)]/60 focus:outline-none focus:border-[var(--color-gold)]/50 focus:ring-1 focus:ring-[var(--color-gold)]/20 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#2ea855]/15 text-[#2ea855] border border-[#2ea855]/30 rounded-lg font-['Rajdhani'] text-[15px] font-bold tracking-[0.15em] uppercase cursor-pointer transition-all duration-150 hover:bg-[#2ea855]/25 hover:border-[#2ea855]/50 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <UserPlus size={16} />
          )}
          {loading ? "ENVIANDO..." : "CONFIRMAR INSCRIÇÃO"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-3 px-4 py-3 rounded-lg text-sm leading-relaxed border ${
            message.type === "success"
              ? "bg-[#2ea855]/10 text-[#2ea855] border-[#2ea855]/30"
              : "bg-[#e53e3e]/10 text-[#e53e3e] border-[#e53e3e]/30"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
