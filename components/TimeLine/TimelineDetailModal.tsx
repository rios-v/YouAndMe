"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseLocalDate } from "@/lib/dates";
import { useDragToClose } from "@/lib/useDragToClose";


interface TimelineItem {
  id: number;
  photoUrl: string;
  description: string;
  eventDate: string;
  author: string;
}

interface TimelineDetailModalProps {
  item: TimelineItem | null;
  onClose: () => void;
}

export function TimelineDetailModal({ item, onClose }: TimelineDetailModalProps) {
  const { handleProps, panelProps } = useDragToClose({ onClose });

  return (
    <AnimatePresence>
      {item && (
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
            {...panelProps}
            className="fixed inset-x-0 bottom-0 z-51 flex flex-col max-h-[92vh]"
            style={{
              background: "var(--bg-main)",
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              boxShadow: "0 -10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div 
              className="flex justify-center pt-3 pb-1 shrink-0"
              {...handleProps}
            >
              <div className="w-10 h-1.5 rounded-full bg-[var(--primary-light)] opacity-60" />
              
            </div>

            <div
              className="flex justify-between items-center pt-2 pb-4 shrink-0"
              style={{ paddingLeft: 24, paddingRight: 24 }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }}
                >
                  <Camera size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--primary-dark)] truncate">
                    por {item.author}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {format(parseLocalDate(item.eventDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-[var(--bg-card)] rounded-full text-[var(--text-secondary)] active:bg-[var(--primary-light)]/30 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="overflow-y-auto flex-1"
              style={{
                paddingLeft: 24,
                paddingRight: 24,
                paddingBottom: "max(28px, env(safe-area-inset-bottom))",
              }}
            >
              {item.photoUrl && (
                <div className="rounded-2xl overflow-hidden mb-4">
                  <img
                    src={item.photoUrl}
                    alt="Momento"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <div className="text-[var(--text-primary)] text-lg leading-relaxed whitespace-pre-wrap break-words">
                {item.description}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}