"use client";

import { ScreenId } from "@/store/useStore";

const screens: { id: ScreenId; code: string; label: string }[] = [
  { id: "dashboard", code: "MD-1", label: "แดชบอร์ด" },
  { id: "products", code: "MD-2", label: "รายการสินค้า" },
  { id: "purchase", code: "MD-3", label: "ใบขอซื้อ" },
  { id: "sales", code: "MD-6", label: "งานขาย" },
  { id: "settings", code: "MD-11", label: "ตั้งค่าบริษัท" },
];

interface Props {
  open: boolean;
  current: ScreenId;
  onNav: (id: ScreenId) => void;
}

export default function ScreenNav({ open, current, onNav }: Props) {
  if (!open) return null;

  return (
    <div className="fixed left-[52px] top-0 bottom-0 w-[220px] bg-erp-nav z-40 flex flex-col">
      <div className="h-[52px] flex items-center px-4">
        <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
          เมนูหน้าจอ
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {screens.map((s) => (
          <button
            key={s.id}
            onClick={() => onNav(s.id)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
              current === s.id
                ? "bg-brand-primary/20 text-brand-primary border-l-2 border-brand-primary"
                : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
            }`}
          >
            <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded">
              {s.code}
            </span>
            <span className="text-sm">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
