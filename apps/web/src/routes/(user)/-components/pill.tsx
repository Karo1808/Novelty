function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 px-2.5 py-1 text-xs">
      {children}
    </span>
  );
}

export default Pill;
