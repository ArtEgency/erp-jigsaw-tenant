"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { TENANT_PRIMARY as OR, TENANT_HOVER as OR_D, MUTED, BORDER } from "@/lib/theme";
import { TENANTS } from "@/data/tenants";

/* ── Mock Companies (จาก Tenant Data) ── */
interface Company {
  id: string;
  slug: string;
  name: string;
  domain: string;
  initials: string;
  color: string;
  notifications: number;
}

const MOCK_COMPANIES: Company[] = TENANTS.map((t, i) => ({
  id: t.id,
  slug: t.slug,
  name: t.name,
  domain: t.domain,
  initials: t.initials,
  color: t.primaryColor,
  notifications: i === 1 ? 3 : 0,
}));

/* ── Step Type ── */
type LoginStep = "login" | "select-company";

export default function LoginPage() {
  const router = useRouter();

  /* ── Login Form State ── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  /* ── Step State ── */
  const [step, setStep] = useState<LoginStep>("login");

  /* ── Company Selection State ── */
  const [companySearch, setCompanySearch] = useState("");
  const [activeCompanyId, setActiveCompanyId] = useState("1"); // Payo = active by default

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return MOCK_COMPANIES;
    const s = companySearch.toLowerCase();
    return MOCK_COMPANIES.filter(
      (c) => c.name.toLowerCase().includes(s) || c.domain.toLowerCase().includes(s)
    );
  }, [companySearch]);

  /* ── Handlers ── */
  const handleLogin = () => {
    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    // Mock: if user has multiple companies → show selection
    // In production: check API response for company list
    if (MOCK_COMPANIES.length > 1) {
      setStep("select-company");
    } else {
      const firstSlug = MOCK_COMPANIES[0]?.slug ?? "june";
      router.push(`/${firstSlug}`);
    }
  };

  const handleSelectCompany = (companyId: string) => {
    setActiveCompanyId(companyId);
  };

  const handleConfirmCompany = () => {
    const selected = MOCK_COMPANIES.find((c) => c.id === activeCompanyId);
    const slug = selected?.slug ?? "june";
    router.push(`/${slug}`);
  };

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

      {/* ══════ RIGHT — Login Form / Company Selection ══════ */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col items-center justify-center bg-white px-8 lg:px-14 relative">

        {/* ───── Step 1: Login Form ───── */}
        {step === "login" && (
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
        )}

        {/* ───── Step 2: Company Selection Modal ───── */}
        {step === "select-company" && (
          <div className="w-full max-w-[400px]">
            {/* Logo small */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: OR }}>
                <span className="text-lg">🧩</span>
              </div>
              <span className="text-xl font-extrabold tracking-[0.12em]" style={{ color: OR }}>JIGSAW</span>
            </div>

            {/* Title */}
            <h2 className="text-center text-lg font-bold mb-1" style={{ color: "#333" }}>กิจการของคุณ</h2>
            <p className="text-center text-xs mb-5" style={{ color: MUTED }}>เลือกกิจการที่ต้องการเข้าใช้งาน</p>

            {/* Search */}
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: MUTED }}>🔍</span>
              <input
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="ค้นหากิจการ..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ border: `1px solid ${BORDER}`, color: "#333" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = OR; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
              />
            </div>

            {/* Company List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-8 text-sm" style={{ color: MUTED }}>
                  ไม่พบกิจการที่ค้นหา
                </div>
              ) : (
                filteredCompanies.map((company) => {
                  const isActive = company.id === activeCompanyId;
                  return (
                    <button
                      key={company.id}
                      onClick={() => handleSelectCompany(company.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group"
                      style={{
                        border: isActive ? `2px solid ${OR}` : `1px solid ${BORDER}`,
                        background: isActive ? `${OR}08` : "white",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = "#B3B7FF";
                          e.currentTarget.style.background = "#FAFAFF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = BORDER;
                          e.currentTarget.style.background = "white";
                        }
                      }}
                    >
                      {/* Avatar */}
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
                        style={{ background: company.color }}
                      >
                        {company.initials}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: isActive ? OR : "#333" }}>
                          {company.name}
                        </p>
                        {isActive ? (
                          <span className="text-[11px] font-medium" style={{ color: OR }}>กำลังใช้งาน</span>
                        ) : company.notifications > 0 ? (
                          <span className="text-[11px]" style={{ color: "#FF6B6B" }}>
                            {company.notifications} การแจ้งเตือน
                          </span>
                        ) : (
                          <span className="text-[11px]" style={{ color: MUTED }}>{company.domain}</span>
                        )}
                      </div>

                      {/* Right side: checkmark or notification badge */}
                      {isActive ? (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: OR }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      ) : company.notifications > 0 ? (
                        <div
                          className="min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1.5 text-[11px] font-bold text-white shrink-0"
                          style={{ background: "#FF6B6B" }}
                        >
                          {company.notifications}
                        </div>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmCompany}
              className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-colors mt-5"
              style={{ background: OR }}
              onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
              onMouseLeave={(e) => (e.currentTarget.style.background = OR)}
            >
              เข้าสู่ระบบบริษัท TA
            </button>

            {/* Back to login */}
            <div className="text-center mt-4">
              <button
                onClick={() => { setStep("login"); setCompanySearch(""); }}
                className="text-xs transition-colors"
                style={{ color: "#bbb" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = OR)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#bbb")}
              >
                ← กลับหน้าเข้าสู่ระบบ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
