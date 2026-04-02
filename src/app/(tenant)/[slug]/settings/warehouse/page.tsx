"use client";

import { useState } from "react";
import TenantShell from "@/components/layout/TenantShell";

/* ── Palette ── */
import { TENANT_PRIMARY as OR, BORDER, TEXT, MUTED, HINT, RED } from "@/lib/theme";

/* ── Mock warehouse data (from onboarding + SA quota) ── */
interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: "คลังสาขา" | "คลังสินค้ากลาง";
  branch: string;
  country: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  googleMap: string;
  note: string;
}

const initialWarehouses: Warehouse[] = [
  {
    id: "1",
    code: "B1-WH-HQ",
    name: "B1-WH-HQ",
    type: "คลังสาขา",
    branch: "B1-WH-HQ",
    country: "Thailand",
    address: "",
    subDistrict: "Phontan",
    district: "Xaysettha",
    province: "Vientiane",
    postalCode: "",
    googleMap: "",
    note: "",
  },
  {
    id: "2",
    code: "B2-WH-EANG",
    name: "B2-WH-EANG",
    type: "คลังสาขา",
    branch: "B2-WH-EANG",
    country: "Thailand",
    address: "000",
    subDistrict: "Phontan",
    district: "Xaysettha",
    province: "Vientiane",
    postalCode: "00000",
    googleMap: "",
    note: "",
  },
];

/* ── Quota from Super Admin ── */
const WAREHOUSE_QUOTA = 2; // จำนวนคลังที่ SA อนุญาต

/* ── Floating label field ── */
function FField({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || ""}
        className="w-full rounded-lg px-4 pt-5 pb-2 text-sm border outline-none focus:ring-2 transition-shadow"
        style={{ borderColor: BORDER, color: TEXT, fontSize: 14, boxShadow: "none" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = OR; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
      />
      <label className="absolute left-3 top-0 -translate-y-1/2 px-1 text-xs pointer-events-none"
        style={{ color: HINT, background: "white", fontSize: 12 }}>
        {label}{required && <span style={{ color: RED }}> *</span>}
      </label>
    </div>
  );
}

/* ── Select field ── */
function FSelect({ label, value, onChange, required, options }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg px-4 pt-5 pb-2 text-sm border outline-none appearance-none bg-white cursor-pointer"
        style={{ borderColor: BORDER, color: TEXT, fontSize: 14, minHeight: 48 }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <label className="absolute left-3 top-0 -translate-y-1/2 px-1 text-xs pointer-events-none"
        style={{ color: HINT, background: "white", fontSize: 12 }}>
        {label}{required && <span style={{ color: RED }}> *</span>}
      </label>
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={HINT} strokeWidth={2} strokeLinecap="round"
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

/* ── Textarea field ── */
function FTextarea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange?: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || ""}
        rows={4}
        className="w-full rounded-lg px-4 pt-5 pb-2 text-sm border outline-none resize-none"
        style={{ borderColor: BORDER, color: TEXT, fontSize: 14 }}
        onFocus={(e) => { e.currentTarget.style.borderColor = OR; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
      />
      <label className="absolute left-3 top-0 -translate-y-1/2 px-1 text-xs pointer-events-none"
        style={{ color: HINT, background: "white", fontSize: 12 }}>
        {label}
      </label>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Warehouse Settings Page
   ═══════════════════════════════════════════════════════════════ */
export default function SettingsWarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Warehouse | null>(null);

  const usedQuota = warehouses.length;
  const canAdd = usedQuota < WAREHOUSE_QUOTA;

  const filtered = warehouses.filter((w) =>
    w.code.toLowerCase().includes(search.toLowerCase()) ||
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  /* Open edit modal */
  const openEdit = (wh: Warehouse) => {
    setEditForm({ ...wh });
    setEditingId(wh.id);
  };

  /* Open add modal */
  const openAdd = () => {
    const newWh: Warehouse = {
      id: String(Date.now()),
      code: "",
      name: "",
      type: "คลังสาขา",
      branch: "",
      country: "Thailand",
      address: "",
      subDistrict: "",
      district: "",
      province: "",
      postalCode: "",
      googleMap: "",
      note: "",
    };
    setEditForm(newWh);
    setEditingId("new");
  };

  /* Save */
  const handleSave = () => {
    if (!editForm) return;
    if (editingId === "new") {
      setWarehouses([...warehouses, editForm]);
    } else {
      setWarehouses(warehouses.map((w) => w.id === editingId ? editForm : w));
    }
    setEditingId(null);
    setEditForm(null);
  };

  /* Delete */
  const handleDelete = () => {
    if (!editingId || editingId === "new") return;
    setWarehouses(warehouses.filter((w) => w.id !== editingId));
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <TenantShell breadcrumb={["ตั้งค่า", "คลังสินค้าทั้งหมด"]} activeModule="settings">
      <div style={{ padding: "24px 32px", fontFamily: "'Sarabun', sans-serif" }}>
        {/* Title */}
        <h1 className="text-xl font-semibold mb-6" style={{ color: OR }}>คลังสินค้าทั้งหมด</h1>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: BORDER }}>
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 gap-4 flex-wrap">
            {/* Export */}
            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors hover:bg-gray-50"
              style={{ borderColor: BORDER, color: TEXT, fontSize: 13 }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              EXPORT
            </button>

            <div className="flex items-center gap-3 flex-1 justify-end">
              {/* Search */}
              <div className="relative" style={{ width: 300 }}>
                <input
                  type="text"
                  placeholder="ค้นหาเลขที่, ชื่อคลังสินค้า"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg pl-4 pr-10 py-2.5 text-sm border outline-none"
                  style={{ borderColor: BORDER, fontSize: 13 }}
                />
              </div>

              {/* Add button with quota */}
              <button
                disabled={!canAdd}
                onClick={() => canAdd && openAdd()}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity flex items-center gap-2"
                style={{
                  background: canAdd ? OR : "#ccc",
                  opacity: canAdd ? 1 : 0.6,
                  cursor: canAdd ? "pointer" : "not-allowed",
                  fontSize: 13,
                }}
              >
                <span>เพิ่มคลังสินค้า</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{
                    background: canAdd ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)",
                    fontSize: 11,
                  }}>
                  {usedQuota}/{WAREHOUSE_QUOTA}
                </span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div>
            <table className="w-full text-sm" style={{ fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}`, background: "#FAFAFA" }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: MUTED, width: "20%" }}>รหัสคลังสินค้า</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: MUTED }}>ชื่อคลังสินค้า</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: MUTED, width: "18%" }}>ประเภทคลังสินค้า</th>
                  <th className="text-center px-4 py-3 font-medium" style={{ color: MUTED, width: "12%" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((wh) => (
                  <tr key={wh.id} style={{ borderBottom: `1px solid #F0F0F0` }}>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(wh)} className="text-sm font-medium hover:underline" style={{ color: OR }}>{wh.code}</button>
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT }}>{wh.name}</td>
                    <td className="px-4 py-3" style={{ color: TEXT }}>{wh.type}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(wh)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-50 transition-colors"
                          style={{ color: OR }}>
                          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                          style={{ color: RED }}>
                          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8" style={{ color: MUTED }}>ไม่พบข้อมูลคลังสินค้า</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-3 px-4 py-3" style={{ borderTop: `1px solid ${BORDER}`, fontSize: 13, color: MUTED }}>
            <span>จำนวนรายการต่อหน้า</span>
            <select className="border rounded px-2 py-1 text-sm" style={{ borderColor: BORDER }}>
              <option>25</option>
            </select>
            <span>1-{filtered.length} of {filtered.length}</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded flex items-center justify-center" style={{ color: MUTED }}>‹</button>
              <button className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: OR }}>1</button>
              <button className="w-7 h-7 rounded flex items-center justify-center" style={{ color: MUTED }}>›</button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ Edit / Add Modal ══════ */}
      {editingId && editForm && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => { setEditingId(null); setEditForm(null); }} />

          {/* SlidePanel */}
          <div className="relative w-full max-w-[520px] bg-white h-full shadow-2xl flex flex-col animate-slideIn z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ background: OR }}>
              <h3 className="text-white font-semibold text-sm">
                {editingId === "new" ? "เพิ่มคลังสินค้า" : "แก้ไขคลังสินค้า"}
              </h3>
              <div className="flex items-center gap-2">
                <button className="text-white/70 hover:text-white transition-colors">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 3h6v6" /><path d="M10 14L21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                </button>
                <button className="text-white/70 hover:text-white transition-colors">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14" /><path d="M18 13l-6 6" /><path d="M6 13l6 6" /></svg>
                </button>
                <button className="text-white/70 hover:text-white transition-colors">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                </button>
                <button onClick={() => { setEditingId(null); setEditForm(null); }} className="text-white/70 hover:text-white transition-colors">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* รหัสคลังสินค้า */}
              <FField label="รหัสคลังสินค้า" value={editForm.code} required
                onChange={(v) => setEditForm({ ...editForm, code: v })} />

              {/* ชื่อคลังสินค้า */}
              <FField label="ชื่อคลังสินค้า" value={editForm.name} required
                onChange={(v) => setEditForm({ ...editForm, name: v })} />

              {/* ประเภทคลังสินค้า */}
              <div>
                <div className="text-sm font-medium mb-2" style={{ color: TEXT }}>
                  ประเภทคลังสินค้า<span style={{ color: RED }}>*</span>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: TEXT }}>
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: editForm.type === "คลังสินค้ากลาง" ? OR : BORDER }}
                      onClick={() => setEditForm({ ...editForm, type: "คลังสินค้ากลาง" })}>
                      {editForm.type === "คลังสินค้ากลาง" && <span className="w-2.5 h-2.5 rounded-full" style={{ background: OR }} />}
                    </span>
                    คลังสินค้ากลาง
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: TEXT }}>
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: editForm.type === "คลังสาขา" ? OR : BORDER }}
                      onClick={() => setEditForm({ ...editForm, type: "คลังสาขา" })}>
                      {editForm.type === "คลังสาขา" && <span className="w-2.5 h-2.5 rounded-full" style={{ background: OR }} />}
                    </span>
                    คลังสินค้าสาขา
                  </label>
                </div>
              </div>

              {/* เลือกสาขา */}
              <FSelect label="เลือกสาขา" value={editForm.branch} required
                options={["B1-WH-HQ", "B2-WH-EANG"]}
                onChange={(v) => setEditForm({ ...editForm, branch: v })} />

              {/* ประเทศ + ที่อยู่ */}
              <div className="grid grid-cols-2 gap-4">
                <FSelect label="ประเทศ" value={editForm.country} required
                  options={["Thailand", "Laos", "Vietnam", "Cambodia"]}
                  onChange={(v) => setEditForm({ ...editForm, country: v })} />
                <FField label="ที่อยู่" value={editForm.address}
                  onChange={(v) => setEditForm({ ...editForm, address: v })} />
              </div>

              {/* แขวง/ตำบล + อำเภอ/เขต */}
              <div className="grid grid-cols-2 gap-4">
                <FField label="แขวง/ตำบล" value={editForm.subDistrict}
                  onChange={(v) => setEditForm({ ...editForm, subDistrict: v })} />
                <FField label="อำเภอ/เขต" value={editForm.district}
                  onChange={(v) => setEditForm({ ...editForm, district: v })} />
              </div>

              {/* จังหวัด + รหัสไปรษณีย์ */}
              <div className="grid grid-cols-2 gap-4">
                <FField label="จังหวัด" value={editForm.province}
                  onChange={(v) => setEditForm({ ...editForm, province: v })} />
                <FField label="รหัสไปรษณีย์" value={editForm.postalCode}
                  onChange={(v) => setEditForm({ ...editForm, postalCode: v })} />
              </div>

              {/* URL Google Map */}
              <FField label="URL Google Map" value={editForm.googleMap} placeholder="กรอก URL Google Map"
                onChange={(v) => setEditForm({ ...editForm, googleMap: v })} />

              {/* หมายเหตุ */}
              <FTextarea label="หมายเหตุ" value={editForm.note} placeholder="ระบุหมายเหตุ"
                onChange={(v) => setEditForm({ ...editForm, note: v })} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
              {editingId !== "new" ? (
                <button onClick={handleDelete}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-red-50"
                  style={{ borderColor: RED, color: RED, fontSize: 14 }}>
                  ลบ
                </button>
              ) : <div />}
              <div className="flex items-center gap-3">
                <button onClick={() => { setEditingId(null); setEditForm(null); }}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-50"
                  style={{ borderColor: BORDER, color: TEXT, fontSize: 14 }}>
                  ยกเลิก
                </button>
                <button onClick={handleSave}
                  className="px-8 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: OR, fontSize: 14 }}>
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* slide-in animation */}
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slideIn { animation: slideIn 0.25s ease-out; }
      `}</style>
    </TenantShell>
  );
}
