export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-24 h-24 bg-[var(--primary-light)] rounded-full opacity-20 mb-4 flex items-center justify-center">
      </div>
      <p className="text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}
