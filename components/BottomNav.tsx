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
    <div className="fixed bottom-2.5 left-1.5 right-1.5 p-4 pb-safe z-50 pointer-events-none">
      <nav
        className="glass-panel rounded-4xl max-w-sm mx-auto flex justify-between items-center pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40"
        style={{ padding: "4px 18px" }}
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
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.25, duration: 2 }}
                className="relative flex flex-col items-center justify-center rounded-4xl"
                style={{ padding: isActive ? "10px 18px" : "10px 18px" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavBubble"
                    className="absolute inset-0 rounded-4xl -z-10"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary-light), var(--primary))",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
                >
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={`transition-colors duration-300 ${
                      isActive ? "text-white" : "text-[var(--text-muted)]"
                    }`}
                  />
                </motion.div>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[11px] font-semibold text-white whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}