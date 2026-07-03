"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTimeTogether, formatTimeTogether } from "@/lib/dates";
import { useUser } from "@/lib/user-context";

export default function Home() {
  const { user } = useUser();
  const [firstConvo, setFirstConvo] = useState<{ days: number; months: number; years: number; totalDays: number } | null>(null);
  const [dating, setDating] = useState<{ days: number; months: number; years: number; totalDays: number } | null>(null);

  useEffect(() => {
    
    const dateConvo = new Date(2025, 4, 9); 
    const dateDating = new Date(2025, 6, 17); 

    setFirstConvo(getTimeTogether(dateConvo));
    setDating(getTimeTogether(dateDating));

    const interval = setInterval(() => {
      setFirstConvo(getTimeTogether(dateConvo));
      setDating(getTimeTogether(dateDating));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative h-[45vh] w-full rounded-b-[40px] overflow-hidden shadow-sm">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/couple-photo.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] to-transparent opacity-90" />
        <div className="absolute inset-0 bg-[var(--primary-dark)] opacity-20" />
        
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[var(--primary-dark)] text-center drop-shadow-md"
          >
            NósDois
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-[var(--text-secondary)] mt-2 font-medium"
          >
            Oi, {user}! 💜
          </motion.p>
        </div>
      </div>

      <div className="container mt-6 flex flex-col gap-5 relative z-10 pb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-3xl"
        >
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Primeira Conversa</h2>
          <div className="text-3xl font-bold text-gradient mb-1">
            {firstConvo ? formatTimeTogether(firstConvo) : "..."}
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            {firstConvo ? `${firstConvo.totalDays} dias desde 09/05/2025` : ""}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 rounded-3xl border border-[var(--accent)]"
        >
          <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Nosso Namoro</h2>
          <div className="text-3xl font-bold text-[var(--primary-dark)] mb-1">
            {dating ? formatTimeTogether(dating) : "..."}
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            {dating ? `${dating.totalDays} dias desde 17/07/2025` : ""}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
