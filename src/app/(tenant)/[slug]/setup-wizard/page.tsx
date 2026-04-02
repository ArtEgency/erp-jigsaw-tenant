"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  Box, Typography, TextField, MenuItem, Button, Stack, Paper, Alert,
  Radio, RadioGroup, FormControlLabel, LinearProgress, Chip, Switch,
  Divider,
} from "@mui/material";

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
    <Box sx={{ height: 52, display: "flex", alignItems: "center", px: 2, gap: 1.25, flexShrink: 0, bgcolor: OR }}>
      <Button onClick={() => setNavOpen(!navOpen)} sx={{ color: "white", fontSize: 18, minWidth: 0, mr: 0.5 }}>☰</Button>
      <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,.8)", flex: 1 }}><strong style={{ color: "white" }}>สยามเทรด จำกัด</strong> | siamtrade.jigsawerp.com</Typography>
      <Stack direction="row" alignItems="center" gap={1.5}>
        <Typography sx={{ fontSize: 18, color: "white", cursor: "pointer", position: "relative" }}>🔔</Typography>
        <Box sx={{ width: 1, height: 22, bgcolor: "rgba(255,255,255,.3)" }} />
        <Typography sx={{ color: "white", fontSize: 12, fontWeight: 500 }}>สมชาย วงศ์ใหญ่</Typography>
        <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, border: "2px solid rgba(255,255,255,.4)", color: OR }}>สว</Box>
      </Stack>
    </Box>
  );

  const ScreenMeta = ({ id, title, actor = "Tenant Admin", pills }: { id: string; title: string; actor?: string; pills?: { label: string; target: Screen; hi?: boolean }[] }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap", flexShrink: 0, px: 2, py: 1, bgcolor: "#1e1e2e" }}>
      <Typography sx={{ fontSize: 10, fontFamily: "monospace", px: 0.75, py: 0.25, borderRadius: 0.5, color: "#7ab8f5", bgcolor: "#1e3a5f" }}>{id}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: "white", flex: 1 }}>{title}</Typography>
      <Typography sx={{ fontSize: 10, px: 0.75, py: 0.25, borderRadius: 2, bgcolor: "#3d2800", color: "#fac775" }}>{actor}</Typography>
      {pills && (
        <Stack direction="row" gap={0.75} sx={{ ml: "auto", flexWrap: "wrap" }}>
          {pills.map((p) => (
            <Button key={p.label} onClick={() => go(p.target)} size="small"
              sx={{
                px: 1.5, py: 0.5, borderRadius: 3, fontSize: 11, textTransform: "none", minWidth: 0,
                ...(p.hi
                  ? { bgcolor: OR, color: "white", borderColor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 } }
                  : { bgcolor: "#2a2a3e", color: "#888", borderColor: "#2a2a3e" }),
                border: "1px solid",
              }}
            >{p.label}</Button>
          ))}
        </Stack>
      )}
    </Box>
  );

  /* ── Wizard sidebar ── */
  const WizSidebar = ({ currentScreen }: { currentScreen: Screen }) => {
    const statuses = getStepStatuses(currentScreen);
    const critDone = getCriticalDone(currentScreen);
    const pct = getProgressPct(currentScreen);
    const isW7 = currentScreen === "w7";

    const circleStyle = (status: StepStatus, step: WizStep): Record<string, string> => {
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
      if (status === "done") return <Typography sx={{ color: GREEN, fontSize: 9 }}>✓ เสร็จแล้ว</Typography>;
      if (status === "skip") return <Typography sx={{ color: "#EF9F27", fontSize: 9 }}>⚠ ข้ามแล้ว</Typography>;
      if (step.type === "critical") return <Typography sx={{ color: RED, fontSize: 9 }}>● Critical</Typography>;
      if (step.type === "warn") return <Typography sx={{ color: "#EF9F27", fontSize: 9 }}>⚠ ข้ามได้</Typography>;
      if (step.type === "checklist") return <Typography sx={{ color: GREEN, fontSize: 9 }}>● Checklist</Typography>;
      return null;
    };

    return (
      <Box sx={{ width: 220, bgcolor: "white", flexShrink: 0, overflowY: "auto", display: "flex", flexDirection: "column", borderRight: `1px solid ${BORDER}` }}>
        <Box sx={{ px: 2, pb: 1.75, mb: 1, borderBottom: `1px solid ${BORDER}`, pt: 2 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: OR }}>⚙ ตั้งค่าระบบ</Typography>
          <Typography sx={{ fontSize: 10, mt: 0.25, color: MUTED }}>{getStepOf(currentScreen)}</Typography>
        </Box>
        {currentScreen === "w1" && (
          <Typography sx={{ px: 2, mb: 0.5, fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", color: HINT }}>ขั้นตอน</Typography>
        )}
        {STEPS.map((step, i) => {
          const status = statuses[i];
          return (
            <Box key={i}
              sx={{
                display: "flex", alignItems: "center", gap: 1.25, px: 2, py: 1, cursor: "pointer", transition: "all 0.15s",
                bgcolor: status === "active" ? OR_L : "transparent",
                borderLeft: `3px solid ${status === "active" ? OR : status === "done" ? GREEN : status === "skip" ? "#EF9F27" : "transparent"}`,
              }}
            >
              <Box sx={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, flexShrink: 0, borderWidth: 2, borderStyle: "solid",
                ...circleStyle(status, step),
              }}>
                {circleContent(status, step)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                  fontSize: 12,
                  color: status === "active" ? (isW7 ? GREEN : OR) : status === "done" ? GREEN : TEXT,
                  fontWeight: status === "active" ? 600 : 500,
                }}>{step.name}</Typography>
                {typeLabel(status, step)}
              </Box>
            </Box>
          );
        })}
        <Box sx={{ mt: "auto", px: 2, py: 1.5, borderTop: `1px solid ${BORDER}` }}>
          <LinearProgress variant="determinate" value={pct} sx={{
            height: 4, borderRadius: 0.5, mb: 0.75, bgcolor: BORDER,
            "& .MuiLinearProgress-bar": { bgcolor: isW7 ? GREEN : OR, borderRadius: 0.5 },
          }} />
          <Typography sx={{ fontSize: 10, color: isW7 ? GREEN : MUTED }}>
            <Box component="span" sx={{ fontWeight: 600, color: isW7 ? GREEN : OR }}>{critDone}</Box> / 4 Critical เสร็จแล้ว{isW7 ? " 🎉" : ""}
          </Typography>
        </Box>
      </Box>
    );
  };

  /* ── Notice box (MUI Alert) ── */
  const Notice = ({ variant, icon, children }: { variant: "red" | "warn" | "blue" | "green" | "orange"; icon: string; children: React.ReactNode }) => {
    const severityMap: Record<string, "error" | "warning" | "info" | "success"> = {
      red: "error", warn: "warning", blue: "info", green: "success", orange: "warning",
    };
    const colorMap: Record<string, { bg: string; color: string; border: string }> = {
      red: { bg: RED_L, color: RED, border: "#FDCACA" },
      warn: { bg: AMBER_L, color: AMBER, border: "#FAC775" },
      blue: { bg: BLUE_L, color: BLUE, border: "#B5D4F4" },
      green: { bg: GREEN_L, color: GREEN, border: GREEN_M },
      orange: { bg: OR_L, color: "#7A3000", border: OR_M },
    };
    const s = colorMap[variant];
    return (
      <Alert severity={severityMap[variant]} icon={<Typography sx={{ fontSize: 14, mt: 0.25 }}>{icon}</Typography>}
        sx={{ mb: 1.75, fontSize: 12, lineHeight: 1.6, bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: "7px", py: 0.5, px: 1, "& .MuiAlert-icon": { mr: 1 }, "& .MuiAlert-message": { p: 0 } }}
      >
        {children}
      </Alert>
    );
  };

  /* ── Section card ── */
  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Paper variant="outlined" sx={{ borderRadius: 2, mb: 1.75, border: `1px solid ${BORDER}`, p: "18px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.75 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: OR }}>{title}</Typography>
        <Box sx={{ flex: 1, height: 1, bgcolor: BORDER }} />
      </Box>
      {children}
    </Paper>
  );

  /* ── Wizard content header ── */
  const WizContentHdr = ({ num, numColor, title, badge }: { num: string; numColor: string; title: string; badge?: { label: string; bg: string; color: string } }) => (
    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
      <Box sx={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0, bgcolor: numColor }}>{num}</Box>
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: TEXT }}>{title}</Typography>
      {badge && <Chip label={badge.label} size="small" sx={{ fontSize: 10, fontWeight: 600, bgcolor: badge.bg, color: badge.color, height: 22, borderRadius: "10px" }} />}
    </Stack>
  );

  /* ── Action footer ── */
  const WizAction = ({ left, children }: { left: string; children: React.ReactNode }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, bgcolor: "white", p: "14px 20px", borderTop: `1px solid ${BORDER}` }}>
      <Typography sx={{ fontSize: 11, color: MUTED }}>{left}</Typography>
      <Stack direction="row" gap={1.25}>{children}</Stack>
    </Box>
  );

  /* ── MUI Form Field with floating label ── */
  const FField = ({ label, value, onChange, type = "text", locked, error, select, children: selectChildren }: {
    label: string; value?: string; onChange?: (v: string) => void; type?: string; locked?: boolean; error?: boolean; select?: boolean; children?: React.ReactNode;
  }) => (
    <TextField
      label={label}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      type={type}
      size="small"
      fullWidth
      select={select}
      error={error}
      slotProps={{
        input: {
          readOnly: locked,
        },
        inputLabel: {
          sx: { color: error ? RED : OR, "&.Mui-focused": { color: error ? RED : OR } },
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          fontSize: 13,
          bgcolor: locked ? "#f5f5f5" : "white",
          cursor: locked ? "not-allowed" : "text",
          "& fieldset": { borderColor: error ? RED : BORDER2 },
          "&:hover fieldset": { borderColor: error ? RED : OR },
          "&.Mui-focused fieldset": { borderColor: error ? RED : OR },
        },
        "& .MuiInputBase-input": {
          color: locked ? MUTED : TEXT,
          cursor: locked ? "not-allowed" : "text",
        },
      }}
    >
      {selectChildren}
    </TextField>
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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#2c2c3a" }}>
      {/* Screen Nav (toggle) */}
      {navOpen && (
        <Box sx={{ width: 220, position: "fixed", left: 52, top: 0, height: "100vh", zIndex: 90, overflowY: "auto", display: "flex", flexDirection: "column", bgcolor: "#12121f" }}>
          <Box sx={{ px: 1.5, py: 1, pb: 1.5, borderBottom: "1px solid #2a2a3e", bgcolor: "#0e0e1a" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "white" }}>🧩 F-02 Wireframe</Typography>
            <Typography sx={{ fontSize: 10, mt: 0.25, color: "#555" }}>Setup Wizard — Onboarding</Typography>
          </Box>
          <Typography sx={{ px: 1.5, pt: 0.75, pb: 0.25, fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", color: "#444" }}>Setup Wizard</Typography>
          {screenNavItems.slice(0, 6).map((item) => (
            <Button key={item.id} onClick={() => { go(item.id); setNavOpen(false); }}
              sx={{
                display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.75, textAlign: "left", fontSize: 12, textTransform: "none", justifyContent: "flex-start", minWidth: 0,
                color: screen === item.id ? "white" : "#777",
                bgcolor: screen === item.id ? "#1a1a2e" : "transparent",
                borderLeft: `2px solid ${screen === item.id ? OR : "transparent"}`,
                borderRadius: 0,
              }}
            >
              <Typography sx={{ fontSize: 10, fontFamily: "monospace", width: 22, opacity: 0.7 }}>{item.id.replace("w", "0").toUpperCase()}</Typography>
              <Typography sx={{ flex: 1, fontSize: 12 }}>{item.label}</Typography>
              {item.badge && (
                <Chip label={item.badge} size="small" sx={{ fontSize: 9, height: 16, bgcolor: item.badge === "✓" ? GREEN : "#EF9F27", color: "white" }} />
              )}
            </Button>
          ))}
          <Typography sx={{ px: 1.5, pt: 1, pb: 0.25, fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", color: "#444" }}>Error States</Typography>
          <Button onClick={() => { go("we1"); setNavOpen(false); }}
            sx={{
              display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.75, textAlign: "left", fontSize: 12, textTransform: "none", justifyContent: "flex-start", minWidth: 0, borderRadius: 0,
              color: screen === "we1" ? "white" : "#777", bgcolor: screen === "we1" ? "#1a1a2e" : "transparent", borderLeft: `2px solid ${screen === "we1" ? OR : "transparent"}`,
            }}
          >
            <Typography sx={{ fontSize: 10, fontFamily: "monospace", width: 22, opacity: 0.7 }}>E1</Typography>
            Block Navigation Modal
          </Button>
        </Box>
      )}

      {/* Icon Sidebar */}
      <Box sx={{ width: 52, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", position: "fixed", height: "100vh", zIndex: 100, top: 0, left: 0, bgcolor: "#2D2D2D" }}>
        <Box onClick={() => setNavOpen(!navOpen)} sx={{ width: 52, height: 56, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", bgcolor: OR }}>
          <Typography sx={{ fontSize: 9, fontWeight: 800, color: "white", textAlign: "center", lineHeight: 1.2, letterSpacing: "0.05em" }}>JIG<br />SAW</Typography>
        </Box>
        {iconSidebarItems.map((item) => (
          <Box key={item.title} sx={{ width: 44, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1, cursor: "pointer", fontSize: 16, my: 0.25, color: "#888" }} title={item.title}>{item.icon}</Box>
        ))}
        <Box sx={{ flex: 1 }} />
        <Box sx={{ width: 44, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1, cursor: "pointer", fontSize: 16, mb: 1, bgcolor: OR_L, color: OR }}>⚙</Box>
      </Box>

      {/* Main */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", ml: navOpen ? "272px" : "52px", bgcolor: BG, transition: "margin-left 0.15s" }}>

        {/* ════ W1: WIZARD ENTRY ════ */}
        {screen === "w1" && (
          <>
            <ScreenMeta id="S-02-01" title="Wizard Entry — Login ครั้งแรก" pills={[
              { label: "เริ่ม Step 1 →", target: "w2a", hi: true },
              { label: "Block Modal →", target: "we1" },
            ]} />
            <TopBar />
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
              <WizSidebar currentScreen="w1" />
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
                  <Notice variant="orange" icon="👋">ยินดีต้อนรับสู่ <strong>ERP Jigsaw</strong> — กรุณาตั้งค่าระบบเบื้องต้นให้ครบก่อนเริ่มใช้งาน · Step ที่มี ⚠ ข้ามได้และแก้ภายหลัง</Notice>
                  <SectionCard title="ภาพรวมการตั้งค่า">
                    <Stack gap={1}>
                      {/* Step 1 active */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, borderRadius: 1, p: "8px 12px", bgcolor: OR_L, border: `1px solid ${OR_M}` }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, bgcolor: OR }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 600, flex: 1, color: "#7A3000" }}>Step 1 — ข้อมูลธุรกิจ</Typography>
                        <Typography sx={{ fontSize: 10, color: OR }}>กำลังดำเนินการ</Typography>
                      </Box>
                      {[{ n: 2, t: "สาขาแรก" }, { n: 3, t: "การเงินพื้นฐาน" }, { n: 4, t: "คลังสินค้าแรก" }].map((s) => (
                        <Box key={s.n} sx={{ display: "flex", alignItems: "center", gap: 1.25, borderRadius: 1, p: "8px 12px", bgcolor: "#f9f9f7", border: `1px solid ${BORDER}` }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, bgcolor: RED }} />
                          <Typography sx={{ fontSize: 12, flex: 1, color: MUTED }}>Step {s.n} — {s.t}</Typography>
                          <Typography sx={{ fontSize: 10, color: HINT }}>รอ</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </SectionCard>
                </Box>
                <WizAction left="0 / 4 Critical เสร็จแล้ว">
                  <Button variant="contained" onClick={() => go("w2a")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, fontSize: 12, fontWeight: 700, textTransform: "none" }}>เริ่มตั้งค่า →</Button>
                </WizAction>
              </Box>
            </Box>
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
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
              <WizSidebar currentScreen="w2a" />
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
                  <WizContentHdr num="1" numColor={RED} title="ข้อมูลธุรกิจ" badge={{ label: "🔴 Critical", bg: RED_L, color: RED }} />

                  {/* ── Card รวมทุก Section ── */}
                  <Paper variant="outlined" sx={{ borderRadius: 2, border: `1px solid ${BORDER}`, p: "24px 28px" }}>

                    {/* ── Section: ข้อมูลธุรกิจ ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>ข้อมูลธุรกิจ</Typography>

                    {/* Logo upload */}
                    <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2.5 }}>
                      <Box sx={{ width: 90, height: 90, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, bgcolor: "#F0F0F0", border: `1px solid ${BORDER}` }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                      </Box>
                      <Stack direction="row" alignItems="center" gap={1.25}>
                        <Button variant="contained" sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, fontSize: 13, fontWeight: 600, textTransform: "none" }}>อัพโหลดรูปภาพ</Button>
                        <Button variant="outlined" sx={{ fontSize: 13, textTransform: "none", color: RED, borderColor: BORDER2 }}>ลบ</Button>
                      </Stack>
                      <Typography sx={{ fontSize: 11, color: HINT }}>อัพโหลดไฟล์ JPG, GIF or PNG. ขนาดไม่เกิน 800K</Typography>
                    </Stack>

                    {/* Row: Radio + เลขภาษี + ประเภทกิจการ */}
                    <Stack direction="row" alignItems="flex-end" gap={2} sx={{ mb: 2 }}>
                      <RadioGroup row value={personType} onChange={(e) => setPersonType(e.target.value as "natural" | "juristic")} sx={{ flexShrink: 0, pb: 0.5 }}>
                        <FormControlLabel value="natural" control={<Radio size="small" sx={{ color: OR, "&.Mui-checked": { color: OR } }} />} label={<Typography sx={{ fontSize: 13, color: TEXT }}>บุคคลธรรมดา</Typography>} />
                        <FormControlLabel value="juristic" control={<Radio size="small" sx={{ color: OR, "&.Mui-checked": { color: OR } }} />} label={<Typography sx={{ fontSize: 13, color: TEXT }}>นิติบุคคล</Typography>} />
                      </RadioGroup>
                      <Box sx={{ flex: 1 }}>
                        <FField label="เลขประจำตัวผู้เสียภาษี *" value={taxId} onChange={setTaxId} />
                      </Box>
                      <Box sx={{ width: 180 }}>
                        <FField label="ประเภทกิจการ *" value={bizCategory} select onChange={(v) => {
                          setBizCategory(v);
                          const prefixes = BIZ_PREFIXES[v] || [];
                          setPrefix(prefixes[0] || "");
                          setSuffix(BIZ_SUFFIXES[v] || "");
                        }}>
                          {BIZ_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </FField>
                      </Box>
                    </Stack>

                    {/* Row: คำนำหน้า(TH), ชื่อบริษัท(TH), คำลงท้าย(TH), ชื่อบริษัท(EN) */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr 140px 1fr", gap: 1.5, mb: 2 }}>
                      <FField label="คำนำหน้า (TH)" value={prefix} onChange={setPrefix} />
                      <FField label="ชื่อบริษัท (TH) *" value={companyName} onChange={setCompanyName} />
                      <FField label="คำลงท้าย (TH)" value={suffix} onChange={setSuffix} />
                      <FField label="ชื่อบริษัท (EN)" value="Siam Trade Co., Ltd." onChange={() => {}} />
                    </Box>

                    {/* Row: เบอร์โทร, อีเมล, ประเภทธุรกิจ */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5, mb: 3 }}>
                      <FField label="เบอร์โทรศัพท์ *" value={phone} onChange={setPhone} />
                      <FField label="อีเมล" value={email} onChange={setEmail} />
                      <FField label="ประเภทธุรกิจ *" value={bizType} select onChange={(v) => setBizType(v)}>
                        {BIZ_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </FField>
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* ── Section: ข้อมูลที่อยู่ธุรกิจ ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>ข้อมูลที่อยู่ธุรกิจ</Typography>

                    {/* Row 1: ประเทศ, ที่อยู่, แขวง/ตำบล, เขต/อำเภอ */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1.5, mb: 2 }}>
                      <FField label="ประเทศ *" value={country} select onChange={(v) => setCountry(v)}>
                        <MenuItem value="">เลือกประเทศ</MenuItem>
                        {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </FField>
                      <FField label="ที่อยู่ *" value={address} onChange={setAddress} />
                      <FField label="แขวง/ตำบล *" value={subDistrict} select onChange={(v) => setSubDistrict(v)}>
                        <MenuItem value="">เลือกแขวง/ตำบล</MenuItem>
                        {(SUB_DISTRICTS[district] || []).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </FField>
                      <FField label="เขต/อำเภอ *" value={district} select onChange={(v) => { setDistrict(v); setSubDistrict(""); }}>
                        <MenuItem value="">เลือกเขต/อำเภอ</MenuItem>
                        {(DISTRICTS[province] || []).map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                      </FField>
                    </Box>

                    {/* Row 2: จังหวัด, รหัสไปรษณีย์, เบอร์โทรศัพท์ */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5, mb: 3 }}>
                      <FField label="จังหวัด *" value={province} select onChange={(v) => { setProvince(v); setDistrict(""); setSubDistrict(""); }}>
                        <MenuItem value="">เลือกจังหวัด</MenuItem>
                        {PROVINCES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                      </FField>
                      <FField label="รหัสไปรษณีย์ *" value={postalCode} select onChange={(v) => setPostalCode(v)}>
                        <MenuItem value="">กรอกรหัสไปรษณีย์</MenuItem>
                      </FField>
                      <FField label="เบอร์โทรศัพท์" value={contactPhone} onChange={setContactPhone} />
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* ── Section: Branding ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>Branding</Typography>

                    <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 3 }}>
                      <Box sx={{ flex: 1, maxWidth: 360 }}>
                        <FField label="ชื่อระบบที่แสดงบน Header" value="Siam Trade" onChange={() => {}} />
                      </Box>
                      <Box sx={{ flex: 1, maxWidth: 300 }}>
                        <FField label="สีหลัก *" value="#565DFF" onChange={() => {}} />
                      </Box>
                      <Box sx={{ width: 40, height: 40, borderRadius: 1, flexShrink: 0, bgcolor: OR }} />
                      <Typography sx={{ fontSize: 12, flexShrink: 0, color: MUTED }}>สีหลัก, Tab active</Typography>
                    </Stack>

                    {/* ── ปุ่ม ยกเลิก / บันทึก ── */}
                    <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ pt: 1 }}>
                      <Button variant="outlined" onClick={() => go("w1")} sx={{ fontSize: 13, textTransform: "none", color: TEXT, borderColor: BORDER2 }}>ยกเลิก</Button>
                      <Button variant="contained" onClick={() => go("w4")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, fontSize: 13, fontWeight: 700, textTransform: "none" }}>ถัดไป →</Button>
                    </Stack>

                  </Paper>
                </Box>
              </Box>
            </Box>
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
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
              <WizSidebar currentScreen="w4" />
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
                  <WizContentHdr num="2" numColor={RED} title="สาขาแรก (สำนักงานใหญ่)" badge={{ label: "🔴 Critical", bg: RED_L, color: RED }} />

                  <Paper variant="outlined" sx={{ borderRadius: 2, border: `1px solid ${BORDER}`, p: "24px 28px" }}>

                    {/* ── Section: ข้อมูลสาขา ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>ข้อมูลสาขา</Typography>

                    {/* Notice */}
                    <Alert severity="info" icon={<Typography sx={{ fontSize: 14 }}>ℹ️</Typography>}
                      sx={{ mb: 2, fontSize: 12, bgcolor: OR_L, color: "#7A3000", border: `1px solid ${OR_M}`, borderRadius: "7px", py: 0.25, "& .MuiAlert-icon": { mr: 1 }, "& .MuiAlert-message": { p: 0 } }}
                    >
                      สาขาแรกจะถูกกำหนดเป็น <strong>HQ (สำนักงานใหญ่)</strong> อัตโนมัติ เพิ่มสาขาอื่นได้ภายหลังใน Settings
                    </Alert>

                    {/* Row: รหัสสาขา + Radio + VAT CODE */}
                    <Stack direction="row" alignItems="flex-end" gap={2} sx={{ mb: 2 }}>
                      <Box sx={{ width: 160 }}>
                        <FField label="รหัสสาขา *" value={branchCode} onChange={setBranchCode} />
                      </Box>
                      <RadioGroup row value={branchType} onChange={(e) => setBranchType(e.target.value as "hq" | "branch" | "none")} sx={{ flexShrink: 0, pb: 0.5 }}>
                        {([
                          { id: "hq" as const, label: "สำนักงานใหญ่" },
                          { id: "branch" as const, label: "สาขา" },
                          { id: "none" as const, label: "ไม่ระบุ" },
                        ]).map((opt) => (
                          <FormControlLabel key={opt.id} value={opt.id} control={<Radio size="small" sx={{ color: OR, "&.Mui-checked": { color: OR } }} />} label={<Typography sx={{ fontSize: 13, color: TEXT }}>{opt.label}</Typography>} />
                        ))}
                      </RadioGroup>
                      <Box sx={{ width: 180 }}>
                        <FField label="VAT CODE *" value={vatCode} onChange={setVatCode} />
                      </Box>
                    </Stack>

                    {/* Row: ชื่อสาขา TH + EN */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
                      <FField label="ชื่อสาขา (TH) *" value={branchNameTH} onChange={setBranchNameTH} />
                      <FField label="ชื่อสาขา (EN) *" value={branchNameEN} onChange={setBranchNameEN} />
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* ── Section: ที่อยู่ภาษาไทย ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>ที่อยู่ภาษาไทย</Typography>

                    <Button variant="contained" sx={{ bgcolor: "#333", "&:hover": { bgcolor: "#444" }, fontSize: 13, fontWeight: 600, textTransform: "none", mb: 2 }}>
                      ดึงที่อยู่จากหน้าธุรกิจ
                    </Button>

                    {/* Row 1: ประเทศ, ที่อยู่, แขวง/ตำบล, เขต/อำเภอ */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1.5, mb: 2 }}>
                      <FField label="ประเทศ *" value={branchCountry} select onChange={(v) => setBranchCountry(v)}>
                        <MenuItem value="">เลือกประเทศ</MenuItem>
                        {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </FField>
                      <FField label="ที่อยู่ *" value={branchAddress} onChange={setBranchAddress} />
                      <FField label="แขวง/ตำบล *" value={branchSubDistrict} select onChange={(v) => setBranchSubDistrict(v)}>
                        <MenuItem value="">เลือกแขวง/ตำบล</MenuItem>
                        {(SUB_DISTRICTS[branchDistrict] || []).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </FField>
                      <FField label="เขต/อำเภอ *" value={branchDistrict} select onChange={(v) => { setBranchDistrict(v); setBranchSubDistrict(""); }}>
                        <MenuItem value="">เลือกเขต/อำเภอ</MenuItem>
                        {(DISTRICTS[branchProvince] || []).map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                      </FField>
                    </Box>

                    {/* Row 2: จังหวัด, รหัสไปรษณีย์, เบอร์โทร */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5, mb: 3 }}>
                      <FField label="จังหวัด *" value={branchProvince} select onChange={(v) => { setBranchProvince(v); setBranchDistrict(""); setBranchSubDistrict(""); }}>
                        <MenuItem value="">เลือกจังหวัด</MenuItem>
                        {PROVINCES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                      </FField>
                      <FField label="รหัสไปรษณีย์ *" value={branchPostalCode} select onChange={(v) => setBranchPostalCode(v)}>
                        <MenuItem value="">กรอกรหัสไปรษณีย์</MenuItem>
                      </FField>
                      <FField label="เบอร์โทรศัพท์" value={branchPhone} onChange={setBranchPhone} />
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* ── Section: ที่อยู่ภาษาอังกฤษ ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>ที่อยู่ภาษาอังกฤษ</Typography>

                    <Stack gap={1.5} sx={{ maxWidth: 480, mb: 2 }}>
                      <FField label="ที่อยู่ 1 (Line1) *" value={enAddr1} onChange={setEnAddr1} />
                      <FField label="ที่อยู่ 2 (Line2)" value={enAddr2} onChange={setEnAddr2} />
                      <FField label="ที่อยู่ 3 (Line3)" value={enAddr3} onChange={setEnAddr3} />
                    </Stack>
                    <Box sx={{ display: "grid", gridTemplateColumns: "220px 220px", gap: 1.5, mb: 3 }}>
                      <FField label="ประเทศ *" value={enCountry} select onChange={(v) => setEnCountry(v)}>
                        <MenuItem value="">เลือกประเทศ</MenuItem>
                        {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </FField>
                      <FField label="รหัสไปรษณีย์ *" value={enPostalCode} onChange={setEnPostalCode} />
                    </Box>

                    {/* ── ปุ่ม ยกเลิก / บันทึก ── */}
                    <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ pt: 1 }}>
                      <Button variant="outlined" onClick={() => go("w2a")} sx={{ fontSize: 13, textTransform: "none", color: TEXT, borderColor: BORDER2 }}>ยกเลิก</Button>
                      <Button variant="contained" onClick={() => go("w5")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, fontSize: 13, fontWeight: 700, textTransform: "none" }}>ถัดไป →</Button>
                    </Stack>

                  </Paper>
                </Box>
              </Box>
            </Box>
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
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
              <WizSidebar currentScreen="w5" />
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
                  <WizContentHdr num="3" numColor={RED} title="การเงินพื้นฐาน" badge={{ label: "🔴 Critical", bg: RED_L, color: RED }} />

                  <Paper variant="outlined" sx={{ borderRadius: 2, border: `1px solid ${BORDER}`, p: "24px 28px" }}>

                    {/* ── Section: ข้อมูลภาษี ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>ข้อมูลภาษี</Typography>

                    {/* สกุลเงิน */}
                    <Box sx={{ mb: 2 }}>
                      <FField label="สกุลเงิน *" value={currency} select onChange={(v) => setCurrency(v)}>
                        <MenuItem value="บาท">บาท</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="JPY">JPY</MenuItem>
                      </FField>
                    </Box>

                    {/* Toggle VAT + ภาษีมูลค่าเพิ่ม */}
                    <Stack direction="row" alignItems="flex-end" gap={2} sx={{ mb: 2 }}>
                      <Box sx={{ flexShrink: 0, pb: 0.5 }}>
                        <Switch checked={vatEnabled} onChange={() => setVatEnabled(!vatEnabled)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#F5A623" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#F5A623" },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <FField label="ภาษีมูลค่าเพิ่ม (VAT) *" value={vatRate} onChange={setVatRate} type="number" />
                      </Box>
                    </Stack>

                    {/* วันที่จดทะเบียนภาษี */}
                    <Box sx={{ mb: 2 }}>
                      <FField label="วันที่จดทะเบียนภาษีมูลค่าเพิ่ม *" value={vatRegDate} onChange={setVatRegDate} type="date" />
                    </Box>

                    {/* วิธีคิดภาษีมูลค่าเพิ่ม */}
                    <Box sx={{ mb: 3 }}>
                      <FField label="วิธีคิดภาษีมูลค่าเพิ่ม *" value={vatCalcMethod} select onChange={(v) => setVatCalcMethod(v)}>
                        <MenuItem value="แยกภาษี">แยกภาษี</MenuItem>
                        <MenuItem value="รวมภาษี">รวมภาษี</MenuItem>
                      </FField>
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* ── Section: วิธีคิดต้นทุนสินค้า ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>วิธีคิดต้นทุนสินค้า</Typography>

                    <Alert severity="warning" icon={<Typography sx={{ fontSize: 14 }}>⚠</Typography>}
                      sx={{ mb: 2, fontSize: 12, bgcolor: AMBER_L, color: AMBER, border: `1px solid #FAC775`, borderRadius: "7px", py: 0.25, "& .MuiAlert-icon": { mr: 1 }, "& .MuiAlert-message": { p: 0 } }}
                    >
                      🔒 Lv 4 — SA แก้ได้ก่อนมีใบรับสินค้า (GR) · หลัง GR แรกไม่มีใครแก้ได้ · เลือกให้ถูกต้องก่อนรับสินค้าครั้งแรก
                    </Alert>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
                      {([
                        { id: "fifo" as const, name: "FIFO", sub: "First In, First Out", desc: "ของที่เข้ามาก่อนถูกตัดออกก่อน · เหมาะกับสินค้าที่มีวันหมดอายุ" },
                        { id: "avg" as const, name: "Average Cost", sub: "ต้นทุนถัวเฉลี่ย", desc: "เฉลี่ยต้นทุนทุกล็อตเข้าด้วยกัน · เหมาะกับสินค้าทั่วไป" },
                      ]).map((m) => {
                        const sel = costingMethod === m.id;
                        return (
                          <Paper key={m.id} variant="outlined" onClick={() => setCostingMethod(m.id)}
                            sx={{
                              borderRadius: 2, p: 2, textAlign: "left", cursor: "pointer", transition: "all 0.15s",
                              border: `1.5px solid ${sel ? OR : BORDER2}`, bgcolor: sel ? OR_L : "white",
                            }}
                          >
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: sel ? "#7A3000" : TEXT }}>{m.name}</Typography>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, mt: 0.25, color: sel ? OR : MUTED }}>{m.sub}</Typography>
                            <Typography sx={{ fontSize: 12, mt: 0.75, lineHeight: 1.6, color: MUTED }}>{m.desc}</Typography>
                            <Typography sx={{ fontSize: 10, mt: 1, color: AMBER }}>🔒 Lv 4 — lock หลัง GR แรก</Typography>
                          </Paper>
                        );
                      })}
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* ── Section: ค่าเริ่มต้น AR / AP ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>ค่าเริ่มต้น AR / AP</Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                      <FField label="เครดิตลูกค้า default (วัน)" value="30" onChange={() => {}} type="number" />
                      <FField label="เครดิต Supplier default (วัน)" value="30" onChange={() => {}} type="number" />
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
                      <FField label="รูปแบบราคา default" value="รวม VAT" select onChange={() => {}}>
                        <MenuItem value="รวม VAT">รวม VAT</MenuItem>
                        <MenuItem value="แยก VAT">แยก VAT</MenuItem>
                      </FField>
                      <FField label="หัก ณ ที่จ่าย default (%)" value="3" onChange={() => {}} type="number" />
                    </Box>

                    {/* ── ปุ่ม ยกเลิก / บันทึก ── */}
                    <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ pt: 1 }}>
                      <Button variant="outlined" onClick={() => go("w4")} sx={{ fontSize: 13, textTransform: "none", color: TEXT, borderColor: BORDER2 }}>ยกเลิก</Button>
                      <Button variant="contained" onClick={() => go("w6")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, fontSize: 13, fontWeight: 700, textTransform: "none" }}>ถัดไป →</Button>
                    </Stack>

                  </Paper>
                </Box>
              </Box>
            </Box>
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
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
              <WizSidebar currentScreen="w6" />
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
                  <WizContentHdr num="4" numColor={RED} title="คลังสินค้าแรก" badge={{ label: "🔴 Critical", bg: RED_L, color: RED }} />

                  <Paper variant="outlined" sx={{ borderRadius: 2, border: `1px solid ${BORDER}`, p: "24px 28px" }}>

                    {/* รหัสคลังสินค้า */}
                    <Box sx={{ mb: 2 }}>
                      <FField label="รหัสคลังสินค้า *" value={whCode} onChange={setWhCode} />
                    </Box>

                    {/* ชื่อคลังสินค้า */}
                    <Box sx={{ mb: 2 }}>
                      <FField label="ชื่อคลังสินค้า *" value={whName} onChange={setWhName} />
                    </Box>

                    {/* ประเภทคลังสินค้า — locked เป็นคลังสินค้าสาขา */}
                    <Box sx={{ mb: 0.5 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1, color: "#F5A623" }}>ประเภทคลังสินค้า<Box component="span" sx={{ color: RED }}>*</Box></Typography>
                      <RadioGroup row value="branch">
                        <FormControlLabel value="central" disabled control={<Radio size="small" sx={{ color: "#F5A623", "&.Mui-checked": { color: "#F5A623" } }} />}
                          label={<Typography sx={{ fontSize: 13, color: TEXT }}>คลังสินค้ากลาง</Typography>} sx={{ opacity: 0.4 }} />
                        <FormControlLabel value="branch" disabled control={<Radio size="small" checked sx={{ color: "#F5A623", "&.Mui-checked": { color: "#F5A623" } }} />}
                          label={<Typography sx={{ fontSize: 13, fontWeight: 500, color: TEXT }}>คลังสินค้าสาขา</Typography>} />
                      </RadioGroup>
                    </Box>
                    {/* แสดงสาขาที่ผูก */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, borderRadius: 1, bgcolor: "#f5f5f5", border: `1px solid ${BORDER}`, p: "9px 12px", mt: 1, mb: 2.5 }}>
                      <Typography sx={{ fontSize: 13, color: MUTED }}>🏢 สาขาสำนักงานใหญ่</Typography>
                      <Chip label="ล๊อกจาก Step 2" size="small" sx={{ fontSize: 9, fontWeight: 600, bgcolor: BLUE_L, color: BLUE, height: 18, borderRadius: "10px" }} />
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* ── Section: ที่อยู่คลังสินค้า ── */}
                    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: OR }}>ที่อยู่คลังสินค้า</Typography>

                    {/* Row 1: ประเทศ, ที่อยู่ */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                      <FField label="ประเทศ *" value={whCountry} select onChange={(v) => setWhCountry(v)}>
                        <MenuItem value="Thailand">Thailand</MenuItem>
                        {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </FField>
                      <FField label="ที่อยู่" value={whAddress} onChange={setWhAddress} />
                    </Box>

                    {/* Row 2: แขวง/ตำบล, อำเภอ/เขต */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                      <FField label="แขวง/ตำบล" value={whSubDistrict} onChange={setWhSubDistrict} />
                      <FField label="อำเภอ/เขต" value={whDistrict} onChange={setWhDistrict} />
                    </Box>

                    {/* Row 3: จังหวัด, รหัสไปรษณีย์ */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                      <FField label="จังหวัด" value={whProvince} onChange={setWhProvince} />
                      <FField label="รหัสไปรษณีย์" value={whPostalCode} onChange={setWhPostalCode} />
                    </Box>

                    {/* URL Google Map */}
                    <Box sx={{ mb: 2 }}>
                      <FField label="URL Google Map" value={whGoogleMap} onChange={setWhGoogleMap} />
                    </Box>

                    {/* หมายเหตุ */}
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        label="หมายเหตุ"
                        value={whNote}
                        onChange={(e) => setWhNote(e.target.value)}
                        multiline
                        rows={4}
                        size="small"
                        fullWidth
                        placeholder="ระบุหมายเหตุ"
                        slotProps={{
                          inputLabel: {
                            sx: { color: OR, "&.Mui-focused": { color: OR } },
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: 13,
                            "& fieldset": { borderColor: BORDER2 },
                            "&:hover fieldset": { borderColor: OR },
                            "&.Mui-focused fieldset": { borderColor: OR },
                          },
                        }}
                      />
                    </Box>

                    {/* ── ปุ่ม ยกเลิก / ถัดไป ── */}
                    <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ pt: 1 }}>
                      <Button variant="outlined" onClick={() => go("w5")} sx={{ fontSize: 13, textTransform: "none", color: TEXT, borderColor: BORDER2 }}>ยกเลิก</Button>
                      <Button variant="contained" onClick={() => go("w7")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, fontSize: 13, fontWeight: 700, textTransform: "none" }}>ถัดไป →</Button>
                    </Stack>

                  </Paper>
                </Box>
              </Box>
            </Box>
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
            <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
              <WizSidebar currentScreen="w7" />
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Box sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
                  <WizContentHdr num="✓" numColor={GREEN} title="สรุปการตั้งค่าก่อนยืนยัน" badge={{ label: "✅ Critical ครบ 4/4", bg: GREEN_L, color: GREEN }} />
                  <Notice variant="warn" icon="⚠">กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกด <strong>&quot;ยืนยันและเปิดใช้ระบบ&quot;</strong> — เมื่อยืนยันแล้วข้อมูลจะ<strong>มีผลทันที</strong>และถูกบันทึกแยกไปยังส่วนต่างๆ ที่เกี่ยวข้อง</Notice>

                  {/* ── Step 1 สรุป ── */}
                  <Paper variant="outlined" sx={{ borderRadius: 2, mb: 1.75, border: `1px solid ${BORDER}`, p: "18px 22px" }}>
                    <Stack direction="row" alignItems="center" gap={1.25} sx={{ mb: 1.5 }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0, bgcolor: GREEN }}>✓</Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Step 1 — ข้อมูลธุรกิจ</Typography>
                      <Box sx={{ flex: 1 }} />
                      <Button variant="outlined" size="small" onClick={() => go("w2a")} sx={{ fontSize: 11, textTransform: "none", color: OR, borderColor: BORDER2 }}>แก้ไข</Button>
                    </Stack>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: 12, color: TEXT }}>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ประเภท</Typography><Typography sx={{ fontSize: 12 }}>{personType === "juristic" ? "นิติบุคคล" : "บุคคลธรรมดา"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>เลขผู้เสียภาษี</Typography><Typography sx={{ fontSize: 12 }}>{taxId}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ชื่อบริษัท (TH)</Typography><Typography sx={{ fontSize: 12 }}>{prefix} {companyName || "สยามเทรด"} {suffix}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ประเภทกิจการ</Typography><Typography sx={{ fontSize: 12 }}>{bizCategory}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ประเภทธุรกิจ</Typography><Typography sx={{ fontSize: 12 }}>{bizType}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>เบอร์โทร</Typography><Typography sx={{ fontSize: 12 }}>{phone || "-"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>อีเมล</Typography><Typography sx={{ fontSize: 12 }}>{email || "-"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ที่อยู่</Typography><Typography sx={{ fontSize: 12 }}>{address || "-"} {subDistrict} {district} {province} {postalCode}</Typography></Box>
                    </Box>
                  </Paper>

                  {/* ── Step 2 สรุป ── */}
                  <Paper variant="outlined" sx={{ borderRadius: 2, mb: 1.75, border: `1px solid ${BORDER}`, p: "18px 22px" }}>
                    <Stack direction="row" alignItems="center" gap={1.25} sx={{ mb: 1.5 }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0, bgcolor: GREEN }}>✓</Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Step 2 — สาขาแรก</Typography>
                      <Box sx={{ flex: 1 }} />
                      <Button variant="outlined" size="small" onClick={() => go("w4")} sx={{ fontSize: 11, textTransform: "none", color: OR, borderColor: BORDER2 }}>แก้ไข</Button>
                    </Stack>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: 12, color: TEXT }}>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>รหัสสาขา</Typography><Typography sx={{ fontSize: 12 }}>{branchCode}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ประเภท</Typography><Typography sx={{ fontSize: 12 }}>{branchType === "hq" ? "สำนักงานใหญ่" : branchType === "branch" ? "สาขา" : "ไม่ระบุ"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>VAT CODE</Typography><Typography sx={{ fontSize: 12 }}>{vatCode}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ชื่อสาขา (TH)</Typography><Typography sx={{ fontSize: 12 }}>{branchNameTH || "-"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ชื่อสาขา (EN)</Typography><Typography sx={{ fontSize: 12 }}>{branchNameEN || "-"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ที่อยู่ (TH)</Typography><Typography sx={{ fontSize: 12 }}>{branchAddress || "-"} {branchSubDistrict} {branchDistrict} {branchProvince}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ที่อยู่ (EN)</Typography><Typography sx={{ fontSize: 12 }}>{enAddr1 || "-"}</Typography></Box>
                    </Box>
                  </Paper>

                  {/* ── Step 3 สรุป ── */}
                  <Paper variant="outlined" sx={{ borderRadius: 2, mb: 1.75, border: `1px solid ${BORDER}`, p: "18px 22px" }}>
                    <Stack direction="row" alignItems="center" gap={1.25} sx={{ mb: 1.5 }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0, bgcolor: GREEN }}>✓</Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Step 3 — การเงินพื้นฐาน</Typography>
                      <Box sx={{ flex: 1 }} />
                      <Button variant="outlined" size="small" onClick={() => go("w5")} sx={{ fontSize: 11, textTransform: "none", color: OR, borderColor: BORDER2 }}>แก้ไข</Button>
                    </Stack>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: 12, color: TEXT }}>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>สกุลเงิน</Typography><Typography sx={{ fontSize: 12 }}>{currency}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>VAT</Typography><Typography sx={{ fontSize: 12 }}>{vatEnabled ? `เปิด (${vatRate}%)` : "ปิด"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>วันจดทะเบียน VAT</Typography><Typography sx={{ fontSize: 12 }}>{vatRegDate}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>วิธีคิด VAT</Typography><Typography sx={{ fontSize: 12 }}>{vatCalcMethod}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>วิธีคิดต้นทุน</Typography><Typography sx={{ fontSize: 12, fontWeight: 600 }}>{costingMethod === "fifo" ? "FIFO" : "Average Cost"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>เครดิตลูกค้า</Typography><Typography sx={{ fontSize: 12 }}>30 วัน</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>เครดิต Supplier</Typography><Typography sx={{ fontSize: 12 }}>30 วัน</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>หัก ณ ที่จ่าย</Typography><Typography sx={{ fontSize: 12 }}>3%</Typography></Box>
                    </Box>
                  </Paper>

                  {/* ── Step 4 สรุป ── */}
                  <Paper variant="outlined" sx={{ borderRadius: 2, mb: 1.75, border: `1px solid ${BORDER}`, p: "18px 22px" }}>
                    <Stack direction="row" alignItems="center" gap={1.25} sx={{ mb: 1.5 }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0, bgcolor: GREEN }}>✓</Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Step 4 — คลังสินค้าแรก</Typography>
                      <Box sx={{ flex: 1 }} />
                      <Button variant="outlined" size="small" onClick={() => go("w6")} sx={{ fontSize: 11, textTransform: "none", color: OR, borderColor: BORDER2 }}>แก้ไข</Button>
                    </Stack>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: 12, color: TEXT }}>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>รหัสคลัง</Typography><Typography sx={{ fontSize: 12 }}>{whCode || "-"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ชื่อคลัง</Typography><Typography sx={{ fontSize: 12 }}>{whName || "-"}</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ประเภท</Typography><Typography sx={{ fontSize: 12 }}>คลังสินค้าสาขา</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>สาขา</Typography><Typography sx={{ fontSize: 12 }}>สำนักงานใหญ่</Typography></Box>
                      <Box sx={{ display: "flex" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>ที่อยู่</Typography><Typography sx={{ fontSize: 12 }}>{whAddress || "-"} {whSubDistrict} {whDistrict} {whProvince} {whPostalCode}</Typography></Box>
                      {whGoogleMap && <Box sx={{ display: "flex", gridColumn: "span 2" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>Google Map</Typography><Typography sx={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{whGoogleMap}</Typography></Box>}
                      {whNote && <Box sx={{ display: "flex", gridColumn: "span 2" }}><Typography sx={{ width: 140, flexShrink: 0, color: MUTED, fontSize: 12 }}>หมายเหตุ</Typography><Typography sx={{ fontSize: 12 }}>{whNote}</Typography></Box>}
                    </Box>
                  </Paper>

                  <Notice variant="orange" icon="➡️">ขั้นตอนถัดไปที่แนะนำ: <strong>F-03 สร้าง Role</strong> → <strong>F-04 สร้าง User</strong> ก่อนเปิดให้ทีมใช้งาน</Notice>
                </Box>
                <WizAction left="Critical ครบ · ข้อมูลจะมีผลทันทีเมื่อยืนยัน">
                  <Button variant="outlined" onClick={() => go("w6")} sx={{ fontSize: 12, textTransform: "none", color: TEXT, borderColor: BORDER2 }}>← แก้ไข</Button>
                  <Button variant="contained" onClick={() => router.push(`/${slug}`)} sx={{ bgcolor: GREEN, "&:hover": { bgcolor: GREEN }, fontSize: 12, fontWeight: 700, textTransform: "none" }}>ยืนยันและเปิดใช้ระบบ →</Button>
                </WizAction>
              </Box>
            </Box>
          </>
        )}

        {/* ════ WE1: ERROR — BLOCK NAVIGATION ════ */}
        {screen === "we1" && (
          <>
            <ScreenMeta id="S-02-E1" title="Error State — Block Navigation Modal" pills={[
              { label: "← กลับ Wizard", target: "w2a" },
            ]} />
            <TopBar />
            <Box sx={{ position: "relative", flex: 1, minHeight: 0 }}>
              {/* Blurred background */}
              <Box sx={{ p: 2.5, filter: "blur(2px)", opacity: 0.4, pointerEvents: "none", bgcolor: BG, height: "100%" }}>
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5, border: `1px solid ${BORDER}` }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>ข้อมูลนิติบุคคล</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                    <Box sx={{ borderRadius: 1, p: 1.25, fontSize: 12, border: `1px solid ${BORDER2}` }}>ชื่อบริษัท...</Box>
                    <Box sx={{ borderRadius: 1, p: 1.25, fontSize: 12, border: `1px solid ${BORDER2}` }}>เลขนิติบุคคล...</Box>
                  </Box>
                </Paper>
              </Box>
              {/* Modal overlay */}
              <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,.45)" }}>
                <Paper elevation={8} sx={{ p: "26px 28px", width: 400, borderRadius: 3 }}>
                  <Typography sx={{ fontSize: 28, textAlign: "center", mb: 1.25 }}>⚠️</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, textAlign: "center", mb: 1, color: RED }}>ยังตั้งค่าไม่ครบ</Typography>
                  <Typography sx={{ fontSize: 12, lineHeight: 1.6, mb: 0.75, color: "#444" }}>ไม่สามารถออกจาก Wizard ได้จนกว่าจะตั้งค่า Critical step ครบทุกขั้น</Typography>
                  <Box sx={{ fontSize: 12, mb: 2 }}>
                    <Typography sx={{ mb: 0.5, color: RED, fontSize: 12 }}>● Step 2 — สาขาแรก (ยังไม่ได้ตั้งค่า)</Typography>
                    <Typography sx={{ mb: 0.5, color: RED, fontSize: 12 }}>● Step 3 — การเงินพื้นฐาน (ยังไม่ได้ตั้งค่า)</Typography>
                    <Typography sx={{ color: RED, fontSize: 12 }}>● Step 4 — คลังสินค้าแรก (ยังไม่ได้ตั้งค่า)</Typography>
                  </Box>
                  <Button fullWidth variant="contained" onClick={() => go("w2a")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, fontSize: 13, fontWeight: 700, textTransform: "none", borderRadius: "7px", py: 1.25 }}>กลับไปตั้งค่า</Button>
                </Paper>
              </Box>
            </Box>
          </>
        )}

      </Box>
    </Box>
  );
}

export default function SetupWizardPage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</Box>}>
      <SetupWizardInner />
    </Suspense>
  );
}
