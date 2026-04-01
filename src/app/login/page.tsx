"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TENANT_PRIMARY as OR, TENANT_HOVER as OR_D } from "@/lib/theme";

const COMPANIES = [
  { name: "บจก. จิ๊กซอว์ ออโต้พาร์ท", domain: "jigsaw-auto.jigsaw-erp.com" },
  { name: "บจก. จิ๊กซอว์ อีคอมเมิร์ซ", domain: "jigsaw-ecom.jigsaw-erp.com" },
  { name: "บจก. เอบีซี เทรดดิ้ง", domain: "abc-trading.jigsaw-erp.com" },
];

export default function CompanyLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(0);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    router.push("/app");
  };

  const company = COMPANIES[selectedCompany];

  return (
    <div className="min-h-screen flex">
      {/* ══════ LEFT — Decorative Panel ══════ */}
      <div
        className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        {/* Circular decorations */}
        <div className="absolute" style={{ width: 500, height: 500, borderRadius: "50%", border: "1px solid rgba(86,93,255,0.12)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div className="absolute" style={{ width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(86,93,255,0.08)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div className="absolute" style={{ width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(86,93,255,0.05)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

        {/* Floating icons */}
        <div className="absolute" style={{ top: "32%", left: "18%" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(86,93,255,0.15)" }}>
            <span className="text-lg" style={{ color: OR }}>👥</span>
          </div>
        </div>
        <div className="absolute" style={{ top: "38%", right: "28%" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(86,93,255,0.12)" }}>
            <span className="text-sm" style={{ color: OR }}>⚙</span>
          </div>
        </div>
        <div className="absolute" style={{ bottom: "28%", left: "22%" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(86,93,255,0.10)" }}>
            <span className="text-sm" style={{ color: OR }}>☁</span>
          </div>
        </div>
        <div className="absolute" style={{ bottom: "30%", right: "30%" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(86,93,255,0.08)" }}>
            <span className="text-xs" style={{ color: OR }}>🔑</span>
          </div>
        </div>

        {/* Center text */}
        <div className="relative z-10 text-center">
          <h2 className="text-7xl font-extrabold tracking-[0.3em] mb-4" style={{ color: "rgba(86,93,255,0.18)" }}>ERP</h2>
          <p className="text-sm tracking-[0.5em] uppercase" style={{ color: "rgba(86,93,255,0.35)" }}>Enterprise Resource Planning</p>
        </div>
      </div>

      {/* ══════ RIGHT — Login Form ══════ */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col items-center justify-center bg-white px-8 lg:px-14 relative">
        {/* Logo + Welcome */}
        <div className="w-full max-w-[360px]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: OR }}>
              <span className="text-2xl">🧩</span>
            </div>
            <span className="text-3xl font-extrabold tracking-[0.15em]" style={{ color: OR }}>JIGSAW</span>
          </div>

          {/* Welcome text */}
          <p className="text-center text-sm mb-0.5" style={{ color: OR }}>ยินดีต้อนรับเข้าสู่ระบบ</p>
          <p className="text-center text-xs mb-6" style={{ color: "#999" }}>JIGSAW ERP for Business</p>

          {/* Company selector */}
          <div className="relative mb-6">
            <button
              onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-all"
              style={{ border: `1px solid ${companyDropdownOpen ? OR : "#E0E0E0"}`, background: companyDropdownOpen ? "#FFF8F3" : "#FAFAFA" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: OR + "15" }}>
                <span className="text-lg">🏢</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: "#333" }}>{company.name}</p>
                <p className="text-[10px] font-mono" style={{ color: "#999" }}>{company.domain}</p>
              </div>
              <span className="text-xs" style={{ color: "#999" }}>{companyDropdownOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {companyDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[10]" onClick={() => setCompanyDropdownOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border z-[20] overflow-hidden" style={{ borderColor: "#E0E0E0" }}>
                  {COMPANIES.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedCompany(i); setCompanyDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 transition-colors text-left"
                      style={{ borderBottom: i < COMPANIES.length - 1 ? "1px solid #F0F0F0" : "none", background: selectedCompany === i ? "#FFF8F3" : "white" }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: selectedCompany === i ? OR + "20" : "#F0F0F0" }}>
                        <span className="text-sm">🏢</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: selectedCompany === i ? OR : "#333" }}>{c.name}</p>
                        <p className="text-[10px] font-mono" style={{ color: "#999" }}>{c.domain}</p>
                      </div>
                      {selectedCompany === i && <span style={{ color: OR }}>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="text-center text-base font-bold mb-5" style={{ color: "#333" }}>เข้าสู่ระบบ</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: "#FCEBEB", color: "#A32D2D", border: "1px solid #E8CCCC" }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <div className="field-group">
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
              />
              <label>อีเมล/เบอร์โทรศัพท์/รหัสพนักงาน</label>
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="field-group relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <label>รหัสผ่าน</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                style={{ color: "#999" }}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: OR }}
              />
              <span className="text-xs" style={{ color: "#555" }}>จำรหัสผ่าน</span>
            </label>
            <button className="text-xs font-medium hover:underline" style={{ color: OR }}>ลืมรหัสผ่าน ?</button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-colors"
            style={{ background: OR }}
            onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
            onMouseLeave={(e) => (e.currentTarget.style.background = OR)}
          >
            เข้าสู่ระบบ
          </button>

          {/* Help text */}
          <p className="text-center mt-5 text-xs" style={{ color: "#999" }}>
            หากพบปัญหาการเข้าสู่ระบบ{" "}
            <button className="font-medium hover:underline" style={{ color: OR }}>กรุณาติดต่อผู้ดูแลระบบ</button>
          </p>

          {/* Back */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/")}
              className="text-xs transition-colors"
              style={{ color: "#bbb" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = OR)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#bbb")}
            >
              ← กลับหน้าเลือกระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
