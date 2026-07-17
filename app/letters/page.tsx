"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AddLetterModal } from "@/components/Letter/AddLetterModal";
import { LetterDetailModal } from "@/components/Letter/LetterDetailModal";
import { LetterActionSheet } from "@/components/Letter/LetterActionSheet";
import { ConfirmDeleteModal } from "@/components/Letter/ConfirmDeleteModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useLongPress } from "@/lib/useLongPress";
import { parseLocalDate } from "@/lib/dates";
import { markSectionAsSeen } from "@/lib/useUnreadBadge";


interface Letter {
  id: number;
  content: string;
  writtenDate: string;
  author: string;
}

function LetterCard({
  letter,
  index,
  onOpen,
  onLongPress,
}: {
  letter: Letter;
  index: number;
  onOpen: () => void;
  onLongPress: () => void;
}) {
  const longPress = useLongPress(onLongPress, onOpen);

  return (
    <motion.button
      {...longPress}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.01 }}
      whileTap={{ scale: 0.95 }}
      className="glass-panel p-6 rounded-[32px] shadow-sm relative overflow-hidden text-left w-full select-none"
      style={{ WebkitTouchCallout: "none" }}
    >
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[var(--primary-light)] to-transparent opacity-10" />

      <div className="flex justify-between items-center mb-6 border-b border-[var(--primary-light)] border-opacity-30 pb-4">
        <span className="text-sm font-semibold text-[var(--text-muted)]">
          {format(parseLocalDate(letter.writtenDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
        </span>
        <span className="text-sm font-bold text-[var(--primary-dark)] bg-[var(--primary-light)] bg-opacity-30 px-3 py-1 rounded-full shrink-0 ml-3">
          De: {letter.author}
        </span>
      </div>

      <div className="text-[var(--text-primary)] font-playfair leading-relaxed break-words line-clamp-3">
        {letter.content}
      </div>

      <p className="text-xs font-semibold text-[var(--primary)] mt-3">
        Ler carta completa →
      </p>
    </motion.button>
  );
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [actionLetter, setActionLetter] = useState<Letter | null>(null);
  const [letterToEdit, setLetterToEdit] = useState<Letter | null>(null);
  const [letterToDelete, setLetterToDelete] = useState<Letter | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLetters = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/letters");
      const data = await res.json();
      setLetters(data);

      if (data.length > 0) {
        const latestId = Math.max(...data.map((l: Letter) => l.id));
        markSectionAsSeen("letters", latestId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const handleConfirmDelete = async () => {
    if (!letterToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/letters/${letterToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete letter");
      await fetchLetters();
      setLetterToDelete(null);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao excluir a carta.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container pt-8 pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primary-dark)]">Cartas</h1>
        <motion.button
          onClick={() => {
            setLetterToEdit(null);
            setIsModalOpen(true);
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.68 }}
          className="bg-[var(--primary)] text-white p-3 rounded-full shadow-md hover:bg-[var(--primary-dark)] transition-colors"
          aria-label="Escrever Carta"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : letters.length === 0 ? (
        <EmptyState message="Nenhuma carta escrita ainda poxa. Deixe uma mensagem especial!" />
      ) : (
        <div className="flex flex-col gap-6">
          {letters.map((letter, index) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              index={index}
              onOpen={() => setSelectedLetter(letter)}
              onLongPress={() => setActionLetter(letter)}
            />
          ))}
        </div>
      )}

      <AddLetterModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setLetterToEdit(null);
        }}
        onAdded={fetchLetters}
        letterToEdit={letterToEdit}
      />

      <LetterDetailModal
        letter={selectedLetter}
        onClose={() => setSelectedLetter(null)}
      />

      <LetterActionSheet
        isOpen={Boolean(actionLetter)}
        onClose={() => setActionLetter(null)}
        onEdit={() => {
          setLetterToEdit(actionLetter);
          setActionLetter(null);
          setIsModalOpen(true);
        }}
        onDelete={() => {
          setLetterToDelete(actionLetter);
          setActionLetter(null);
        }}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(letterToDelete)}
        isDeleting={isDeleting}
        onCancel={() => setLetterToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <ScrollToTop />
    </div>
  );
}