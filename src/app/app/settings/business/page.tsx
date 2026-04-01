"use client";

import { useState } from "react";
import TenantShell from "@/components/TenantShell";

/* ── Palette ── */
import { TENANT_PRIMARY as OR, BORDER, TEXT, MUTED, HINT, BG } from "@/lib/theme";

/* ── Tab definitions ── */
const TABS = [
  { id: "general", label: "ข้อมูลทั่วไป", icon: <TabIconGeneral /> },
  { id: "contact", label: "ข้อมูลการติดต่อ", icon: <TabIconContact /> },
  { id: "sales", label: "ตั้งค่าการขาย", icon: <TabIconSales /> },
];

/* ── Tab icons ── */
function TabIconGeneral() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function TabIconContact() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
    </svg>
  );
}
function TabIconSales() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

/* ── Floating label field (read-only version) ── */
function FField({ label, value, required, locked, colSpan, type = "text" }: {
  label: string; value: string; required?: boolean; locked?: boolean; colSpan?: string; type?: string;
}) {
  return (
    <div className={colSpan || ""}>
      <div className="relative">
        <div
          className="w-full rounded-lg px-4 pt-5 pb-2 text-sm border"
          style={{
            borderColor: BORDER,
            background: locked ? "#F8F8F8" : "white",
            color: locked ? MUTED : TEXT,
            minHeight: type === "textarea" ? 80 : 48,
            fontSize: 14,
          }}
        >
          {value || <span style={{ color: HINT }}>{label === "รหัสไปรษณีย์" ? "กรอกรหัสไปรษณีย์" : ""}</span>}
        </div>
        <label
          className="absolute left-3 top-0 -translate-y-1/2 px-1 text-xs"
          style={{ color: locked ? MUTED : HINT, background: locked ? "#F8F8F8" : "white", fontSize: 12 }}
        >
          {label}{required && <span style={{ color: "#E53935" }}> *</span>}
        </label>
      </div>
    </div>
  );
}

/* ── Select field (read-only) ── */
function FSelect({ label, value, required, locked, colSpan }: {
  label: string; value: string; required?: boolean; locked?: boolean; colSpan?: string;
}) {
  return (
    <div className={colSpan || ""}>
      <div className="relative">
        <div
          className="w-full rounded-lg px-4 pt-5 pb-2 text-sm border flex items-center justify-between"
          style={{
            borderColor: BORDER,
            background: locked ? "#F8F8F8" : "white",
            color: locked ? MUTED : TEXT,
            minHeight: 48,
            fontSize: 14,
          }}
        >
          <span>{value}</span>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={HINT} strokeWidth={2} strokeLinecap="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <label
          className="absolute left-3 top-0 -translate-y-1/2 px-1 text-xs"
          style={{ color: locked ? MUTED : HINT, background: locked ? "#F8F8F8" : "white", fontSize: 12 }}
        >
          {label}{required && <span style={{ color: "#E53935" }}> *</span>}
        </label>
      </div>
    </div>
  );
}

/* ── Phone field with country code ── */
function FPhone({ code, flag, value, locked }: { code: string; flag: string; value: string; locked?: boolean }) {
  return (
    <div className="flex gap-2">
      <div className="relative shrink-0" style={{ width: 100 }}>
        <div
          className="w-full rounded-lg px-3 pt-5 pb-2 text-sm border flex items-center gap-2"
          style={{ borderColor: BORDER, background: locked ? "#F8F8F8" : "white", color: locked ? MUTED : TEXT, minHeight: 48, fontSize: 14 }}
        >
          <span>{flag}</span><span>{code}</span>
        </div>
        <label className="absolute left-3 top-0 -translate-y-1/2 px-1 text-xs"
          style={{ color: MUTED, background: locked ? "#F8F8F8" : "white", fontSize: 12 }}>
          รหัสประเทศ<span style={{ color: "#E53935" }}> *</span>
        </label>
      </div>
      <div className="relative flex-1">
        <div
          className="w-full rounded-lg px-4 pt-5 pb-2 text-sm border"
          style={{ borderColor: BORDER, background: locked ? "#F8F8F8" : "white", color: locked ? MUTED : TEXT, minHeight: 48, fontSize: 14 }}
        >
          {value}
        </div>
        <label className="absolute left-3 top-0 -translate-y-1/2 px-1 text-xs"
          style={{ color: MUTED, background: locked ? "#F8F8F8" : "white", fontSize: 12 }}>
          เบอร์โทรศัพท์<span style={{ color: "#E53935" }}> *</span>
        </label>
      </div>
    </div>
  );
}

/* ── Toggle switch ── */
function Toggle({ checked }: { checked: boolean }) {
  return (
    <div className="w-11 h-6 rounded-full relative" style={{ background: checked ? OR : "#ccc" }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ left: checked ? 22 : 2 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════════ */
export default function SettingsBusinessPage() {
  const [activeTab, setActiveTab] = useState("general");

  /* ── Mock data from Onboarding (locked) ── */
  const onboardingData = {
    entityType: "นิติบุคคล",
    taxId: "223372271000",
    companyType: "บริษัทจำกัด",
    prefix: "บริษัท",
    companyName: "Pardesco Retail and Trading",
    suffix: "จำกัด",
    shortName: "Pardesco",
    country: "Laos",
    address: "",
    subDistrict: "Phontan",
    district: "Xaysettha",
    province: "Vientiane",
    postalCode: "",
    phoneCode: "+856",
    phoneFlag: "🇱🇦",
    phone: "02092975143",
    phone2: "",
    email: "pardesco.lao@gmail.com",
    /* Finance from onboarding */
    currency: "บาท",
    vatEnabled: true,
    vatRate: "10",
    vatRegDate: "31/12/2024",
    vatCalcMethod: "แยกภาษี",
  };

  return (
    <TenantShell breadcrumb={["ตั้งค่าธุรกิจ", "ข้อมูลธุรกิจ"]} activeModule="settings">
      <div style={{ padding: "24px 32px", fontFamily: "'Sarabun', sans-serif" }}>
        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: BORDER }}>
          {/* ── Tab bar ── */}
          <div className="flex" style={{ borderBottom: `2px solid ${BORDER}` }}>
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative"
                  style={{
                    color: active ? OR : MUTED,
                    fontWeight: active ? 600 : 400,
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: active ? OR : MUTED }}>{tab.icon}</span>
                  {tab.label}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px]" style={{ background: OR }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Tab content ── */}
          <div className="p-8">
            {activeTab === "general" && <TabGeneral data={onboardingData} />}
            {activeTab === "contact" && <TabContact data={onboardingData} />}
            {activeTab === "sales" && <TabSales data={onboardingData} />}
          </div>
        </div>
      </div>
    </TenantShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Tab 1 — ข้อมูลทั่วไป
   ═══════════════════════════════════════════════════════════════ */
function TabGeneral({ data }: { data: Record<string, unknown> }) {
  const d = data as Record<string, string | boolean>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6" style={{ color: OR }}>ข้อมูลทั่วไป</h2>

      {/* Profile image placeholder */}
      <div className="w-24 h-24 rounded-xl mb-8 flex items-center justify-center" style={{ background: BG, border: `1px solid ${BORDER}` }}>
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={HINT} strokeWidth={1.2}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
      </div>

      {/* Entity type radio + Tax ID */}
      <div className="flex items-center gap-6 mb-6 flex-wrap">
        <label className="flex items-center gap-2 text-sm" style={{ color: MUTED }}>
          <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: BORDER }}>
            {String(d.entityType) === "บุคคลธรรมดา" && <span className="w-2.5 h-2.5 rounded-full" style={{ background: OR }} />}
          </span>
          บุคคลธรรมดา
        </label>
        <label className="flex items-center gap-2 text-sm" style={{ color: TEXT }}>
          <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: OR }}>
            {String(d.entityType) === "นิติบุคคล" && <span className="w-2.5 h-2.5 rounded-full" style={{ background: OR }} />}
          </span>
          นิติบุคคล
        </label>
        <div className="ml-4" style={{ width: 280 }}>
          <FField label="เลขที่ประจำตัวผู้เสียภาษี" value={String(d.taxId)} required locked />
        </div>
      </div>

      {/* Row: ประเภท, คำนำหน้า, ชื่อบริษัท, คำลงท้าย, ชื่อย่อ */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-3">
          <FSelect label="ประเภท" value={String(d.companyType)} required locked />
        </div>
        <div className="col-span-2">
          <FSelect label="คำนำหน้า" value={String(d.prefix)} required locked />
        </div>
        <div className="col-span-3">
          <FField label="ชื่อบริษัท" value={String(d.companyName)} required locked />
        </div>
        <div className="col-span-2">
          <FField label="คำลงท้าย" value={String(d.suffix)} locked />
        </div>
        <div className="col-span-2">
          <FField label="ชื่อย่อ" value={String(d.shortName)} locked />
        </div>
      </div>

      {/* Row: ประเทศ, ที่อยู่, แขวง/ตำบล, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์ */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-2">
          <FSelect label="ประเทศ" value={String(d.country)} required locked />
        </div>
        <div className="col-span-2">
          <FField label="ที่อยู่" value={String(d.address)} locked />
        </div>
        <div className="col-span-2">
          <FField label="แขวง/ตำบล" value={String(d.subDistrict)} locked />
        </div>
        <div className="col-span-2">
          <FField label="อำเภอ/เขต" value={String(d.district)} locked />
        </div>
        <div className="col-span-2">
          <FField label="จังหวัด" value={String(d.province)} locked />
        </div>
        <div className="col-span-2">
          <FField label="รหัสไปรษณีย์" value={String(d.postalCode)} locked />
        </div>
      </div>

      {/* Row: Phone, phone2, email */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-4">
          <FPhone code={String(d.phoneCode)} flag={String(d.phoneFlag)} value={String(d.phone)} locked />
        </div>
        <div className="col-span-3">
          <FField label="เบอร์โทร" value={String(d.phone2)} locked />
        </div>
        <div className="col-span-4">
          <FField label="อีเมล" value={String(d.email)} locked />
        </div>
      </div>

      {/* Edit button */}
      <div className="flex justify-end mt-8">
        <button className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: OR, fontSize: 14 }}>
          แก้ไข
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Tab 2 — ข้อมูลการติดต่อ
   ═══════════════════════════════════════════════════════════════ */
function TabContact({ data }: { data: Record<string, unknown> }) {
  // This tab has no onboarding data — all fields editable
  void data;

  return (
    <div>
      {/* Row 1: เบอร์โทรศัพท์, เบอร์มือถือ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <FField label="เบอร์โทรศัพท์" value="" />
        <FField label="เบอร์มือถือ" value="" />
      </div>

      {/* Row 2: E-mail, Website */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <FField label="E-mail" value="" required />
        <FField label="Website" value="" />
      </div>

      {/* Row 3: Facebook, Line */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <FField label="Facebook" value="" />
        <FField label="Line" value="" />
      </div>

      {/* Row 4: URL Google Map */}
      <div className="mb-6">
        <FField label="URL Google Map" value="" />
      </div>

      {/* Edit button */}
      <div className="flex justify-end mt-8">
        <button className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: OR, fontSize: 14 }}>
          แก้ไข
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Tab 3 — ตั้งค่าการขาย
   ═══════════════════════════════════════════════════════════════ */
function TabSales({ data }: { data: Record<string, unknown> }) {
  const d = data as Record<string, string | boolean>;

  return (
    <div style={{ maxWidth: 560 }}>
      {/* สกุลเงิน */}
      <div className="mb-6">
        <FSelect label="สกุลเงิน" value={String(d.currency)} required locked />
      </div>

      {/* VAT toggle + rate */}
      <div className="flex items-center gap-4 mb-6">
        <Toggle checked={Boolean(d.vatEnabled)} />
        <div className="flex-1" style={{ maxWidth: 500 }}>
          <FField label="ภาษีมูลค่าเพิ่ม (VAT)" value={String(d.vatRate)} required locked />
        </div>
      </div>

      {/* VAT registration date */}
      <div className="mb-6">
        <div className="relative">
          <div className="w-full rounded-lg px-4 pt-5 pb-2 text-sm border flex items-center justify-between"
            style={{ borderColor: BORDER, background: "#F8F8F8", color: MUTED, minHeight: 48, fontSize: 14 }}>
            <span>{String(d.vatRegDate)}</span>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={HINT} strokeWidth={1.5}>
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <label className="absolute left-3 top-0 -translate-y-1/2 px-1 text-xs"
            style={{ color: MUTED, background: "#F8F8F8", fontSize: 12 }}>
            วันที่จดทะเบียนภาษีมูลค่าเพิ่ม<span style={{ color: "#E53935" }}> *</span>
          </label>
        </div>
      </div>

      {/* VAT calculation method */}
      <div className="mb-6">
        <FSelect label="วิธีคิดภาษีมูลค่าเพิ่ม" value={String(d.vatCalcMethod)} required locked />
      </div>

      {/* Edit button */}
      <div className="flex justify-center mt-8">
        <button className="px-16 py-3 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: OR, fontSize: 15 }}>
          แก้ไข
        </button>
      </div>
    </div>
  );
}
