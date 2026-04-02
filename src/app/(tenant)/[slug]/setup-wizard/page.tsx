"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

type Screen = "w1" | "w2a" | "w4" | "w5" | "w6" | "w7" | "we1";

/* ── colour tokens ── */
import { TENANT_PRIMARY as OR, TENANT_LIGHT as OR_L, TENANT_MID as OR_M, GREEN, GREEN_L, GREEN_M, RED_D as RED, RED_L, BLUE, BLUE_L, AMBER, AMBER_L, BORDER, BORDER2, MUTED, HINT, TEXT, BG } from "@/lib/theme";

/* ── wizard step definitions ── */
interface WizStep {
  num: string;
  name: string;
  type: "critical" | "warn" | "checklist";
}
const STEPS: WizStep[] = [
  { num: "1", name: "ข้อมูลธุรกิจ", type: "critical" },
  { num: "2", name: "สาขาแรก", type: "critical" },
  { num: "3", name: "การเงินพื้นฐาน", type: "critical" },
  { num: "4", name: "คลังสินค้าแรก", type: "critical" },
  { num: "✓", name: "สรุปและเปิดระบบ", type: "checklist" },
];

/* step status per screen */
type StepStatus = "todo" | "active" | "done" | "skip";
function getStepStatuses(screen: Screen): StepStatus[] {
  switch (screen) {
    case "w1":
    case "w2a":
      return ["active", "todo", "todo", "todo", "todo"];
    case "w4":
      return ["done", "active", "todo", "todo", "todo"];
    case "w5":
      return ["done", "done", "active", "todo", "todo"];
    case "w6":
      return ["done", "done", "done", "active", "todo"];
    case "w7":
      return ["done", "done", "done", "done", "active"];
    case "we1":
      return ["done", "todo", "todo", "todo", "todo"];
    default:
      return ["todo", "todo", "todo", "todo", "todo"];
  }
}

function getCriticalDone(screen: Screen): number {
  const s = getStepStatuses(screen);
  // critical steps are indices 0,1,2,3
  return [0, 1, 2, 3].filter((i) => s[i] === "done").length;
}

function getProgressPct(screen: Screen): number {
  const done = getCriticalDone(screen);
  return Math.round((done / 4) * 100);
}

function getStepOf(screen: Screen): string {
  switch (screen) {
    case "w1": return "Setup Wizard — ครั้งแรก";
    case "w2a": return "Step 1 of 4";
    case "w4": return "Step 2 of 4";
    case "w5": return "Step 3 of 4";
    case "w6": return "Step 4 of 4";
    case "w7": return "สรุปผล";
    default: return "";
  }
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
function SetupWizardInner() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();
  const initialScreen = (searchParams.get("screen") as Screen) || "w1";
  const [screen, setScreen] = useState<Screen>(initialScreen);

  useEffect(() => {
    const s = searchParams.get("screen") as Screen;
    if (s && ["w1","w2a","w4","w5","w6","w7","we1"].includes(s)) {
      setScreen(s);
    }
  }, [searchParams]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Form states — Step 1 ข้อมูลธุรกิจ
  const [personType, setPersonType] = useState<"natural" | "juristic">("juristic");
  const [taxId, setTaxId] = useState("223372271000");
  const [bizCategory, setBizCategory] = useState("บริษัท");
  const [prefix, setPrefix] = useState("บริษัท");
  const [companyName, setCompanyName] = useState("");
  const [suffix, setSuffix] = useState("จำกัด");
  const [bizType, setBizType] = useState("ขายส่ง");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // ข้อมูลติดต่อ
  const [country, setCountry] = useState("ไทย");
  const [address, setAddress] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Step 2 สาขาแรก
  const [branchCode, setBranchCode] = useState("HQ");
  const [branchType, setBranchType] = useState<"hq" | "branch" | "none">("hq");
  const [vatCode, setVatCode] = useState("000000");
  const [branchNameTH, setBranchNameTH] = useState("");
  const [branchNameEN, setBranchNameEN] = useState("");
  const [branchCountry, setBranchCountry] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [branchSubDistrict, setBranchSubDistrict] = useState("");
  const [branchDistrict, setBranchDistrict] = useState("");
  const [branchProvince, setBranchProvince] = useState("");
  const [branchPostalCode, setBranchPostalCode] = useState("");
  const [branchPhone, setBranchPhone] = useState("");
  const [enAddr1, setEnAddr1] = useState("");
  const [enAddr2, setEnAddr2] = useState("");
  const [enAddr3, setEnAddr3] = useState("");
  const [enCountry, setEnCountry] = useState("");
  const [enPostalCode, setEnPostalCode] = useState("");

  // Step 3 การเงิน
  const [currency, setCurrency] = useState("บาท");
  const [vatEnabled, setVatEnabled] = useState(true);
  const [vatRate, setVatRate] = useState("10");
  const [vatRegDate, setVatRegDate] = useState("2024-12-31");
  const [vatCalcMethod, setVatCalcMethod] = useState("แยกภาษี");
  const [costingMethod, setCostingMethod] = useState<"fifo" | "avg">("fifo");
  // Step 4 คลังสินค้า
  const [whCode, setWhCode] = useState("");
  const [whName, setWhName] = useState("");
  const [whCountry, setWhCountry] = useState("Thailand");
  const [whAddress, setWhAddress] = useState("");
  const [whSubDistrict, setWhSubDistrict] = useState("");
  const [whDistrict, setWhDistrict] = useState("");
  const [whProvince, setWhProvince] = useState("");
  const [whPostalCode, setWhPostalCode] = useState("");
  const [whGoogleMap, setWhGoogleMap] = useState("");
  const [whNote, setWhNote] = useState("");

  /* ── Thai address mock data ── */
  const PROVINCES = ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "เชียงใหม่", "ชลบุรี", "ภูเก็ต", "ขอนแก่น", "นครราชสีมา", "สงขลา"];
  const DISTRICTS: Record<string, string[]> = {
    "กรุงเทพมหานคร": ["คลองเตย", "วัฒนา", "สาทร", "บางรัก", "ปทุมวัน", "จตุจักร", "ดินแดง", "ห้วยขวาง", "บางนา", "พระโขนง"],
    "นนทบุรี": ["เมืองนนทบุรี", "ปากเกร็ด", "บางกรวย", "บางใหญ่", "บางบัวทอง"],
    "ปทุมธานี": ["เมืองปทุมธานี", "คลองหลวง", "ธัญบุรี", "ลำลูกกา", "รังสิต"],
    "สมุทรปราการ": ["เมืองสมุทรปราการ", "บางพลี", "บางบ่อ", "พระประแดง"],
  };
  const SUB_DISTRICTS: Record<string, string[]> = {
    "คลองเตย": ["คลองเตย", "คลองตัน", "พระโขนง"],
    "วัฒนา": ["คลองเตยเหนือ", "คลองตันเหนือ", "พระโขนงเหนือ"],
    "สาทร": ["ทุ่งมหาเมฆ", "ทุ่งวัดดอน", "ยานนาวา"],
    "บางรัก": ["บางรัก", "สีลม", "สุริยวงศ์", "มหาพฤฒาราม"],
    "ปทุมวัน": ["ปทุมวัน", "รองเมือง", "วังใหม่", "ลุมพินี"],
    "เมืองนนทบุรี": ["สวนใหญ่", "ตลาดขวัญ", "บางเขน"],
    "ปากเกร็ด": ["ปากเกร็ด", "บางตลาด", "คลองเกลือ"],
  };
  const BIZ_CATEGORIES = ["บริษัท", "ห้างหุ้นส่วนจำกัด", "ห้างหุ้นส่วนสามัญ", "บุคคลธรรมดา"];
  const BIZ_PREFIXES: Record<string, string[]> = {
    "บริษัท": ["บริษัท"],
    "ห้างหุ้นส่วนจำกัด": ["ห้างหุ้นส่วนจำกัด"],
    "ห้างหุ้นส่วนสามัญ": ["ห้างหุ้นส่วนสามัญ"],
    "บุคคลธรรมดา": ["นาย", "นาง", "นางสาว"],
  };
  const BIZ_SUFFIXES: Record<string, string> = {
    "บริษัท": "จำกัด",
    "ห้างหุ้นส่วนจำกัด": "",
    "ห้างหุ้นส่วนสามัญ": "",
    "บุคคลธรรมดา": "",
  };
  const BIZ_TYPES = ["ขายส่ง", "ขายปลีก", "ผลิต", "บริการ", "นำเข้า-ส่งออก", "อื่นๆ"];
  const COUNTRIES = ["ไทย", "สิงคโปร์", "มาเลเซีย", "ญี่ปุ่น", "จีน", "สหรัฐอเมริกา"];

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  /* ── sub-components ── */

  const TopBar = () => (
    <div className="h-[52px] flex items-center px-4 gap-2.5 shrink-0" style={{ background: OR }}>
      <button onClick={() => setNavOpen(!navOpen)} className="text-white text-lg mr-1">☰</button>
      <div className="text-[11px] text-white/80 flex-1"><strong className="text-white font-semibold">สยามเทรด จำกัด</strong> | siamtrade.jigsawerp.com</div>
      <div className="flex items-center gap-3">
        <span className="text-white text-lg cursor-pointer relative">🔔</span>
        <div className="w-px h-[22px] bg-white/30" />
        <span className="text-white text-xs font-medium">สมชาย วงศ์ใหญ่</span>
        <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center text-[11px] font-bold border-2 border-white/40" style={{ color: OR }}>สว</div>
      </div>
    </div>
  );

  const ScreenMeta = ({ id, title, actor = "Tenant Admin", pills }: { id: string; title: string; actor?: string; pills?: { label: string; target: Screen; hi?: boolean }[] }) => (
    <div className="flex items-center gap-2.5 flex-wrap shrink-0 px-4 py-2" style={{ background: "#1e1e2e" }}>
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: "#7ab8f5", background: "#1e3a5f" }}>{id}</span>
      <span className="text-xs font-medium text-white flex-1">{title}</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded-lg" style={{ background: "#3d2800", color: "#fac775" }}>{actor}</span>
      {pills && (
        <div className="flex gap-1.5 ml-auto flex-wrap">
          {pills.map((p) => (
            <button key={p.label} onClick={() => go(p.target)}
              className="px-3 py-1 rounded-xl text-[11px] cursor-pointer transition-all border"
              style={p.hi ? { background: OR, color: "white", borderColor: OR } : { background: "#2a2a3e", color: "#888", borderColor: "#2a2a3e" }}
            >{p.label}</button>
          ))}
        </div>
      )}
    </div>
  );

  /* ── Wizard sidebar ── */
  const WizSidebar = ({ currentScreen }: { currentScreen: Screen }) => {
    const statuses = getStepStatuses(currentScreen);
    const critDone = getCriticalDone(currentScreen);
    const pct = getProgressPct(currentScreen);
    const isW7 = currentScreen === "w7";

    const circleStyle = (status: StepStatus, step: WizStep): React.CSSProperties => {
      if (status === "active" && isW7) return { background: GREEN, borderColor: GREEN, color: "white" };
      if (status === "active") return { background: OR, borderColor: OR, color: "white" };
      if (status === "done") return { background: GREEN, borderColor: GREEN, color: "white" };
      if (status === "skip") return { background: "#EF9F27", borderColor: "#EF9F27", color: "white" };
      if (step.type === "critical") return { background: "white", color: RED, borderColor: RED, borderStyle: "dashed" };
      if (step.type === "warn") return { background: "white", color: "#EF9F27", borderColor: "#EF9F27" };
      return { background: "white", color: HINT, borderColor: BORDER2 };
    };

    const circleContent = (status: StepStatus, step: WizStep) => {
      if (status === "done") return "✓";
      if (status === "skip") return "–";
      return step.num;
    };

    const typeLabel = (status: StepStatus, step: WizStep) => {
      if (status === "done") return <span style={{ color: GREEN, fontSize: 9 }}>✓ เสร็จแล้ว</span>;
      if (status === "skip") return <span style={{ color: "#EF9F27", fontSize: 9 }}>⚠ ข้ามแล้ว</span>;
      if (step.type === "critical") return <span style={{ color: RED, fontSize: 9 }}>● Critical</span>;
      if (step.type === "warn") return <span style={{ color: "#EF9F27", fontSize: 9 }}>⚠ ข้ามได้</span>;
      if (step.type === "checklist") return <span style={{ color: GREEN, fontSize: 9 }}>● Checklist</span>;
      return null;
    };

    return (
      <div className="w-[220px] bg-white shrink-0 overflow-y-auto flex flex-col" style={{ borderRight: `1px solid ${BORDER}` }}>
        <div className="px-4 pb-3.5 mb-2" style={{ borderBottom: `1px solid ${BORDER}`, paddingTop: 16 }}>
          <div className="text-[13px] font-bold" style={{ color: OR }}>⚙ ตั้งค่าระบบ</div>
          <div className="text-[10px] mt-0.5" style={{ color: MUTED }}>{getStepOf(currentScreen)}</div>
        </div>
        {currentScreen === "w1" && (
          <div className="px-4 mb-1 text-[9px] font-semibold uppercase tracking-wider" style={{ color: HINT, letterSpacing: "0.7px" }}>ขั้นตอน</div>
        )}
        {STEPS.map((step, i) => {
          const status = statuses[i];
          return (
            <div key={i}
              className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-all"
              style={{
                background: status === "active" ? OR_L : "transparent",
                borderLeft: `3px solid ${status === "active" ? OR : status === "done" ? GREEN : status === "skip" ? "#EF9F27" : "transparent"}`,
              }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ ...circleStyle(status, step), borderWidth: 2 }}>
                {circleContent(status, step)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium" style={{
                  color: status === "active" ? (isW7 ? GREEN : OR) : status === "done" ? GREEN : TEXT,
                  fontWeight: status === "active" ? 600 : 500,
                }}>{step.name}</div>
                {typeLabel(status, step)}
              </div>
            </div>
          );
        })}
        <div className="mt-auto px-4 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="h-1 rounded-sm overflow-hidden mb-1.5" style={{ background: BORDER }}>
            <div className="h-full rounded-sm transition-all duration-300" style={{ width: `${pct}%`, background: isW7 ? GREEN : OR }} />
          </div>
          <div className="text-[10px]" style={{ color: isW7 ? GREEN : MUTED }}>
            <span className="font-semibold" style={{ color: isW7 ? GREEN : OR }}>{critDone}</span> / 4 Critical เสร็จแล้ว{isW7 ? " 🎉" : ""}
          </div>
        </div>
      </div>
    );
  };

  /* ── Notice box ── */
  const Notice = ({ variant, icon, children }: { variant: "red" | "warn" | "blue" | "green" | "orange"; icon: string; children: React.ReactNode }) => {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
      red: { bg: RED_L, color: RED, border: "#FDCACA" },
      warn: { bg: AMBER_L, color: AMBER, border: "#FAC775" },
      blue: { bg: BLUE_L, color: BLUE, border: "#B5D4F4" },
      green: { bg: GREEN_L, color: GREEN, border: GREEN_M },
      orange: { bg: OR_L, color: "#7A3000", border: OR_M },
    };
    const s = styles[variant];
    return (
      <div className="flex items-start gap-2.5 rounded-[7px] mb-3.5 text-xs leading-relaxed" style={{ padding: "10px 14px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
        <span className="text-sm shrink-0 mt-0.5">{icon}</span>
        <div>{children}</div>
      </div>
    );
  };

  /* ── Section card ── */
  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg mb-3.5" style={{ border: `1px solid ${BORDER}`, padding: 18 }}>
      <div className="text-[13px] font-bold mb-3.5 flex items-center gap-1.5" style={{ color: OR }}>
        {title}
        <div className="flex-1 h-px" style={{ background: BORDER }} />
      </div>
      {children}
    </div>
  );

  /* ── Wizard content header ── */
  const WizContentHdr = ({ num, numColor, title, badge }: { num: string; numColor: string; title: string; badge?: { label: string; bg: string; color: string } }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: numColor }}>{num}</div>
      <div className="text-lg font-bold" style={{ color: TEXT }}>{title}</div>
      {badge && <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-[10px]" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>}
    </div>
  );

  /* ── Action footer ── */
  const WizAction = ({ left, children }: { left: string; children: React.ReactNode }) => (
    <div className="flex justify-between items-center shrink-0 bg-white" style={{ padding: "14px 20px", borderTop: `1px solid ${BORDER}` }}>
      <span className="text-[11px]" style={{ color: MUTED }}>{left}</span>
      <div className="flex gap-2.5">{children}</div>
    </div>
  );

  const BtnGhost = ({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) => (
    <button onClick={onClick} disabled={disabled}
      className="px-4 py-2 rounded-md text-xs cursor-pointer font-[inherit] transition-colors"
      style={{ border: `1px solid ${BORDER2}`, background: "white", color: disabled ? HINT : TEXT, opacity: disabled ? 0.4 : 1 }}
    >{children}</button>
  );
  const BtnOr = ({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) => (
    <button onClick={onClick} disabled={disabled}
      className="px-5 py-2 rounded-md text-xs font-bold cursor-pointer font-[inherit] border-none"
      style={{ background: disabled ? "#ccc" : OR, color: "white", opacity: disabled ? 0.4 : 1 }}
    >{children}</button>
  );
  const BtnGreen = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
    <button onClick={onClick}
      className="px-5 py-2 rounded-md text-xs font-bold cursor-pointer font-[inherit] border-none"
      style={{ background: GREEN, color: "white" }}
    >{children}</button>
  );

  /* ── Form field (floating label) ── */
  const FGroup = ({ label, value, onChange, type = "text", locked, error, fullSpan, children }: {
    label: string; value?: string; onChange?: (v: string) => void; type?: string; locked?: boolean; error?: boolean; fullSpan?: boolean; children?: React.ReactNode;
  }) => (
    <div className={fullSpan ? "col-span-2" : ""}>
      <div className="relative mb-0.5">
        {children ? children : (
          <input
            type={type} value={value || ""} onChange={(e) => onChange?.(e.target.value)}
            readOnly={locked}
            className="w-full rounded-md text-[13px] outline-none transition-colors"
            style={{
              padding: "10px 12px", border: `1px solid ${error ? RED : BORDER2}`,
              background: locked ? "#f5f5f5" : "white", color: locked ? MUTED : TEXT,
              cursor: locked ? "not-allowed" : "text",
            }}
          />
        )}
        <label className="absolute top-0 left-[11px] -translate-y-1/2 bg-white px-0.5 text-[10px] pointer-events-none" style={{ color: error ? RED : OR }}>{label}</label>
      </div>
    </div>
  );

  /* ═══════ SCREEN NAV (dev nav) ═══════ */
  const screenNavItems: { id: Screen; label: string; badge?: string }[] = [
    { id: "w1", label: "Wizard Entry" },
    { id: "w2a", label: "Step 1 — ข้อมูลธุรกิจ" },
    { id: "w4", label: "Step 2 — สาขาแรก" },
    { id: "w5", label: "Step 3 — การเงิน" },
    { id: "w6", label: "Step 4 — คลังสินค้า" },
    { id: "w7", label: "Checklist Summary", badge: "✓" },
    { id: "we1", label: "Block Navigation Modal" },
  ];

  /* ═══════ ICON SIDEBAR ═══════ */
  const iconSidebarItems = [
    { icon: "⌂", title: "งานของฉัน" },
    { icon: "⏱", title: "My Tasks" },
    { icon: "📋", title: "จัดซื้อ" },
    { icon: "📦", title: "คลัง" },
    { icon: "🏷", title: "ขาย" },
    { icon: "📊", title: "รายงาน" },
  ];

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <div className="flex min-h-screen" style={{ background: "#2c2c3a" }}>
      {/* Screen Nav (toggle) */}
      {navOpen && (
        <div className="w-[220px] fixed left-[52px] top-0 h-screen z-[90] overflow-y-auto flex flex-col" style={{ background: "#12121f" }}>
          <div className="px-3 py-2 pb-3" style={{ borderBottom: "1px solid #2a2a3e", background: "#0e0e1a" }}>
            <div className="text-xs font-semibold text-white">🧩 F-02 Wireframe</div>
            <div className="text-[10px] mt-0.5" style={{ color: "#555" }}>Setup Wizard — Onboarding</div>
          </div>
          <div className="px-3 pt-1.5 pb-0.5 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#444", letterSpacing: "0.7px" }}>Setup Wizard</div>
          {screenNavItems.slice(0, 6).map((item) => (
            <button key={item.id} onClick={() => { go(item.id); setNavOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 text-left text-xs transition-all"
              style={{
                color: screen === item.id ? "white" : "#777",
                background: screen === item.id ? "#1a1a2e" : "transparent",
                borderLeft: `2px solid ${screen === item.id ? OR : "transparent"}`,
              }}
            >
              <span className="text-[10px] font-mono w-[22px] opacity-70">{item.id.replace("w", "0").toUpperCase()}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-px rounded-lg text-white" style={{ background: item.badge === "✓" ? GREEN : "#EF9F27" }}>{item.badge}</span>
              )}
            </button>
          ))}
          <div className="px-3 pt-2 pb-0.5 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#444", letterSpacing: "0.7px" }}>Error States</div>
          <button onClick={() => { go("we1"); setNavOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 text-left text-xs"
            style={{ color: screen === "we1" ? "white" : "#777", background: screen === "we1" ? "#1a1a2e" : "transparent", borderLeft: `2px solid ${screen === "we1" ? OR : "transparent"}` }}
          >
            <span className="text-[10px] font-mono w-[22px] opacity-70">E1</span>
            Block Navigation Modal
          </button>
        </div>
      )}

      {/* Icon Sidebar */}
      <div className="w-[52px] shrink-0 flex flex-col items-center fixed h-screen z-[100] top-0 left-0" style={{ background: "#2D2D2D" }}>
        <div className="w-[52px] h-[56px] flex items-center justify-center cursor-pointer" style={{ background: OR }} onClick={() => setNavOpen(!navOpen)}>
          <div className="text-[9px] font-extrabold text-white text-center leading-tight tracking-wider">JIG<br />SAW</div>
        </div>
        {iconSidebarItems.map((item) => (
          <div key={item.title} className="w-[44px] h-[40px] flex items-center justify-center rounded-md cursor-pointer text-[16px] my-0.5" style={{ color: "#888" }} title={item.title}>{item.icon}</div>
        ))}
        <div className="flex-1" />
        <div className="w-[44px] h-[40px] flex items-center justify-center rounded-md cursor-pointer text-[16px] mb-2" style={{ background: OR_L, color: OR }}>⚙</div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen" style={{ marginLeft: navOpen ? 272 : 52, background: BG, transition: "margin-left 0.15s" }}>

        {/* ════ W1: WIZARD ENTRY ════ */}
        {screen === "w1" && (
          <>
            <ScreenMeta id="S-02-01" title="Wizard Entry — Login ครั้งแรก" pills={[
              { label: "เริ่ม Step 1 →", target: "w2a", hi: true },
              { label: "Block Modal →", target: "we1" },
            ]} />
            <TopBar />
            <div className="flex flex-1 min-h-0">
              <WizSidebar currentScreen="w1" />
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5">
                  <Notice variant="orange" icon="👋">ยินดีต้อนรับสู่ <strong>ERP Jigsaw</strong> — กรุณาตั้งค่าระบบเบื้องต้นให้ครบก่อนเริ่มใช้งาน · Step ที่มี ⚠ ข้ามได้และแก้ภายหลัง</Notice>
                  <SectionCard title="ภาพรวมการตั้งค่า">
                    <div className="flex flex-col gap-2">
                      {/* Step 1 active */}
                      <div className="flex items-center gap-2.5 rounded-md" style={{ padding: "8px 12px", background: OR_L, border: `1px solid ${OR_M}` }}>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: OR }} />
                        <div className="text-xs font-semibold flex-1" style={{ color: "#7A3000" }}>Step 1 — ข้อมูลธุรกิจ</div>
                        <div className="text-[10px]" style={{ color: OR }}>กำลังดำเนินการ</div>
                      </div>
                      {[{ n: 2, t: "สาขาแรก" }, { n: 3, t: "การเงินพื้นฐาน" }, { n: 4, t: "คลังสินค้าแรก" }].map((s) => (
                        <div key={s.n} className="flex items-center gap-2.5 rounded-md" style={{ padding: "8px 12px", background: "#f9f9f7", border: `1px solid ${BORDER}` }}>
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: RED }} />
                          <div className="text-xs flex-1" style={{ color: MUTED }}>Step {s.n} — {s.t}</div>
                          <div className="text-[10px]" style={{ color: HINT }}>รอ</div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
                <WizAction left="0 / 4 Critical เสร็จแล้ว">
                  <BtnOr onClick={() => go("w2a")}>เริ่มตั้งค่า →</BtnOr>
                </WizAction>
              </div>
            </div>
          </>
        )}

        {/* ════ W2A: STEP 1 — ข้อมูลธุรกิจ (รวม) ════ */}
        {screen === "w2a" && (
          <>
            <ScreenMeta id="S-02-02" title="Step 1 — ข้อมูลธุรกิจ" pills={[
              { label: "← Entry", target: "w1" },
              { label: "ถัดไป → Step 2 →", target: "w4", hi: true },
            ]} />
            <TopBar />
            <div className="flex flex-1 min-h-0">
              <WizSidebar currentScreen="w2a" />
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5">
                  <WizContentHdr num="1" numColor={RED} title="ข้อมูลธุรกิจ" badge={{ label: "🔴 Critical", bg: RED_L, color: RED }} />

                  {/* ── Card รวมทุก Section ── */}
                  <div className="bg-white rounded-lg" style={{ border: `1px solid ${BORDER}`, padding: "24px 28px" }}>

                    {/* ── Section: ข้อมูลธุรกิจ ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>ข้อมูลธุรกิจ</div>

                    {/* Logo upload */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-[90px] h-[90px] rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F0F0F0", border: `1px solid ${BORDER}` }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button className="px-4 py-2 rounded-md text-[13px] font-semibold text-white border-none cursor-pointer" style={{ background: OR }}>อัพโหลดรูปภาพ</button>
                        <button className="px-4 py-2 rounded-md text-[13px] cursor-pointer" style={{ border: `1px solid ${BORDER2}`, background: "white", color: RED }}>ลบ</button>
                      </div>
                      <span className="text-[11px]" style={{ color: HINT }}>อัพโหลดไฟล์ JPG, GIF or PNG. ขนาดไม่เกิน 800K</span>
                    </div>

                    {/* Row: Radio + เลขภาษี + ประเภทกิจการ */}
                    <div className="flex items-end gap-4 mb-4">
                      <div className="flex items-center gap-5 shrink-0 pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="personType" checked={personType === "natural"} onChange={() => setPersonType("natural")}
                            className="w-4 h-4 accent-[#565DFF]" />
                          <span className="text-[13px]" style={{ color: TEXT }}>บุคคลธรรมดา</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="personType" checked={personType === "juristic"} onChange={() => setPersonType("juristic")}
                            className="w-4 h-4 accent-[#565DFF]" />
                          <span className="text-[13px]" style={{ color: TEXT }}>นิติบุคคล</span>
                        </label>
                      </div>
                      <div className="flex-1">
                        <FGroup label="เลขประจำตัวผู้เสียภาษี *" value={taxId} onChange={setTaxId} />
                      </div>
                      <div className="w-[180px]">
                        <FGroup label="ประเภทกิจการ *">
                          <select value={bizCategory} onChange={(e) => {
                            setBizCategory(e.target.value);
                            const prefixes = BIZ_PREFIXES[e.target.value] || [];
                            setPrefix(prefixes[0] || "");
                            setSuffix(BIZ_SUFFIXES[e.target.value] || "");
                          }}
                            className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                            style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                          >
                            {BIZ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </FGroup>
                      </div>
                    </div>

                    {/* Row: คำนำหน้า(TH), ชื่อบริษัท(TH), คำลงท้าย(TH), ชื่อบริษัท(EN) */}
                    <div className="grid grid-cols-[140px_1fr_140px_1fr] gap-3 mb-4">
                      <FGroup label="คำนำหน้า (TH)" value={prefix} onChange={setPrefix} />
                      <FGroup label="ชื่อบริษัท (TH) *" value={companyName} onChange={setCompanyName} />
                      <FGroup label="คำลงท้าย (TH)" value={suffix} onChange={setSuffix} />
                      <FGroup label="ชื่อบริษัท (EN)" value="Siam Trade Co., Ltd." onChange={() => {}} />
                    </div>

                    {/* Row: เบอร์โทร, อีเมล, ประเภทธุรกิจ */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <FGroup label="เบอร์โทรศัพท์ *" value={phone} onChange={setPhone} />
                      <FGroup label="อีเมล" value={email} onChange={setEmail} />
                      <FGroup label="ประเภทธุรกิจ *">
                        <select value={bizType} onChange={(e) => setBizType(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          {BIZ_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </FGroup>
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px mb-5" style={{ background: BORDER }} />

                    {/* ── Section: ข้อมูลที่อยู่ธุรกิจ ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>ข้อมูลที่อยู่ธุรกิจ</div>

                    {/* Row 1: ประเทศ, ที่อยู่, แขวง/ตำบล, เขต/อำเภอ */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <FGroup label="ประเทศ *">
                        <select value={country} onChange={(e) => setCountry(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกประเทศ</option>
                          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </FGroup>
                      <FGroup label="ที่อยู่ *" value={address} onChange={setAddress} />
                      <FGroup label="แขวง/ตำบล *">
                        <select value={subDistrict} onChange={(e) => setSubDistrict(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกแขวง/ตำบล</option>
                          {(SUB_DISTRICTS[district] || []).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </FGroup>
                      <FGroup label="เขต/อำเภอ *">
                        <select value={district} onChange={(e) => { setDistrict(e.target.value); setSubDistrict(""); }}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกเขต/อำเภอ</option>
                          {(DISTRICTS[province] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FGroup>
                    </div>

                    {/* Row 2: จังหวัด, รหัสไปรษณีย์, เบอร์โทรศัพท์ */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <FGroup label="จังหวัด *">
                        <select value={province} onChange={(e) => { setProvince(e.target.value); setDistrict(""); setSubDistrict(""); }}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกจังหวัด</option>
                          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </FGroup>
                      <FGroup label="รหัสไปรษณีย์ *">
                        <select value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">กรอกรหัสไปรษณีย์</option>
                        </select>
                      </FGroup>
                      <FGroup label="เบอร์โทรศัพท์" value={contactPhone} onChange={setContactPhone} />
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px mb-5" style={{ background: BORDER }} />

                    {/* ── Section: Branding ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>Branding</div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 max-w-[360px]">
                        <FGroup label="ชื่อระบบที่แสดงบน Header" value="Siam Trade" onChange={() => {}} />
                      </div>
                      <div className="flex-1 max-w-[300px]">
                        <FGroup label="สีหลัก *" value="#565DFF" onChange={() => {}} />
                      </div>
                      <div className="w-10 h-10 rounded-md shrink-0" style={{ background: OR }} />
                      <span className="text-[12px] shrink-0" style={{ color: MUTED }}>สีหลัก, Tab active</span>
                    </div>

                    {/* ── ปุ่ม ยกเลิก / บันทึก ── */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => go("w1")}
                        className="px-6 py-2.5 rounded-md text-[13px] cursor-pointer"
                        style={{ border: `1px solid ${BORDER2}`, background: "white", color: TEXT }}
                      >ยกเลิก</button>
                      <button onClick={() => go("w4")}
                        className="px-6 py-2.5 rounded-md text-[13px] font-bold cursor-pointer border-none text-white"
                        style={{ background: OR }}
                      >ถัดไป →</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ════ W4: STEP 2 — สาขาแรก ════ */}
        {screen === "w4" && (
          <>
            <ScreenMeta id="S-02-04" title="Step 2 — สาขาแรก (HQ)" pills={[
              { label: "← Step 1", target: "w2a" },
              { label: "ถัดไป → Step 3 →", target: "w5", hi: true },
            ]} />
            <TopBar />
            <div className="flex flex-1 min-h-0">
              <WizSidebar currentScreen="w4" />
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5">
                  <WizContentHdr num="2" numColor={RED} title="สาขาแรก (สำนักงานใหญ่)" badge={{ label: "🔴 Critical", bg: RED_L, color: RED }} />

                  {/* ── Card รวมทุก Section ── */}
                  <div className="bg-white rounded-lg" style={{ border: `1px solid ${BORDER}`, padding: "24px 28px" }}>

                    {/* ── Section: ข้อมูลสาขา ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>ข้อมูลสาขา</div>

                    {/* Notice */}
                    <div className="flex items-center gap-2.5 rounded-[7px] mb-4 text-xs" style={{ padding: "10px 14px", background: OR_L, border: `1px solid ${OR_M}`, color: "#7A3000" }}>
                      <span className="text-sm shrink-0">ℹ️</span>
                      <span>สาขาแรกจะถูกกำหนดเป็น <strong>HQ (สำนักงานใหญ่)</strong> อัตโนมัติ เพิ่มสาขาอื่นได้ภายหลังใน Settings</span>
                    </div>

                    {/* Row: รหัสสาขา + Radio + VAT CODE */}
                    <div className="flex items-end gap-4 mb-4">
                      <div className="w-[160px]">
                        <FGroup label="รหัสสาขา *" value={branchCode} onChange={setBranchCode} />
                      </div>
                      <div className="flex items-center gap-5 shrink-0 pb-2">
                        {([
                          { id: "hq" as const, label: "สำนักงานใหญ่" },
                          { id: "branch" as const, label: "สาขา" },
                          { id: "none" as const, label: "ไม่ระบุ" },
                        ]).map((opt) => (
                          <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="branchType" checked={branchType === opt.id} onChange={() => setBranchType(opt.id)}
                              className="w-4 h-4 accent-[#565DFF]" />
                            <span className="text-[13px]" style={{ color: TEXT }}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="w-[180px]">
                        <FGroup label="VAT CODE *" value={vatCode} onChange={setVatCode} />
                      </div>
                    </div>

                    {/* Row: ชื่อสาขา TH + EN */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <FGroup label="ชื่อสาขา (TH) *" value={branchNameTH} onChange={setBranchNameTH} />
                      <FGroup label="ชื่อสาขา (EN) *" value={branchNameEN} onChange={setBranchNameEN} />
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px mb-5" style={{ background: BORDER }} />

                    {/* ── Section: ที่อยู่ภาษาไทย ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>ที่อยู่ภาษาไทย</div>

                    {/* Button: ดึงที่อยู่จากหน้าธุรกิจ */}
                    <button className="px-4 py-2 rounded-md text-[13px] font-semibold text-white border-none cursor-pointer mb-4" style={{ background: "#333" }}>
                      ดึงที่อยู่จากหน้าธุรกิจ
                    </button>

                    {/* Row 1: ประเทศ, ที่อยู่, แขวง/ตำบล, เขต/อำเภอ */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <FGroup label="ประเทศ *">
                        <select value={branchCountry} onChange={(e) => setBranchCountry(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกประเทศ</option>
                          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </FGroup>
                      <FGroup label="ที่อยู่ *" value={branchAddress} onChange={setBranchAddress} />
                      <FGroup label="แขวง/ตำบล *">
                        <select value={branchSubDistrict} onChange={(e) => setBranchSubDistrict(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกแขวง/ตำบล</option>
                          {(SUB_DISTRICTS[branchDistrict] || []).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </FGroup>
                      <FGroup label="เขต/อำเภอ *">
                        <select value={branchDistrict} onChange={(e) => { setBranchDistrict(e.target.value); setBranchSubDistrict(""); }}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกเขต/อำเภอ</option>
                          {(DISTRICTS[branchProvince] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </FGroup>
                    </div>

                    {/* Row 2: จังหวัด, รหัสไปรษณีย์, เบอร์โทร */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <FGroup label="จังหวัด *">
                        <select value={branchProvince} onChange={(e) => { setBranchProvince(e.target.value); setBranchDistrict(""); setBranchSubDistrict(""); }}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกจังหวัด</option>
                          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </FGroup>
                      <FGroup label="รหัสไปรษณีย์ *">
                        <select value={branchPostalCode} onChange={(e) => setBranchPostalCode(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">กรอกรหัสไปรษณีย์</option>
                        </select>
                      </FGroup>
                      <FGroup label="เบอร์โทรศัพท์" value={branchPhone} onChange={setBranchPhone} />
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px mb-5" style={{ background: BORDER }} />

                    {/* ── Section: ที่อยู่ภาษาอังกฤษ ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>ที่อยู่ภาษาอังกฤษ</div>

                    <div className="max-w-[480px] flex flex-col gap-3 mb-4">
                      <FGroup label="ที่อยู่ 1 (Line1) *" value={enAddr1} onChange={setEnAddr1} />
                      <FGroup label="ที่อยู่ 2 (Line2)" value={enAddr2} onChange={setEnAddr2} />
                      <FGroup label="ที่อยู่ 3 (Line3)" value={enAddr3} onChange={setEnAddr3} />
                    </div>
                    <div className="grid grid-cols-[220px_220px] gap-3 mb-6">
                      <FGroup label="ประเทศ *">
                        <select value={enCountry} onChange={(e) => setEnCountry(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="">เลือกประเทศ</option>
                          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </FGroup>
                      <FGroup label="รหัสไปรษณีย์ *" value={enPostalCode} onChange={setEnPostalCode} />
                    </div>

                    {/* ── ปุ่ม ยกเลิก / บันทึก ── */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => go("w2a")}
                        className="px-6 py-2.5 rounded-md text-[13px] cursor-pointer"
                        style={{ border: `1px solid ${BORDER2}`, background: "white", color: TEXT }}
                      >ยกเลิก</button>
                      <button onClick={() => go("w5")}
                        className="px-6 py-2.5 rounded-md text-[13px] font-bold cursor-pointer border-none text-white"
                        style={{ background: OR }}
                      >ถัดไป →</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ════ W5: STEP 3 — การเงินพื้นฐาน ════ */}
        {screen === "w5" && (
          <>
            <ScreenMeta id="S-02-05" title="Step 3 — การเงินพื้นฐาน · Costing Method" pills={[
              { label: "← Step 2", target: "w4" },
              { label: "ถัดไป → Step 4 →", target: "w6", hi: true },
            ]} />
            <TopBar />
            <div className="flex flex-1 min-h-0">
              <WizSidebar currentScreen="w5" />
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5">
                  <WizContentHdr num="3" numColor={RED} title="การเงินพื้นฐาน" badge={{ label: "🔴 Critical", bg: RED_L, color: RED }} />

                  {/* ── Card รวมทุก Section ── */}
                  <div className="bg-white rounded-lg" style={{ border: `1px solid ${BORDER}`, padding: "24px 28px" }}>

                    {/* ── Section: ข้อมูลภาษี ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>ข้อมูลภาษี</div>

                    {/* สกุลเงิน */}
                    <div className="mb-4">
                      <FGroup label="สกุลเงิน *">
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="บาท">บาท</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="JPY">JPY</option>
                        </select>
                      </FGroup>
                    </div>

                    {/* Toggle VAT + ภาษีมูลค่าเพิ่ม */}
                    <div className="flex items-end gap-4 mb-4">
                      {/* Toggle */}
                      <div className="shrink-0 pb-2">
                        <button onClick={() => setVatEnabled(!vatEnabled)}
                          className="w-[44px] h-[24px] rounded-full relative transition-colors cursor-pointer border-none"
                          style={{ background: vatEnabled ? "#F5A623" : BORDER2 }}
                        >
                          <div className="w-[20px] h-[20px] rounded-full bg-white absolute top-[2px] transition-all shadow-sm"
                            style={{ left: vatEnabled ? 22 : 2 }}
                          />
                        </button>
                      </div>
                      <div className="flex-1">
                        <FGroup label="ภาษีมูลค่าเพิ่ม (VAT) *" value={vatRate} onChange={setVatRate} type="number" />
                      </div>
                    </div>

                    {/* วันที่จดทะเบียนภาษี */}
                    <div className="mb-4">
                      <FGroup label="วันที่จดทะเบียนภาษีมูลค่าเพิ่ม *" value={vatRegDate} onChange={setVatRegDate} type="date" />
                    </div>

                    {/* วิธีคิดภาษีมูลค่าเพิ่ม */}
                    <div className="mb-6">
                      <FGroup label="วิธีคิดภาษีมูลค่าเพิ่ม *">
                        <select value={vatCalcMethod} onChange={(e) => setVatCalcMethod(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="แยกภาษี">แยกภาษี</option>
                          <option value="รวมภาษี">รวมภาษี</option>
                        </select>
                      </FGroup>
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px mb-5" style={{ background: BORDER }} />

                    {/* ── Section: วิธีคิดต้นทุนสินค้า ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>วิธีคิดต้นทุนสินค้า</div>

                    <div className="flex items-center gap-2.5 rounded-[7px] mb-4 text-xs" style={{ padding: "10px 14px", background: AMBER_L, border: `1px solid #FAC775`, color: AMBER }}>
                      <span className="text-sm shrink-0">⚠</span>
                      <span>🔒 Lv 4 — SA แก้ได้ก่อนมีใบรับสินค้า (GR) · หลัง GR แรกไม่มีใครแก้ได้ · เลือกให้ถูกต้องก่อนรับสินค้าครั้งแรก</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {([
                        { id: "fifo" as const, name: "FIFO", sub: "First In, First Out", desc: "ของที่เข้ามาก่อนถูกตัดออกก่อน · เหมาะกับสินค้าที่มีวันหมดอายุ" },
                        { id: "avg" as const, name: "Average Cost", sub: "ต้นทุนถัวเฉลี่ย", desc: "เฉลี่ยต้นทุนทุกล็อตเข้าด้วยกัน · เหมาะกับสินค้าทั่วไป" },
                      ]).map((m) => {
                        const sel = costingMethod === m.id;
                        return (
                          <button key={m.id} onClick={() => setCostingMethod(m.id)}
                            className="rounded-lg p-4 text-left cursor-pointer transition-all"
                            style={{ border: `1.5px solid ${sel ? OR : BORDER2}`, background: sel ? OR_L : "white" }}
                          >
                            <div className="text-[14px] font-bold" style={{ color: sel ? "#7A3000" : TEXT }}>{m.name}</div>
                            <div className="text-[11px] font-semibold mt-0.5" style={{ color: sel ? OR : MUTED }}>{m.sub}</div>
                            <div className="text-[12px] mt-1.5 leading-relaxed" style={{ color: MUTED }}>{m.desc}</div>
                            <div className="text-[10px] mt-2 flex items-center gap-1" style={{ color: AMBER }}>🔒 Lv 4 — lock หลัง GR แรก</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px mb-5" style={{ background: BORDER }} />

                    {/* ── Section: ค่าเริ่มต้น AR / AP ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>ค่าเริ่มต้น AR / AP</div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <FGroup label="เครดิตลูกค้า default (วัน)" value="30" onChange={() => {}} type="number" />
                      <FGroup label="เครดิต Supplier default (วัน)" value="30" onChange={() => {}} type="number" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <FGroup label="รูปแบบราคา default">
                        <select className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option>รวม VAT</option><option>แยก VAT</option>
                        </select>
                      </FGroup>
                      <FGroup label="หัก ณ ที่จ่าย default (%)" value="3" onChange={() => {}} type="number" />
                    </div>

                    {/* ── ปุ่ม ยกเลิก / บันทึก ── */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => go("w4")}
                        className="px-6 py-2.5 rounded-md text-[13px] cursor-pointer"
                        style={{ border: `1px solid ${BORDER2}`, background: "white", color: TEXT }}
                      >ยกเลิก</button>
                      <button onClick={() => go("w6")}
                        className="px-6 py-2.5 rounded-md text-[13px] font-bold cursor-pointer border-none text-white"
                        style={{ background: OR }}
                      >ถัดไป →</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ════ W6: STEP 4 — คลังสินค้า ════ */}
        {screen === "w6" && (
          <>
            <ScreenMeta id="S-02-06" title="Step 4 — คลังสินค้าแรก" pills={[
              { label: "← Step 3", target: "w5" },
              { label: "ถัดไป → สรุป →", target: "w7", hi: true },
            ]} />
            <TopBar />
            <div className="flex flex-1 min-h-0">
              <WizSidebar currentScreen="w6" />
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5">
                  <WizContentHdr num="4" numColor={RED} title="คลังสินค้าแรก" badge={{ label: "🔴 Critical", bg: RED_L, color: RED }} />

                  {/* ── Card รวมทุก Section ── */}
                  <div className="bg-white rounded-lg" style={{ border: `1px solid ${BORDER}`, padding: "24px 28px" }}>

                    {/* รหัสคลังสินค้า */}
                    <div className="mb-4">
                      <FGroup label="รหัสคลังสินค้า *" value={whCode} onChange={setWhCode} />
                    </div>

                    {/* ชื่อคลังสินค้า */}
                    <div className="mb-4">
                      <FGroup label="ชื่อคลังสินค้า *" value={whName} onChange={setWhName} />
                    </div>

                    {/* ประเภทคลังสินค้า — locked เป็นคลังสินค้าสาขา */}
                    <div className="mb-1">
                      <div className="text-[13px] font-semibold mb-2" style={{ color: "#F5A623" }}>ประเภทคลังสินค้า<span style={{ color: RED }}>*</span></div>
                      <div className="flex items-center gap-5">
                        <label className="flex items-center gap-2 opacity-40 cursor-not-allowed">
                          <input type="radio" name="whCategory" checked={false} disabled className="w-4 h-4 accent-[#F5A623]" />
                          <span className="text-[13px]" style={{ color: TEXT }}>คลังสินค้ากลาง</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-not-allowed">
                          <input type="radio" name="whCategory" checked={true} disabled className="w-4 h-4 accent-[#F5A623]" />
                          <span className="text-[13px] font-medium" style={{ color: TEXT }}>คลังสินค้าสาขา</span>
                        </label>
                      </div>
                    </div>
                    {/* แสดงสาขาที่ผูก */}
                    <div className="flex items-center gap-2 rounded-md mb-5" style={{ background: "#f5f5f5", border: `1px solid ${BORDER}`, padding: "9px 12px", marginTop: 8 }}>
                      <span className="text-[13px]" style={{ color: MUTED }}>🏢 สาขาสำนักงานใหญ่</span>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-[10px] whitespace-nowrap" style={{ background: BLUE_L, color: BLUE }}>ล๊อกจาก Step 2</span>
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px mb-5" style={{ background: BORDER }} />

                    {/* ── Section: ที่อยู่คลังสินค้า ── */}
                    <div className="text-[15px] font-bold mb-4" style={{ color: OR }}>ที่อยู่คลังสินค้า</div>

                    {/* Row 1: ประเทศ, ที่อยู่ */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <FGroup label="ประเทศ *">
                        <select value={whCountry} onChange={(e) => setWhCountry(e.target.value)}
                          className="w-full rounded-md text-[13px] outline-none appearance-none bg-white cursor-pointer"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        >
                          <option value="Thailand">Thailand</option>
                          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </FGroup>
                      <FGroup label="ที่อยู่" value={whAddress} onChange={setWhAddress} />
                    </div>

                    {/* Row 2: แขวง/ตำบล, อำเภอ/เขต */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <FGroup label="แขวง/ตำบล" value={whSubDistrict} onChange={setWhSubDistrict} />
                      <FGroup label="อำเภอ/เขต" value={whDistrict} onChange={setWhDistrict} />
                    </div>

                    {/* Row 3: จังหวัด, รหัสไปรษณีย์ */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <FGroup label="จังหวัด" value={whProvince} onChange={setWhProvince} />
                      <FGroup label="รหัสไปรษณีย์" value={whPostalCode} onChange={setWhPostalCode} />
                    </div>

                    {/* URL Google Map */}
                    <div className="mb-4">
                      <FGroup label="URL Google Map" value={whGoogleMap} onChange={setWhGoogleMap} />
                    </div>

                    {/* หมายเหตุ */}
                    <div className="mb-6">
                      <div className="relative">
                        <textarea value={whNote} onChange={(e) => setWhNote(e.target.value)}
                          rows={4}
                          className="w-full rounded-md text-[13px] outline-none resize-none"
                          style={{ padding: "10px 12px", border: `1px solid ${BORDER2}`, color: TEXT }}
                          placeholder="ระบุหมายเหตุ"
                        />
                        <label className="absolute top-0 left-[11px] -translate-y-1/2 bg-white px-0.5 text-[10px] pointer-events-none" style={{ color: OR }}>หมายเหตุ</label>
                      </div>
                    </div>

                    {/* ── ปุ่ม ยกเลิก / ถัดไป ── */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => go("w5")}
                        className="px-6 py-2.5 rounded-md text-[13px] cursor-pointer"
                        style={{ border: `1px solid ${BORDER2}`, background: "white", color: TEXT }}
                      >ยกเลิก</button>
                      <button onClick={() => go("w7")}
                        className="px-6 py-2.5 rounded-md text-[13px] font-bold cursor-pointer border-none text-white"
                        style={{ background: OR }}
                      >ถัดไป →</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ════ W7: CHECKLIST SUMMARY ════ */}
        {screen === "w7" && (
          <>
            <ScreenMeta id="S-02-07" title="Checklist Summary — พร้อมเปิดใช้ระบบ" pills={[
              { label: "← Step 4", target: "w6" },
              { label: "ยืนยัน → เข้าสู่ระบบ", target: "w7", hi: true },
            ]} />
            <TopBar />
            <div className="flex flex-1 min-h-0">
              <WizSidebar currentScreen="w7" />
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5">
                  <WizContentHdr num="✓" numColor={GREEN} title="สรุปการตั้งค่าก่อนยืนยัน" badge={{ label: "✅ Critical ครบ 4/4", bg: GREEN_L, color: GREEN }} />
                  <Notice variant="warn" icon="⚠">กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกด <strong>&quot;ยืนยันและเปิดใช้ระบบ&quot;</strong> — เมื่อยืนยันแล้วข้อมูลจะ<strong>มีผลทันที</strong>และถูกบันทึกแยกไปยังส่วนต่างๆ ที่เกี่ยวข้อง</Notice>

                  {/* ── Step 1 สรุป ── */}
                  <div className="bg-white rounded-lg mb-3.5" style={{ border: `1px solid ${BORDER}`, padding: "18px 22px" }}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: GREEN }}>✓</div>
                      <div className="text-[14px] font-bold" style={{ color: GREEN }}>Step 1 — ข้อมูลธุรกิจ</div>
                      <div className="flex-1" />
                      <button onClick={() => go("w2a")} className="text-[11px] px-2.5 py-1 rounded-md cursor-pointer" style={{ border: `1px solid ${BORDER2}`, background: "white", color: OR }}>แก้ไข</button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]" style={{ color: TEXT }}>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ประเภท</span><span>{personType === "juristic" ? "นิติบุคคล" : "บุคคลธรรมดา"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>เลขผู้เสียภาษี</span><span>{taxId}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ชื่อบริษัท (TH)</span><span>{prefix} {companyName || "สยามเทรด"} {suffix}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ประเภทกิจการ</span><span>{bizCategory}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ประเภทธุรกิจ</span><span>{bizType}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>เบอร์โทร</span><span>{phone || "-"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>อีเมล</span><span>{email || "-"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ที่อยู่</span><span>{address || "-"} {subDistrict} {district} {province} {postalCode}</span></div>
                    </div>
                  </div>

                  {/* ── Step 2 สรุป ── */}
                  <div className="bg-white rounded-lg mb-3.5" style={{ border: `1px solid ${BORDER}`, padding: "18px 22px" }}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: GREEN }}>✓</div>
                      <div className="text-[14px] font-bold" style={{ color: GREEN }}>Step 2 — สาขาแรก</div>
                      <div className="flex-1" />
                      <button onClick={() => go("w4")} className="text-[11px] px-2.5 py-1 rounded-md cursor-pointer" style={{ border: `1px solid ${BORDER2}`, background: "white", color: OR }}>แก้ไข</button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]" style={{ color: TEXT }}>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>รหัสสาขา</span><span>{branchCode}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ประเภท</span><span>{branchType === "hq" ? "สำนักงานใหญ่" : branchType === "branch" ? "สาขา" : "ไม่ระบุ"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>VAT CODE</span><span>{vatCode}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ชื่อสาขา (TH)</span><span>{branchNameTH || "-"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ชื่อสาขา (EN)</span><span>{branchNameEN || "-"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ที่อยู่ (TH)</span><span>{branchAddress || "-"} {branchSubDistrict} {branchDistrict} {branchProvince}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ที่อยู่ (EN)</span><span>{enAddr1 || "-"}</span></div>
                    </div>
                  </div>

                  {/* ── Step 3 สรุป ── */}
                  <div className="bg-white rounded-lg mb-3.5" style={{ border: `1px solid ${BORDER}`, padding: "18px 22px" }}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: GREEN }}>✓</div>
                      <div className="text-[14px] font-bold" style={{ color: GREEN }}>Step 3 — การเงินพื้นฐาน</div>
                      <div className="flex-1" />
                      <button onClick={() => go("w5")} className="text-[11px] px-2.5 py-1 rounded-md cursor-pointer" style={{ border: `1px solid ${BORDER2}`, background: "white", color: OR }}>แก้ไข</button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]" style={{ color: TEXT }}>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>สกุลเงิน</span><span>{currency}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>VAT</span><span>{vatEnabled ? `เปิด (${vatRate}%)` : "ปิด"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>วันจดทะเบียน VAT</span><span>{vatRegDate}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>วิธีคิด VAT</span><span>{vatCalcMethod}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>วิธีคิดต้นทุน</span><span className="font-semibold">{costingMethod === "fifo" ? "FIFO" : "Average Cost"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>เครดิตลูกค้า</span><span>30 วัน</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>เครดิต Supplier</span><span>30 วัน</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>หัก ณ ที่จ่าย</span><span>3%</span></div>
                    </div>
                  </div>

                  {/* ── Step 4 สรุป ── */}
                  <div className="bg-white rounded-lg mb-3.5" style={{ border: `1px solid ${BORDER}`, padding: "18px 22px" }}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: GREEN }}>✓</div>
                      <div className="text-[14px] font-bold" style={{ color: GREEN }}>Step 4 — คลังสินค้าแรก</div>
                      <div className="flex-1" />
                      <button onClick={() => go("w6")} className="text-[11px] px-2.5 py-1 rounded-md cursor-pointer" style={{ border: `1px solid ${BORDER2}`, background: "white", color: OR }}>แก้ไข</button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]" style={{ color: TEXT }}>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>รหัสคลัง</span><span>{whCode || "-"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ชื่อคลัง</span><span>{whName || "-"}</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ประเภท</span><span>คลังสินค้าสาขา</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>สาขา</span><span>สำนักงานใหญ่</span></div>
                      <div className="flex"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>ที่อยู่</span><span>{whAddress || "-"} {whSubDistrict} {whDistrict} {whProvince} {whPostalCode}</span></div>
                      {whGoogleMap && <div className="flex col-span-2"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>Google Map</span><span className="truncate">{whGoogleMap}</span></div>}
                      {whNote && <div className="flex col-span-2"><span className="w-[140px] shrink-0" style={{ color: MUTED }}>หมายเหตุ</span><span>{whNote}</span></div>}
                    </div>
                  </div>

                  <Notice variant="orange" icon="➡️">ขั้นตอนถัดไปที่แนะนำ: <strong>F-03 สร้าง Role</strong> → <strong>F-04 สร้าง User</strong> ก่อนเปิดให้ทีมใช้งาน</Notice>
                </div>
                <WizAction left="Critical ครบ · ข้อมูลจะมีผลทันทีเมื่อยืนยัน">
                  <BtnGhost onClick={() => go("w6")}>← แก้ไข</BtnGhost>
                  <BtnGreen onClick={() => router.push(`/${slug}`)}>ยืนยันและเปิดใช้ระบบ →</BtnGreen>
                </WizAction>
              </div>
            </div>
          </>
        )}

        {/* ════ WE1: ERROR — BLOCK NAVIGATION ════ */}
        {screen === "we1" && (
          <>
            <ScreenMeta id="S-02-E1" title="Error State — Block Navigation Modal" pills={[
              { label: "← กลับ Wizard", target: "w2a" },
            ]} />
            <TopBar />
            <div className="relative flex-1 min-h-0">
              {/* Blurred background */}
              <div className="p-5" style={{ filter: "blur(2px)", opacity: 0.4, pointerEvents: "none", background: BG, height: "100%" }}>
                <div className="bg-white rounded-lg p-5" style={{ border: `1px solid ${BORDER}` }}>
                  <div className="text-base font-bold mb-3">ข้อมูลนิติบุคคล</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md p-2.5 text-xs" style={{ border: `1px solid ${BORDER2}` }}>ชื่อบริษัท...</div>
                    <div className="rounded-md p-2.5 text-xs" style={{ border: `1px solid ${BORDER2}` }}>เลขนิติบุคคล...</div>
                  </div>
                </div>
              </div>
              {/* Modal overlay */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,.45)" }}>
                <div className="bg-white rounded-xl shadow-2xl" style={{ padding: "26px 28px", width: 400 }}>
                  <div className="text-[28px] text-center mb-2.5">⚠️</div>
                  <div className="text-base font-bold text-center mb-2" style={{ color: RED }}>ยังตั้งค่าไม่ครบ</div>
                  <div className="text-xs leading-relaxed mb-1.5" style={{ color: "#444" }}>ไม่สามารถออกจาก Wizard ได้จนกว่าจะตั้งค่า Critical step ครบทุกขั้น</div>
                  <div className="text-xs mb-4">
                    <div className="mb-1" style={{ color: RED }}>● Step 2 — สาขาแรก (ยังไม่ได้ตั้งค่า)</div>
                    <div className="mb-1" style={{ color: RED }}>● Step 3 — การเงินพื้นฐาน (ยังไม่ได้ตั้งค่า)</div>
                    <div style={{ color: RED }}>● Step 4 — คลังสินค้าแรก (ยังไม่ได้ตั้งค่า)</div>
                  </div>
                  <button onClick={() => go("w2a")} className="w-full py-2.5 rounded-[7px] text-[13px] font-bold text-white border-none cursor-pointer" style={{ background: OR }}>กลับไปตั้งค่า</button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function SetupWizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SetupWizardInner />
    </Suspense>
  );
}
