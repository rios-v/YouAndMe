"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Clock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Nós", icon: Heart },
    { href: "/timeline", label: "Momentos", icon: Clock },
    { href: "/letters", label: "Cartas", icon: Mail },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50">
      <nav className="glass-panel rounded-full max-w-sm mx-auto flex justify-between items-center px-6 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-16"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavBubble"
                  className="absolute inset-0 bg-[var(--primary-light)] rounded-full -z-10 opacity-30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                size={24}
                className={`mb-1 transition-colors ${
                  isActive ? "text-[var(--primary-dark)]" : "text-[var(--text-muted)]"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-[var(--primary-dark)]" : "text-[var(--text-muted)]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
