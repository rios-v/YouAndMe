"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImagePlus, Loader2, Camera } from "lucide-react";
import { useUser } from "@/lib/user-context";

interface TimelineItem {
  id: number;
  photoUrl: string;
  description: string;
  eventDate: string;
  author: string;
}

interface AddTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
  itemToEdit?: TimelineItem | null;
}

export function AddTimelineModal({ isOpen, onClose, onAdded, itemToEdit }: AddTimelineModalProps) {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isEditing = Boolean(itemToEdit);

  useEffect(() => {
    if (isOpen && itemToEdit) {
      setDescription(itemToEdit.description);
      setEventDate(itemToEdit.eventDate.split("T")[0]);
      setPreviewUrl(itemToEdit.photoUrl);
      setFile(null);
    } else if (isOpen && !itemToEdit) {
      setDescription("");
      setEventDate("");
      setPreviewUrl(null);
      setFile(null);
    }
  }, [isOpen, itemToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !eventDate) return;
    if (!isEditing && !file) return;

    setIsSubmitting(true);

    try {
      let photoUrl: string | undefined;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);

        photoUrl = uploadData.url;
      }

      if (isEditing) {
        const res = await fetch(`/api/timeline/${itemToEdit!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            eventDate,
            ...(photoUrl ? { photoUrl } : {}),
          }),
        });
        if (!res.ok) throw new Error("Failed to update item");
      } else {
        const res = await fetch("/api/timeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photoUrl,
            description,
            eventDate,
            author: user,
          }),
        });
        if (!res.ok) throw new Error("Failed to save item");
      }

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
            className="fixed inset-x-0 bottom-0 z-51 flex flex-col max-h-[92vh]"
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
                  <Camera size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-[var(--primary-dark)]">
                  {isEditing ? "Editar Momento" : "Novo Momento"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-[var(--bg-card)] rounded-full text-[var(--text-secondary)] active:bg-[var(--primary-light)]/30"
              >
                <X size={20} />
              </button>
            </div>

            <form
              id="add-timeline-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 overflow-y-auto flex-1"
              style={{ paddingLeft: 24, paddingRight: 24 }}
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Data</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="p-4 rounded-2xl bg-white border-2 border-transparent focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)] shadow-sm"
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
                  className="p-4 rounded-2xl bg-white border-2 border-transparent focus:outline-none focus:border-[var(--primary)] text-[var(--text-primary)] resize-none shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Foto</label>
                <label className="cursor-pointer border-2 border-dashed border-[var(--primary-light)] rounded-2xl h-40 flex flex-col items-center justify-center bg-white active:bg-[var(--bg-main)] overflow-hidden relative">
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
                    required={!isEditing}
                  />
                </label>
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
                form="add-timeline-form"
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                className="w-full text-white py-4 rounded-2xl font-semibold text-lg flex justify-center items-center gap-2 shadow-lg disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Salvando...
                  </>
                ) : isEditing ? (
                  "Salvar alterações"
                ) : (
                  "Salvar Momento"
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}