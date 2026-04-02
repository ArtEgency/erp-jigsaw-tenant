"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTenantBySlug } from "@/data/tenants";

export default function TenantLoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const tenant = getTenantBySlug(slug);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ fontFamily: "'Sarabun', sans-serif" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบบริษัท</h1>
          <p className="text-gray-500 mb-4">ไม่พบ tenant &quot;{slug}&quot; ในระบบ</p>
          <button onClick={() => router.push("/")} className="text-sm px-4 py-2 rounded-lg" style={{ background: "#565DFF", color: "#fff" }}>
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  const handleLogin = () => {
    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    router.push(`/${slug}`);
  };

  const PC = tenant.primaryColor;

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Sarabun', sans-serif" }}>
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col items-center justify-center relative overflow-hidden" style={{ background: PC }}>
        {/* Decorative circles */}
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-10 bg-white" style={{ top: -200, left: -200 }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 bg-white" style={{ bottom: -80, right: -80 }} />

        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6">
            {tenant.initials}
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">{tenant.name}</h1>
          {tenant.description && (
            <p className="text-white/70 text-sm mb-4">{tenant.description}</p>
          )}
          <div className="inline-block bg-white/15 rounded-full px-4 py-1.5 text-white/80 text-xs">
            {tenant.domain}
          </div>
          <div className="mt-3 inline-block bg-white/10 rounded-full px-4 py-1.5 text-white/60 text-xs ml-2">
            {tenant.package}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-[380px]">
          {/* Mobile: show tenant name */}
          <div className="lg:hidden mb-6 text-center">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white mx-auto mb-3" style={{ background: PC }}>
              {tenant.initials}
            </div>
            <h2 className="text-lg font-bold" style={{ color: "#333" }}>{tenant.name}</h2>
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color: "#333" }}>เข้าสู่ระบบ</h2>
          <p className="text-sm mb-6" style={{ color: "#999" }}>{tenant.domain}</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#555" }}>อีเมล / เบอร์โทร / รหัสพนักงาน</label>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="email@company.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                style={{ border: "1.5px solid #E0E0E0", color: "#333" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = PC; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#E0E0E0"; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#555" }}>รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="รหัสผ่าน"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors pr-12"
                  style={{ border: "1.5px solid #E0E0E0", color: "#333" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = PC; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#E0E0E0"; }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? "ซ่อน" : "แสดง"}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: PC }}
            >
              เข้าสู่ระบบ
            </button>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => router.push("/")} className="text-xs hover:underline" style={{ color: "#999" }}>
              ← กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
