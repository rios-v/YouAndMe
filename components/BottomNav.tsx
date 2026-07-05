"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Clock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/timeline", label: "Momentos", icon: Clock },
    { href: "/", label: "Nós", icon: Heart },
    { href: "/letters", label: "Cartas", icon: Mail },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50 pointer-events-none">
      <nav
        className="rounded-4xl max-w-sm mx-auto flex justify-between items-center pointer-events-auto border border-white/40"
        style={{
          padding: "6px 24px",
          background: "var(--bg-glass)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transform: "translateZ(0)",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center justify-center"
            >
              <div
                className="relative flex flex-col items-center justify-center rounded-2xl"
                style={{ padding: isActive ? "10px 18px" : "10px 14px" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavBubble"
                    className="absolute inset-0 rounded-3xl -z-10"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary-light), var(--primary))",
                      willChange: "transform",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}

                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.4 : 2}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-white scale-110" : "text-[var(--text-muted)] scale-100"
                  }`}
                  style={{ transition: "transform 0.25s ease, color 0.2s ease" }}
                />

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] font-semibold text-white whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}