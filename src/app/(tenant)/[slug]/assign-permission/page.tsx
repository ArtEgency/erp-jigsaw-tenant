"use client";

import { useState, Suspense } from "react";
import TenantShell from "@/components/layout/TenantShell";

/* ── Palette ── */
import { TENANT_PRIMARY as OR, TENANT_HOVER as OR_D, GREEN, GREEN_L, RED, BORDER, TEXT, MUTED } from "@/lib/theme";

/* ── Mock Data ── */
interface PermUser {
  id: string;
  code: string;
  name: string;
  avatar: string;
  department: string;
  position: string;
  menuRole: string;
  erpRole: string;
  hasEdit: boolean;
}

const mockUsers: PermUser[] = [
  { id: "1", code: "1122", name: "พนักงาน พนักงาน", avatar: "", department: "", position: "", menuRole: "TEST_REDIRECT", erpRole: "", hasEdit: true },
  { id: "2", code: "EMP001", name: "dev dev2", avatar: "🐶", department: "", position: "", menuRole: "", erpRole: "ผู้ดูแลระบบ", hasEdit: false },
  { id: "3", code: "EMP0003", name: "Admin Admin", avatar: "", department: "", position: "", menuRole: "", erpRole: "", hasEdit: false },
  { id: "4", code: "EMP0005", name: "Nannaphat chk", avatar: "", department: "", position: "", menuRole: "", erpRole: "", hasEdit: false },
  { id: "5", code: "EMP0004", name: "Super Admin", avatar: "", department: "", position: "", menuRole: "", erpRole: "", hasEdit: false },
  { id: "6", code: "EMP0007", name: "wichuda May", avatar: "", department: "", position: "", menuRole: "", erpRole: "", hasEdit: false },
  { id: "7", code: "EMP0009", name: "สุพัชรี อาทิตย์ตั้ง", avatar: "", department: "", position: "", menuRole: "", erpRole: "", hasEdit: false },
  { id: "8", code: "EMP0011", name: "chalita Bell", avatar: "", department: "", position: "", menuRole: "", erpRole: "", hasEdit: false },
];

const EMPLOYEE_LIST = [
  { code: "1122", firstName: "พนักงาน", lastName: "พนักงาน", email: "employee@test.com" },
  { code: "EMP001", firstName: "dev", lastName: "dev2", email: "dev@company.com" },
  { code: "EMP0003", firstName: "Admin", lastName: "Admin", email: "admin@company.com" },
  { code: "EMP0005", firstName: "Nannaphat", lastName: "chk", email: "nannaphat@company.com" },
  { code: "EMP0004", firstName: "Super", lastName: "Admin", email: "superadmin@company.com" },
  { code: "EMP0007", firstName: "wichuda", lastName: "May", email: "wichuda@company.com" },
  { code: "EMP0009", firstName: "สุพัชรี", lastName: "อาทิตย์ตั้ง", email: "supatchari@company.com" },
  { code: "EMP0011", firstName: "chalita", lastName: "Bell", email: "chalita@company.com" },
];

const MENU_ROLES = ["TEST_REDIRECT", "MASTER2", "SALE", "ADMIN"];
const ERP_ROLES = ["ผู้ดูแลระบบ", "SaleP", "Admin", "EMP001"];
const DEPARTMENTS = ["ฝ่ายขาย", "ฝ่ายบัญชี", "ฝ่ายผลิต", "ฝ่ายบุคคล", "ฝ่ายคลังสินค้า"];
const POSITIONS = ["ผู้จัดการ", "หัวหน้างาน", "พนักงาน", "เจ้าหน้าที่"];

/* ── Reusable Components ── */
const Field = ({ label, value, onChange, required, disabled, type = "text", placeholder }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; disabled?: boolean; type?: string; placeholder?: string;
}) => (
  <div className="field-group">
    <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} placeholder={placeholder || " "} />
    <label>{label}{required && <span className="text-[#E53935] ml-0.5">*</span>}</label>
  </div>
);

const Select = ({ label, value, onChange, options, required, disabled, placeholder }: {
  label: string; value: string; onChange?: (v: string) => void; options: { value: string; label: string }[] | string[]; required?: boolean; disabled?: boolean; placeholder?: string;
}) => (
  <div className="field-group">
    <select value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} style={{ appearance: "none", background: "transparent" }}>
      <option value="">{placeholder || "เลือก..."}</option>
      {options.map((o) => {
        const val = typeof o === "string" ? o : o.value;
        const lbl = typeof o === "string" ? o : o.label;
        return <option key={val} value={val}>{lbl}</option>;
      })}
    </select>
    <label>{label}{required && <span className="text-[#E53935] ml-0.5">*</span>}</label>
  </div>
);


/* ══════════════════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════════════════ */

function AssignPermissionInner() {
  const [screen, setScreen] = useState<"list" | "add">("list");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterPos, setFilterPos] = useState("");

  /* ── form state ── */
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMenuRole, setFormMenuRole] = useState("");
  const [formErpRole, setFormErpRole] = useState("");

  /* ── meatball menu ── */
  const [meatballOpen, setMeatballOpen] = useState<string | null>(null);

  /* ── toast ── */
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err" = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  /* ── filter ── */
  const filtered = mockUsers.filter((u) => {
    if (search) {
      const s = search.toLowerCase();
      if (!u.code.toLowerCase().includes(s) && !u.name.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  /* ── employee select handler ── */
  const handleSelectEmployee = (code: string) => {
    setSelectedEmployee(code);
    const emp = EMPLOYEE_LIST.find((e) => e.code === code);
    if (emp) {
      setFormCode(emp.code);
      setFormFirstName(emp.firstName);
      setFormLastName(emp.lastName);
      setFormEmail(emp.email);
    } else {
      setFormCode("");
      setFormFirstName("");
      setFormLastName("");
      setFormEmail("");
    }
    // reset after employee select
  };

  /* ── save ── */
  const handleSave = () => {
    if (!selectedEmployee || !formEmail) {
      showToast("กรุณากรอกข้อมูลที่จำเป็นให้ครบ", "err");
      return;
    }
    if (!formMenuRole || !formErpRole) {
      showToast("กรุณาเลือกสิทธิ์การใช้งาน", "err");
      return;
    }
    showToast("บันทึกและส่งคำเชิญเรียบร้อย");
    setScreen("list");
  };

  /* ── reset form ── */
  const resetForm = () => {
    setSelectedEmployee(""); setFormCode(""); setFormFirstName(""); setFormLastName("");
    setFormEmail(""); setFormMenuRole(""); setFormErpRole("");
  };

  /* ── breadcrumb ── */
  const breadcrumb = screen === "list"
    ? ["บุคคล", "จัดการสิทธิ์ผู้ใช้งาน", "กำหนดสิทธิ์ผู้ใช้งาน"]
    : ["บุคคล", "จัดการสิทธิ์ผู้ใช้งาน", "กำหนดสิทธิ์ผู้ใช้งาน"];

  /* ══════════════════════════════════════ */
  /* ── LIST SCREEN ── */
  /* ══════════════════════════════════════ */
  if (screen === "list") {
    return (
      <TenantShell breadcrumb={breadcrumb} activeModule="hr">
        {toast && (
          <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium"
            style={{ background: toast.type === "ok" ? GREEN_L : "#FCEBEB", color: toast.type === "ok" ? GREEN : "#A32D2D", border: `1px solid ${toast.type === "ok" ? GREEN : RED}33` }}>
            {toast.msg}
          </div>
        )}

        <div className="p-6">
          <h1 className="text-lg font-bold mb-5" style={{ color: TEXT }}>กำหนดสิทธิ์ผู้ใช้งาน</h1>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Export button */}
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: OR }}
              onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
              onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
              ⬇ ส่งออกรายงาน
            </button>

            {/* Filter: แผนก */}
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, color: TEXT, minWidth: 130 }}>
              <option value="">ดูทั้งหมด</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Filter: ตำแหน่ง */}
            <select value={filterPos} onChange={(e) => setFilterPos(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, color: TEXT, minWidth: 130 }}>
              <option value="">ดูทั้งหมด</option>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            <div className="flex-1" />

            {/* Search */}
            <div className="relative">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหารหัสบัตร,ชื่อผู้ใช้งาน"
                className="pl-3 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, width: 260 }} />
            </div>

            {/* Add button */}
            <button onClick={() => { resetForm(); setScreen("add"); }}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: OR }}
              onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
              onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
              + กำหนดสิทธิ์
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border" style={{ borderColor: BORDER }}>
            <div className="overflow-x-auto" style={{ overflow: "visible" }}>
              <table className="w-full text-sm" style={{ color: TEXT }}>
                <thead>
                  <tr style={{ background: "#F8F8F8" }}>
                    {["รหัสพนักงาน", "ชื่อ-นามสกุล (ชื่อเล่น)", "แผนก", "ตำแหน่ง", "สิทธิ์การใช้งาน", "จัดการ"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูล</td></tr>
                  ) : filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-indigo-50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td className="px-4 py-3 font-medium cursor-pointer" style={{ color: OR }}>{u.code}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0"
                            style={{ background: u.avatar ? "#E8E8E8" : "#F0F0F0", color: MUTED }}>
                            {u.avatar || "👤"}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{u.department || "—"}</td>
                      <td className="px-4 py-3">{u.position || "—"}</td>
                      <td className="px-4 py-3">
                        {(u.menuRole || u.erpRole) ? (
                          <span className="font-medium" style={{ color: OR }}>{u.menuRole || u.erpRole}</span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative" style={{ zIndex: meatballOpen === u.id ? 50 : 0 }}>
                          <button onClick={() => setMeatballOpen(meatballOpen === u.id ? null : u.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-lg cursor-pointer"
                            style={{ color: MUTED }}>
                            ⋮
                          </button>
                          {meatballOpen === u.id && (
                            <>
                              <div className="fixed inset-0 z-40" onMouseDown={() => setMeatballOpen(null)} />
                              <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border py-1 min-w-[160px]"
                                style={{ borderColor: BORDER }}>
                                <button onClick={() => { showToast(`ส่งคำเชิญซ้ำไปยัง ${u.name} แล้ว`); setMeatballOpen(null); }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors cursor-pointer flex items-center gap-2"
                                  style={{ color: TEXT }}>
                                  <span>📩</span> ส่งคำเชิญซ้ำ
                                </button>
                                <button onClick={() => { setMeatballOpen(null); }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors cursor-pointer flex items-center gap-2"
                                  style={{ color: TEXT }}>
                                  <span>✏️</span> แก้ไข
                                </button>
                                <button onClick={() => { setMeatballOpen(null); }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
                                  style={{ color: RED }}>
                                  <span>🗑</span> ลบ
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TenantShell>
    );
  }

  /* ══════════════════════════════════════ */
  /* ── ADD / ASSIGN FORM ── */
  /* ══════════════════════════════════════ */
  return (
    <TenantShell breadcrumb={breadcrumb} activeModule="hr">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium"
          style={{ background: toast.type === "ok" ? GREEN_L : "#FCEBEB", color: toast.type === "ok" ? GREEN : "#A32D2D", border: `1px solid ${toast.type === "ok" ? GREEN : RED}33` }}>
          {toast.msg}
        </div>
      )}

      <div className="p-6">
        <h1 className="text-lg font-bold mb-5" style={{ color: TEXT }}>กำหนดสิทธิ์ผู้ใช้งาน</h1>

        {/* ── Section 1: ดึงข้อมูลพนักงาน ── */}
        <div className="bg-white rounded-lg border mb-5 p-5" style={{ borderColor: BORDER }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: TEXT }}>ดึงข้อมูลพนักงาน</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Employee search dropdown */}
            <div className="md:col-span-1">
              <Select
                label="ค้นหาชื่อพนักงาน"
                value={selectedEmployee}
                onChange={handleSelectEmployee}
                options={EMPLOYEE_LIST.map((e) => ({ value: e.code, label: `${e.firstName} ${e.lastName} (${e.code})` }))}
                required
                placeholder="เลือกพนักงาน..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Field label="รหัสพนักงาน" value={formCode} disabled placeholder="รหัสพนักงาน" />
            <Field label="ชื่อ" value={formFirstName} disabled placeholder="ชื่อพนักงาน" />
            <Field label="นามสกุล" value={formLastName} disabled placeholder="นามสกุลพนักงาน" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Field label="E-mail" value={formEmail} onChange={setFormEmail} required type="email" placeholder="กรอก E-mail" />
          </div>
        </div>

        {/* ── Section 2: กำหนดสิทธิ์ผู้ใช้งาน ── */}
        <div className="bg-white rounded-lg border mb-5 p-5" style={{ borderColor: BORDER }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: TEXT }}>กำหนดสิทธิ์ผู้ใช้งาน</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="สิทธิ์จัดการเมนู"
              value={formMenuRole}
              onChange={setFormMenuRole}
              options={MENU_ROLES}
              required
              placeholder="เลือกสิทธิ์จัดการเมนู"
            />
            <Select
              label="สิทธิ์จัดการส่วนงาน"
              value={formErpRole}
              onChange={setFormErpRole}
              options={ERP_ROLES}
              required
              placeholder="เลือกสิทธิ์จัดการส่วนงาน"
            />
          </div>
        </div>

        {/* ── Footer Buttons ── */}
        <div className="flex items-center justify-end gap-3 mt-2 pb-6" style={{ background: "#F4F4F4" }}>
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
            บันทึกและส่งคำเชิญ
          </button>
        </div>
      </div>
    </TenantShell>
  );
}

export default function AssignPermissionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm" style={{ color: "#777" }}>กำลังโหลด...</div>}>
      <AssignPermissionInner />
    </Suspense>
  );
}
