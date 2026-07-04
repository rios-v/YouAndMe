"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { MessageCircleHeart, Heart, Sparkles, CalendarHeart } from "lucide-react";
import { getTimeTogether, formatTimeTogether } from "@/lib/dates";
import { useUser } from "@/lib/user-context";

const LOVE_QUOTES = [
  "Cada dia que passo com você é mais uma certeza que te quero para sempre.",
  "Eu te amo infinitamente!",
  "Você é o meu lugar favorito.",
  "Você é minha princesinha.",
  "Tenho muito orgulho de você!",
];

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value]);

  return <>{display}</>;
}

function StatCard({
  icon: Icon,
  label,
  time,
  since,
  totalDays,
  accentFrom,
  accentTo,
  delay,
  direction,
}: {
  icon: typeof Heart;
  label: string;
  time: { days: number; months: number; years: number; totalDays: number } | null;
  since: string;
  totalDays: number | null;
  accentFrom: string;
  accentTo: string;
  delay: number;
  direction: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 * direction, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-3xl p-7"
      style={{
        background: "var(--card-bg, rgba(255,255,255,0.7))",
        backdropFilter: "blur(12px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <motion.div
        className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-30 blur-2xl pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex items-start gap-4">
        <motion.div
          className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
          style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
          whileHover={{ rotate: 8, scale: 1.05 }}
        >
          <Icon size={24} className="text-white" strokeWidth={2.2} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            {label}
          </h2>

          <div className="text-[24px] font-bold text-[var(--primary-dark)] leading-tight mb-1.5 flex flex-wrap gap-x-1.5">
            {time && (
              <>
                {time.years > 0 && (
                  <span>
                    <AnimatedNumber value={time.years} /> ano{time.years !== 1 ? "s" : ""}
                  </span>
                )}
                {time.months > 0 && (
                  <span>
                    <AnimatedNumber value={time.months} /> mês{time.months !== 1 ? "es" : ""}
                  </span>
                )}
                <span>
                  <AnimatedNumber value={time.days} /> dia{time.days !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>

          <p className="text-[var(--text-secondary)] text-xs">
            {totalDays !== null ? `${totalDays} dias desde ${since}` : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function getNextMonthiversary(anniversaryDate: Date) {
  const today = new Date();
  const next = new Date(today.getFullYear(), today.getMonth(), anniversaryDate.getDate());
  if (next <= today) {
    next.setMonth(next.getMonth() + 1);
  }
  const diffMs = next.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return { date: next, daysLeft };
}

export default function Home() {
  const { user } = useUser();
  const [firstConvo, setFirstConvo] = useState<{ days: number; months: number; years: number; totalDays: number } | null>(null);
  const [dating, setDating] = useState<{ days: number; months: number; years: number; totalDays: number } | null>(null);
  const [quote] = useState(() => LOVE_QUOTES[Math.floor(Math.random() * LOVE_QUOTES.length)]);

  const dateDating = new Date(2025, 6, 17);
  const [milestone, setMilestone] = useState(() => getNextMonthiversary(dateDating));

  useEffect(() => {
    const dateConvo = new Date(2025, 4, 9);

    setFirstConvo(getTimeTogether(dateConvo));
    setDating(getTimeTogether(dateDating));
    setMilestone(getNextMonthiversary(dateDating));

    const interval = setInterval(() => {
      setFirstConvo(getTimeTogether(dateConvo));
      setDating(getTimeTogether(dateDating));
      setMilestone(getNextMonthiversary(dateDating));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[var(--primary-light)] opacity-20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <Heart size={28 + (i % 3) * 10} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="relative h-[42vh] w-full rounded-b-[40px] overflow-hidden shadow-sm">
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
            Nós Dois
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

      <div className="container mt-6 flex flex-col gap-5 relative z-10 pb-20">
        <StatCard
          icon={MessageCircleHeart}
          label="Primeira Conversa"
          time={firstConvo}
          since="09/05/2025"
          totalDays={firstConvo?.totalDays ?? null}
          accentFrom="#f7b6c2"
          accentTo="#e893a8"
          delay={0.3}
          direction={-1}
        />

        <StatCard
          icon={Heart}
          label="Nosso Namoro"
          time={dating}
          since="17/07/2025"
          totalDays={dating?.totalDays ?? null}
          accentFrom="var(--primary)"
          accentTo="var(--primary-dark)"
          delay={0.4}
          direction={1}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl p-7"
          style={{
            background: "var(--card-bg, rgba(255,255,255,0.7))",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <motion.div
            className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-30 blur-2xl pointer-events-none"
            style={{ background: "linear-gradient(135deg, #f7b6c2, #e893a8" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex items-start gap-4">
            <motion.div
              className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
              style={{ background: "linear-gradient(135deg, #f7b6c2, #e893a8)" }}
              whileHover={{ rotate: 8, scale: 1.05 }}
            >
              <CalendarHeart size={24} className="text-white" strokeWidth={2.2} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Próximo Mêsversário
              </h2>
              <p className="text-[24px] font-bold text-[var(--primary-dark)] leading-tight mb-1.5">
                Faltam <AnimatedNumber value={milestone.daysLeft} /> dia{milestone.daysLeft !== 1 ? "s" : ""}
              </p>
              <p className="text-[var(--text-secondary)] text-xs">
                {milestone.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-14 text-center"
          style={{
            background: "var(--card-bg, rgba(255,255,255,0.7))",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <p className="text-[var(--primary-dark)] text-base font-medium italic leading-relaxed">
            "{quote}"
          </p>
        </motion.div>
      </div>
    </div>
  );
}