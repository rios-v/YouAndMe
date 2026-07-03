"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AddLetterModal } from "@/components/AddLetterModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Letter {
  id: number;
  content: string;
  writtenDate: string;
  author: string;
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLetters = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/letters");
      const data = await res.json();
      setLetters(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  return (
    <div className="container pt-8 pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primary-dark)]">Cartas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--primary)] text-white p-3 rounded-full shadow-md hover:bg-[var(--primary-dark)] transition-colors"
          aria-label="Escrever Carta"
        >
          <Plus size={24} />
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : letters.length === 0 ? (
        <EmptyState message="Nenhuma carta escrita ainda. Deixe uma mensagem especial!" />
      ) : (
        <div className="flex flex-col gap-6">
          {letters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 rounded-[32px] shadow-sm relative overflow-hidden"
            >
              {/* Envelope flap aesthetic */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[var(--primary-light)] to-transparent opacity-10" />
              
              <div className="flex justify-between items-center mb-6 border-b border-[var(--primary-light)] border-opacity-30 pb-4">
                <span className="text-sm font-semibold text-[var(--text-muted)]">
                  {format(new Date(letter.writtenDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
                <span className="text-sm font-bold text-[var(--primary-dark)] bg-[var(--primary-light)] bg-opacity-30 px-3 py-1 rounded-full">
                  De: {letter.author}
                </span>
              </div>
              
              <div className="text-[var(--text-primary)] font-playfair text-lg leading-relaxed whitespace-pre-wrap">
                {letter.content}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddLetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={fetchLetters}
      />
      
      <ScrollToTop />
    </div>
  );
}
