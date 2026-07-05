"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Feather } from "lucide-react";
import { useUser } from "@/lib/user-context";

interface Letter {
  id: number;
  content: string;
  writtenDate: string;
  author: string;
}

interface AddLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
  letterToEdit?: Letter | null;
}

export function AddLetterModal({ isOpen, onClose, onAdded, letterToEdit }: AddLetterModalProps) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [writtenDate, setWrittenDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(letterToEdit);

  useEffect(() => {
    if (isOpen && letterToEdit) {
      setContent(letterToEdit.content);
      setWrittenDate(letterToEdit.writtenDate.split("T")[0]);
    } else if (isOpen && !letterToEdit) {
      setContent("");
      setWrittenDate("");
    }
  }, [isOpen, letterToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !writtenDate) return;

    setIsSubmitting(true);

    try {
      const url = isEditing ? `/api/letters/${letterToEdit!.id}` : "/api/letters";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          writtenDate,
          author: isEditing ? letterToEdit!.author : user,
        }),
      });

      if (!res.ok) throw new Error("Failed to save letter");

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            className="fixed inset-x-0 bottom-0 z-[70] flex flex-col max-h-[92vh]"
            style={{
              background: "var(--bg-main)",
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-[var(--primary-light)] opacity-60" />
            </div>

            <div
              className="flex justify-between items-center pt-2 pb-4 shrink-0"
              style={{ paddingLeft: 24, paddingRight: 24 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }}
                >
                  <Feather size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-[var(--primary-dark)] font-playfair">
                  {isEditing ? "Editar Carta" : "Nova Carta"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-[var(--bg-card)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--primary-light)]/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form
              id="add-letter-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 overflow-y-auto flex-1"
              style={{ paddingLeft: 24, paddingRight: 24 }}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Data
                </label>
                <input
                  type="date"
                  required
                  value={writtenDate}
                  onChange={(e) => setWrittenDate(e.target.value)}
                  className="p-4 rounded-2xl bg-white border-2 border-transparent focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)] shadow-sm transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Sua carta
                </label>
                <textarea
                  required
                  placeholder="Escreva o que está no seu coração..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={7}
                  className="p-4 rounded-2xl bg-white border-2 border-transparent focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)] resize-none font-playfair text-lg leading-relaxed shadow-sm transition-colors"
                />
              </div>
            </form>

            <div
              className="pt-4 shrink-0"
              style={{
                paddingLeft: 24,
                paddingRight: 24,
                paddingBottom: "max(20px, env(safe-area-inset-bottom))",
                background: "linear-gradient(to top, var(--bg-main) 60%, transparent)",
              }}
            >
              <motion.button
                type="submit"
                form="add-letter-form"
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                className="w-full text-white py-4 rounded-2xl font-semibold text-lg flex justify-center items-center gap-2 shadow-lg disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Guardando...
                  </>
                ) : isEditing ? (
                  "Salvar alterações"
                ) : (
                  "Guardar Carta"
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}