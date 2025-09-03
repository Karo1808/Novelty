import Pill from "./pill";

function Tags({ items, empty }: { items: string[]; empty: string }) {
  if (!items?.length) {
    return <span className="text-slate-400">{empty}</span>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <Pill key={t}>{t}</Pill>
      ))}
    </div>
  );
}

export default Tags;
