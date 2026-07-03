"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useUser } from "@/lib/user-context";

interface AddLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export function AddLetterModal({ isOpen, onClose, onAdded }: AddLetterModalProps) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [writtenDate, setWrittenDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !writtenDate) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          writtenDate,
          author: user,
        }),
      });

      if (!res.ok) throw new Error("Failed to save letter");

      // Reset and close
      setContent("");
      setWrittenDate("");
      onAdded();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar a carta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 bg-[var(--bg-main)] rounded-t-[32px] p-6 z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--primary-dark)] font-playfair">Nova Carta</h2>
              <button onClick={onClose} className="p-2 bg-[var(--bg-card)] rounded-full text-[var(--text-secondary)]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Data</label>
                <input
                  type="date"
                  required
                  value={writtenDate}
                  onChange={(e) => setWrittenDate(e.target.value)}
                  className="p-4 rounded-2xl bg-white border border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Sua carta</label>
                <textarea
                  required
                  placeholder="Escreva o que está no seu coração..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="p-4 rounded-2xl bg-white border border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)] resize-none font-playfair text-lg leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-[var(--primary)] text-white py-4 rounded-2xl font-semibold text-lg flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Guardando...
                  </>
                ) : (
                  "Guardar Carta"
                )}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
