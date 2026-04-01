"use client";

interface Props {
  id: string;
  name: string;
  actor: string;
}

export default function ScreenMeta({ id, name, actor }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
      <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
        {id}
      </span>
      <span className="text-sm font-semibold text-erp-text">{name}</span>
      <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-medium">
        {actor}
      </span>
    </div>
  );
}
