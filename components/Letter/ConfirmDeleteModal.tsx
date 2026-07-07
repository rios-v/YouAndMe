"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ isOpen, isDeleting, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-6"
          >
            <div
              className="w-full max-w-sm rounded-3xl p-6 text-center"
              style={{
                background: "var(--bg-card)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                transform: "translateZ(0)",
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Você tem certeza disso?</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Essa ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-2xl font-semibold text-[var(--text-primary)] bg-[var(--bg-main)] active:opacity-70"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-2xl font-semibold text-white bg-red-500 flex items-center justify-center gap-2 disabled:opacity-70 active:bg-red-600"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Excluir"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}