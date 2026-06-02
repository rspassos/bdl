const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyY3B_2GTa7qssOfkX9QJFfvURKOfcTDe1BqiScVh4ZEZuSbapEJCSfSU72K3kHRbJQ/exec";

export const MIN_PLAYERS = 24;

export interface Player {
  nome: string;
  whatsapp: string;
  discord: string;
  nick: string;
}

export interface InscricaoPayload {
  nome: string;
  whatsapp: string;
  discord: string;
  nick: string;
  ts: string;
}

export async function fetchPlayers(): Promise<Player[]> {
  const r = await fetch(SCRIPT_URL, { method: "GET", mode: "cors" });
  const text = await r.text();
  const data = JSON.parse(text);
  return data.players ?? [];
}

export async function submitInscricao(payload: InscricaoPayload): Promise<void> {
  await fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function normalizeWpp(w: string): string {
  return String(w).replace(/\D/g, "");
}
