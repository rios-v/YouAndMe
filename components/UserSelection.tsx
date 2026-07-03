"use client";

import { useUser } from "@/lib/user-context";
import { motion } from "framer-motion";

export function UserSelection() {
  const { setUser } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-sm p-8 rounded-3xl text-center"
      >
        <h1 className="text-3xl mb-2 text-[var(--primary-dark)]">Olá!</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Para começar, me diga quem é você:
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setUser("Arthur")}
            className="bg-white py-4 px-6 rounded-2xl shadow-sm border border-[var(--primary-light)] text-[var(--primary-dark)] font-medium text-lg hover:bg-[var(--primary-light)] hover:text-white transition-colors"
          >
            Sou o Arthur
          </button>
          <button
            onClick={() => setUser("Fabíola")}
            className="bg-white py-4 px-6 rounded-2xl shadow-sm border border-[var(--accent)] text-[var(--primary-dark)] font-medium text-lg hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Sou a Fabíola
          </button>
        </div>
      </motion.div>
    </div>
  );
}
