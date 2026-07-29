export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4A853]" />
      <div className="w-2 h-2 rotate-45 bg-[#D4A853]" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4A853]" />
    </div>
  );
}
