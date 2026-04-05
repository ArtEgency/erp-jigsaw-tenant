"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box } from "@mui/material";
import { useLocale } from "@/lib/locale";

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
import { TENANT_PRIMARY as OR, TENANT_LIGHT as OR_L, BORDER, TEXT, MUTED, BG } from "@/lib/theme";

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

/* Module nav icons — from Figma SVG files */
const MenuIcon = ({ name }: { name: string }) => (
  <img src={`/icons/menu/${name}.svg`} alt={name} width={32} height={32} style={{ borderRadius: 6 }} />
);

const MIconTask = () => <MenuIcon name="my-tasks" />;
const MIconProduct = () => <MenuIcon name="products" />;
const MIconCart = () => <MenuIcon name="purchase" />;
const MIconWarehouse = () => <MenuIcon name="warehouse" />;
const MIconContacts = () => <MenuIcon name="contacts" />;
const MIconSale = () => <MenuIcon name="sales" />;
const MIconFinance = () => <MenuIcon name="finance" />;
const MIconFactory = () => <MenuIcon name="manufacturing" />;
const MIconHR = () => <MenuIcon name="hr" />;
const MIconReport = () => <MenuIcon name="reports" />;
const MIconAnalytics = () => <MenuIcon name="analytics" />;
const MIconGear = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
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

/* ── Enabled modules ── */
const ENABLED_MODULES = new Set([
  "hr", "settings", "products",
  "products-list",
  "hr-employee", "hr-role-list", "hr-assign-permission", "hr-permissions",
  "settings-business", "settings-business-info", "settings-business-branch",
  "settings-product", "settings-product-type", "settings-product-unit",
  "settings-product-pack", "settings-product-dim", "settings-product-weight",
  "settings-product-brand", "settings-product-import",
  "settings-warehouse", "settings-warehouse-config",
]);

/* ── Route map ── */
const getModuleRoutes = (slug: string): Record<string, string> => ({
  "products-list": `/${slug}/product`,
  "hr-employee": `/${slug}/employee`,
  "hr-role-list": `/${slug}/role-permission`,
  "hr-assign-permission": `/${slug}/assign-permission`,
  "settings-business-info": `/${slug}/settings/business`,
  "settings-business-branch": `/${slug}/settings/business?tab=branches`,
  "settings-warehouse-config": `/${slug}/settings/warehouse`,
  "settings-product-type": `/${slug}/settings/product?tab=product-type`,
  "settings-product-unit": `/${slug}/settings/product?tab=unit`,
  "settings-product-pack": `/${slug}/settings/product?tab=pack-size`,
  "settings-product-dim": `/${slug}/settings/product?tab=dimension`,
  "settings-product-weight": `/${slug}/settings/product?tab=weight`,
  "settings-product-brand": `/${slug}/settings/product?tab=brand`,
  "settings-product-import": `/${slug}/settings/product?tab=import`,
});

/* ── Side bar items ── */
const SIDEBAR_ITEMS = [
  { icon: <IconHome />, label: "หน้าหลัก", path: "/_SLUG_" },
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
   Fixed Dropdown Menu
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
    if (left + rect.width > vw - 8) {
      left = Math.max(8, vw - rect.width - 8);
    }
    setPos({ left, top: anchorRect.bottom });
  }, [anchorRect]);

  return (
    <Box
      ref={menuRef}
      sx={{ position: "fixed", bgcolor: "white", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, boxShadow: 6, border: `1px solid ${BORDER}`, minWidth: 200, zIndex: 100, left: pos.left, top: pos.top }}
    >
      {items.map((child) => {
        const hasSub = child.children && child.children.length > 0;
        const childEnabled = ENABLED_MODULES.has(child.id);
        return (
          <Box key={child.id} sx={{ position: "relative" }}
            onMouseEnter={() => hasSub && childEnabled && setHoveredSub(child.id)}
            onMouseLeave={() => setHoveredSub(null)}
          >
            <Box
              component="button"
              disabled={!childEnabled}
              onClick={() => { if (!hasSub && childEnabled) onSelect(child.id); }}
              sx={{
                width: "100%", textAlign: "left", px: 2, py: 1.25, fontSize: 14, transition: "all 150ms",
                display: "flex", alignItems: "center", justifyContent: "space-between", border: "none",
                color: !childEnabled ? "#C8C8C8" : hoveredSub === child.id ? OR : TEXT,
                bgcolor: hoveredSub === child.id && childEnabled ? OR_L : "transparent",
                borderBottom: "1px solid #f0f0f0",
                cursor: !childEnabled ? "default" : "pointer",
              }}
            >
              <span>{child.label}</span>
              {hasSub && <Box component="span" sx={{ fontSize: 12, color: childEnabled ? "#aaa" : "#D8D8D8" }}>&#x203A;</Box>}
            </Box>
            {hasSub && hoveredSub === child.id && childEnabled && (
              <Box
                sx={{
                  position: "absolute", left: "100%", top: 0, bgcolor: "white", borderRadius: 2,
                  boxShadow: 6, border: `1px solid ${BORDER}`, minWidth: 200, zIndex: 110,
                  ...(pos.left + 400 > (typeof window !== "undefined" ? window.innerWidth : 1200) ? { left: "auto", right: "100%" } : {}),
                }}
              >
                {child.children!.map((sub) => {
                  const subEnabled = ENABLED_MODULES.has(sub.id);
                  return (
                    <Box
                      key={sub.id} component="button" disabled={!subEnabled}
                      onClick={() => { if (subEnabled) onSelect(sub.id); }}
                      sx={{
                        width: "100%", textAlign: "left", px: 2, py: 1.25, fontSize: 14, transition: "all 150ms",
                        color: subEnabled ? TEXT : "#C8C8C8", borderBottom: "1px solid #f0f0f0",
                        cursor: subEnabled ? "pointer" : "default", border: "none", bgcolor: "transparent",
                        "&:hover": subEnabled ? { bgcolor: OR_L, color: OR } : {},
                      }}
                    >
                      {sub.label}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ModuleNavBar
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
    <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, bgcolor: "white", position: "relative", zIndex: 40, borderBottom: `1px solid ${BORDER}` }}>
      {showLeft && (
        <Box
          component="button" onClick={() => scroll("left")}
          sx={{ width: 32, height: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "none", cursor: "pointer", bgcolor: "transparent", color: OR, borderRight: `1px solid ${BORDER}`, "&:hover": { bgcolor: "#f5f5f5" } }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </Box>
      )}

      <Box ref={scrollRef} sx={{ flex: 1, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {modules.map((mod) => {
            const isActive = activeModule === mod.id;
            const hasChildren = mod.children && mod.children.length > 0;
            const isDropOpen = openDropdown === mod.id;
            const isEnabled = ENABLED_MODULES.has(mod.id);

            return (
              <Box
                key={mod.id} component="button"
                ref={(el: HTMLButtonElement | null) => { btnRefs.current[mod.id] = el; }}
                disabled={!isEnabled}
                onClick={() => {
                  if (!isEnabled) return;
                  if (hasChildren) { onDropdownToggle(mod.id); }
                  else { onDropdownClose(); onModuleNav(mod.id); }
                }}
                sx={{
                  display: "flex", alignItems: "center", gap: 1, px: 2, height: 48,
                  whiteSpace: "nowrap", transition: "all 150ms", position: "relative", flexShrink: 0,
                  border: "none", fontFamily: "'Sarabun', sans-serif", fontSize: 16, fontWeight: 500,
                  color: !isEnabled ? "#C8C8C8" : isActive || isDropOpen ? OR : MUTED,
                  bgcolor: isActive ? OR_L : isDropOpen ? "#fafafa" : "transparent",
                  cursor: !isEnabled ? "default" : "pointer",
                  opacity: !isEnabled ? 0.6 : 1,
                  "&:hover": isEnabled ? { bgcolor: isActive ? OR_L : "#fafafa", color: OR } : {},
                }}
              >
                <Box component="span" sx={{ color: !isEnabled ? "#C8C8C8" : isActive || isDropOpen ? OR : MUTED, display: "flex", alignItems: "center" }}>{mod.icon}</Box>
                <span>{mod.label}</span>
                {hasChildren && (
                  <svg width={10} height={6} viewBox="0 0 10 6" fill="none" style={{ marginLeft: 2 }}>
                    <path d="M1 1l4 4 4-4" stroke={!isEnabled ? "#C8C8C8" : isActive || isDropOpen ? OR : "#aaa"} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {isActive && <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2.5, borderTopLeftRadius: 4, borderTopRightRadius: 4, bgcolor: OR }} />}
              </Box>
            );
          })}
        </Box>
      </Box>

      {showRight && (
        <Box
          component="button" onClick={() => scroll("right")}
          sx={{ width: 32, height: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "none", cursor: "pointer", color: OR, bgcolor: OR_L, borderLeft: `1px solid ${BORDER}`, "&:hover": { bgcolor: OR_L } }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </Box>
      )}

      {activeDropdownMod && activeDropdownMod.children && dropdownAnchor && (
        <FixedDropdownMenu
          items={activeDropdownMod.children}
          anchorRect={dropdownAnchor}
          onSelect={(id) => { onDropdownClose(); onModuleNav(id); }}
        />
      )}
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TenantShell Component
   ═══════════════════════════════════════════════════════════════ */
export default function TenantShell({ children, breadcrumb, activeModule, onModuleClick }: Props) {
  const router = useRouter();
  const params = useParams();
  const slug = (params.slug as string) || "";
  const MODULE_ROUTES = getModuleRoutes(slug);
  const { locale: lang, setLocale: setLang, t } = useLocale();
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [branchOpen, setBranchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleModuleNav = (id: string) => {
    if (MODULE_ROUTES[id]) { router.push(MODULE_ROUTES[id]); }
    else if (onModuleClick) { onModuleClick(id); }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: BG, fontFamily: "'Sarabun', sans-serif" }}>

      {/* LEFT SIDEBAR */}
      <Box sx={{ flexShrink: 0, display: "flex", transition: "width 300ms", width: sidebarExpanded ? 260 : 68, borderRight: `1px solid ${BORDER}` }}>
        <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", py: 1.5, gap: 0.5, zIndex: 50, transition: "width 300ms", width: sidebarExpanded ? "100%" : 68, bgcolor: "#FFFFFF" }}>
          {/* JIGSAW logo */}
          <Box
            component="button" onClick={() => router.push("/")}
            sx={{ width: 44, height: 44, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", mb: 1, border: "none", cursor: "pointer", bgcolor: OR, "&:hover": { opacity: 0.8 } }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity={0.7} />
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity={0.7} />
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity={0.5} />
            </svg>
          </Box>

          {SIDEBAR_ITEMS.map((item, i) => {
            const hasPath = !!item.path;
            return (
              <Box
                key={i} component="button" disabled={!hasPath}
                onClick={() => hasPath ? router.push(item.path.replace("_SLUG_", slug)) : undefined}
                sx={{
                  borderRadius: 2, display: "flex", alignItems: "center", transition: "all 150ms",
                  border: "none",
                  ...(sidebarExpanded
                    ? { width: "100%", px: 1.5, py: 1, gap: 1.5 }
                    : { width: 36, height: 36, justifyContent: "center" }),
                  color: hasPath ? (i === 0 ? OR : MUTED) : "#D0D0D0",
                  cursor: hasPath ? "pointer" : "default",
                  opacity: hasPath ? 1 : 0.5,
                  bgcolor: "transparent",
                  "&:hover": hasPath ? { bgcolor: OR_L, color: OR } : {},
                }}
                title={item.label}
              >
                {item.icon}
                {sidebarExpanded && <Box component="span" sx={{ fontSize: 14, fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden" }}>{item.label}</Box>}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* MAIN AREA */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* TOP BAR */}
        <Box sx={{ height: 52, display: "flex", alignItems: "center", px: 2, gap: 1.5, flexShrink: 0, position: "relative", zIndex: 50, bgcolor: OR }}>
          <Box component="button" onClick={() => setSidebarExpanded(prev => !prev)} sx={{ color: "white", border: "none", cursor: "pointer", bgcolor: "transparent", borderRadius: 2, p: 0.75, "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
            <IconHamburger />
          </Box>

          {/* Branch Selector */}
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", gap: 1 }}>
            <Box component="span" sx={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500 }}>{t("shell.branch")} :</Box>
            <Box
              component="button"
              onClick={() => { setBranchOpen(!branchOpen); setLangOpen(false); }}
              sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.75, borderRadius: 1, fontSize: 14, fontWeight: 500, bgcolor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "white", cursor: "pointer" }}
            >
              <span>{selectedBranch.name}</span>
              <svg width={10} height={6} viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Box>
            {branchOpen && (
              <Box sx={{ position: "absolute", top: "100%", left: 0, mt: 0.5, bgcolor: "white", borderRadius: 2, boxShadow: 6, border: `1px solid ${BORDER}`, minWidth: 220, zIndex: 100, overflow: "hidden" }}>
                {BRANCHES.map((b) => (
                  <Box
                    key={b.code} component="button"
                    onClick={() => { setSelectedBranch(b); setBranchOpen(false); }}
                    sx={{
                      width: "100%", textAlign: "left", px: 2, py: 1.5, fontSize: 14, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 1, bgcolor: "transparent",
                      color: selectedBranch.code === b.code ? OR : TEXT,
                      fontWeight: selectedBranch.code === b.code ? 600 : 400,
                      borderBottom: `1px solid ${BORDER}`,
                      "&:hover": { bgcolor: "#f0f0ff" },
                    }}
                  >
                    {b.name}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* System name */}
          <Box sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14, flex: 1 }}>SYSTEM NAME HERE</Box>

          {/* Right icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {/* Onboarding */}
            <Box
              component="button" onClick={() => router.push(`/${slug}/setup-wizard`)}
              sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1.5, py: 0.5, borderRadius: 1, fontSize: 12, fontWeight: 700, bgcolor: "white", color: "#565DFF", border: "none", cursor: "pointer", "&:hover": { opacity: 0.9 } }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>{t("shell.onboarding")}</span>
            </Box>
            {/* Mail */}
            <Box component="button" sx={{ color: "white", border: "none", cursor: "pointer", bgcolor: "transparent", borderRadius: 2, p: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
              <IconMail />
            </Box>
            {/* Notification */}
            <Box component="button" sx={{ color: "white", border: "none", cursor: "pointer", bgcolor: "transparent", borderRadius: 2, p: 1, position: "relative", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
              <IconBell />
              <Box component="span" sx={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, bgcolor: "#E53935", borderRadius: "50%", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, lineHeight: 1 }}>3</Box>
            </Box>
            {/* Refresh */}
            <Box component="button" sx={{ color: "white", border: "none", cursor: "pointer", bgcolor: "transparent", borderRadius: 2, p: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
              <IconRefresh />
            </Box>
            {/* Grid */}
            <Box component="button" sx={{ color: "white", border: "none", cursor: "pointer", bgcolor: "transparent", borderRadius: 2, p: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
              <IconGrid />
            </Box>

            {/* Language Switcher */}
            <Box sx={{ position: "relative" }}>
              <Box
                component="button"
                onClick={() => { setLangOpen(!langOpen); setBranchOpen(false); }}
                sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.75, borderRadius: 1, fontSize: 14, fontWeight: 600, color: "white", border: "none", cursor: "pointer", bgcolor: "transparent", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
              >
                {lang === "th" ? "TH" : "EN"}
                <svg width={10} height={6} viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Box>
              {langOpen && (
                <Box sx={{ position: "absolute", top: "100%", right: 0, mt: 0.5, bgcolor: "white", borderRadius: 2, boxShadow: 6, border: `1px solid ${BORDER}`, minWidth: 140, zIndex: 100, overflow: "hidden" }}>
                  <Box component="button" onClick={() => { setLang("th"); setLangOpen(false); }}
                    sx={{ width: "100%", textAlign: "left", px: 2, py: 1.25, fontSize: 14, border: "none", cursor: "pointer", bgcolor: "transparent", color: lang === "th" ? OR : TEXT, fontWeight: lang === "th" ? 600 : 400, borderBottom: `1px solid ${BORDER}`, "&:hover": { bgcolor: "#f0f0ff" } }}>
                    TH Thai
                  </Box>
                  <Box component="button" onClick={() => { setLang("en"); setLangOpen(false); }}
                    sx={{ width: "100%", textAlign: "left", px: 2, py: 1.25, fontSize: 14, border: "none", cursor: "pointer", bgcolor: "transparent", color: lang === "en" ? OR : TEXT, fontWeight: lang === "en" ? 600 : 400, "&:hover": { bgcolor: "#f0f0ff" } }}>
                    EN English
                  </Box>
                </Box>
              )}
            </Box>

            {/* User + profile dropdown */}
            <Box sx={{ position: "relative" }}>
              <Box
                component="button"
                onClick={() => { setProfileOpen(!profileOpen); setBranchOpen(false); setLangOpen(false); }}
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 0.5, cursor: "pointer", border: "none", bgcolor: "transparent", borderRadius: 2, px: 1, py: 0.5, "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                <Box component="span" sx={{ color: "white", fontSize: 14, fontWeight: 500, display: { xs: "none", lg: "block" } }}>คลิษา จิตดี</Box>
                <Box sx={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0 }}>
                  <Box sx={{ width: "100%", height: "100%", bgcolor: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>ค</Box>
                </Box>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transition: "transform 200ms", transform: profileOpen ? "rotate(180deg)" : "none" }}>
                  <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Box>
              {profileOpen && (
                <Box sx={{ position: "absolute", right: 0, top: "100%", mt: 1, zIndex: 50, bgcolor: "white", borderRadius: 3, boxShadow: 6, border: "1px solid #E0E0E0", py: 0, minWidth: 280, overflow: "hidden" }}>
                  {/* Profile header */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 2, borderBottom: "1px solid #F0F0F0" }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: `2px solid ${OR}`, flexShrink: 0 }}>
                      <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, bgcolor: "#EEEEFF", color: OR }}>ค</Box>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ fontSize: 14, fontWeight: 600, color: TEXT }}>คลิษา จิตดี</Box>
                      <Box sx={{ fontSize: 11, color: MUTED }}>ผู้ดูแลระบบ</Box>
                    </Box>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  </Box>
                  {/* Profile link */}
                  <Box sx={{ py: 0.5, borderBottom: "1px solid #F0F0F0" }}>
                    <Box component="button" onClick={() => setProfileOpen(false)}
                      sx={{ width: "100%", textAlign: "left", px: 2, py: 1.25, fontSize: 13, border: "none", cursor: "pointer", bgcolor: "transparent", color: TEXT, display: "flex", alignItems: "center", gap: 1.5, "&:hover": { bgcolor: "#f0f0ff" } }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      {t("shell.profile")}
                    </Box>
                  </Box>
                  {/* Company list */}
                  <Box sx={{ py: 0.5, borderBottom: "1px solid #F0F0F0" }}>
                    <Box sx={{ px: 2, pt: 1, pb: 0.5, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: MUTED }}>กิจการของคุณ</Box>
                    {/* Company 1 — active */}
                    <Box component="button" onClick={() => setProfileOpen(false)}
                      sx={{ width: "100%", textAlign: "left", px: 2, py: 1.25, border: "none", cursor: "pointer", bgcolor: "transparent", display: "flex", alignItems: "center", gap: 1.5, "&:hover": { bgcolor: "#f0f0ff" } }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", bgcolor: "#7C3AED" }}>PC</Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: TEXT }}>Payo Coffee Roaster</Box>
                        <Box sx={{ fontSize: 11, color: MUTED }}>กำลังใช้งาน</Box>
                      </Box>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                    </Box>
                    {/* Company 2 */}
                    <Box component="button" onClick={() => setProfileOpen(false)}
                      sx={{ width: "100%", textAlign: "left", px: 2, py: 1.25, border: "none", cursor: "pointer", bgcolor: "transparent", display: "flex", alignItems: "center", gap: 1.5, "&:hover": { bgcolor: "#f0f0ff" } }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", bgcolor: "#059669" }}>JB</Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: TEXT }}>จูน เบเกอร์มาร์ท</Box>
                        <Box sx={{ fontSize: 11, display: "flex", alignItems: "center", gap: 0.5, color: OR }}>
                          <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: OR, display: "inline-block" }} />
                          3 การแจ้งเตือน
                        </Box>
                      </Box>
                    </Box>
                    {/* View all */}
                    <Box component="button" onClick={() => { setProfileOpen(false); setCompanyModalOpen(true); setCompanySearch(""); }}
                      sx={{ width: "100%", textAlign: "left", px: 2, py: 1.25, fontSize: 13, border: "none", cursor: "pointer", bgcolor: "transparent", color: OR, display: "flex", alignItems: "center", gap: 1.5, "&:hover": { bgcolor: "#f0f0ff" } }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                      ดูกิจการทั้งหมด
                    </Box>
                  </Box>
                  {/* Logout */}
                  <Box>
                    <Box component="button" onClick={() => { setProfileOpen(false); window.location.href = "/"; }}
                      sx={{ width: "100%", textAlign: "left", px: 2, py: 1.25, fontSize: 13, border: "none", cursor: "pointer", bgcolor: "transparent", color: "#E53935", display: "flex", alignItems: "center", gap: 1.5, "&:hover": { bgcolor: "#fff5f5" } }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      {t("shell.logout")}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* MODULE NAVIGATION BAR */}
        <ModuleNavBar
          modules={MODULES}
          activeModule={activeModule}
          openDropdown={openDropdown}
          onDropdownToggle={(id) => setOpenDropdown(openDropdown === id ? null : id)}
          onDropdownClose={() => setOpenDropdown(null)}
          onModuleNav={handleModuleNav}
        />

        {/* BREADCRUMB */}
        {breadcrumb && breadcrumb.length > 0 && (
          <Box sx={{ px: 2.5, py: 1.25, fontSize: 12, display: "flex", alignItems: "center", gap: 1, color: MUTED }}>
            {breadcrumb.map((item, i) => (
              <Box key={i} component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {i > 0 && <Box component="span" sx={{ color: "#ccc" }}>&#x203A;</Box>}
                <Box component="span" sx={{ color: i === breadcrumb.length - 1 ? TEXT : OR, fontWeight: i === breadcrumb.length - 1 ? 500 : 400, cursor: i < breadcrumb.length - 1 ? "pointer" : "default" }}>{item}</Box>
              </Box>
            ))}
          </Box>
        )}

        {/* CONTENT */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {children}
        </Box>
      </Box>

      {/* Click-away overlay */}
      {(branchOpen || langOpen || openDropdown || profileOpen) && (
        <Box onClick={() => { setBranchOpen(false); setLangOpen(false); setOpenDropdown(null); setProfileOpen(false); }} sx={{ position: "fixed", inset: 0, zIndex: 35 }} />
      )}

      {/* COMPANY SWITCH MODAL */}
      {companyModalOpen && (() => {
        const allCompanies = [
          { id: "c1", name: "Payo Coffee Roaster", initials: "PC", color: "#7C3AED", notifications: 0, active: true },
          { id: "c2", name: "จูน เบเกอร์มาร์ท วัตถุดิบ อุปกรณ์ เบเกอรี่ เครื่องดื่ม", initials: "JB", color: "#059669", notifications: 3 },
          { id: "c3", name: "Sct Farm ไม่ใช่แค่ปลูก แต่เราสร้างอนาคต", initials: "SF", color: "#D97706", notifications: 11 },
          { id: "c4", name: "SCT-Siam Coffee Trade ซื้อ-ขายสารกาแฟไทย ไปไกลทั่วโลก", initials: "SC", color: "#DC2626", notifications: 10 },
          { id: "c5", name: "สภาอุตสาหกรรมท่องเที่ยวจังหวัดพะเยา", initials: "สท", color: "#0891B2", notifications: 2 },
        ];
        const filtered = allCompanies.filter(c => !companySearch || c.name.toLowerCase().includes(companySearch.toLowerCase()));
        return (
          <>
            <Box onClick={() => setCompanyModalOpen(false)} sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.5)", zIndex: 300 }} />
            <Box sx={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 310, bgcolor: "white", borderRadius: 4, boxShadow: 6, width: 420, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #E0E0E0" }}>
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 2, borderBottom: "1px solid #F0F0F0" }}>
                <Box sx={{ fontSize: 16, fontWeight: 600, color: TEXT }}>กิจการของคุณ</Box>
                <Box component="button" onClick={() => setCompanyModalOpen(false)} sx={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "none", cursor: "pointer", bgcolor: "transparent", "&:hover": { bgcolor: "#f5f5f5" } }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </Box>
              </Box>
              {/* Search */}
              <Box sx={{ px: 2.5, py: 1.5, borderBottom: "1px solid #F0F0F0" }}>
                <Box sx={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <Box
                    component="input" type="text" placeholder="ค้นหากิจการ..."
                    value={companySearch} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanySearch(e.target.value)}
                    sx={{ width: "100%", pl: 5, pr: 2, py: 1.25, borderRadius: 2, fontSize: 13, outline: "none", bgcolor: "#F4F4F4", border: "1px solid #E0E0E0", color: TEXT, "&:focus": { borderColor: OR } }}
                  />
                </Box>
              </Box>
              {/* Company list */}
              <Box sx={{ flex: 1, overflow: "auto", py: 0.5 }}>
                {filtered.length === 0 && (
                  <Box sx={{ px: 2.5, py: 4, textAlign: "center", fontSize: 13, color: MUTED }}>ไม่พบกิจการที่ค้นหา</Box>
                )}
                {filtered.map(c => (
                  <Box key={c.id} component="button" onClick={() => setCompanyModalOpen(false)}
                    sx={{ width: "100%", textAlign: "left", px: 2.5, py: 1.5, border: "none", cursor: "pointer", bgcolor: "transparent", display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid #FAFAFA", "&:hover": { bgcolor: "#f0f0ff" } }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", bgcolor: c.color }}>{c.initials}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: TEXT }}>{c.name}</Box>
                      {c.notifications > 0 && (
                        <Box sx={{ fontSize: 11, display: "flex", alignItems: "center", gap: 0.5, mt: 0.25, color: OR }}>
                          <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: OR, display: "inline-block" }} />
                          {c.notifications} การแจ้งเตือน
                        </Box>
                      )}
                      {c.active && <Box sx={{ fontSize: 11, mt: 0.25, color: MUTED }}>กำลังใช้งาน</Box>}
                    </Box>
                    {c.active && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>}
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        );
      })()}
    </Box>
  );
}
