"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-erp-body flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo-jigsaw.png"
            alt="JIGSAW"
            width={200}
            height={46}
            className="mx-auto mb-4"
            priority
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="text-white/50 text-sm mt-1">Enterprise Resource Planning</p>
        </div>

        {/* Login Options */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 w-[420px]">
          <h2 className="text-white text-lg font-semibold mb-2">เลือกประเภทการเข้าสู่ระบบ</h2>
          <p className="text-white/40 text-sm mb-8">กรุณาเลือกบทบาทของคุณเพื่อเข้าสู่ระบบ</p>

          <div className="space-y-4">
            {/* Super Admin */}
            <button
              onClick={() => router.push("/super-admin/login")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-sa-primary/20 hover:border-sa-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-sa-primary/20 flex items-center justify-center text-2xl group-hover:bg-sa-primary/30 transition-colors">
                🛡️
              </div>
              <div className="text-left flex-1">
                <p className="text-white font-semibold text-sm">เข้าสู่ระบบ Super Admin</p>
                <p className="text-white/40 text-xs mt-0.5">สำหรับทีมผู้ดูแลระบบ Jigsaw</p>
              </div>
              <span className="text-white/30 text-lg group-hover:text-sa-primary transition-colors">→</span>
            </button>

            {/* Company / Tenant */}
            <button
              onClick={() => router.push("/login")}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-brand-primary/20 hover:border-brand-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center text-2xl group-hover:bg-brand-primary/30 transition-colors">
                🏢
              </div>
              <div className="text-left flex-1">
                <p className="text-white font-semibold text-sm">เข้าสู่ระบบบริษัท</p>
                <p className="text-white/40 text-xs mt-0.5">สำหรับผู้ใช้งานระบบ ERP ของบริษัท</p>
              </div>
              <span className="text-white/30 text-lg group-hover:text-brand-primary transition-colors">→</span>
            </button>
          </div>

          {/* Component Showcase */}
          <button
            onClick={() => router.push("/component-showcase")}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all group mt-4"
          >
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl group-hover:bg-white/15 transition-colors">
              🧩
            </div>
            <div className="text-left flex-1">
              <p className="text-white font-semibold text-sm">Component ของระบบ</p>
              <p className="text-white/40 text-xs mt-0.5">ดูตัวอย่าง MUI Components ทั้งหมด (Live Preview)</p>
            </div>
            <span className="text-white/30 text-lg group-hover:text-white/60 transition-colors">→</span>
          </button>
        </div>

        <p className="text-white/20 text-xs mt-6">Jigsaw ERP v1.0 — Prototype</p>
      </div>
    </div>
  );
}
