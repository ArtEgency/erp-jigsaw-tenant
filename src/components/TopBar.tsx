"use client";

import { useRouter } from "next/navigation";

interface Props {
  onToggleNav: () => void;
}

export default function TopBar({ onToggleNav }: Props) {
  const router = useRouter();

  return (
    <div className="h-[52px] bg-brand-primary flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleNav}
          className="text-white text-xl hover:bg-white/20 rounded p-1 transition-colors"
        >
          ☰
        </button>
        <span className="text-white font-semibold text-sm">
          บจก. จิ๊กซอว์ ออโต้พาร์ท
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Onboarding Button */}
        <button
          onClick={() => router.push("/app/setup-wizard")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-brand-primary hover:bg-orange-50 shadow-sm"
        >
          <span>⚙</span>
          <span>Onboarding</span>
        </button>
        <button className="text-white text-lg hover:bg-white/20 rounded p-1 transition-colors relative">
          🔔
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
            3
          </span>
        </button>
        <div className="h-6 w-px bg-white/30" />
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">สมชาย ใจดี</span>
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white text-sm font-bold">
            ส
          </div>
        </div>
      </div>
    </div>
  );
}
