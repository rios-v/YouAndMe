import { X } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-24 h-24 bg-[var(--primary-light)] text-red rounded-full opacity-20 mb-4 flex items-center justify-center">
        <X size={52} />
      </div>
      <p className="text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}
