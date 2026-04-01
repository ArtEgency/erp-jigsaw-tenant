"use client";

import { ScreenId } from "@/store/useStore";

const menuItems: { icon: string; label: string; screen: ScreenId }[] = [
  { icon: "⌂", label: "แดชบอร์ด", screen: "dashboard" },
  { icon: "⏱", label: "ใบขอซื้อ", screen: "purchase" },
  { icon: "📋", label: "สินค้า", screen: "products" },
  { icon: "📦", label: "งานขาย", screen: "sales" },
  { icon: "🏷", label: "ตั้งค่า", screen: "settings" },
  { icon: "📊", label: "รายงาน", screen: "dashboard" },
  { icon: "⚙", label: "ระบบ", screen: "settings" },
];

interface Props {
  current: ScreenId;
  onNav: (id: ScreenId) => void;
}

export default function IconSidebar({ current, onNav }: Props) {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-[52px] bg-erp-sidebar flex flex-col items-center z-50">
      {/* Logo */}
      <div className="w-full h-[52px] bg-brand-primary flex items-center justify-center">
        <span className="text-white font-bold text-[9px] leading-tight tracking-wider">
          JIG<br />SAW
        </span>
      </div>

      {/* Menu Icons */}
      <div className="flex-1 flex flex-col items-center gap-1 pt-2">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => onNav(item.screen)}
            title={item.label}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${
              current === item.screen
                ? "bg-brand-primary text-white"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
