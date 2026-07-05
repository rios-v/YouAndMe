"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

interface LetterActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function LetterActionSheet({ isOpen, onClose, onEdit, onDelete }: LetterActionSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="fixed inset-x-0 bottom-0 z-[90] px-4"
            style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
          >
            <div className="max-w-sm mx-auto flex flex-col gap-2">
              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "var(--bg-card)", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
              >
                <button
                  onClick={onEdit}
                  className="w-full flex items-center gap-3 px-5 py-4 text-[var(--text-primary)] font-medium active:bg-[var(--primary-light)]/20 transition-colors"
                >
                  <Pencil size={20} className="text-[var(--primary)]" />
                  Editar carta
                </button>
                <div className="h-px bg-[var(--primary-light)] opacity-20 mx-5" />
                <button
                  onClick={onDelete}
                  className="w-full flex items-center gap-3 px-5 py-4 text-red-500 font-medium active:bg-red-50 transition-colors"
                >
                  <Trash2 size={20} />
                  Excluir carta
                </button>
              </div>

              <button
                onClick={onClose}
                className="rounded-3xl py-4 font-semibold text-[var(--text-primary)]"
                style={{ background: "var(--bg-card)", boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}