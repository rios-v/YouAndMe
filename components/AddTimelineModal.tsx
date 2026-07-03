"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { useUser } from "@/lib/user-context";

interface AddTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export function AddTimelineModal({ isOpen, onClose, onAdded }: AddTimelineModalProps) {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !eventDate || !file) return;

    setIsSubmitting(true);

    try {
      // 1. Upload photo
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) throw new Error(uploadData.error);

      // 2. Save timeline item
      const itemRes = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoUrl: uploadData.url,
          description,
          eventDate,
          author: user,
        }),
      });

      if (!itemRes.ok) throw new Error("Failed to save item");

      // Reset and close
      setFile(null);
      setPreviewUrl(null);
      setDescription("");
      setEventDate("");
      onAdded();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar o momento.");
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
              <h2 className="text-2xl font-bold text-[var(--primary-dark)]">Novo Momento</h2>
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
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="p-4 rounded-2xl bg-white border border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Descrição</label>
                <textarea
                  required
                  placeholder="O que aconteceu de especial nesse dia?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="p-4 rounded-2xl bg-white border border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)] resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Foto</label>
                <label className="cursor-pointer border-2 border-dashed border-[var(--primary-light)] rounded-2xl h-40 flex flex-col items-center justify-center bg-white hover:bg-[var(--bg-main)] overflow-hidden relative">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus size={32} className="text-[var(--primary)] mb-2" />
                      <span className="text-[var(--text-secondary)] text-sm">Toque para escolher uma foto</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-[var(--primary)] text-white py-4 rounded-2xl font-semibold text-lg flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Salvando...
                  </>
                ) : (
                  "Salvar Momento"
                )}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
