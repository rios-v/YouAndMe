"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Clock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUnreadBadge } from "@/lib/useUnreadBadge";

export function BottomNav() {
  const pathname = usePathname();
  const unread = useUnreadBadge();

  const navItems = [
    { href: "/timeline", icon: Clock, unread: unread.timeline },
    { href: "/", icon: Heart, unread: false },
    { href: "/letters", icon: Mail, unread: unread.letters },
  ];

  const activeIndex = navItems.findIndex((item) => item.href === pathname);

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 h-28 z-40 pointer-events-none backdrop-blur-sm"
        style={{
          maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
        }}
      />

      <div className="fixed bottom-3 left-1.5 right-1.5 p-4 pb-safe z-50 pointer-events-none">
        <nav
          className="glass-panel rounded-4xl max-w-sm mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40"
          style={{ padding: "12px 12px" }}
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
                        className="relative"
                      >
                        <Icon
                          size={24}
                          strokeWidth={isActive ? 2.4 : 2}
                          className={`transition-colors duration-300 ${
                            isActive ? "text-white" : "text-[var(--text-muted)]"
                          }`}
                        />

                        <AnimatePresence>
                          {item.unread && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
                              className="absolute rounded-full"
                              style={{
                                top: -2,
                                right: -2,
                                width: 9,
                                height: 9,
                                background: "#ef4444",
                                border: "2px solid white",
                              }}
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

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
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}