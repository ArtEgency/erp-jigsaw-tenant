"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TenantShell from "@/components/layout/TenantShell";

/* ── colours ── */
import { TENANT_PRIMARY as OR, GREEN, GREEN_L, RED_D as RED, RED_L, BORDER, BORDER2, TEXT, MUTED } from "@/lib/theme";
const HINT = "#AAAAAA";

type Screen = "s1" | "s2" | "s3" | "s3e" | "s4" | "s5" | "s5e" | "s6";

/* ── mock data ── */
const systemRoles = [
  { code: "TEST_REDIRECT", name: "TEST_REDIRECT", users: 1, status: "เปิดใช้งาน" as const, editable: true },
  { code: "MASTER2", name: "MASTER2", users: 1, status: "เปิดใช้งาน" as const, editable: true },
  { code: "SALE", name: "SALE", users: 1, status: "เปิดใช้งาน" as const, editable: true },
  { code: "ADMIN", name: "ผู้ดูแลระบบ", users: 2, status: "เปิดใช้งาน" as const, editable: false },
];

const erpRoles = [
  { code: "SaleP", name: "SaleP", users: 2, status: "เปิดใช้งาน" as const, editable: true },
  { code: "Admin", name: "Admin", users: 2, status: "เปิดใช้งาน" as const, editable: true },
  { code: "test", name: "test", users: 0, status: "ปิดใช้งาน" as const, editable: true },
  { code: "1", name: "1", users: 0, status: "ปิดใช้งาน" as const, editable: true },
  { code: "เ", name: "เ", users: 0, status: "ปิดใช้งาน" as const, editable: true },
  { code: "test edit", name: "test", users: 1, status: "ปิดใช้งาน" as const, editable: true },
  { code: "EMP001", name: "Employee", users: 0, status: "ปิดใช้งาน" as const, editable: false },
];

const menuItems = [
  "สินค้า", "จัดซื้อ", "คลังสินค้า", "ลูกค้า / ผู้จำหน่าย", "ขาย",
  "การเงินและบัญชี", "การผลิต", "บุคคล", "รายงาน", "การวิเคราะห์", "ตั้งค่า",
];

const branchOptions = [
  { code: "B1-WH-HQ", name: "สำนักงานใหญ่" },
  { code: "B2-WH-EANG", name: "สาขา EANG" },
  { code: "B3-CNX", name: "สาขาเชียงใหม่" },
];
const warehouseOptions = [
  { code: "WH-HQ", name: "คลังสำนักงานใหญ่" },
  { code: "WH-EANG", name: "คลัง EANG" },
  { code: "WH-CNX", name: "คลังเชียงใหม่" },
];

/* ── Resizable Column Hook ── */
function useResizableColumns(initialWidths: number[]) {
  const [widths, setWidths] = useState(initialWidths);
  const resizing = useRef<{ idx: number; startX: number; startW: number } | null>(null);

  const onMouseDown = useCallback((idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    resizing.current = { idx, startX: e.clientX, startW: widths[idx] };
    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return;
      const diff = ev.clientX - resizing.current.startX;
      const newW = Math.max(60, resizing.current.startW + diff);
      setWidths((prev) => { const n = [...prev]; n[resizing.current!.idx] = newW; return n; });
    };
    const onUp = () => { resizing.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [widths]);

  return { widths, onMouseDown };
}

/* ── Draggable / Resizable Modal ── */
function DraggableModal({ title, open, onClose, children, initialWidth = 500, initialX, initialY }: {
  title: string; open: boolean; onClose: () => void; children: React.ReactNode;
  initialWidth?: number; initialX?: number; initialY?: number;
}) {
  const [pos, setPos] = useState({ x: initialX ?? 0, y: initialY ?? 0 });
  const [size, setSize] = useState({ w: initialWidth, h: 0 });
  const [centered, setCentered] = useState(!initialX && !initialY);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && centered && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setPos({ x: (window.innerWidth - rect.width) / 2, y: Math.max(60, (window.innerHeight - rect.height) / 2) });
      setSize((s) => ({ ...s, h: rect.height }));
    }
  }, [open, centered]);

  if (!open) return null;

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setCentered(false);
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: pos.x, posY: pos.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({ x: dragRef.current.posX + (ev.clientX - dragRef.current.startX), y: dragRef.current.posY + (ev.clientY - dragRef.current.startY) });
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCentered(false);
    const rect = modalRef.current?.getBoundingClientRect();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, w: rect?.width || size.w, h: rect?.height || size.h };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      setSize({ w: Math.max(320, resizeRef.current.w + (ev.clientX - resizeRef.current.startX)), h: Math.max(200, resizeRef.current.h + (ev.clientY - resizeRef.current.startY)) });
    };
    const onUp = () => { resizeRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div ref={modalRef}
      className="fixed z-[500] flex flex-col rounded-xl shadow-2xl overflow-hidden"
      style={{
        ...(centered ? { left: "50%", top: "50%", transform: "translate(-50%, -50%)" } : { left: pos.x, top: pos.y }),
        width: size.w,
        ...(size.h > 0 && !centered ? { height: size.h } : {}),
        maxHeight: "90vh",
      }}
    >
      {/* Header — draggable */}
      <div onMouseDown={onDragStart} className="flex items-center px-4 py-3 cursor-move shrink-0" style={{ background: OR }}>
        <span className="text-white font-bold text-sm flex-1">{title}</span>
        <div className="flex items-center gap-1.5">
          <button className="text-white/70 hover:text-white text-base p-0.5" title="เปิด Tab ใหม่">↗</button>
          <button className="text-white/70 hover:text-white text-base p-0.5" title="ปักหมุดตำแหน่ง">📌</button>
          <button className="text-white/70 hover:text-white text-base p-0.5" title="ย่อ">□</button>
          <button onClick={onClose} className="text-white/70 hover:text-white text-lg p-0.5" title="ปิด">✕</button>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-white p-5">
        {children}
      </div>
      {/* Resize handle */}
      <div onMouseDown={onResizeStart}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
        style={{ background: "linear-gradient(135deg, transparent 50%, #ccc 50%)" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   F-03 MAIN PAGE
   ══════════════════════════════════════════════════ */
function RolePermissionInner() {
  const searchParams = useSearchParams();
  const initialScreen = (searchParams.get("screen") as Screen) || "s1";
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showPopup, setShowPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // S3 form state
  const [roleCode, setRoleCode] = useState("");
  const [roleName, setRoleName] = useState("");
  const [roleActive, setRoleActive] = useState(true);
  const [menuAccess, setMenuAccess] = useState<Record<string, "deny" | "view">>(
    Object.fromEntries(menuItems.map((m) => [m, "view"]))
  );

  // S5 ERP form state
  const [erpCode, setErpCode] = useState("");
  const [erpName, setErpName] = useState("");
  const [erpActive, setErpActive] = useState(true);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);

  // Error states
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [codeError, setCodeError] = useState("");
  const [showDeleteBlock, setShowDeleteBlock] = useState(false);

  // Resizable columns for S1
  const s1Cols = useResizableColumns([160, 250, 200, 150, 100]);
  // Resizable columns for S2 (same structure as S1)
  const s2Cols = useResizableColumns([160, 250, 200, 150, 100]);

  // Sync screen from URL query param
  useEffect(() => {
    const s = searchParams.get("screen") as Screen;
    if (s && ["s1","s2","s3","s3e","s4","s5","s5e","s6"].includes(s)) {
      setScreen(s);
    }
  }, [searchParams]);

  const go = (s: Screen) => { setScreen(s); setCodeError(""); window.scrollTo(0, 0); };

  const toast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  /* ── Sub tabs component ── */
  const SubTabs = ({ active, tabs, onTab }: { active: string; tabs: { id: string; label: string }[]; onTab: (id: string) => void }) => (
    <div className="flex items-center gap-1 mb-5">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onTab(t.id)}
          className="px-5 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: active === t.id ? OR : "transparent",
            color: active === t.id ? "white" : OR,
          }}
        >{t.label}</button>
      ))}
    </div>
  );

  /* ── Table header with resizable columns ── */
  const TH = ({ children, width, onResize, isLast }: { children: React.ReactNode; width: number; onResize?: (e: React.MouseEvent) => void; isLast?: boolean }) => (
    <th className="text-left text-xs font-semibold relative select-none" style={{ width, minWidth: 60, padding: "12px 14px", color: TEXT, background: "#F9F9F9", borderBottom: `1px solid ${BORDER}` }}>
      {children}
      {!isLast && onResize && (
        <div onMouseDown={onResize}
          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-300 transition-colors"
          style={{ background: "transparent" }}
        />
      )}
    </th>
  );

  /* ScreenMetaBar removed — dev nav bar no longer shown */

  /* ── Status badge ── */
  const StatusBadge = ({ status }: { status: string }) => (
    <span className="px-3 py-1 rounded-full text-[11px] font-medium" style={{
      background: status === "เปิดใช้งาน" ? GREEN_L : RED_L,
      color: status === "เปิดใช้งาน" ? GREEN : RED,
    }}>{status}</span>
  );

  /* ── Floating field ── */
  const Field = ({ label, value, onChange, required, error, disabled }: {
    label: string; value: string; onChange?: (v: string) => void; required?: boolean; error?: string; disabled?: boolean;
  }) => (
    <div className="field-group">
      <input type="text" value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} />
      <label>{label}{required && <span className="text-[#E53935] ml-0.5">*</span>}</label>
      {error && <div className="text-[10px] mt-1" style={{ color: RED }}>{error}</div>}
    </div>
  );

  const breadcrumbForScreen = (): string[] => {
    switch (screen) {
      case "s1": case "s2": return ["บุคคล", "สร้างสิทธิ์ผู้ใช้งาน"];
      case "s3": case "s3e": return ["บุคคล", "สร้างสิทธิ์ผู้ใช้งาน", "สร้างสิทธิ์ SYSTEM"];
      case "s4": return ["บุคคล", "สร้างสิทธิ์ผู้ใช้งาน", "สร้างสิทธิ์ SYSTEM"];
      case "s5": case "s5e": return ["บุคคล", "สร้างสิทธิ์ผู้ใช้งาน", "สร้างสิทธิ์ ERP"];
      case "s6": return ["บุคคล", "สร้างสิทธิ์ผู้ใช้งาน"];
      default: return [];
    }
  };

  return (
    <TenantShell breadcrumb={breadcrumbForScreen()} activeModule="hr">

      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-20 right-5 z-[600] px-5 py-3 rounded-lg shadow-xl text-sm font-medium text-white transition-all"
          style={{ background: toastType === "success" ? GREEN : RED }}
        >{toastMsg}</div>
      )}

      {/* ═══════ S1 — Role List (สิทธิ์จัดการเมนู) ═══════ */}
      {screen === "s1" && (
        <>
          <div className="px-5 pt-5">
            <h1 className="text-xl font-bold mb-1" style={{ color: TEXT }}>สร้างสิทธิ์ผู้ใช้งาน</h1>
            <SubTabs active="system" tabs={[
              { id: "system", label: "สิทธิ์จัดการเมนู" },
              { id: "erp", label: "สิทธิ์จัดการส่วนงาน" },
            ]} onTab={(id) => id === "erp" && go("s2")} />

            {/* Data list card */}
            <div className="bg-white rounded-lg" style={{ border: `1px solid ${BORDER}` }}>
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm" style={{ border: `1px solid ${BORDER2}`, color: TEXT }}>
                  <span>📤</span> ส่งออกรายงาน
                </button>
                <div className="flex items-center gap-3">
                  <div className="field-group" style={{ width: 260 }}>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <label>ค้นหาข้อมูลตามสิทธิ์</label>
                  </div>
                  <button onClick={() => go("s3")} className="px-5 py-2.5 rounded-md text-sm font-bold border-none text-white" style={{ background: OR }}>
                    เพิ่มสิทธิ์ SYSTEM
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <TH width={s1Cols.widths[0]} onResize={(e) => s1Cols.onMouseDown(0, e)}>รหัสสิทธิ์</TH>
                      <TH width={s1Cols.widths[1]} onResize={(e) => s1Cols.onMouseDown(1, e)}>ชื่อสิทธิ์การใช้งาน</TH>
                      <TH width={s1Cols.widths[2]} onResize={(e) => s1Cols.onMouseDown(2, e)}>จำนวนคนที่ใช้งานสิทธิ์</TH>
                      <TH width={s1Cols.widths[3]} onResize={(e) => s1Cols.onMouseDown(3, e)}>สถานะ</TH>
                      <TH width={s1Cols.widths[4]} isLast>จัดการ</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {systemRoles.map((r) => (
                      <tr key={r.code} className="hover:bg-orange-50/50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td className="px-3.5 py-3 text-sm font-medium" style={{ color: OR, cursor: "pointer" }}>{r.code}</td>
                        <td className="px-3.5 py-3 text-sm" style={{ color: TEXT }}>{r.name}</td>
                        <td className="px-3.5 py-3 text-sm text-center" style={{ color: TEXT }}>{r.users}</td>
                        <td className="px-3.5 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-3.5 py-3">
                          <div className="flex items-center gap-2">
                            {r.editable ? (
                              <>
                                <button className="text-base" style={{ color: MUTED }} title="แก้ไข">✏️</button>
                                <button onClick={() => setShowDeleteBlock(true)} className="text-base" style={{ color: MUTED }} title="ลบ">🗑️</button>
                              </>
                            ) : (
                              <button className="text-base" style={{ color: MUTED }} title="ดู">👁</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-3 px-4 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                <span className="text-xs" style={{ color: MUTED }}>จำนวนรายการต่อหน้า</span>
                <select className="text-xs rounded px-2 py-1" style={{ border: `1px solid ${BORDER2}` }}>
                  <option>25</option><option>50</option><option>100</option>
                </select>
                <span className="text-xs" style={{ color: MUTED }}>1-4 of 4</span>
                <button className="text-sm px-1" style={{ color: MUTED }}>&lt;</button>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: OR }}>1</span>
                <button className="text-sm px-1" style={{ color: MUTED }}>&gt;</button>
              </div>
            </div>
          </div>

          {/* Delete block modal */}
          {showDeleteBlock && (
            <>
              <div className="fixed inset-0 bg-black/40 z-[500]" onClick={() => setShowDeleteBlock(false)} />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[510] bg-white rounded-xl shadow-2xl p-6 w-[400px]">
                <div className="text-center text-3xl mb-3">⚠️</div>
                <div className="text-base font-bold text-center mb-2" style={{ color: RED }}>ไม่สามารถลบได้</div>
                <div className="text-sm text-center mb-4" style={{ color: TEXT }}>Role นี้มีผู้ใช้งานอยู่ <strong>2 คน</strong><br />กรุณาย้ายผู้ใช้ออกก่อนจึงจะลบได้</div>
                <button onClick={() => setShowDeleteBlock(false)} className="w-full py-2.5 rounded-lg text-sm font-bold text-white border-none" style={{ background: OR }}>เข้าใจแล้ว</button>
              </div>
            </>
          )}
        </>
      )}

      {/* ═══════ S2 — Role List (สิทธิ์จัดการส่วนงาน) ═══════ */}
      {screen === "s2" && (
        <>
          <div className="px-5 pt-5">
            <h1 className="text-xl font-bold mb-1" style={{ color: TEXT }}>สร้างสิทธิ์ผู้ใช้งาน</h1>
            <SubTabs active="erp" tabs={[
              { id: "system", label: "สิทธิ์จัดการเมนู" },
              { id: "erp", label: "สิทธิ์จัดการส่วนงาน" },
            ]} onTab={(id) => id === "system" && go("s1")} />

            <div className="bg-white rounded-lg" style={{ border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm" style={{ border: `1px solid ${BORDER2}`, color: TEXT }}>
                  <span>📤</span> ส่งออกรายงาน
                </button>
                <div className="flex items-center gap-3">
                  <div className="field-group" style={{ width: 260 }}>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <label>ค้นหาข้อมูลตามสิทธิ์</label>
                  </div>
                  <button onClick={() => go("s5")} className="px-5 py-2.5 rounded-md text-sm font-bold border-none text-white" style={{ background: OR }}>
                    สิทธิ์จัดการส่วนงาน
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <TH width={s2Cols.widths[0]} onResize={(e) => s2Cols.onMouseDown(0, e)}>รหัสสิทธิ์</TH>
                      <TH width={s2Cols.widths[1]} onResize={(e) => s2Cols.onMouseDown(1, e)}>ชื่อสิทธิ์การใช้งาน</TH>
                      <TH width={s2Cols.widths[2]} onResize={(e) => s2Cols.onMouseDown(2, e)}>จำนวนคนที่ใช้งานสิทธิ์</TH>
                      <TH width={s2Cols.widths[3]} onResize={(e) => s2Cols.onMouseDown(3, e)}>สถานะ</TH>
                      <TH width={s2Cols.widths[4]} isLast>จัดการ</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {erpRoles.map((r) => (
                      <tr key={r.code} className="hover:bg-orange-50/50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td className="px-3.5 py-3 text-sm font-medium" style={{ color: OR, cursor: "pointer" }}>{r.code}</td>
                        <td className="px-3.5 py-3 text-sm" style={{ color: TEXT }}>{r.name}</td>
                        <td className="px-3.5 py-3 text-sm text-center" style={{ color: TEXT }}>{r.users}</td>
                        <td className="px-3.5 py-3"><StatusBadge status={r.status} /></td>
                        <td className="px-3.5 py-3">
                          {r.editable ? (
                            <div className="flex items-center gap-2">
                              <button className="text-base" style={{ color: MUTED }}>✏️</button>
                              <button className="text-base" style={{ color: MUTED }}>🗑️</button>
                            </div>
                          ) : (
                            <button className="text-base" style={{ color: MUTED }}>👁</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-3 px-4 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                <span className="text-xs" style={{ color: MUTED }}>จำนวนรายการต่อหน้า</span>
                <select className="text-xs rounded px-2 py-1" style={{ border: `1px solid ${BORDER2}` }}><option>25</option></select>
                <span className="text-xs" style={{ color: MUTED }}>1-7 of 7</span>
                <button className="text-sm px-1" style={{ color: MUTED }}>&lt;</button>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: OR }}>1</span>
                <button className="text-sm px-1" style={{ color: MUTED }}>&gt;</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════ S3 — สร้างสิทธิ์ SYSTEM ═══════ */}
      {(screen === "s3" || screen === "s3e" || screen === "s4") && (
        <>
          <div className="px-5 pt-5">
            <h1 className="text-xl font-bold mb-4" style={{ color: TEXT }}>สร้างสิทธิ์ผู้ใช้งาน</h1>

            {/* Form card */}
            <div className="bg-white rounded-lg mb-4" style={{ border: `1px solid ${BORDER}`, padding: 20 }}>
              <div className="text-sm font-bold mb-4" style={{ color: TEXT }}>สร้างสิทธิ์การใช้งาน SYSTEM</div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Field label="รหัสสิทธิ์การใช้งาน" value={roleCode} onChange={setRoleCode} required
                    error={screen === "s3e" ? "✗ รหัสสิทธิ์นี้มีอยู่แล้วในระบบ" : ""}
                  />
                </div>
                <div className="flex-1">
                  <Field label="ชื่อสิทธิ์ใช้งาน" value={roleName} onChange={setRoleName} required />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => setRoleActive(!roleActive)}
                    className="w-10 h-5 rounded-full relative transition-colors"
                    style={{ background: roleActive ? OR : "#ccc" }}
                  >
                    <div className="absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all shadow" style={{ left: roleActive ? 20 : 2 }} />
                  </button>
                  <span className="text-sm" style={{ color: TEXT }}>เปิดใช้งาน</span>
                </div>
              </div>
            </div>

            {/* Menu permission table */}
            <div className="bg-white rounded-lg" style={{ border: `1px solid ${BORDER}` }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F9F9F9" }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: TEXT, borderBottom: `1px solid ${BORDER}` }}>เมนู</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: TEXT, borderBottom: `1px solid ${BORDER}`, width: 140 }}>ห้ามเข้าดู</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: TEXT, borderBottom: `1px solid ${BORDER}`, width: 140 }}>เข้าดูได้</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold" style={{ color: TEXT, borderBottom: `1px solid ${BORDER}`, width: 180 }}>ตั้งค่าสิทธิ์เฉพาะกรณี</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((m) => (
                    <tr key={m} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td className="px-4 py-3 text-sm" style={{ color: OR }}>{m}</td>
                      <td className="text-center px-4 py-3">
                        <input type="radio" name={`access-${m}`} checked={menuAccess[m] === "deny"} onChange={() => setMenuAccess((p) => ({ ...p, [m]: "deny" }))}
                          className="w-4 h-4" style={{ accentColor: OR }}
                        />
                      </td>
                      <td className="text-center px-4 py-3">
                        <input type="radio" name={`access-${m}`} checked={menuAccess[m] === "view"} onChange={() => setMenuAccess((p) => ({ ...p, [m]: "view" }))}
                          className="w-4 h-4" style={{ accentColor: OR }}
                        />
                      </td>
                      <td className="text-center px-4 py-3">
                        <button onClick={() => { go("s4"); setShowPopup(true); }}
                          className="px-4 py-1.5 rounded-md text-xs font-bold text-white"
                          style={{ background: menuAccess[m] === "view" ? OR : "#ccc", cursor: menuAccess[m] === "view" ? "pointer" : "not-allowed" }}
                          disabled={menuAccess[m] !== "view"}
                        >ตั้งค่า</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 mt-5 mb-5">
              <button onClick={() => go("s1")} className="px-8 py-2.5 rounded-lg text-sm font-medium" style={{ border: `1px solid ${BORDER2}`, color: TEXT }}>ยกเลิก</button>
              <button onClick={() => { toast("บันทึกสิทธิ์สำเร็จ"); go("s1"); }}
                className="px-8 py-2.5 rounded-lg text-sm font-bold text-white border-none"
                style={{ background: screen === "s3e" ? "#ccc" : OR, cursor: screen === "s3e" ? "not-allowed" : "pointer" }}
                disabled={screen === "s3e"}
              >บันทึก</button>
            </div>
          </div>

          {/* S4 — Popup ตั้งค่าสิทธิ์เฉพาะกรณี */}
          <DraggableModal title="ตั้งค่าสิทธิ์เฉพาะกรณี — สินค้า" open={screen === "s4"} onClose={() => go("s3")} initialWidth={480}>
            <div className="text-sm font-bold mb-4" style={{ color: TEXT }}>Action ที่อนุญาต</div>
            {["สร้าง", "แก้ไข", "อนุมัติ", "ยกเลิก"].map((action) => (
              <label key={action} className="flex items-center gap-3 py-2.5 cursor-pointer" style={{ borderBottom: `1px solid #f0f0f0` }}>
                <input type="checkbox" defaultChecked className="w-4 h-4" style={{ accentColor: OR }} />
                <span className="text-sm" style={{ color: TEXT }}>{action}</span>
              </label>
            ))}
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => go("s3")} className="px-6 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${BORDER2}`, color: TEXT }}>ยกเลิก</button>
              <button onClick={() => go("s3")} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white border-none" style={{ background: OR }}>บันทึก</button>
            </div>
          </DraggableModal>
        </>
      )}

      {/* ═══════ S5 — สร้างสิทธิ์ ERP Permission ═══════ */}
      {(screen === "s5" || screen === "s5e") && (
        <>
          <div className="px-5 pt-5">
            <h1 className="text-xl font-bold mb-4" style={{ color: TEXT }}>สร้างสิทธิ์ผู้ใช้งาน</h1>

            <div className="bg-white rounded-lg mb-4" style={{ border: `1px solid ${BORDER}`, padding: 24 }}>
              <div className="text-sm font-bold mb-5" style={{ color: TEXT }}>สร้างสิทธิ์การใช้งาน ERP</div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="field-group">
                    <input type="text" value={erpCode} onChange={(e) => setErpCode(e.target.value)} placeholder=" " />
                    <label>รหัสสิทธิ์การใช้งาน<span className="text-[#E53935] ml-0.5">*</span></label>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="field-group">
                    <input type="text" value={erpName} onChange={(e) => setErpName(e.target.value)} placeholder=" " />
                    <label>ชื่อสิทธิ์ผู้ใช้งาน<span className="text-[#E53935] ml-0.5">*</span></label>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => setErpActive(!erpActive)}
                    className="w-10 h-5 rounded-full relative transition-colors"
                    style={{ background: erpActive ? OR : "#ccc" }}
                  >
                    <div className="absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all shadow" style={{ left: erpActive ? 20 : 2 }} />
                  </button>
                  <span className="text-sm" style={{ color: TEXT }}>{erpActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}</span>
                </div>
              </div>

              {/* Branch dropdown */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="field-group" style={screen === "s5e" ? { borderColor: RED } : {}}>
                    <select value={selectedBranches[0] || ""} onChange={(e) => setSelectedBranches(e.target.value ? [e.target.value] : [])}
                      className="w-full appearance-none bg-transparent pr-8"
                      style={{ color: selectedBranches.length > 0 ? TEXT : HINT }}
                    >
                      <option value="" disabled>กรอกส่วนงานที่เข้าถึง</option>
                      {branchOptions.map((b) => (
                        <option key={b.code} value={b.code}>{b.code}</option>
                      ))}
                    </select>
                    <label style={screen === "s5e" ? { color: RED } : {}}>ส่วนงานที่เข้าถึง<span className="text-[#E53935] ml-0.5">*</span></label>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: MUTED }}>▼</div>
                  </div>
                  {screen === "s5e" && <div className="text-[10px] mt-1" style={{ color: RED }}>— ต้องเลือกอย่างน้อย 1</div>}
                </div>
                <div className="flex-1">
                  <div className="field-group" style={screen === "s5e" ? { borderColor: RED } : {}}>
                    <select value={selectedWarehouses[0] || ""} onChange={(e) => setSelectedWarehouses(e.target.value ? [e.target.value] : [])}
                      className="w-full appearance-none bg-transparent pr-8"
                      style={{ color: selectedWarehouses.length > 0 ? TEXT : HINT }}
                    >
                      <option value="" disabled>กรอกคลังที่เข้าถึง</option>
                      {warehouseOptions.map((w) => (
                        <option key={w.code} value={w.code}>{w.code}</option>
                      ))}
                    </select>
                    <label style={screen === "s5e" ? { color: RED } : {}}>คลังสินค้าที่เข้าถึง<span className="text-[#E53935] ml-0.5">*</span></label>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs" style={{ color: MUTED }}>▼</div>
                  </div>
                  {screen === "s5e" && <div className="text-[10px] mt-1" style={{ color: RED }}>— ต้องเลือกอย่างน้อย 1</div>}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-5 mb-5">
              <button onClick={() => go("s2")} className="px-8 py-2.5 rounded-lg text-sm font-medium" style={{ border: `1px solid ${BORDER2}`, color: TEXT }}>ยกเลิก</button>
              <button onClick={() => { toast("บันทึกสิทธิ์ ERP สำเร็จ"); go("s2"); }}
                className="px-8 py-2.5 rounded-lg text-sm font-bold text-white border-none"
                style={{ background: screen === "s5e" ? "#ccc" : OR, cursor: screen === "s5e" ? "not-allowed" : "pointer" }}
                disabled={screen === "s5e"}
              >บันทึก</button>
            </div>
          </div>
        </>
      )}

      {/* ═══════ S6 — Error States ═══════ */}
      {screen === "s6" && (
        <>
          <div className="px-5 pt-5">
            <h1 className="text-xl font-bold mb-4" style={{ color: TEXT }}>Error States</h1>

            <div className="grid grid-cols-2 gap-4">
              {/* Error 1 */}
              <div className="bg-white rounded-lg p-4" style={{ border: `1px solid ${BORDER}` }}>
                <div className="text-sm font-bold mb-2" style={{ color: RED }}>Error 1 — รหัสสิทธิ์ซ้ำ</div>
                <div className="text-xs" style={{ color: MUTED }}>error inline ทันที · ปุ่มบันทึก disabled</div>
                <button onClick={() => go("s3e")} className="mt-3 px-4 py-1.5 rounded-md text-xs font-bold text-white" style={{ background: OR }}>ดูหน้าจอ →</button>
              </div>
              {/* Error 2 */}
              <div className="bg-white rounded-lg p-4" style={{ border: `1px solid ${BORDER}` }}>
                <div className="text-sm font-bold mb-2" style={{ color: RED }}>Error 2 — ไม่เลือก Branch/WH</div>
                <div className="text-xs" style={{ color: MUTED }}>Validation block · ต้องเลือก ≥ 1</div>
                <button onClick={() => go("s5e")} className="mt-3 px-4 py-1.5 rounded-md text-xs font-bold text-white" style={{ background: OR }}>ดูหน้าจอ →</button>
              </div>
              {/* Error 3 */}
              <div className="bg-white rounded-lg p-4" style={{ border: `1px solid ${BORDER}` }}>
                <div className="text-sm font-bold mb-2" style={{ color: RED }}>Error 3 — ลบ Role ที่มี User</div>
                <div className="text-xs" style={{ color: MUTED }}>ระบบ block · แสดงจำนวน User</div>
                <button onClick={() => { go("s1"); setTimeout(() => setShowDeleteBlock(true), 300); }} className="mt-3 px-4 py-1.5 rounded-md text-xs font-bold text-white" style={{ background: OR }}>ดูหน้าจอ →</button>
              </div>
              {/* Error 4 */}
              <div className="bg-white rounded-lg p-4" style={{ border: `1px solid ${BORDER}` }}>
                <div className="text-sm font-bold mb-2" style={{ color: RED }}>Error 4 — DB Error</div>
                <div className="text-xs" style={{ color: MUTED }}>แสดง toast error · ข้อมูลไม่หาย</div>
                <button onClick={() => toast("บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง", "error")} className="mt-3 px-4 py-1.5 rounded-md text-xs font-bold text-white" style={{ background: OR }}>ดู Toast →</button>
              </div>
            </div>
          </div>
        </>
      )}

    </TenantShell>
  );
}

export default function RolePermissionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RolePermissionInner />
    </Suspense>
  );
}
