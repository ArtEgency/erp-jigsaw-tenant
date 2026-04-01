"use client";

import { useState, Suspense, useRef } from "react";
import TenantShell from "@/components/TenantShell";
import {
  TENANT_PRIMARY as OR,
  TENANT_HOVER as OR_D,
  GREEN,
  GREEN_L,
  RED,
  RED_L,
  BORDER,
  TEXT,
  MUTED,
  BG,
} from "@/lib/theme";

/* ══════════════════════════════════════════════════ */
/* ── TYPES ── */
/* ══════════════════════════════════════════════════ */

interface ProductUnit {
  barcode: string;
  unitName: string;
  ratio: number;
  container: string;
  isBuy: boolean;
  isSell: boolean;
  isTransfer: boolean;
  isUMS: boolean;
  isUML: boolean;
}

interface ProductSpec {
  barcode: string;
  unitName: string;
  weight: string;
  weightUnit: string;
  width: string;
  length: string;
  height: string;
  dimUnit: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  barcode: string;
  image: string;
  type: string;
  category: string;
  subCategory: string;
  brand: string;
  packSize: string;
  sellPrice: number;
  sellUnit: string;
  bulkPrice: number;
  bulkUnit: string;
  active: boolean;
  colorTag: string;
}

/* ══════════════════════════════════════════════════ */
/* ── MOCK DATA ── */
/* ══════════════════════════════════════════════════ */

const PRODUCT_TYPES = ["เครื่องสำอาง", "ของใช้ส่วนตัว", "อาหารเสริม", "เวชสำอาง"];
const CATEGORIES = ["เมคอัพปาก", "ดูแลช่องปาก", "ป้องกันแดด", "บำรุงผิว"];
const SUB_CATEGORIES = ["ลิปบาล์ม", "ลิปสติก", "ยาสีฟัน", "ครีมกันแดด", "เจล"];
const BRANDS = ["Srichand", "ฟลูโอคารีล", "บู๊ทส์", "นีเวีย", "มิสทีน"];
const UNITS = ["ชิ้น", "แผง", "กล่อง", "ลัง", "โหล"];
const WEIGHT_UNITS = ["กรัม", "กิโลกรัม", "มิลลิลิตร", "ลิตร"];
const DIM_UNITS = ["CM", "MM", "IN"];
const SUPPLIERS = [
  "GC450055487 บริษัท เอเอฟซ์ อีแอล จำกัด (สำนักงานใหญ่) - 00000",
  "GC450055488 บริษัท ไทยนครพัฒนา จำกัด - 00001",
];

const mockProducts: Product[] = [
  {
    id: "1", code: "SK12653", name: "ศรีจันทร์ เดย์ ทู ไกลว์ ไฮเดรติ้ง ลิป 2.5ก. 01 พริตตี้", barcode: "8854815084858, 8854815084859",
    image: "", type: "เครื่องสำอาง", category: "เมคอัพปาก", subCategory: "ลิปบาล์ม", brand: "Srichand",
    packSize: "40 กรัม", sellPrice: 40.00, sellUnit: "ชิ้น", bulkPrice: 3500.00, bulkUnit: "ลัง",
    active: true, colorTag: "#E8913A",
  },
  {
    id: "2", code: "SK12653", name: "ฟลูโอคารีล สเปร์ระงับกลิ่นปาก เฟรชมิ้นท์ 15 มล.", barcode: "8854815084858, 8854815084859",
    image: "", type: "ของใช้ส่วนตัว", category: "ดูแลช่องปาก", subCategory: "", brand: "ฟลูโอคารีล",
    packSize: "-", sellPrice: 149.00, sellUnit: "ชิ้น", bulkPrice: 0, bulkUnit: "",
    active: true, colorTag: "#3B82F6",
  },
  {
    id: "3", code: "1086584", name: "บู๊ทส์ อโลเวร่า ซูทติ้ง แอนด์ มอยเจอร์ไรซิ่ง เจล 300 กรัม", barcode: "5000167386646",
    image: "", type: "อาหารเสริม", category: "ป้องกันแดด", subCategory: "เจล", brand: "บู๊ทส์",
    packSize: "300 กรัม", sellPrice: 159.00, sellUnit: "ชิ้น", bulkPrice: 0, bulkUnit: "",
    active: true, colorTag: "#10B981",
  },
];

/* ══════════════════════════════════════════════════ */
/* ── REUSABLE COMPONENTS ── */
/* ══════════════════════════════════════════════════ */

const SubTabs = ({ active, tabs, onTab }: { active: string; tabs: { id: string; label: string }[]; onTab: (id: string) => void }) => (
  <div className="flex items-center gap-6 mb-5">
    {tabs.map((t) => (
      <button key={t.id} onClick={() => onTab(t.id)}
        className="px-4 py-2.5 rounded-lg text-base font-semibold transition-colors"
        style={{ background: active === t.id ? OR : "transparent", color: active === t.id ? "white" : MUTED }}>
        {t.label}
      </button>
    ))}
  </div>
);

const Field = ({ label, value, onChange, required, disabled, type = "text", placeholder, className }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; disabled?: boolean; type?: string; placeholder?: string; className?: string;
}) => (
  <div className={`field-group ${className || ""}`}>
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} placeholder={placeholder || " "} />
    <label>{label}{required && <span className="text-[#E53935] ml-0.5">*</span>}</label>
  </div>
);

const Select = ({ label, value, onChange, options, required, disabled }: {
  label: string; value: string; onChange?: (v: string) => void; options: string[]; required?: boolean; disabled?: boolean;
}) => (
  <div className="field-group">
    <select value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} style={{ appearance: "none", background: "transparent" }}>
      <option value="">เลือก...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    <label>{label}{required && <span className="text-[#E53935] ml-0.5">*</span>}</label>
  </div>
);

const Section = ({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg border mb-4" style={{ borderColor: BORDER }}>
    <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-3 text-left">
      <span className="font-bold text-base" style={{ color: OR }}>{title}</span>
      <span className="text-lg" style={{ color: MUTED }}>{open ? "\u25B2" : "\u25BC"}</span>
    </button>
    {open && <div className="px-5 pb-5 border-t" style={{ borderColor: BORDER }}>{children}</div>}
  </div>
);

/* ── Product Type Modal ── */
const ProductTypeModal = ({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (type: "general" | "variant" | "service") => void }) => {
  if (!open) return null;
  const types = [
    { id: "general" as const, title: "สินค้าทั่วไป", desc: "(สามารถสร้างหลายหน่วยอัตราส่วนได้)\nเช่น ชิ้น, โหล, ลัง", example: "เช่น 1 ลัง = 4 ขวด", color: "#E8913A", icon: "\uD83D\uDCE6" },
    { id: "variant" as const, title: "สินค้าหลายตัวเลือก", desc: "(สินค้าที่มีตัวเลือก สี, SIZE, ขนาด)", example: "", color: "#3B82F6", icon: "\uD83D\uDC55" },
    { id: "service" as const, title: "สินค้าบริการ", desc: "สินค้าประเภทให้บริการ\nหรือสินค้าไม่ควบคุมสต็อก", example: "NO STOCK", color: "#10B981", icon: "\uD83D\uDCE4" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-[700px] max-w-[95vw] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BORDER }}>
          <h2 className="text-lg font-bold" style={{ color: TEXT }}>เลือกรูปแบบสินค้า</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-lg" style={{ color: MUTED }}>&times;</button>
        </div>
        {/* Body */}
        <div className="p-6 flex gap-4">
          {types.map((t) => (
            <button key={t.id} onClick={() => onSelect(t.id)}
              className="flex-1 rounded-xl border-2 p-5 flex flex-col items-center text-center transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ borderColor: t.color + "40" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.color + "40"; }}>
              <div className="text-4xl mb-3">{t.icon}</div>
              <div className="font-bold text-base mb-1" style={{ color: t.color }}>{t.title}</div>
              {t.example && <div className="text-xs mb-2" style={{ color: t.color }}>{t.example}</div>}
              <div className="text-xs whitespace-pre-line" style={{ color: t.color }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════════════════ */

function ProductInner() {
  /* ── screen state ── */
  const [screen, setScreen] = useState<"list" | "add">("list");
  const [tab, setTab] = useState("all");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterAll, setFilterAll] = useState("");
  const [search, setSearch] = useState("");

  /* ── add form state ── */
  const [sections, setSections] = useState({
    general: true, product: true, pricing: true, units: true, spec: true, images: true, history: true,
  });
  const toggleSection = (s: keyof typeof sections) => setSections((p) => ({ ...p, [s]: !p[s] }));

  // ข้อมูลทั่วไป
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [nameEN, setNameEN] = useState("");
  const [nameTH, setNameTH] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierCode, setSupplierCode] = useState("");
  const [supplierProductName, setSupplierProductName] = useState("");

  // ข้อมูลสินค้า
  const [prodType, setProdType] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  // กำหนดราคา
  const [costPrice, setCostPrice] = useState("");
  const [sellPriceVal, setSellPriceVal] = useState("");

  // ตั้งค่าเพิ่มเติม — multi-unit
  const [units, setUnits] = useState<ProductUnit[]>([
    { barcode: "", unitName: "แผง", ratio: 1, container: "1x10", isBuy: true, isSell: false, isTransfer: false, isUMS: false, isUML: false },
    { barcode: "", unitName: "ลัง", ratio: 10, container: "1x10", isBuy: false, isSell: true, isTransfer: false, isUMS: true, isUML: false },
    { barcode: "", unitName: "กล่อง", ratio: 10, container: "1x10", isBuy: false, isSell: false, isTransfer: true, isUMS: false, isUML: true },
  ]);

  // ข้อมูลจำเพาะ
  const [packWeight, setPackWeight] = useState("60");
  const [packWeightUnit, setPackWeightUnit] = useState("กรัม");
  const [specs, setSpecs] = useState<ProductSpec[]>([
    { barcode: "", unitName: "แผง", weight: "-", weightUnit: "กรัม", width: "-", length: "-", height: "-", dimUnit: "CM" },
    { barcode: "", unitName: "ลัง", weight: "-", weightUnit: "กรัม", width: "-", length: "-", height: "-", dimUnit: "CM" },
    { barcode: "", unitName: "กล่อง", weight: "-", weightUnit: "กรัม", width: "-", length: "-", height: "-", dimUnit: "CM" },
  ]);

  // สถานะ sidebar
  const [showOnShelf, setShowOnShelf] = useState(true);
  const [showInStock, setShowInStock] = useState(true);

  // toast
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err" = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  // ref for file input
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── section completion for sidebar ── */
  const sectionStatus = {
    general: !!(sku && barcode && nameTH),
    product: !!(prodType && mainCategory),
    pricing: !!(sellPriceVal),
    spec: true,
    images: false,
  };

  /* ── filter products ── */
  const filtered = mockProducts.filter((p) => {
    if (tab === "all" && !p.active) return false;
    if (tab === "cancelled" && p.active) return false;
    if (filterType && p.type !== filterType) return false;
    if (search) {
      const s = search.toLowerCase();
      return p.code.toLowerCase().includes(s) || p.name.toLowerCase().includes(s) || p.barcode.toLowerCase().includes(s);
    }
    return true;
  });

  /* ── breadcrumb ── */
  const breadcrumb = screen === "list"
    ? ["สินค้า", "จัดการสินค้า"]
    : ["สินค้า", "จัดการสินค้า", "สินค้า"];

  /* ── handle save ── */
  const handleSave = () => {
    if (!sku || !barcode || !nameTH || !prodType) {
      showToast("กรุณากรอกข้อมูลที่จำเป็นให้ครบ", "err");
      return;
    }
    showToast("บันทึกข้อมูลสินค้าเรียบร้อย");
    setScreen("list");
  };

  /* ── update unit ── */
  const updateUnit = (idx: number, key: keyof ProductUnit, val: string | number | boolean) => {
    setUnits((prev) => prev.map((u, i) => i === idx ? { ...u, [key]: val } : u));
  };

  /* ── update spec ── */
  const updateSpec = (idx: number, key: keyof ProductSpec, val: string) => {
    setSpecs((prev) => prev.map((s, i) => i === idx ? { ...s, [key]: val } : s));
  };

  /* ══════════════════════════════════════ */
  /* ── LIST SCREEN ── */
  /* ══════════════════════════════════════ */
  if (screen === "list") {
    return (
      <TenantShell breadcrumb={breadcrumb} activeModule="products">
        {toast && (
          <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium"
            style={{ background: toast.type === "ok" ? GREEN_L : RED_L, color: toast.type === "ok" ? GREEN : RED, border: `1px solid ${toast.type === "ok" ? GREEN : RED}33` }}>
            {toast.msg}
          </div>
        )}

        <ProductTypeModal open={showTypeModal} onClose={() => setShowTypeModal(false)}
          onSelect={(type) => { setShowTypeModal(false); if (type === "general") setScreen("add"); }} />

        <div className="flex justify-center items-start w-full min-h-full" style={{ background: BG }}>
          <div className="w-full max-w-[1920px] px-6 py-6">

            <h1 className="text-xl font-bold mb-1" style={{ color: TEXT }}>จัดการสินค้า</h1>

            {/* Sub-tabs */}
            <SubTabs active={tab} tabs={[
              { id: "all", label: "สินค้าทั้งหมด" },
              { id: "cancelled", label: "สินค้ายกเลิกขาย" },
            ]} onTab={setTab} />

            {/* Content Card */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: "0 2px 10px 0 rgba(76,78,100,0.22)" }}>

              {/* Toolbar / Filter */}
              <div className="flex flex-wrap items-center gap-4 p-5">
                {/* Export */}
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                  style={{ background: OR }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  EXPORT
                </button>

                {/* Filter: ประเภทสินค้า */}
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: "#B8B8C2", color: TEXT, minWidth: 160 }}>
                  <option value="">ประเภทสินค้า</option>
                  {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* Filter: ทั้งหมด */}
                <select value={filterAll} onChange={(e) => setFilterAll(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: "#B8B8C2", color: TEXT, minWidth: 120 }}>
                  <option value="">ทั้งหมด</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <div className="flex-1" />

                {/* Search */}
                <div className="relative">
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาชื่อสินค้า / รหัสสินค้า / บาร์โค้ด"
                    className="pl-3 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: "rgba(76,78,100,0.22)", width: 300 }} />
                </div>

                {/* Add button */}
                <button onClick={() => setShowTypeModal(true)}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors shadow"
                  style={{ background: OR, boxShadow: "0 4px 8px -4px rgba(76,78,100,0.42)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                  เพิ่มสินค้า
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ color: TEXT }}>
                  <thead>
                    <tr style={{ background: "#F5F5F7" }}>
                      {["รหัสสินค้า", "รูปภาพ", "ชื่อรายการ", "ประเภทสินค้า", "หมวดหมู่", "แบรนด์", "ขนาดบรรจุ", "ราคาขาย", "จัดการ"].map((h, i) => (
                        <th key={h} className="px-5 py-3.5 text-left font-medium text-[15px] whitespace-nowrap" style={{ color: "#374151", borderBottom: `1px solid #F5F5F7`, borderTop: `1px solid #F5F5F7` }}>
                          <div className="flex items-center gap-2">
                            {h}
                            {i < 8 && <div className="w-[2px] h-[14px] ml-auto" style={{ background: "rgba(76,78,100,0.12)" }} />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={9} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูลสินค้า</td></tr>
                    ) : filtered.map((prod) => (
                      <tr key={prod.id} className="hover:bg-indigo-50/50 transition-colors" style={{ borderBottom: `1px solid rgba(76,78,100,0.12)` }}>
                        {/* รหัสสินค้า with color tag */}
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-[4px] h-[40px] rounded-full" style={{ background: prod.colorTag }} />
                            <span className="text-sm cursor-pointer flex items-center gap-1" style={{ color: OR }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill={OR} stroke="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="2"/><line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="2"/></svg>
                              {prod.code}
                            </span>
                          </div>
                        </td>
                        {/* รูปภาพ */}
                        <td className="px-5 py-3">
                          <div className="w-[50px] h-[50px] rounded-md bg-gray-100 flex items-center justify-center text-xs" style={{ color: MUTED }}>
                            {prod.image ? <img src={prod.image} alt="" className="w-full h-full object-cover rounded-md" /> : "No img"}
                          </div>
                        </td>
                        {/* ชื่อรายการ */}
                        <td className="px-5 py-3 max-w-[300px]">
                          <div className="text-sm font-normal" style={{ color: "#374151" }}>{prod.name}</div>
                          <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: MUTED }}>
                            Barcode : {prod.barcode}
                            <button className="ml-1 opacity-50 hover:opacity-100">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                          </div>
                        </td>
                        {/* ประเภทสินค้า */}
                        <td className="px-5 py-3 text-sm" style={{ color: "#374151" }}>{prod.type}</td>
                        {/* หมวดหมู่ */}
                        <td className="px-5 py-3">
                          <div className="text-xs" style={{ color: "#374151" }}>{prod.category}</div>
                          <div className="text-sm font-medium" style={{ color: "#374151" }}>{prod.subCategory}</div>
                        </td>
                        {/* แบรนด์ */}
                        <td className="px-5 py-3 text-sm" style={{ color: "#374151" }}>{prod.brand}</td>
                        {/* ขนาดบรรจุ */}
                        <td className="px-5 py-3 text-sm text-center" style={{ color: "#374151" }}>{prod.packSize}</td>
                        {/* ราคาขาย */}
                        <td className="px-5 py-3 text-right">
                          <div className="font-semibold" style={{ color: OR }}>{prod.sellPrice.toFixed(2)} / {prod.sellUnit}</div>
                          {prod.bulkPrice > 0 && (
                            <div className="text-xs" style={{ color: MUTED }}>{prod.bulkPrice.toFixed(2)} / {prod.bulkUnit}</div>
                          )}
                        </td>
                        {/* จัดการ */}
                        <td className="px-5 py-3">
                          <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-indigo-50"
                            style={{ border: `1px solid ${BORDER}` }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={OR} strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end px-5 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-4 text-sm">
                  <span style={{ color: "#9294A1" }}>จำนวนรายการต่อหน้า</span>
                  <select className="border-0 text-sm font-medium" style={{ color: "#4C4E63" }}>
                    <option>6</option><option>25</option><option>50</option>
                  </select>
                  <span style={{ color: "#9294A1" }}>1-{filtered.length} of {filtered.length}</span>
                  <div className="flex items-center gap-1.5">
                    <button className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs opacity-40">&lt;</button>
                    <button className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs text-white" style={{ background: OR }}>1</button>
                    <button className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs" style={{ color: "#4C4E63" }}>2</button>
                    <button className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs" style={{ color: MUTED }}>&gt;</button>
                  </div>
                </div>
              </div>

            </div>{/* end card */}
          </div>
        </div>
      </TenantShell>
    );
  }

  /* ══════════════════════════════════════ */
  /* ── ADD PRODUCT FORM (สินค้าทั่วไป) ── */
  /* ══════════════════════════════════════ */

  const sidebarSections = [
    { key: "general", label: "ข้อมูลทั่วไป", done: sectionStatus.general },
    { key: "product", label: "ข้อมูลสินค้า", done: sectionStatus.product },
    { key: "pricing", label: "กำหนดราคาน่าเสนอ", done: sectionStatus.pricing },
    { key: "spec", label: "ข้อมูลจำเพาะสินค้า", done: sectionStatus.spec },
    { key: "images", label: "รูปภาพสินค้า", done: sectionStatus.images },
  ];

  return (
    <TenantShell breadcrumb={breadcrumb} activeModule="products">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium"
          style={{ background: toast.type === "ok" ? GREEN_L : RED_L, color: toast.type === "ok" ? GREEN : RED, border: `1px solid ${toast.type === "ok" ? GREEN : RED}33` }}>
          {toast.msg}
        </div>
      )}

      <div className="flex justify-center items-start w-full min-h-full" style={{ background: BG }}>
        <div className="w-full max-w-[1920px] px-6 py-6">

          <h1 className="text-xl font-bold mb-5" style={{ color: TEXT }}>สินค้า</h1>

          <div className="flex gap-6 items-start">
            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0">

              {/* Section 1: ข้อมูลทั่วไป */}
              <Section title="ข้อมูลทั่วไป" open={sections.general} onToggle={() => toggleSection("general")}>
                <div className="flex items-center justify-end mb-3">
                  <button className="text-xs underline" style={{ color: OR }}>ระบบสร้างรหัสสินค้าอัตโนมัติ</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <Field label="รหัสสินค้า (SKU)" value={sku} onChange={setSku} required />
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Field label="Barcode" value={barcode} onChange={setBarcode} required />
                    </div>
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center mb-0.5" style={{ borderColor: BORDER }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="7" x2="7" y2="17"/><line x1="11" y1="7" x2="11" y2="17"/><line x1="15" y1="7" x2="15" y2="13"/></svg>
                    </button>
                  </div>
                  <Field label="ชื่อสินค้าภาษาไทย (TH)" value={nameTH} onChange={setNameTH} required />
                  <Field label="ชื่อสินค้าภาษาอังกฤษ (EN)" value={nameEN} onChange={setNameEN} />
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Select label="ชื่อผู้จำหน่าย (Supplier Name)" value={supplier} onChange={setSupplier} options={SUPPLIERS} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="รหัสสินค้าจากผู้จำหน่าย (Supplier Code)" value={supplierCode} onChange={setSupplierCode} />
                    <Field label="ชื่อสินค้าจากผู้จำหน่าย (Supplier Product Name)" value={supplierProductName} onChange={setSupplierProductName} />
                  </div>
                </div>
              </Section>

              {/* Section 2: ข้อมูลสินค้า */}
              <Section title="ข้อมูลสินค้า" open={sections.product} onToggle={() => toggleSection("product")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Select label="ประเภทสินค้า" value={prodType} onChange={setProdType} options={PRODUCT_TYPES} required />
                  <Select label="หมวดหมู่หลัก" value={mainCategory} onChange={setMainCategory} options={CATEGORIES} />
                  <Select label="หมวดหมู่ย่อย" value={subCategory} onChange={setSubCategory} options={SUB_CATEGORIES} />
                  <Select label="ยี่ห้อ (แบรนด์)" value={brand} onChange={setBrand} options={BRANDS} />
                </div>
                <div className="mt-4">
                  <label className="text-xs font-medium mb-1 block" style={{ color: MUTED }}>รายละเอียดสินค้า</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: BORDER, color: TEXT }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = OR; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
                    placeholder="ระบุรายละเอียดสินค้า..." />
                </div>
              </Section>

              {/* Section 3: กำหนดราคาน่าเสนอ */}
              <Section title="กำหนดราคาน่าเสนอ" open={sections.pricing} onToggle={() => toggleSection("pricing")}>
                <div className="flex items-center gap-3 mt-3 mb-3">
                  <button className="px-4 py-1.5 rounded-lg text-xs font-medium" style={{ color: MUTED, border: `1px solid ${BORDER}` }}>กำหนดราคาขาย</button>
                  <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-white" style={{ background: OR }}>ตั้งค่าเพิ่มเติม</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="ราคาทุน" value={costPrice} onChange={setCostPrice} type="number" />
                  <Field label="ราคาขาย" value={sellPriceVal} onChange={setSellPriceVal} type="number" required />
                </div>
              </Section>

              {/* Section 4: ตั้งค่าเพิ่มเติม — Multi-unit */}
              <Section title="ตั้งค่าเพิ่มเติม" open={sections.units} onToggle={() => toggleSection("units")}>
                <div className="mt-3 mb-3 p-3 rounded-lg" style={{ background: "#FFF3E6", border: "1px solid #E8913A33" }}>
                  <p className="text-xs font-medium" style={{ color: "#E8913A" }}>แพ็คไซส์</p>
                  <p className="text-sm font-semibold" style={{ color: RED }}>1 กล่อง เท่ากับ 10 แผง</p>
                </div>

                {units.map((u, idx) => (
                  <div key={idx} className="mb-4 pb-4" style={{ borderBottom: idx < units.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Field label="Barcode" value={u.barcode} onChange={(v) => updateUnit(idx, "barcode", v)} />
                        </div>
                        <button className="w-8 h-8 rounded border flex items-center justify-center mb-0.5" style={{ borderColor: BORDER }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="7" x2="7" y2="17"/><line x1="11" y1="7" x2="11" y2="17"/><line x1="15" y1="7" x2="15" y2="13"/></svg>
                        </button>
                      </div>
                      <Select label="หน่วย" value={u.unitName} onChange={(v) => updateUnit(idx, "unitName", v)} options={UNITS} />
                      <Field label="อัตราส่วน" value={String(u.ratio)} onChange={(v) => updateUnit(idx, "ratio", Number(v))} type="number" />
                      <Field label="Container" value={u.container} onChange={(v) => updateUnit(idx, "container", v)} />
                    </div>
                    <div className="flex items-center gap-6 text-xs" style={{ color: TEXT }}>
                      {[
                        { key: "isBuy" as const, label: "หน่วยซื้อ" },
                        { key: "isSell" as const, label: "หน่วยขาย" },
                        { key: "isTransfer" as const, label: "หน่วยโอน" },
                        { key: "isUMS" as const, label: "หน่วย UMS" },
                        { key: "isUML" as const, label: "หน่วยแปลงผล\n(UML)" },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex flex-col items-center gap-1 cursor-pointer">
                          <span className="text-center whitespace-pre-line">{label}</span>
                          <input type="checkbox" checked={u[key] as boolean} onChange={(e) => updateUnit(idx, key, e.target.checked)}
                            className="w-4 h-4 rounded" style={{ accentColor: OR }} />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </Section>

              {/* Section 5: ข้อมูลจำเพาะสินค้า */}
              <Section title="ข้อมูลจำเพาะสินค้า" open={sections.spec} onToggle={() => toggleSection("spec")}>
                <div className="grid grid-cols-2 gap-4 mt-3 mb-4">
                  <Field label="ขนาดบรรจุสินค้า" value={packWeight} onChange={setPackWeight} />
                  <Select label="หน่วยบรรจุ" value={packWeightUnit} onChange={setPackWeightUnit} options={WEIGHT_UNITS} />
                </div>

                {specs.map((s, idx) => (
                  <div key={idx} className="mb-4 pb-4" style={{ borderBottom: idx < specs.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div className="grid grid-cols-4 gap-3 mb-2">
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Field label="Barcode" value={s.barcode} onChange={(v) => updateSpec(idx, "barcode", v)} />
                        </div>
                        <button className="w-8 h-8 rounded border flex items-center justify-center mb-0.5" style={{ borderColor: BORDER }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                        </button>
                      </div>
                      <Select label="หน่วย" value={s.unitName} onChange={(v) => updateSpec(idx, "unitName", v)} options={UNITS} />
                      <Field label="น้ำหนักสินค้า" value={s.weight} onChange={(v) => updateSpec(idx, "weight", v)} />
                      <Select label="หน่วยน้ำหนัก" value={s.weightUnit} onChange={(v) => updateSpec(idx, "weightUnit", v)} options={WEIGHT_UNITS} />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <Field label="ความกว้าง" value={s.width} onChange={(v) => updateSpec(idx, "width", v)} />
                      <Field label="ความยาว" value={s.length} onChange={(v) => updateSpec(idx, "length", v)} />
                      <Field label="ความสูง" value={s.height} onChange={(v) => updateSpec(idx, "height", v)} />
                      <Select label="หน่วย Dimension" value={s.dimUnit} onChange={(v) => updateSpec(idx, "dimUnit", v)} options={DIM_UNITS} />
                    </div>
                  </div>
                ))}
              </Section>

              {/* Section 6: รูปภาพสินค้า */}
              <Section title="รูปภาพสินค้า" open={sections.images} onToggle={() => toggleSection("images")}>
                <div className="mt-3">
                  <p className="text-sm font-medium mb-3" style={{ color: TEXT }}>ภาพสินค้ามาตรฐาน</p>
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 transition-colors mb-2"
                    style={{ borderColor: BORDER, background: "#FAFAFA" }}
                    onClick={() => fileRef.current?.click()}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                    <span className="text-[10px] mt-1" style={{ color: MUTED }}>อัพโหลด</span>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                  <ul className="text-xs space-y-0.5" style={{ color: MUTED }}>
                    <li>- อัปโหลดรูปภาพความละเอียดไม่เกิน 2 MB</li>
                    <li>- รูปสินค้าจะแสดงหน้าสินค้า และหน้าสั่งสินค้า</li>
                  </ul>

                  <p className="text-sm font-medium mt-5 mb-3" style={{ color: TEXT }}>แกลเลอรี่</p>
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 transition-colors"
                    style={{ borderColor: BORDER, background: "#FAFAFA" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                    <span className="text-[10px] mt-1" style={{ color: MUTED }}>เพิ่มรูปภาพ<br/>0/6</span>
                  </div>
                  <ul className="text-xs space-y-0.5 mt-2" style={{ color: MUTED }}>
                    <li>- อัปโหลดรูปภาพความละเอียดไม่เกิน 2 MB</li>
                    <li>- รูปเป็นเพิ่มแสดงสินค้าได้เป็นสินค้าต่างๆ และหน้าสินค้าหลายๆ</li>
                  </ul>
                </div>
              </Section>

              {/* Section 7: ประวัติการแก้ไข */}
              <Section title="ประวัติการแก้ไข" open={sections.history} onToggle={() => toggleSection("history")}>
                <div className="flex items-center gap-3 mt-3 mb-3">
                  <span className="text-xs" style={{ color: MUTED }}>เลือกดูตามประเภท</span>
                  <select className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: BORDER, color: TEXT }}>
                    <option>ทั้งหมด</option>
                  </select>
                </div>
                <table className="w-full text-xs" style={{ color: TEXT }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      {["วัน-เวลา", "ประเภท", "รายละเอียด", "ผู้ดำเนินการ"].map((h) => (
                        <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: MUTED }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={4} className="text-center py-6" style={{ color: MUTED }}>ยังไม่มีประวัติการแก้ไข</td></tr>
                  </tbody>
                </table>
              </Section>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 pb-6">
                <button onClick={() => setScreen("list")}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium border transition-colors"
                  style={{ borderColor: BORDER, color: MUTED }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = OR; e.currentTarget.style.color = OR; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}>
                  ยกเลิก
                </button>
                <button onClick={handleSave}
                  className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                  style={{ background: OR }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                  บันทึก
                </button>
              </div>
            </div>

            {/* ── Right Sidebar ── */}
            <div className="w-[240px] shrink-0 sticky top-4">
              {/* Section Navigator */}
              <div className="bg-white rounded-lg border p-4 mb-4" style={{ borderColor: BORDER }}>
                {sidebarSections.map((s) => (
                  <div key={s.key} className="flex items-center gap-2 py-1.5 cursor-pointer hover:opacity-80"
                    onClick={() => { setSections((prev) => ({ ...prev, [s.key]: true })); document.getElementById(`section-${s.key}`)?.scrollIntoView({ behavior: "smooth" }); }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                      style={{ background: s.done ? GREEN : RED }}>
                      {s.done ? "\u2713" : "!"}
                    </div>
                    <span className="text-sm" style={{ color: TEXT }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Info panel */}
              <div className="bg-white rounded-lg border p-4" style={{ borderColor: BORDER }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: MUTED }}>วันสร้าง</span>
                  <span className="text-xs font-medium" style={{ color: TEXT }}>2025-04-17 15:38:42</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs" style={{ color: MUTED }}>ผู้สร้าง</span>
                  <span className="text-xs font-medium" style={{ color: TEXT }}>wachirawit chanchlaw</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: TEXT }}>สถานะรายการหน้าร้าน</span>
                  <button className="relative w-10 h-5 rounded-full transition-colors"
                    style={{ background: showOnShelf ? OR : "#ccc" }}
                    onClick={() => setShowOnShelf(!showOnShelf)}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      style={{ left: showOnShelf ? 22 : 2 }} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: TEXT }}>สถานะรับสินค้า</span>
                  <button className="relative w-10 h-5 rounded-full transition-colors"
                    style={{ background: showInStock ? OR : "#ccc" }}
                    onClick={() => setShowInStock(!showInStock)}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      style={{ left: showInStock ? 22 : 2 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </TenantShell>
  );
}

/* ══════════════════════════════════════════════════ */
/* ── PAGE EXPORT ── */
/* ══════════════════════════════════════════════════ */

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm" style={{ color: "#777" }}>กำลังโหลด...</div>}>
      <ProductInner />
    </Suspense>
  );
}
