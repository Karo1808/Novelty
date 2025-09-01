function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
      <h4 className="text-sm font-medium text-slate-200 mb-3">{title}</h4>
      {children}
    </div>
  );
}

export default Section;
