"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AddTimelineModal } from "@/components/TimeLine/AddTimelineModal";
import { TimelineDetailModal } from "@/components/TimeLine/TimelineDetailModal";
import { LetterActionSheet } from "@/components/Letter/LetterActionSheet";
import { ConfirmDeleteModal } from "@/components/Letter/ConfirmDeleteModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useLongPress } from "@/lib/useLongPress";
import { parseLocalDate } from "@/lib/dates";
import { markSectionAsSeen } from "@/lib/useUnreadBadge";


interface TimelineItem {
  id: number;
  photoUrl: string;
  description: string;
  eventDate: string;
  author: string;
}

function TimelineCard({
  item,
  index,
  onOpen,
  onLongPress,
}: {
  item: TimelineItem;
  index: number;
  onOpen: () => void;
  onLongPress: () => void;
}) {
  const longPress = useLongPress(onLongPress, onOpen);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.01 }}
      whileTap={{ scale: 0.97 }}
      className="relative"
    >
      <div className="absolute -left-[35px] top-4 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-[var(--bg-main)]" />

      <button
        {...longPress}
        className="glass-panel p-4 rounded-3xl overflow-hidden shadow-sm text-left w-full select-none"
        style={{ WebkitTouchCallout: "none" }}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-[var(--primary-dark)] bg-[var(--primary-light)] bg-opacity-30 px-3 py-1 rounded-full">
            {format(parseLocalDate(item.eventDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </span>
          <span className="text-xs text-[var(--text-muted)] italic">
            por {item.author}
          </span>
        </div>

        {item.photoUrl && (
          <div className="rounded-2xl overflow-hidden mb-4">
            <img src={item.photoUrl} alt="Momento" className="w-full h-auto object-cover" />
          </div>
        )}

        <p className="text-[var(--text-primary)] leading-relaxed break-words line-clamp-3">
          {item.description}
        </p>

        <p className="text-xs font-semibold text-[var(--primary)] mt-3">
          Ver momento completo →
        </p>
      </button>
    </motion.div>
  );
}

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [actionItem, setActionItem] = useState<TimelineItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<TimelineItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TimelineItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/timeline");
      const data = await res.json();
      setItems(data);

      if (data.length > 0) {
        const latestId = Math.max(...data.map((t: TimelineItem) => t.id));
        markSectionAsSeen("timeline", latestId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/timeline/${itemToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      await fetchItems();
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao excluir o momento.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container pt-8 pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primary-dark)]">Linha do Tempo</h1>
        <motion.button
          onClick={() => {
            setItemToEdit(null);
            setIsModalOpen(true);
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.68 }}
          className="bg-[var(--primary)] text-white p-3 rounded-full shadow-md active:bg-[var(--primary-dark)] transition-colors"
          aria-label="Adicionar Momento"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState message="Nenhum momento registrado ainda. Adicione a primeira memória de vocês!" />
      ) : (
        <div className="relative border-l-2 border-[var(--primary-light)] ml-4 pl-6 flex flex-col gap-8">
          {items.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={index}
              onOpen={() => setSelectedItem(item)}
              onLongPress={() => setActionItem(item)}
            />
          ))}
        </div>
      )}

      <AddTimelineModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setItemToEdit(null);
        }}
        onAdded={fetchItems}
        itemToEdit={itemToEdit}
      />

      <TimelineDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <LetterActionSheet
        isOpen={Boolean(actionItem)}
        onClose={() => setActionItem(null)}
        onEdit={() => {
          setItemToEdit(actionItem);
          setActionItem(null);
          setIsModalOpen(true);
        }}
        onDelete={() => {
          setItemToDelete(actionItem);
          setActionItem(null);
        }}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(itemToDelete)}
        isDeleting={isDeleting}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <ScrollToTop />
    </div>
  );
}