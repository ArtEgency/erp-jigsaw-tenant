"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ── Types ── */
export interface ModuleChild {
  label: string;
  id: string;
  children?: { label: string; id: string }[];
}

export interface ModuleItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  children?: ModuleChild[];
}

export interface BranchOption {
  code: string;
  name: string;
}

interface Props {
  children: React.ReactNode;
  breadcrumb?: string[];
  activeModule?: string;
  onModuleClick?: (id: string) => void;
}

/* ── Palette ── */
import { TENANT_PRIMARY as OR, TENANT_LIGHT as OR_L, BORDER, TEXT, MUTED } from "@/lib/theme";

/* ═══════════════════════════════════════════════════════════════
   SVG Icons — line-style matching the Allder NOW reference
   ═══════════════════════════════════════════════════════════════ */
const IC = { size: 18, stroke: "currentColor", strokeWidth: 1.6, fill: "none" } as const;

/* Top Bar icons */
const IconHamburger = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC}><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
);
const IconMail = () => (
  <svg width={IC.size} height={IC.size} viewBox="0 0 24 24" {...IC}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4" /></svg>
);
const IconBell = () => (
  <svg width={IC.size} height={IC.size} viewBox="0 0 24 24" {...IC}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
);
const IconRefresh = () => (
  <svg width={IC.size} height={IC.size} viewBox="0 0 24 24" {...IC}><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
);
const IconGrid = () => (
  <svg width={IC.size} height={IC.size} viewBox="0 0 24 24" {...IC}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
);

/* Side bar icons */
const IconHome = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconClock = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconClipboard = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC}><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
);
const IconCalendar = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const IconGlobe = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
);
const IconUsers = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
);
const IconSettings = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
);
const IconDots = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" {...IC} strokeWidth={2}><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>
);

/* Module nav icons — line-style, 16px */
const MI = { size: 16, stroke: "currentColor", strokeWidth: 1.6, fill: "none" } as const;

const MIconTask = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>
);
const MIconProduct = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);
const MIconCart = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
);
const MIconWarehouse = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><path d="M22 12H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/><line x1="12" y1="16" x2="12" y2="16.01"/></svg>
);
const MIconContacts = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
);
const MIconSale = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
);
const MIconFinance = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);
const MIconFactory = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><path d="M2 20h20"/><path d="M5 20V8l5 4V8l5 4V4h3a2 2 0 012 2v14"/></svg>
);
const MIconHR = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const MIconReport = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);
const MIconAnalytics = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const MIconGear = () => (
  <svg width={MI.size} height={MI.size} viewBox="0 0 24 24" {...MI}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
);

/* ── Module definitions ── */
const MODULES: ModuleItem[] = [
  { icon: <MIconTask />, label: "งานของฉัน", id: "my-tasks" },
  { icon: <MIconProduct />, label: "สินค้า", id: "products", children: [
    { label: "จัดการสินค้า", id: "products-list" },
    { label: "หมวดหมู่สินค้า", id: "products-category" },
    { label: "หน่วยนับ", id: "products-unit" },
  ]},
  { icon: <MIconCart />, label: "จัดซื้อ", id: "purchase", children: [
    { label: "ใบขอซื้อ", id: "purchase-request" },
    { label: "ใบสั่งซื้อ", id: "purchase-order" },
    { label: "ใบรับสินค้า", id: "purchase-receive" },
  ]},
  { icon: <MIconWarehouse />, label: "คลังสินค้า", id: "inventory", children: [
    { label: "ตรวจนับสต็อก", id: "inventory-count" },
    { label: "โอนสินค้า", id: "inventory-transfer" },
    { label: "คลังสินค้า", id: "inventory-warehouse" },
  ]},
  { icon: <MIconContacts />, label: "ลูกค้า / ผู้จำหน่าย", id: "contacts", children: [
    { label: "ลูกค้า", id: "contacts-customer" },
    { label: "ผู้จำหน่าย", id: "contacts-supplier" },
  ]},
  { icon: <MIconSale />, label: "ขาย", id: "sales", children: [
    { label: "ใบเสนอราคา", id: "sales-quotation" },
    { label: "ใบสั่งขาย", id: "sales-order" },
    { label: "ใบส่งสินค้า", id: "sales-delivery" },
  ]},
  { icon: <MIconFinance />, label: "การเงินและบัญชี", id: "finance", children: [
    { label: "ใบแจ้งหนี้", id: "finance-invoice" },
    { label: "ใบเสร็จรับเงิน", id: "finance-receipt" },
    { label: "ภาษี", id: "finance-tax" },
  ]},
  { icon: <MIconFactory />, label: "การผลิต", id: "manufacturing" },
  { icon: <MIconHR />, label: "บุคคล", id: "hr", children: [
    { label: "รายชื่อพนักงาน", id: "hr-employee" },
    { label: "จัดการสิทธิ์ผู้ใช้งาน", id: "hr-permissions", children: [
      { label: "กำหนดสิทธิ์ผู้ใช้งาน", id: "hr-assign-permission" },
      { label: "สร้างสิทธิ์ผู้ใช้งาน", id: "hr-role-list" },
    ]},
  ]},
  { icon: <MIconReport />, label: "รายงาน", id: "reports", children: [
    { label: "รายงานขาย", id: "reports-sales" },
    { label: "รายงานซื้อ", id: "reports-purchase" },
    { label: "รายงานสต็อก", id: "reports-stock" },
  ]},
  { icon: <MIconAnalytics />, label: "การวิเคราะห์", id: "analytics" },
  { icon: <MIconGear />, label: "ตั้งค่า", id: "settings", children: [
    { label: "ตั้งค่าธุรกิจ", id: "settings-business", children: [
      { label: "ข้อมูลธุรกิจ", id: "settings-business-info" },
      { label: "สาขาทั้งหมด", id: "settings-business-branch" },
    ]},
    { label: "สินค้า", id: "settings-product", children: [
      { label: "ประเภทสินค้า", id: "settings-product-type" },
      { label: "หน่วยนับ", id: "settings-product-unit" },
      { label: "ขนาดบรรจุ", id: "settings-product-pack" },
      { label: "หน่วย Dimension", id: "settings-product-dim" },
      { label: "น้ำหนักสินค้า", id: "settings-product-weight" },
      { label: "ยี่ห้อ (แบรนด์)", id: "settings-product-brand" },
      { label: "นำเข้าสินค้า", id: "settings-product-import" },
    ]},
    { label: "คลังสินค้า", id: "settings-warehouse", children: [
      { label: "ตั้งค่าคลังสินค้า", id: "settings-warehouse-config" },
    ]},
    { label: "การเงินและบัญชี", id: "settings-finance" },
    { label: "จัดซื้อ", id: "settings-purchase" },
    { label: "ขาย", id: "settings-sales" },
    { label: "ลูกค้า / ผู้จำหน่าย", id: "settings-customer", children: [
      { label: "ตั้งค่าลูกค้า", id: "settings-customer-config" },
    ]},
    { label: "บุคคล", id: "settings-hr" },
    { label: "รายงาน", id: "settings-reports" },
    { label: "การวิเคราะห์", id: "settings-analytics" },
    { label: "ตั้งค่าการใช้งาน", id: "settings-usage" },
    { label: "อื่นๆ", id: "settings-other" },
  ]},
];

const BRANCHES: BranchOption[] = [
  { code: "Central Office", name: "Central Office" },
  { code: "B1-WH-HQ", name: "B1-WH-HQ" },
  { code: "B2-WH-EANG", name: "B2-WH-EANG" },
];

/* ── Enabled modules (มีหน้าจอแล้ว) ── */
const ENABLED_MODULES = new Set([
  "hr", "settings",
  // sub-items that have real pages
  "hr-employee", "hr-role-list", "hr-assign-permission", "hr-permissions",
  "settings-business", "settings-business-info", "settings-business-branch",
  "settings-product", "settings-product-type", "settings-product-unit",
  "settings-product-pack", "settings-product-dim", "settings-product-weight",
  "settings-product-brand", "settings-product-import",
  "settings-warehouse", "settings-warehouse-config",
]);

/* ── Route map ── */
const MODULE_ROUTES: Record<string, string> = {
  "hr-employee": "/app/employee",
  "hr-role-list": "/app/role-permission",
  "hr-assign-permission": "/app/assign-permission",
  "settings-business-info": "/app/settings/business",
  "settings-business-branch": "/app/settings/business?tab=branches",
  "settings-warehouse-config": "/app/settings/warehouse",
  "settings-product-type": "/app/settings/product?tab=product-type",
  "settings-product-unit": "/app/settings/product?tab=unit",
  "settings-product-pack": "/app/settings/product?tab=pack-size",
  "settings-product-dim": "/app/settings/product?tab=dimension",
  "settings-product-weight": "/app/settings/product?tab=weight",
  "settings-product-brand": "/app/settings/product?tab=brand",
  "settings-product-import": "/app/settings/product?tab=import",
};

/* ── Side bar items ── */
const SIDEBAR_ITEMS = [
  { icon: <IconHome />, label: "หน้าหลัก", path: "/app" },
  { icon: <IconClock />, label: "ล่าสุด", path: "" },
  { icon: <IconClipboard />, label: "รายการ", path: "" },
  { icon: <IconCalendar />, label: "ปฏิทิน", path: "" },
  { icon: <IconGlobe />, label: "เว็บไซต์", path: "" },
  { icon: <IconUsers />, label: "ผู้ติดต่อ", path: "" },
  { icon: <IconGlobe />, label: "ภาษา", path: "" },
  { icon: <IconSettings />, label: "ตั้งค่า", path: "" },
  { icon: <IconDots />, label: "เพิ่มเติม", path: "" },
];

/* ═══════════════════════════════════════════════════════════════
   Fixed Dropdown Menu — renders at viewport level, never clipped
   ═══════════════════════════════════════════════════════════════ */
function FixedDropdownMenu({ items, onSelect, anchorRect }: {
  items: ModuleChild[]; onSelect: (id: string) => void; anchorRect: DOMRect;
}) {
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: anchorRect.left, top: anchorRect.bottom });

  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    let left = anchorRect.left;
    // If menu overflows right edge, shift it left
    if (left + rect.width > vw - 8) {
      left = Math.max(8, vw - rect.width - 8);
    }
    setPos({ left, top: anchorRect.bottom });
  }, [anchorRect]);

  return (
    <div ref={menuRef} className="fixed bg-white rounded-b-lg shadow-xl border min-w-[200px] z-[100]"
      style={{ borderColor: BORDER, left: pos.left, top: pos.top }}>
      {items.map((child) => {
        const hasSub = child.children && child.children.length > 0;
        const childEnabled = ENABLED_MODULES.has(child.id);
        return (
          <div key={child.id} className="relative"
            onMouseEnter={() => hasSub && childEnabled && setHoveredSub(child.id)}
            onMouseLeave={() => setHoveredSub(null)}
          >
            <button
              disabled={!childEnabled}
              onClick={() => { if (!hasSub && childEnabled) onSelect(child.id); }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between"
              style={{
                color: !childEnabled ? "#C8C8C8" : hoveredSub === child.id ? OR : TEXT,
                background: hoveredSub === child.id && childEnabled ? OR_L : "transparent",
                borderBottom: `1px solid #f0f0f0`,
                cursor: !childEnabled ? "default" : "pointer",
              }}
            >
              <span>{child.label}</span>
              {hasSub && <span className="text-xs" style={{ color: childEnabled ? "#aaa" : "#D8D8D8" }}>&#x203A;</span>}
            </button>
            {hasSub && hoveredSub === child.id && childEnabled && (
              <div className="absolute left-full top-0 bg-white rounded-lg shadow-xl border min-w-[200px] z-[110]"
                style={{ borderColor: BORDER, ...(pos.left + 400 > window.innerWidth ? { left: "auto", right: "100%" } : {}) }}>
                {child.children!.map((sub) => {
                  const subEnabled = ENABLED_MODULES.has(sub.id);
                  return (
                  <button key={sub.id}
                    disabled={!subEnabled}
                    onClick={() => { if (subEnabled) onSelect(sub.id); }}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                    style={{ color: subEnabled ? TEXT : "#C8C8C8", borderBottom: `1px solid #f0f0f0`, cursor: subEnabled ? "pointer" : "default" }}
                    onMouseEnter={(e) => { if (subEnabled) { e.currentTarget.style.background = OR_L; e.currentTarget.style.color = OR; } }}
                    onMouseLeave={(e) => { if (subEnabled) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TEXT; } }}
                  >
                    {sub.label}
                  </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ModuleNavBar — horizontally scrollable with safe area + arrows
   ═══════════════════════════════════════════════════════════════ */
function ModuleNavBar({ modules, activeModule, openDropdown, onDropdownToggle, onDropdownClose, onModuleNav }: {
  modules: ModuleItem[];
  activeModule?: string;
  openDropdown: string | null;
  onDropdownToggle: (id: string) => void;
  onDropdownClose: () => void;
  onModuleNav: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [dropdownAnchor, setDropdownAnchor] = useState<DOMRect | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => { el.removeEventListener("scroll", checkScroll); window.removeEventListener("resize", checkScroll); };
  }, [checkScroll]);

  // Update dropdown anchor when openDropdown changes
  useEffect(() => {
    if (openDropdown && btnRefs.current[openDropdown]) {
      setDropdownAnchor(btnRefs.current[openDropdown]!.getBoundingClientRect());
    } else {
      setDropdownAnchor(null);
    }
  }, [openDropdown]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const activeDropdownMod = modules.find((m) => m.id === openDropdown);

  return (
    <div className="flex items-center shrink-0 bg-white relative z-40" style={{ borderBottom: `1px solid ${BORDER}` }}>
      {/* Left scroll arrow */}
      {showLeft && (
        <button onClick={() => scroll("left")}
          className="w-8 h-[48px] flex items-center justify-center shrink-0 hover:bg-gray-100 transition-colors"
          style={{ color: OR, borderRight: `1px solid ${BORDER}` }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}

      {/* Scrollable module list */}
      <div ref={scrollRef} className="flex-1 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style>{`[data-module-scroll]::-webkit-scrollbar{display:none}`}</style>
        <div className="flex items-center" data-module-scroll>
          {modules.map((mod) => {
            const isActive = activeModule === mod.id;
            const hasChildren = mod.children && mod.children.length > 0;
            const isDropOpen = openDropdown === mod.id;
            const isEnabled = ENABLED_MODULES.has(mod.id);

            return (
              <button
                key={mod.id}
                ref={(el) => { btnRefs.current[mod.id] = el; }}
                disabled={!isEnabled}
                onClick={() => {
                  if (!isEnabled) return;
                  if (hasChildren) {
                    onDropdownToggle(mod.id);
                  } else {
                    onDropdownClose();
                    onModuleNav(mod.id);
                  }
                }}
                className="flex items-center gap-2 px-4 h-[48px] whitespace-nowrap transition-colors relative shrink-0"
                style={{
                  color: !isEnabled ? "#C8C8C8" : isActive || isDropOpen ? OR : MUTED,
                  background: isActive ? OR_L : isDropOpen ? "#fafafa" : "transparent",
                  fontFamily: "'Sarabun', sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: !isEnabled ? "default" : "pointer",
                  opacity: !isEnabled ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isEnabled) return;
                  if (!isActive && !isDropOpen) { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.color = OR; }
                }}
                onMouseLeave={(e) => {
                  if (!isEnabled) return;
                  if (!isActive && !isDropOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; }
                }}
              >
                <span style={{ color: !isEnabled ? "#C8C8C8" : isActive || isDropOpen ? OR : MUTED, display: "flex", alignItems: "center" }}>{mod.icon}</span>
                <span>{mod.label}</span>
                {hasChildren && (
                  <svg width={10} height={6} viewBox="0 0 10 6" fill="none" className="ml-0.5">
                    <path d="M1 1l4 4 4-4" stroke={!isEnabled ? "#C8C8C8" : isActive || isDropOpen ? OR : "#aaa"} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t" style={{ background: OR }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right scroll arrow */}
      {showRight && (
        <button onClick={() => scroll("right")}
          className="w-8 h-[48px] flex items-center justify-center shrink-0 hover:bg-gray-100 transition-colors"
          style={{ color: OR, background: OR_L, borderLeft: `1px solid ${BORDER}` }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* Fixed dropdown — rendered at viewport level */}
      {activeDropdownMod && activeDropdownMod.children && dropdownAnchor && (
        <FixedDropdownMenu
          items={activeDropdownMod.children}
          anchorRect={dropdownAnchor}
          onSelect={(id) => { onDropdownClose(); onModuleNav(id); }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Screen Index — side panel data
   ═══════════════════════════════════════════════════════════════ */
const screenIndex = [
  {
    group: "F-02 \u00b7 Setup Wizard", color: OR,
    items: [
      { label: "W1 \u2014 Wizard Entry", path: "/app/setup-wizard?screen=w1" },
      { label: "W2a \u2014 \u0e40\u0e25\u0e37\u0e2d\u0e01\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e19\u0e34\u0e15\u0e34\u0e1a\u0e38\u0e04\u0e04\u0e25", path: "/app/setup-wizard?screen=w2a" },
      { label: "W2b \u2014 \u0e01\u0e23\u0e2d\u0e01\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e19\u0e34\u0e15\u0e34\u0e1a\u0e38\u0e04\u0e04\u0e25", path: "/app/setup-wizard?screen=w2b" },
      { label: "W2e \u2014 Error Tax ID", path: "/app/setup-wizard?screen=w2e" },
      { label: "W3 \u2014 Branding", path: "/app/setup-wizard?screen=w3" },
      { label: "W4 \u2014 \u0e2a\u0e32\u0e02\u0e32\u0e41\u0e23\u0e01 (HQ)", path: "/app/setup-wizard?screen=w4" },
      { label: "W5 \u2014 \u0e01\u0e32\u0e23\u0e40\u0e07\u0e34\u0e19\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19", path: "/app/setup-wizard?screen=w5" },
      { label: "W6 \u2014 \u0e04\u0e25\u0e31\u0e07\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e41\u0e23\u0e01", path: "/app/setup-wizard?screen=w6" },
      { label: "W7 \u2014 Checklist Summary", path: "/app/setup-wizard?screen=w7" },
      { label: "WE1 \u2014 Block Navigation Modal", path: "/app/setup-wizard?screen=we1" },
    ],
  },
  {
    group: "F-03 \u00b7 \u0e2a\u0e23\u0e49\u0e32\u0e07 Role & Permission", color: OR,
    items: [
      { label: "S1 \u2014 \u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c (\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e40\u0e21\u0e19\u0e39)", path: "/app/role-permission?screen=s1" },
      { label: "S2 \u2014 \u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c (\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e2a\u0e48\u0e27\u0e19\u0e07\u0e32\u0e19)", path: "/app/role-permission?screen=s2" },
      { label: "S3 \u2014 \u0e2a\u0e23\u0e49\u0e32\u0e07\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c SYSTEM", path: "/app/role-permission?screen=s3" },
      { label: "S4 \u2014 Popup \u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c\u0e40\u0e09\u0e1e\u0e32\u0e30\u0e01\u0e23\u0e13\u0e35", path: "/app/role-permission?screen=s4" },
      { label: "S5 \u2014 \u0e2a\u0e23\u0e49\u0e32\u0e07\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c ERP Permission", path: "/app/role-permission?screen=s5" },
      { label: "S6 \u2014 Error States", path: "/app/role-permission?screen=s6" },
    ],
  },
  {
    group: "F-04 \u00b7 \u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e1e\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19", color: OR,
    items: [
      { label: "S1 \u2014 \u0e23\u0e32\u0e22\u0e0a\u0e37\u0e48\u0e2d\u0e1e\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19 (\u0e1b\u0e31\u0e08\u0e08\u0e38\u0e1a\u0e31\u0e19)", path: "/app/employee" },
      { label: "S2 \u2014 \u0e40\u0e1e\u0e34\u0e48\u0e21\u0e1e\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19 (\u0e1f\u0e2d\u0e23\u0e4c\u0e21)", path: "/app/employee" },
    ],
  },
  {
    group: "F-05 \u00b7 \u0e01\u0e33\u0e2b\u0e19\u0e14\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19", color: OR,
    items: [
      { label: "S1 \u2014 \u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c", path: "/app/assign-permission" },
      { label: "S2 \u2014 \u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e2a\u0e34\u0e17\u0e18\u0e34\u0e4c", path: "/app/assign-permission" },
    ],
  },
  {
    group: "F-06 \u00b7 \u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32", color: OR,
    items: [
      { label: "S1 \u2014 \u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32 (List + Modal)", path: "/app/settings/product?tab=product-type" },
      { label: "S2 \u2014 \u0e2b\u0e19\u0e48\u0e27\u0e22\u0e19\u0e31\u0e1a (List + Modal)", path: "/app/settings/product?tab=unit" },
    ],
  },
  {
    group: "Tenant App", color: OR,
    items: [
      { label: "\u0e41\u0e14\u0e0a\u0e1a\u0e2d\u0e23\u0e4c\u0e14 (My Job)", path: "/app" },
      { label: "\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32", path: "/app" },
      { label: "\u0e43\u0e1a\u0e02\u0e2d\u0e0b\u0e37\u0e49\u0e2d", path: "/app" },
      { label: "\u0e07\u0e32\u0e19\u0e02\u0e32\u0e22", path: "/app" },
      { label: "\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17", path: "/app" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   TenantShell Component
   ═══════════════════════════════════════════════════════════════ */
export default function TenantShell({ children, breadcrumb, activeModule, onModuleClick }: Props) {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [branchOpen, setBranchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [lang, setLang] = useState<"th" | "en">("th");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [screenIndexOpen, setScreenIndexOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const handleModuleNav = (id: string) => {
    if (MODULE_ROUTES[id]) {
      router.push(MODULE_ROUTES[id]);
    } else if (onModuleClick) {
      onModuleClick(id);
    }
  };

  const totalScreens = screenIndex.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="min-h-screen flex" style={{ background: "#F4F4F4", fontFamily: "'Sarabun', sans-serif" }}>

      {/* ══════ LEFT SIDEBAR ══════ */}
      <div className="w-[52px] shrink-0 flex flex-col items-center py-3 gap-1 z-50" style={{ background: "#FFFFFF", borderRight: `1px solid ${BORDER}` }}>
        {/* JIGSAW logo */}
        <button onClick={() => router.push("/")} className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 hover:opacity-80 transition-opacity" style={{ background: OR }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity={0.7} />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity={0.7} />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity={0.5} />
          </svg>
        </button>

        {SIDEBAR_ITEMS.map((item, i) => {
          const hasPath = !!item.path;
          return (
          <button
            key={i}
            disabled={!hasPath}
            onClick={() => hasPath ? router.push(item.path) : undefined}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors group relative"
            style={{ color: hasPath ? (i === 0 ? OR : MUTED) : "#D0D0D0", cursor: hasPath ? "pointer" : "default", opacity: hasPath ? 1 : 0.5 }}
            onMouseEnter={(e) => { if (hasPath) { e.currentTarget.style.background = OR_L; e.currentTarget.style.color = OR; } }}
            onMouseLeave={(e) => { if (hasPath) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = i === 0 ? OR : MUTED; } }}
            title={item.label}
          >
            {item.icon}
          </button>
          );
        })}
      </div>

      {/* ══════ MAIN AREA ══════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ══════ TOP BAR ══════ */}
        <div className="h-[52px] flex items-center px-4 gap-3 shrink-0 relative z-50" style={{ background: OR }}>
          {/* Hamburger */}
          <button onClick={() => setScreenIndexOpen(!screenIndexOpen)} className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors">
            <IconHamburger />
          </button>

          {/* Branch Selector */}
          <div className="relative flex items-center gap-2">
            <span className="text-white/70 text-sm font-medium" style={{ fontSize: 14 }}>ส่วนงาน :</span>
            <button
              onClick={() => { setBranchOpen(!branchOpen); setLangOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "white", fontSize: 14 }}
            >
              <span>{selectedBranch.name}</span>
              <svg width={10} height={6} viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {branchOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border min-w-[220px] z-[100] overflow-hidden" style={{ borderColor: BORDER }}>
                {BRANCHES.map((b) => (
                  <button key={b.code} onClick={() => { setSelectedBranch(b); setBranchOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2"
                    style={{ color: selectedBranch.code === b.code ? OR : TEXT, fontWeight: selectedBranch.code === b.code ? 600 : 400, borderBottom: `1px solid ${BORDER}` }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* System name */}
          <div className="text-white/60 text-sm flex-1" style={{ fontSize: 14 }}>
            SYSTEM NAME HERE
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Onboarding - ทางเข้าชั่วคราว */}
            <button
              onClick={() => router.push("/app/setup-wizard")}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-bold transition-all hover:opacity-90"
              style={{ background: "white", color: "#565DFF" }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>Onboarding</span>
            </button>
            {/* Mail */}
            <button className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
              <IconMail />
            </button>
            {/* Notification */}
            <button className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors relative">
              <IconBell />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold" style={{ lineHeight: 1 }}>3</span>
            </button>
            {/* Refresh */}
            <button className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
              <IconRefresh />
            </button>
            {/* Grid */}
            <button className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
              <IconGrid />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button onClick={() => { setLangOpen(!langOpen); setBranchOpen(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                style={{ fontSize: 14 }}
              >
                {lang === "th" ? "TH" : "EN"}
                <svg width={10} height={6} viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border min-w-[140px] z-[100] overflow-hidden" style={{ borderColor: BORDER }}>
                  <button onClick={() => { setLang("th"); setLangOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors"
                    style={{ color: lang === "th" ? OR : TEXT, fontWeight: lang === "th" ? 600 : 400, borderBottom: `1px solid ${BORDER}` }}
                  >
                    TH Thai
                  </button>
                  <button onClick={() => { setLang("en"); setLangOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors"
                    style={{ color: lang === "en" ? OR : TEXT, fontWeight: lang === "en" ? 600 : 400 }}
                  >
                    EN English
                  </button>
                </div>
              )}
            </div>

            {/* User name + avatar + profile dropdown */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setBranchOpen(false); setLangOpen(false); }}
                className="flex items-center gap-2 ml-1 cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-colors">
                <span className="text-white text-sm font-medium hidden lg:block" style={{ fontSize: 14 }}>คลิษา จิตดี</span>
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/40 shrink-0">
                  <div className="w-full h-full bg-white/30 flex items-center justify-center text-white text-xs font-bold">ค</div>
                </div>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}>
                  <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-2xl border py-0 min-w-[280px] overflow-hidden"
                  style={{ borderColor: "#E0E0E0" }}>
                  {/* Profile header */}
                  <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: "1px solid #F0F0F0" }}>
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: OR }}>
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ background: "#EEEEFF", color: OR }}>ค</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold" style={{ color: TEXT }}>คลิษา จิตดี</div>
                      <div className="text-[11px]" style={{ color: MUTED }}>ผู้ดูแลระบบ</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  {/* โปรไฟล์ */}
                  <div className="py-1" style={{ borderBottom: "1px solid #F0F0F0" }}>
                    <button onClick={() => { setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-indigo-50 transition-colors flex items-center gap-3 cursor-pointer"
                      style={{ color: TEXT }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      โปรไฟล์
                    </button>
                  </div>
                  {/* Company list — 2 entries */}
                  <div className="py-1" style={{ borderBottom: "1px solid #F0F0F0" }}>
                    <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>กิจการของคุณ</div>
                    {/* Company 1 — active */}
                    <button onClick={() => { setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors flex items-center gap-3 cursor-pointer">
                      <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ background: "#7C3AED" }}>PC</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate" style={{ color: TEXT }}>Payo Coffee Roaster</div>
                        <div className="text-[11px]" style={{ color: MUTED }}>กำลังใช้งาน</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </button>
                    {/* Company 2 */}
                    <button onClick={() => { setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors flex items-center gap-3 cursor-pointer">
                      <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ background: "#059669" }}>JB</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate" style={{ color: TEXT }}>จูน เบเกอร์มาร์ท</div>
                        <div className="text-[11px] flex items-center gap-1" style={{ color: OR }}>
                          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: OR }}></span>
                          3 การแจ้งเตือน
                        </div>
                      </div>
                    </button>
                    {/* ดูกิจการทั้งหมด */}
                    <button onClick={() => { setProfileOpen(false); setCompanyModalOpen(true); setCompanySearch(""); }}
                      className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-indigo-50 transition-colors flex items-center gap-3 cursor-pointer"
                      style={{ color: OR }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                      ดูกิจการทั้งหมด
                    </button>
                  </div>
                  {/* ออกจากระบบ */}
                  <div>
                    <button onClick={() => { setProfileOpen(false); window.location.href = "/"; }}
                      className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-red-50 transition-colors flex items-center gap-3 cursor-pointer"
                      style={{ color: "#E53935" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════ MODULE NAVIGATION BAR ══════ */}
        <ModuleNavBar
          modules={MODULES}
          activeModule={activeModule}
          openDropdown={openDropdown}
          onDropdownToggle={(id) => setOpenDropdown(openDropdown === id ? null : id)}
          onDropdownClose={() => setOpenDropdown(null)}
          onModuleNav={handleModuleNav}
        />

        {/* ══════ BREADCRUMB ══════ */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="px-5 py-2.5 text-xs flex items-center gap-2" style={{ color: MUTED }}>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span style={{ color: "#ccc" }}>&#x203A;</span>}
                <span style={{ color: i === breadcrumb.length - 1 ? TEXT : OR, fontWeight: i === breadcrumb.length - 1 ? 500 : 400, cursor: i < breadcrumb.length - 1 ? "pointer" : "default" }}>{item}</span>
              </span>
            ))}
          </div>
        )}

        {/* ══════ CONTENT ══════ */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Click-away overlay for dropdowns */}
      {(branchOpen || langOpen || openDropdown || profileOpen) && (
        <div className="fixed inset-0 z-[35]" onClick={() => { setBranchOpen(false); setLangOpen(false); setOpenDropdown(null); setProfileOpen(false); }} />
      )}

      {/* ══════ COMPANY SWITCH MODAL ══════ */}
      {companyModalOpen && (() => {
        const allCompanies = [
          { id: "c1", name: "Payo Coffee Roaster", initials: "PC", color: "#7C3AED", notifications: 0, active: true },
          { id: "c2", name: "จูน เบเกอร์มาร์ท วัตถุดิบ อุปกรณ์ เบเกอรี่ เครื่องดื่ม", initials: "JB", color: "#059669", notifications: 3 },
          { id: "c3", name: "Sct Farm ไม่ใช่แค่ปลูก แต่เราสร้างอนาคต", initials: "SF", color: "#D97706", notifications: 11 },
          { id: "c4", name: "SCT-Siam Coffee Trade ซื้อ-ขายสารกาแฟไทย ไปไกลทั่วโลก", initials: "SC", color: "#DC2626", notifications: 10 },
          { id: "c5", name: "สภาอุตสาหกรรมท่องเที่ยวจังหวัดพะเยา", initials: "สท", color: "#0891B2", notifications: 2 },
        ];
        const filtered = allCompanies.filter(c => {
          if (!companySearch) return true;
          return c.name.toLowerCase().includes(companySearch.toLowerCase());
        });
        return (
          <>
            <div className="fixed inset-0 bg-black/50 z-[300]" onClick={() => setCompanyModalOpen(false)} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[310] bg-white rounded-2xl shadow-2xl w-[420px] max-h-[80vh] flex flex-col overflow-hidden"
              style={{ border: "1px solid #E0E0E0" }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F0F0F0" }}>
                <div className="text-[16px] font-semibold" style={{ color: TEXT }}>กิจการของคุณ</div>
                <button onClick={() => setCompanyModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              {/* Search */}
              <div className="px-5 py-3" style={{ borderBottom: "1px solid #F0F0F0" }}>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <input
                    type="text"
                    placeholder="ค้นหากิจการ..."
                    value={companySearch}
                    onChange={e => setCompanySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-[13px] outline-none transition-colors"
                    style={{ background: "#F4F4F4", border: "1px solid #E0E0E0", color: TEXT }}
                    onFocus={e => { e.currentTarget.style.borderColor = OR; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#E0E0E0"; }}
                  />
                </div>
              </div>
              {/* Company list */}
              <div className="flex-1 overflow-auto py-1">
                {filtered.length === 0 && (
                  <div className="px-5 py-8 text-center text-[13px]" style={{ color: MUTED }}>ไม่พบกิจการที่ค้นหา</div>
                )}
                {filtered.map(c => (
                  <button key={c.id} onClick={() => { setCompanyModalOpen(false); }}
                    className="w-full text-left px-5 py-3 hover:bg-indigo-50 transition-colors flex items-center gap-3 cursor-pointer"
                    style={{ borderBottom: "1px solid #FAFAFA" }}>
                    <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ background: c.color }}>{c.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate" style={{ color: TEXT }}>{c.name}</div>
                      {c.notifications > 0 && (
                        <div className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: OR }}>
                          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: OR }}></span>
                          {c.notifications} การแจ้งเตือน
                        </div>
                      )}
                      {c.active && (
                        <div className="text-[11px] mt-0.5" style={{ color: MUTED }}>กำลังใช้งาน</div>
                      )}
                    </div>
                    {c.active && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      })()}

      {/* ══════ SCREEN INDEX SIDE PANEL ══════ */}
      {screenIndexOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[200]" onClick={() => setScreenIndexOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-[320px] bg-[#12121f] z-[210] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #2a2a3e" }}>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">Jigsaw ERP &mdash; Prototype</div>
                <div className="text-[10px] text-white/40 mt-1">ออกแบบแล้ว {totalScreens} หน้าจอ</div>
              </div>
              <button onClick={() => setScreenIndexOpen(false)} className="text-white/50 hover:text-white text-lg p-1">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {screenIndex.map((group) => {
                const isCollapsed = collapsedGroups[group.group] ?? false;
                return (
                  <div key={group.group}>
                    <button
                      onClick={() => setCollapsedGroups((prev) => ({ ...prev, [group.group]: !isCollapsed }))}
                      className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className="text-[10px] text-white/40 transition-transform" style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}>&#x25BC;</span>
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: group.color }} />
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider flex-1 text-left">{group.group}</span>
                      <span className="text-[9px] text-white/30">{group.items.length} หน้า</span>
                    </button>
                    {!isCollapsed && group.items.map((item, i) => (
                      <button key={i} onClick={() => { router.push(item.path); setScreenIndexOpen(false); }}
                        className="w-full text-left px-4 py-2 pl-10 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <span className="text-[10px] font-mono w-5 text-white/30">{String(i + 1).padStart(2, "0")}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid #2a2a3e" }}>
              <button onClick={() => { router.push("/"); setScreenIndexOpen(false); }}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                &larr; กลับหน้าเลือกระบบ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
