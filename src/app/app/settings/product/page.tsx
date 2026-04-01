"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TenantShell from "@/components/TenantShell";

/* ── Palette ── */
import { TENANT_PRIMARY as OR, TENANT_HOVER as OR_D, GREEN, GREEN_L, RED, BORDER, TEXT, MUTED } from "@/lib/theme";

/* ── Side nav items ── */
const SIDE_ITEMS = [
  { id: "product-type", label: "ประเภทสินค้า" },
  { id: "unit", label: "หน่วยนับ" },
  { id: "pack-size", label: "ขนาดบรรจุ" },
  { id: "dimension", label: "หน่วย Dimension" },
  { id: "weight", label: "น้ำหนักสินค้า" },
  { id: "brand", label: "ยี่ห้อ (แบรนด์)" },
  { id: "import", label: "นำเข้าสินค้า" },
];

/* ══════════════════════════════════════════ */
/* ── MOCK DATA ── */
/* ══════════════════════════════════════════ */
interface ProductType {
  id: string; code: string; nameTH: string; nameEN: string; categoryCount: number; productCount: number;
}
const mockProductTypes: ProductType[] = [
  { id: "1", code: "P01", nameTH: "สกินแคร์", nameEN: "Skincare", categoryCount: 10, productCount: 129 },
  { id: "2", code: "P02", nameTH: "เครื่องสำอาง", nameEN: "Makeup", categoryCount: 6, productCount: 90 },
  { id: "3", code: "P03", nameTH: "เครื่องมือความงาม", nameEN: "Beauty Tools", categoryCount: 3, productCount: 1 },
  { id: "4", code: "P04", nameTH: "น้ำหอม", nameEN: "Fragrance", categoryCount: 3, productCount: 116 },
  { id: "5", code: "P05", nameTH: "สุขภาพและอาหารเสริม", nameEN: "Health Care & Supply", categoryCount: 3, productCount: 43 },
  { id: "6", code: "P06", nameTH: "ผลิตภัณฑ์ช่องปาก", nameEN: "Oral Care", categoryCount: 3, productCount: 5 },
  { id: "7", code: "P07", nameTH: "ดูแลร่างกาย", nameEN: "Personal Care", categoryCount: 9, productCount: 86 },
  { id: "8", code: "P08", nameTH: "แฟชั่นและไลฟ์สไตล์", nameEN: "Fashion & Lifestyle", categoryCount: 2, productCount: 8 },
  { id: "9", code: "P09", nameTH: "แม่และเด็ก", nameEN: "Baby & Mom", categoryCount: 5, productCount: 1 },
];

interface UnitItem {
  id: string; nameTH: string; nameEN: string; desc: string;
}
const mockUnits: UnitItem[] = [
  { id: "1", nameTH: "ลัง", nameEN: "Carton", desc: "ลัง" },
  { id: "2", nameTH: "แพ็ค", nameEN: "Pack", desc: "แพ็ค" },
  { id: "3", nameTH: "ชิ้น", nameEN: "PCS", desc: "ชิ้น" },
];

interface MasterItem {
  id: string; nameTH: string; nameEN: string; active: boolean;
}
const mockPackSizes: MasterItem[] = [
  { id: "1", nameTH: "มิลลิกรัม", nameEN: "Mg", active: true },
  { id: "2", nameTH: "กรัม", nameEN: "Gm", active: true },
];
const mockDimensions: MasterItem[] = [
  { id: "1", nameTH: "เซนติเมตร", nameEN: "cm", active: true },
];
const mockWeights: MasterItem[] = [
  { id: "1", nameTH: "มิลลิกรัม", nameEN: "Mg", active: true },
  { id: "2", nameTH: "กรัม", nameEN: "Gm", active: true },
];

interface BrandItem {
  id: string; nameTH: string; nameEN: string; image: string; active: boolean;
}
const mockBrands: BrandItem[] = [
  { id: "1", nameTH: "Bio Women", nameEN: "Bio Women", image: "", active: true },
  { id: "2", nameTH: "Mihada", nameEN: "Mihada", image: "", active: true },
  { id: "3", nameTH: "Raben", nameEN: "Raben", image: "", active: true },
  { id: "4", nameTH: "Vipada", nameEN: "Vipada", image: "", active: true },
  { id: "5", nameTH: "Darling Sky", nameEN: "Darling Sky", image: "", active: true },
  { id: "6", nameTH: "Miss & Kiss", nameEN: "Miss & Kiss", image: "", active: true },
];

interface MainCategory {
  id: string; code: string; nameTH: string; nameEN: string;
  productTypeId: string; subCatCount: number; productCount: number;
}
const mockMainCategories: MainCategory[] = [
  { id: "1", code: "MC01", nameTH: "คลีนเซอร์ & เอ็กซ์โฟลิเอเตอร์", nameEN: "Cleanser & Exfoliator", productTypeId: "1", subCatCount: 4, productCount: 18 },
  { id: "2", code: "MC02", nameTH: "รักษาสิว", nameEN: "Acne Treatment", productTypeId: "1", subCatCount: 3, productCount: 12 },
  { id: "3", code: "MC03", nameTH: "ดูแลรอบดวงตา", nameEN: "Eye Care", productTypeId: "1", subCatCount: 2, productCount: 8 },
  { id: "4", code: "MC04", nameTH: "มาส์ก", nameEN: "Mask", productTypeId: "1", subCatCount: 5, productCount: 22 },
  { id: "5", code: "MC05", nameTH: "มอยส์เจอไรเซอร์", nameEN: "Moisturizer", productTypeId: "1", subCatCount: 3, productCount: 15 },
  { id: "6", code: "MC06", nameTH: "เซรั่ม", nameEN: "Serum", productTypeId: "1", subCatCount: 4, productCount: 20 },
  { id: "7", code: "MC07", nameTH: "กันแดด", nameEN: "Sunscreen", productTypeId: "1", subCatCount: 2, productCount: 14 },
  { id: "8", code: "MC08", nameTH: "รองพื้น", nameEN: "Foundation", productTypeId: "2", subCatCount: 3, productCount: 10 },
  { id: "9", code: "MC09", nameTH: "ลิปสติก", nameEN: "Lipstick", productTypeId: "2", subCatCount: 2, productCount: 8 },
  { id: "10", code: "MC10", nameTH: "ดูแลผู้ชาย", nameEN: "Men's Care", productTypeId: "7", subCatCount: 3, productCount: 12 },
];

interface SubCategory {
  id: string; code: string; nameTH: string; nameEN: string;
  mainCatId: string; productTypeId: string; productCount: number;
}
const mockSubCategories: SubCategory[] = [
  { id: "1", code: "SC01", nameTH: "แป้งผู้ชาย", nameEN: "Body Powder", mainCatId: "10", productTypeId: "7", productCount: 3 },
  { id: "2", code: "SC02", nameTH: "สบู่ผู้ชาย", nameEN: "Body Wash", mainCatId: "10", productTypeId: "7", productCount: 5 },
  { id: "3", code: "SC03", nameTH: "มาส์กหน้า", nameEN: "Face Mask", mainCatId: "4", productTypeId: "1", productCount: 8 },
  { id: "4", code: "SC04", nameTH: "สลีปปิ้งมาส์ก", nameEN: "Sleeping Mask", mainCatId: "4", productTypeId: "1", productCount: 4 },
  { id: "5", code: "SC05", nameTH: "เคลย์มาส์ก", nameEN: "Clay Mask", mainCatId: "4", productTypeId: "1", productCount: 3 },
  { id: "6", code: "SC06", nameTH: "ชีทมาส์ก", nameEN: "Sheet Mask", mainCatId: "4", productTypeId: "1", productCount: 7 },
  { id: "7", code: "SC07", nameTH: "บับเบิ้ลคลีนเซอร์", nameEN: "Bubble Cleanser", mainCatId: "1", productTypeId: "1", productCount: 5 },
  { id: "8", code: "SC08", nameTH: "โฟมคลีนเซอร์", nameEN: "Foam Cleanser", mainCatId: "1", productTypeId: "1", productCount: 6 },
];

/* ══════════════════════════════════════════ */
/* ── DRAGGABLE MODAL ── */
/* ══════════════════════════════════════════ */
function DraggableModal({ title, open, onClose, children, initialWidth = 520 }: {
  title: string; open: boolean; onClose: () => void; children: React.ReactNode; initialWidth?: number;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: initialWidth, h: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setPos({ x: Math.max(0, (window.innerWidth - initialWidth) / 2), y: 80 });
      setSize({ w: initialWidth, h: 0 });
    }
  }, [open, initialWidth]);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({ x: dragRef.current.origX + ev.clientX - dragRef.current.startX, y: dragRef.current.origY + ev.clientY - dragRef.current.startY });
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [pos]);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const rect = modalRef.current?.getBoundingClientRect();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: rect?.width || size.w, origH: rect?.height || 400 };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      setSize({ w: Math.max(360, resizeRef.current.origW + ev.clientX - resizeRef.current.startX), h: Math.max(200, resizeRef.current.origH + ev.clientY - resizeRef.current.startY) });
    };
    const onUp = () => { resizeRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [size]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.25)" }} onClick={onClose} />
      <div ref={modalRef} className="fixed z-50 rounded-xl overflow-hidden shadow-2xl flex flex-col bg-white"
        style={{ left: pos.x, top: pos.y, width: size.w, ...(size.h ? { height: size.h } : {}), border: `1px solid ${BORDER}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 cursor-move select-none" style={{ background: OR }}
          onMouseDown={onDragStart}>
          <span className="text-white font-semibold text-sm">{title}</span>
          <div className="flex items-center gap-2">
            {["↗", "📌", "□", "✕"].map((icon, i) => (
              <button key={i} className="text-white/80 hover:text-white text-sm"
                onClick={i === 3 ? onClose : undefined}>{icon}</button>
            ))}
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-auto p-5">
          {children}
        </div>
        {/* Resize handle */}
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-indigo-300 rounded-tl"
          style={{ background: "transparent" }} onMouseDown={onResizeStart} />
      </div>
    </>
  );
}

/* ══════════════════════════════════════════ */
/* ── FIELD COMPONENTS ── */
/* ══════════════════════════════════════════ */
const Field = ({ label, value, onChange, required, disabled }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; disabled?: boolean;
}) => (
  <div className="field-group">
    <input type="text" value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} placeholder=" " />
    <label>{label}{required && <span className="text-[#E53935] ml-0.5">*</span>}</label>
  </div>
);

/* ══════════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════════ */
function SettingsProductInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "product-type");
  const [search, setSearch] = useState("");

  /* ── toast ── */
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err" = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  /* ── Product Type state ── */
  const [ptSubTab, setPtSubTab] = useState("product-type");
  const [ptModal, setPtModal] = useState(false);
  const [ptCode, setPtCode] = useState("");
  const [ptNameTH, setPtNameTH] = useState("");
  const [ptNameEN, setPtNameEN] = useState("");

  /* ── Unit state ── */
  const [unitModal, setUnitModal] = useState(false);
  const [unitNameTH, setUnitNameTH] = useState("");
  const [unitNameEN, setUnitNameEN] = useState("");
  const [unitDesc, setUnitDesc] = useState("");

  /* ── Generic master modal state (ขนาดบรรจุ / Dimension / น้ำหนัก) ── */
  const [masterModal, setMasterModal] = useState(false);
  const [masterNameTH, setMasterNameTH] = useState("");
  const [masterNameEN, setMasterNameEN] = useState("");
  const [masterStatus, setMasterStatus] = useState<"active" | "inactive">("active");

  /* ── Brand state ── */
  const [brandModal, setBrandModal] = useState(false);
  const [brandNameTH, setBrandNameTH] = useState("");
  const [brandNameEN, setBrandNameEN] = useState("");
  const [brandNote, setBrandNote] = useState("");
  const [brandStatus, setBrandStatus] = useState<"active" | "inactive">("active");

  /* ── Main Category state ── */
  const [mcModal, setMcModal] = useState(false);
  const [mcCode, setMcCode] = useState("");
  const [mcNameTH, setMcNameTH] = useState("");
  const [mcNameEN, setMcNameEN] = useState("");
  const [mcProductType, setMcProductType] = useState("");

  /* ── Sub Category state ── */
  const [scModal, setScModal] = useState(false);
  const [scCode, setScCode] = useState("");
  const [scNameTH, setScNameTH] = useState("");
  const [scNameEN, setScNameEN] = useState("");
  const [scMainCat, setScMainCat] = useState("");
  const [scProductType, setScProductType] = useState("");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t) setActiveTab(t);
  }, [searchParams]);

  const now = new Date().toLocaleString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  /* ── breadcrumb ── */
  const currentLabel = SIDE_ITEMS.find((s) => s.id === activeTab)?.label || "ประเภทสินค้า";
  const breadcrumb = ["ตั้งค่า", "สินค้า", currentLabel];

  /* ── filter ── */
  const filteredPT = mockProductTypes.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.code.toLowerCase().includes(s) || p.nameTH.includes(s) || p.nameEN.toLowerCase().includes(s);
  });

  const filteredUnits = mockUnits.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.nameTH.includes(s) || u.nameEN.toLowerCase().includes(s) || u.desc.includes(s);
  });

  const filteredMainCats = mockMainCategories.filter((mc) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return mc.code.toLowerCase().includes(s) || mc.nameTH.includes(s) || mc.nameEN.toLowerCase().includes(s);
  });

  const filteredSubCats = mockSubCategories.filter((sc) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return sc.code.toLowerCase().includes(s) || sc.nameTH.includes(s) || sc.nameEN.toLowerCase().includes(s);
  });

  const getPTName = (ptId: string) => mockProductTypes.find((p) => p.id === ptId)?.nameTH || "-";
  const getMCName = (mcId: string) => mockMainCategories.find((m) => m.id === mcId)?.nameTH || "-";

  /* ── Sub-tabs component ── */
  const SubTabs = ({ active, tabs, onTab }: { active: string; tabs: { id: string; label: string }[]; onTab: (id: string) => void }) => (
    <div className="flex items-center gap-1 mb-5">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onTab(t.id)}
          className="px-5 py-2 rounded-full text-sm font-medium transition-colors"
          style={{ background: active === t.id ? OR : "transparent", color: active === t.id ? "white" : OR }}>
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <TenantShell breadcrumb={breadcrumb} activeModule="settings">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium"
          style={{ background: toast.type === "ok" ? GREEN_L : "#FCEBEB", color: toast.type === "ok" ? GREEN : "#A32D2D", border: `1px solid ${toast.type === "ok" ? GREEN : RED}33` }}>
          {toast.msg}
        </div>
      )}

      <div className="p-6">
        <h1 className="text-lg font-bold mb-5" style={{ color: TEXT }}>{currentLabel}</h1>

        {/* ═══════════════════════════════════════════ */}
        {/* ── ประเภทสินค้า ── */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "product-type" && (
          <>
            <SubTabs active={ptSubTab}
              tabs={[{ id: "product-type", label: "ประเภทสินค้า" }, { id: "main-cat", label: "หมวดหมู่หลัก" }, { id: "sub-cat", label: "หมวดหมู่ย่อย" }]}
              onTab={setPtSubTab} />

            {/* ── Sub-tab: ประเภทสินค้า ── */}
            {ptSubTab === "product-type" && (
              <>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                    style={{ borderColor: BORDER, color: TEXT }}>
                    ⬆ EXPORT
                  </button>
                  <div className="flex-1" />
                  <div className="relative">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อประเภทสินค้า"
                      className="pl-3 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, width: 220 }} />
                  </div>
                  <button onClick={() => { setPtCode(""); setPtNameTH(""); setPtNameEN(""); setPtModal(true); }}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                    style={{ background: OR }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                    เพิ่มประเภทสินค้า
                  </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: BORDER }}>
                  <table className="w-full text-sm" style={{ color: TEXT }}>
                    <thead>
                      <tr style={{ background: "#F8F8F8" }}>
                        {["รหัสประเภท", "ชื่อประเภท TH", "ชื่อประเภท ENG", "จำนวนหมวดหมู่หลัก", "จำนวนรายการสินค้า", "จัดการ"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPT.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูล</td></tr>
                      ) : filteredPT.map((p) => (
                        <tr key={p.id} className="hover:bg-indigo-50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td className="px-4 py-3 font-medium" style={{ color: OR }}>{p.code}</td>
                          <td className="px-4 py-3">{p.nameTH}</td>
                          <td className="px-4 py-3">{p.nameEN}</td>
                          <td className="px-4 py-3 text-center">{p.categoryCount}</td>
                          <td className="px-4 py-3 text-center">{p.productCount}</td>
                          <td className="px-4 py-3"><button className="text-base hover:opacity-70">✏️</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-3 mt-3 text-xs" style={{ color: MUTED }}>
                  <span>จำนวนรายการต่อหน้า</span>
                  <select className="border rounded px-2 py-1 text-xs" style={{ borderColor: BORDER }}>
                    <option>25</option><option>50</option><option>100</option>
                  </select>
                  <span>1-{filteredPT.length} of {filteredPT.length}</span>
                  <div className="flex items-center gap-1">
                    <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&lt;</button>
                    <button className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: OR }}>1</button>
                    <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&gt;</button>
                  </div>
                </div>

                {/* Modal */}
                <DraggableModal title="เพิ่มประเภทสินค้า" open={ptModal} onClose={() => setPtModal(false)}>
                  <div className="space-y-4">
                    <Field label="รหัสประเภทสินค้า" value={ptCode} onChange={setPtCode} required />
                    <Field label="ชื่อประเภทสินค้า (TH)" value={ptNameTH} onChange={setPtNameTH} required />
                    <Field label="ชื่อประเภทสินค้า (ENG)" value={ptNameEN} onChange={setPtNameEN} />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="วันที่สร้าง" value={now} disabled />
                      <Field label="ผู้ดำเนินการล่าสุด" value="dev dev1" disabled />
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <button onClick={() => setPtModal(false)}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: BORDER, color: MUTED }}>
                        ยกเลิก
                      </button>
                      <button onClick={() => { if (!ptCode || !ptNameTH) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกประเภทสินค้าเรียบร้อย"); setPtModal(false); }}
                        className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: OR }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                        บันทึก
                      </button>
                    </div>
                  </div>
                </DraggableModal>
              </>
            )}

            {/* ── Sub-tab: หมวดหมู่หลัก ── */}
            {ptSubTab === "main-cat" && (
              <>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                    style={{ borderColor: BORDER, color: TEXT }}>
                    ⬆ EXPORT
                  </button>
                  <div className="flex-1" />
                  <div className="relative">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาหมวดหมู่หลัก"
                      className="pl-3 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, width: 220 }} />
                  </div>
                  <button onClick={() => { setMcCode(""); setMcNameTH(""); setMcNameEN(""); setMcProductType(""); setMcModal(true); }}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                    style={{ background: OR }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                    เพิ่มหมวดหมู่หลัก
                  </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: BORDER }}>
                  <table className="w-full text-sm" style={{ color: TEXT }}>
                    <thead>
                      <tr style={{ background: "#F8F8F8" }}>
                        {["รหัสหมวดหมู่หลัก", "ชื่อหมวดหมู่หลัก (TH)", "ชื่อหมวดหมู่หลัก (ENG)", "ประเภทสินค้า", "จำนวนหมวดหมู่ย่อย", "จำนวนรายการสินค้า", "จัดการ"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMainCats.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูล</td></tr>
                      ) : filteredMainCats.map((mc) => (
                        <tr key={mc.id} className="hover:bg-indigo-50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td className="px-4 py-3 font-medium" style={{ color: OR }}>{mc.code}</td>
                          <td className="px-4 py-3">{mc.nameTH}</td>
                          <td className="px-4 py-3">{mc.nameEN}</td>
                          <td className="px-4 py-3">{getPTName(mc.productTypeId)}</td>
                          <td className="px-4 py-3 text-center">{mc.subCatCount}</td>
                          <td className="px-4 py-3 text-center">{mc.productCount}</td>
                          <td className="px-4 py-3"><button className="text-base hover:opacity-70">✏️</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-3 mt-3 text-xs" style={{ color: MUTED }}>
                  <span>จำนวนรายการต่อหน้า</span>
                  <select className="border rounded px-2 py-1 text-xs" style={{ borderColor: BORDER }}>
                    <option>25</option><option>50</option><option>100</option>
                  </select>
                  <span>1-{filteredMainCats.length} of {filteredMainCats.length}</span>
                  <div className="flex items-center gap-1">
                    <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&lt;</button>
                    <button className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: OR }}>1</button>
                    <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&gt;</button>
                  </div>
                </div>

                {/* Modal */}
                <DraggableModal title="เพิ่มหมวดหมู่หลัก" open={mcModal} onClose={() => setMcModal(false)}>
                  <div className="space-y-4">
                    <Field label="รหัสหมวดหมู่หลัก" value={mcCode} onChange={setMcCode} required />
                    <Field label="ชื่อหมวดหมู่หลัก (TH)" value={mcNameTH} onChange={setMcNameTH} required />
                    <Field label="ชื่อหมวดหมู่หลัก (ENG)" value={mcNameEN} onChange={setMcNameEN} />
                    {/* Dropdown ประเภทสินค้า */}
                    <div className="field-group">
                      <select value={mcProductType} onChange={(e) => setMcProductType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: BORDER, color: mcProductType ? TEXT : MUTED }}>
                        <option value="">-- เลือกประเภทสินค้า --</option>
                        {mockProductTypes.map((pt) => (
                          <option key={pt.id} value={pt.id}>{pt.nameTH} ({pt.nameEN})</option>
                        ))}
                      </select>
                      <label>ประเภทสินค้า<span className="text-[#E53935] ml-0.5">*</span></label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="วันที่สร้าง" value={now} disabled />
                      <Field label="ผู้ดำเนินการล่าสุด" value="dev dev1" disabled />
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <button onClick={() => setMcModal(false)}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: BORDER, color: MUTED }}>
                        ยกเลิก
                      </button>
                      <button onClick={() => { if (!mcCode || !mcNameTH || !mcProductType) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกหมวดหมู่หลักเรียบร้อย"); setMcModal(false); }}
                        className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: OR }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                        บันทึก
                      </button>
                    </div>
                  </div>
                </DraggableModal>
              </>
            )}

            {/* ── Sub-tab: หมวดหมู่ย่อย ── */}
            {ptSubTab === "sub-cat" && (
              <>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                    style={{ borderColor: BORDER, color: TEXT }}>
                    ⬆ EXPORT
                  </button>
                  <div className="flex-1" />
                  <div className="relative">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาหมวดหมู่ย่อย"
                      className="pl-3 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, width: 220 }} />
                  </div>
                  <button onClick={() => { setScCode(""); setScNameTH(""); setScNameEN(""); setScMainCat(""); setScProductType(""); setScModal(true); }}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                    style={{ background: OR }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                    เพิ่มหมวดหมู่ย่อย
                  </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: BORDER }}>
                  <table className="w-full text-sm" style={{ color: TEXT }}>
                    <thead>
                      <tr style={{ background: "#F8F8F8" }}>
                        {["รหัสหมวดหมู่ย่อย", "ชื่อหมวดหมู่ย่อย (TH)", "ชื่อหมวดหมู่ย่อย (ENG)", "ชื่อหมวดหมู่หลัก", "ประเภทสินค้า", "จำนวนรายการสินค้า", "จัดการ"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubCats.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูล</td></tr>
                      ) : filteredSubCats.map((sc) => (
                        <tr key={sc.id} className="hover:bg-indigo-50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td className="px-4 py-3 font-medium" style={{ color: OR }}>{sc.code}</td>
                          <td className="px-4 py-3">{sc.nameTH}</td>
                          <td className="px-4 py-3">{sc.nameEN}</td>
                          <td className="px-4 py-3">{getMCName(sc.mainCatId)}</td>
                          <td className="px-4 py-3">{getPTName(sc.productTypeId)}</td>
                          <td className="px-4 py-3 text-center">{sc.productCount}</td>
                          <td className="px-4 py-3"><button className="text-base hover:opacity-70">✏️</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-3 mt-3 text-xs" style={{ color: MUTED }}>
                  <span>จำนวนรายการต่อหน้า</span>
                  <select className="border rounded px-2 py-1 text-xs" style={{ borderColor: BORDER }}>
                    <option>25</option><option>50</option><option>100</option>
                  </select>
                  <span>1-{filteredSubCats.length} of {filteredSubCats.length}</span>
                  <div className="flex items-center gap-1">
                    <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&lt;</button>
                    <button className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: OR }}>1</button>
                    <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&gt;</button>
                  </div>
                </div>

                {/* Modal */}
                <DraggableModal title="เพิ่มหมวดหมู่ย่อย" open={scModal} onClose={() => setScModal(false)} initialWidth={560}>
                  <div className="space-y-4">
                    <Field label="รหัสหมวดหมู่ย่อย" value={scCode} onChange={setScCode} required />
                    <Field label="ชื่อหมวดหมู่ย่อย (TH)" value={scNameTH} onChange={setScNameTH} required />
                    <Field label="ชื่อหมวดหมู่ย่อย (ENG)" value={scNameEN} onChange={setScNameEN} />
                    {/* Dropdown หมวดหมู่หลัก */}
                    <div className="field-group">
                      <select value={scMainCat} onChange={(e) => {
                        setScMainCat(e.target.value);
                        const mc = mockMainCategories.find((m) => m.id === e.target.value);
                        if (mc) setScProductType(mc.productTypeId);
                      }}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: BORDER, color: scMainCat ? TEXT : MUTED }}>
                        <option value="">-- เลือกหมวดหมู่หลัก --</option>
                        {mockMainCategories.map((mc) => (
                          <option key={mc.id} value={mc.id}>{mc.nameTH} ({mc.nameEN})</option>
                        ))}
                      </select>
                      <label>หมวดหมู่หลัก<span className="text-[#E53935] ml-0.5">*</span></label>
                    </div>
                    {/* Dropdown ประเภทสินค้า */}
                    <div className="field-group">
                      <select value={scProductType} onChange={(e) => setScProductType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: BORDER, color: scProductType ? TEXT : MUTED }}>
                        <option value="">-- เลือกประเภทสินค้า --</option>
                        {mockProductTypes.map((pt) => (
                          <option key={pt.id} value={pt.id}>{pt.nameTH} ({pt.nameEN})</option>
                        ))}
                      </select>
                      <label>ประเภทสินค้า<span className="text-[#E53935] ml-0.5">*</span></label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="วันที่สร้าง" value={now} disabled />
                      <Field label="ผู้ดำเนินการล่าสุด" value="dev dev1" disabled />
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <button onClick={() => setScModal(false)}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: BORDER, color: MUTED }}>
                        ยกเลิก
                      </button>
                      <button onClick={() => { if (!scCode || !scNameTH || !scMainCat || !scProductType) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกหมวดหมู่ย่อยเรียบร้อย"); setScModal(false); }}
                        className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: OR }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                        บันทึก
                      </button>
                    </div>
                  </div>
                </DraggableModal>
              </>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ── หน่วยนับ ── */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "unit" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{ borderColor: BORDER, color: TEXT }}>
                ⬆ EXPORT
              </button>
              <div className="flex-1" />
              <div className="relative">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อหน่วยนับ"
                  className="pl-3 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, width: 200 }} />
              </div>
              <button onClick={() => { setUnitNameTH(""); setUnitNameEN(""); setUnitDesc(""); setUnitModal(true); }}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: OR }}
                onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                เพิ่มหน่วยนับ
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: BORDER }}>
              <table className="w-full text-sm" style={{ color: TEXT }}>
                <thead>
                  <tr style={{ background: "#F8F8F8" }}>
                    {["ชื่อหน่วยนับ (TH)", "ชื่อหน่วยนับ (ENG)", "รายละเอียดเพิ่มเติม", "จัดการ"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูล</td></tr>
                  ) : filteredUnits.map((u) => (
                    <tr key={u.id} className="hover:bg-indigo-50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td className="px-4 py-3">{u.nameTH}</td>
                      <td className="px-4 py-3">{u.nameEN}</td>
                      <td className="px-4 py-3">{u.desc}</td>
                      <td className="px-4 py-3"><button className="text-base hover:opacity-70">✏️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-3 mt-3 text-xs" style={{ color: MUTED }}>
              <span>จำนวนรายการต่อหน้า</span>
              <select className="border rounded px-2 py-1 text-xs" style={{ borderColor: BORDER }}>
                <option>25</option><option>50</option><option>100</option>
              </select>
              <span>1-{filteredUnits.length} of {filteredUnits.length}</span>
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&lt;</button>
                <button className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: OR }}>1</button>
                <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&gt;</button>
              </div>
            </div>

            {/* Modal */}
            <DraggableModal title="เพิ่มหน่วยนับ" open={unitModal} onClose={() => setUnitModal(false)}>
              <div className="space-y-4">
                <Field label="ชื่อหน่วยนับ (TH)" value={unitNameTH} onChange={setUnitNameTH} required />
                <Field label="ชื่อหน่วยนับ (ENG)" value={unitNameEN} onChange={setUnitNameEN} />
                <Field label="รายละเอียดเพิ่มเติม" value={unitDesc} onChange={setUnitDesc} required />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="วันที่สร้าง" value={now} disabled />
                  <Field label="ผู้ดำเนินการล่าสุด" value="dev dev1" disabled />
                </div>
                <div className="flex items-center justify-center gap-3 pt-4">
                  <button onClick={() => setUnitModal(false)}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: BORDER, color: MUTED }}>
                    ยกเลิก
                  </button>
                  <button onClick={() => { if (!unitNameTH || !unitDesc) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกหน่วยนับเรียบร้อย"); setUnitModal(false); }}
                    className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: OR }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                    บันทึก
                  </button>
                </div>
              </div>
            </DraggableModal>
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ── ขนาดบรรจุ / หน่วย Dimension / น้ำหนักสินค้า ── */}
        {/* ═══════════════════════════════════════════ */}
        {["pack-size", "dimension", "weight"].includes(activeTab) && (() => {
          const config: Record<string, { data: MasterItem[]; addLabel: string; searchPH: string; colTH: string; colEN: string; modalTitle: string; fieldTH: string; fieldEN: string }> = {
            "pack-size": { data: mockPackSizes, addLabel: "เพิ่มขนาดบรรจุ", searchPH: "ค้นหาขนาดบรรจุ", colTH: "ชื่อขนาดบรรจุ (TH)", colEN: "ชื่อขนาดบรรจุ (EN)", modalTitle: "เพิ่มขนาดบรรจุ", fieldTH: "ชื่อขนาดบรรจุ (TH)", fieldEN: "ชื่อขนาดบรรจุ (EN)" },
            "dimension": { data: mockDimensions, addLabel: "เพิ่มหน่วย DIMENSION", searchPH: "ค้นหาหน่วย Dimension", colTH: "ชื่อหน่วย Dimension (TH)", colEN: "ชื่อหน่วย Dimension (EN)", modalTitle: "เพิ่มหน่วย Dimension", fieldTH: "ชื่อหน่วย Dimension (TH)", fieldEN: "ชื่อหน่วย Dimension (EN)" },
            "weight": { data: mockWeights, addLabel: "เพิ่มน้ำหนักสินค้า", searchPH: "ค้นหาน้ำหนักสินค้า", colTH: "ชื่อน้ำหนักสินค้า (TH)", colEN: "ชื่อน้ำหนักสินค้า (EN)", modalTitle: "เพิ่มน้ำหนักสินค้า", fieldTH: "ชื่อน้ำหนักสินค้า (TH)", fieldEN: "ชื่อน้ำหนักสินค้า (EN)" },
          };
          const c = config[activeTab];
          const filtered = c.data.filter((item) => {
            if (!search) return true;
            const s = search.toLowerCase();
            return item.nameTH.includes(s) || item.nameEN.toLowerCase().includes(s);
          });

          return (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                  style={{ borderColor: BORDER, color: TEXT }}>
                  ⬆ EXPORT
                </button>
                <div className="flex-1" />
                <select className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, color: TEXT, minWidth: 100 }}>
                  <option value="">ทั้งหมด</option>
                  <option value="active">เปิดใช้งาน</option>
                  <option value="inactive">ปิดใช้งาน</option>
                </select>
                <div className="relative">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={c.searchPH}
                    className="pl-3 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, width: 220 }} />
                </div>
                <button onClick={() => { setMasterNameTH(""); setMasterNameEN(""); setMasterStatus("active"); setMasterModal(true); }}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                  style={{ background: OR }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                  {c.addLabel}
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: BORDER }}>
                <table className="w-full text-sm" style={{ color: TEXT }}>
                  <thead>
                    <tr style={{ background: "#F8F8F8" }}>
                      {[c.colTH, c.colEN, "สถานะ", "จัดการ"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูล</td></tr>
                    ) : filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-indigo-50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td className="px-4 py-3">{item.nameTH}</td>
                        <td className="px-4 py-3">{item.nameEN}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: item.active ? GREEN_L : "#FCEBEB", color: item.active ? GREEN : "#A32D2D" }}>
                            {item.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                          </span>
                        </td>
                        <td className="px-4 py-3"><button className="text-base hover:opacity-70">✏️</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-3 mt-3 text-xs" style={{ color: MUTED }}>
                <span>จำนวนรายการต่อหน้า</span>
                <select className="border rounded px-2 py-1 text-xs" style={{ borderColor: BORDER }}>
                  <option>6</option><option>25</option><option>50</option>
                </select>
                <span>1-{filtered.length} of {filtered.length}</span>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&lt;</button>
                  <button className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: OR }}>1</button>
                  <button className="w-6 h-6 rounded flex items-center justify-center" style={{ color: MUTED }}>&gt;</button>
                </div>
              </div>

              {/* Modal */}
              <DraggableModal title={c.modalTitle} open={masterModal} onClose={() => setMasterModal(false)}>
                <div className="space-y-4">
                  <Field label={c.fieldTH} value={masterNameTH} onChange={setMasterNameTH} required />
                  <Field label={c.fieldEN} value={masterNameEN} onChange={setMasterNameEN} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="วันที่สร้าง" value={now} disabled />
                    <Field label="วันที่แก้ไขล่าสุด" value={now} disabled />
                  </div>
                  {/* Status radio */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: TEXT }}>สถานะ</p>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="masterStatus" checked={masterStatus === "active"} onChange={() => setMasterStatus("active")} style={{ accentColor: OR }} />
                        <span className="text-sm" style={{ color: TEXT }}>เปิดใช้งาน</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="masterStatus" checked={masterStatus === "inactive"} onChange={() => setMasterStatus("inactive")} style={{ accentColor: OR }} />
                        <span className="text-sm" style={{ color: TEXT }}>ปิดใช้งาน</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <button onClick={() => setMasterModal(false)}
                      className="px-6 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: BORDER, color: MUTED }}>
                      ยกเลิก
                    </button>
                    <button onClick={() => { if (!masterNameTH || !masterNameEN) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกเรียบร้อย"); setMasterModal(false); }}
                      className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: OR }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                      บันทึก
                    </button>
                  </div>
                </div>
              </DraggableModal>
            </>
          );
        })()}

        {/* ═══════════════════════════════════════════ */}
        {/* ── ยี่ห้อ (แบรนด์) ── */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "brand" && (() => {
          const filteredBrands = mockBrands.filter((b) => {
            if (!search) return true;
            const s = search.toLowerCase();
            return b.nameTH.toLowerCase().includes(s) || b.nameEN.toLowerCase().includes(s);
          });
          return (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                  style={{ borderColor: BORDER, color: TEXT }}>
                  ⬆ EXPORT
                </button>
                <div className="flex-1" />
                <div className="relative">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหายี่ห้อ"
                    className="pl-3 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, width: 200 }} />
                </div>
                <button onClick={() => { setBrandNameTH(""); setBrandNameEN(""); setBrandNote(""); setBrandStatus("active"); setBrandModal(true); }}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                  style={{ background: OR }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                  เพิ่มยี่ห้อ
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: BORDER }}>
                <table className="w-full text-sm" style={{ color: TEXT }}>
                  <thead>
                    <tr style={{ background: "#F8F8F8" }}>
                      {["ยี่ห้อ (แบรนด์) (TH)", "ยี่ห้อ (แบรนด์) (EN)", "สถานะ", "จัดการ"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBrands.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูล</td></tr>
                    ) : filteredBrands.map((b) => (
                      <tr key={b.id} className="hover:bg-indigo-50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded border flex items-center justify-center shrink-0"
                              style={{ borderColor: BORDER, background: "#F8F8F8" }}>
                              {b.image ? <span>🖼</span> : <span className="text-xs" style={{ color: MUTED }}>📷</span>}
                            </div>
                            <span>{b.nameTH}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{b.nameEN}</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: b.active ? GREEN_L : "#FCEBEB", color: b.active ? GREEN : "#A32D2D" }}>
                            {b.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                          </span>
                        </td>
                        <td className="px-4 py-3"><button className="text-base hover:opacity-70">✏️</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal */}
              <DraggableModal title="เพิ่มยี่ห้อ (แบรนด์)" open={brandModal} onClose={() => setBrandModal(false)} initialWidth={560}>
                <div className="space-y-4">
                  <Field label="ชื่อยี่ห้อ (TH)" value={brandNameTH} onChange={setBrandNameTH} required />
                  <Field label="ชื่อยี่ห้อ (EN)" value={brandNameEN} onChange={setBrandNameEN} required />

                  {/* Image upload area */}
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded border-2 border-dashed flex items-center justify-center"
                        style={{ borderColor: BORDER, background: "#FAFAFA" }}>
                        <span className="text-xl">📷</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                          style={{ background: OR }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                          อัพโหลดรูปภาพ
                        </button>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium border"
                          style={{ borderColor: RED, color: RED }}>
                          ลบ
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: MUTED }}>อัพโหลดไฟล์ JPG, GIF or PNG. ขนาดไม่เกิน 800K</p>
                  </div>

                  {/* หมายเหตุ */}
                  <div className="field-group">
                    <textarea value={brandNote} onChange={(e) => setBrandNote(e.target.value)} placeholder=" " rows={3}
                      style={{ resize: "vertical" }} />
                    <label>หมายเหตุ</label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="วันที่สร้าง" value={now} disabled />
                    <Field label="วันที่แก้ไขล่าสุด" value={now} disabled />
                  </div>

                  {/* Status radio */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: TEXT }}>สถานะ</p>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="brandStatus" checked={brandStatus === "active"} onChange={() => setBrandStatus("active")} style={{ accentColor: OR }} />
                        <span className="text-sm" style={{ color: TEXT }}>เปิดใช้งาน</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="brandStatus" checked={brandStatus === "inactive"} onChange={() => setBrandStatus("inactive")} style={{ accentColor: OR }} />
                        <span className="text-sm" style={{ color: TEXT }}>ปิดใช้งาน</span>
                      </label>
                    </div>
                  </div>

                  {/* Footer buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button className="px-5 py-2 rounded-lg text-sm font-medium border"
                      style={{ borderColor: RED, color: RED }}>
                      ลบ
                    </button>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setBrandModal(false)}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium border" style={{ borderColor: BORDER, color: MUTED }}>
                        ยกเลิก
                      </button>
                      <button onClick={() => { if (!brandNameTH || !brandNameEN) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกยี่ห้อเรียบร้อย"); setBrandModal(false); }}
                        className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: OR }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
                        บันทึก
                      </button>
                    </div>
                  </div>
                </div>
              </DraggableModal>
            </>
          );
        })()}

        {/* ═══════════════════════════════════════════ */}
        {/* ── Placeholder for remaining tabs ── */}
        {/* ═══════════════════════════════════════════ */}
        {!["product-type", "unit", "pack-size", "dimension", "weight", "brand"].includes(activeTab) && (
          <div className="bg-white rounded-lg border p-10 text-center" style={{ borderColor: BORDER }}>
            <p className="text-sm" style={{ color: MUTED }}>หน้า &ldquo;{currentLabel}&rdquo; — อยู่ระหว่างพัฒนา</p>
          </div>
        )}
      </div>
    </TenantShell>
  );
}

export default function SettingsProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm" style={{ color: "#777" }}>กำลังโหลด...</div>}>
      <SettingsProductInner />
    </Suspense>
  );
}
