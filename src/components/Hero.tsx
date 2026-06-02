"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center py-8 px-4 border-b border-[var(--color-border)]"
    >
      <div className="relative w-36 h-36 mb-4">
        <Image
          src="https://i.imgur.com/iWfbdvr.jpeg"
          alt="BDL Brasil Draft League"
          fill
          className="object-contain rounded-lg"
          priority
        />
      </div>
      <h1 className="font-['Rajdhani'] text-2xl font-bold tracking-[0.12em] text-[var(--color-gold)] text-center">
        INSCRIÇÕES ABERTAS
      </h1>
      <p className="text-xs text-[var(--color-text-muted)] tracking-[0.2em] text-center uppercase mt-0.5">
        Temporada 2026 · Fase de Draft
      </p>
    </motion.div>
  );
}
