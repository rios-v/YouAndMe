"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AddTimelineModal } from "@/components/AddTimelineModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface TimelineItem {
  id: number;
  photoUrl: string;
  description: string;
  eventDate: string;
  author: string;
}

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/timeline");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container pt-8 pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primary-dark)]">Linha do Tempo</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--primary)] text-white p-3 rounded-full shadow-md hover:bg-[var(--primary-dark)] transition-colors"
          aria-label="Adicionar Momento"
        >
          <Plus size={24} />
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState message="Nenhum momento registrado ainda. Adicione a primeira memória de vocês!" />
      ) : (
        <div className="relative border-l-2 border-[var(--primary-light)] ml-4 pl-6 flex flex-col gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[35px] top-4 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-[var(--bg-main)]" />
              
              <div className="glass-panel p-4 rounded-3xl overflow-hidden shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-[var(--primary-dark)] bg-[var(--primary-light)] bg-opacity-30 px-3 py-1 rounded-full">
                    {format(new Date(item.eventDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
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
                
                <p className="text-[var(--text-primary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddTimelineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={fetchItems}
      />
      
      <ScrollToTop />
    </div>
  );
}
