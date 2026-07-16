"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Clock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/timeline", icon: Clock },
    { href: "/", icon: Heart },
    { href: "/letters", icon: Mail },
  ];

  const activeIndex = navItems.findIndex((item) => item.href === pathname);

  return (
    <div className="fixed bottom-3 left-1.5 right-1.5 p-4 pb-safe z-50 pointer-events-none">
      <nav
        className="glass-panel rounded-4xl max-w-sm mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40"
        style={{ padding: "10px 12px" }}
      >
        <div className="relative flex justify-between items-center pointer-events-auto">
          {activeIndex !== -1 && (
            <motion.div
              className="absolute rounded-4xl -z-10"
              style={{
                width: `${100 / navItems.length}%`,
                height: "100%",
                top: 0,
                background: "linear-gradient(135deg, var(--primary-light), var(--primary))",
              }}
              animate={{ left: `${(activeIndex * 100) / navItems.length}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center justify-center z-10"
                style={{ width: `${100 / navItems.length}%` }}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{ padding: "10px 18px", minHeight: 44 }}
                >
                  <div className="relative flex flex-col items-center justify-center">
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

                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-1 text-[11px] font-semibold text-white whitespace-nowrap"
                        >
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}