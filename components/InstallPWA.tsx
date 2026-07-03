"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, X } from "lucide-react";

export function InstallPWA() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if it's iOS Safari
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIOSSafari = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isSafari = isIOSSafari && webkit && !ua.match(/CriOS/i);

    // Check if it's already installed (standalone mode)
    const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;

    setIsIOS(isSafari);
    setIsStandalone(isStandaloneMode);

    // Show prompt if iOS Safari and not installed, and user hasn't dismissed it recently
    if (isSafari && !isStandaloneMode) {
      const dismissedAt = localStorage.getItem("nosdois_pwa_dismissed");
      if (!dismissedAt || Date.now() - parseInt(dismissedAt) > 1000 * 60 * 60 * 24) {
        // Show after a small delay
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("nosdois_pwa_dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (!isIOS || isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 z-50 glass-panel rounded-2xl p-4 shadow-xl border border-[var(--primary-light)]"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-[var(--text-muted)]"
          >
            <X size={16} />
          </button>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[var(--primary-dark)]">Instale nosso app! 💜</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Para ter o NósDois na tela inicial como um app de verdade:
            </p>
            <ol className="text-sm text-[var(--text-primary)] list-decimal list-inside mt-1 flex flex-col gap-1">
              <li className="flex items-center gap-1">
                Toque no botão Compartilhar <Share size={14} className="inline text-blue-500" /> abaixo
              </li>
              <li>Role para baixo e toque em <strong>Adicionar à Tela de Início</strong></li>
            </ol>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
