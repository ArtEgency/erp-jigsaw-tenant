"use client";

import { useState, Suspense } from "react";
import TenantShell from "@/components/TenantShell";

/* ── Palette ── */
import { TENANT_PRIMARY as OR, TENANT_HOVER as OR_D, TENANT_LIGHT as OR_L, GREEN, GREEN_L, RED, BORDER, TEXT, MUTED } from "@/lib/theme";

/* ── Mock Data ── */
const DEPARTMENTS = ["ฝ่ายขาย", "ฝ่ายบัญชี", "ฝ่ายผลิต", "ฝ่ายบุคคล", "ฝ่ายคลังสินค้า"];
const POSITIONS = ["ผู้จัดการ", "หัวหน้างาน", "พนักงาน", "เจ้าหน้าที่", "ผู้ช่วย"];
const PREFIXES = ["นาย", "นาง", "นางสาว"];
const EMP_TYPES = ["พนักงานประจำ", "พนักงานสัญญาจ้าง", "พนักงานชั่วคราว", "ฝึกงาน"];
const STATUSES_WORK = ["ทำงานอยู่", "ทดลองงาน", "พ้นสภาพ"];
const BANKS = ["ธนาคารกสิกรไทย", "ธนาคารไทยพาณิชย์", "ธนาคารกรุงเทพ", "ธนาคารกรุงไทย", "ธนาคารทหารไทยธนชาต"];
const ACCOUNT_TYPES = ["ออมทรัพย์", "กระแสรายวัน"];
const MARITAL = ["โสด", "สมรส", "หย่าร้าง", "หม้าย"];
const MILITARY = ["ได้รับการยกเว้น", "ผ่านการเกณฑ์ทหาร", "ยังไม่ได้เกณฑ์"];
const RELATIONSHIPS = ["บิดา", "มารดา", "พี่น้อง", "คู่สมรส", "บุตร", "อื่นๆ"];

interface Employee {
  id: string;
  code: string;
  name: string;
  nickname: string;
  division: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  status: string;
  type: string;
  active: boolean;
}

const mockEmployees: Employee[] = [
  { id: "1", code: "EMP001", name: "สมชาย ใจดี (ชาย)", nickname: "ชาย", division: "ฝ่ายขาย", department: "แผนกขายในประเทศ", position: "ผู้จัดการ", phone: "081-234-5678", email: "somchai@company.com", status: "ทำงานอยู่", type: "พนักงานประจำ", active: true },
  { id: "2", code: "EMP002", name: "สมหญิง รักเรียน (หญิง)", nickname: "หญิง", division: "ฝ่ายบัญชี", department: "แผนกบัญชีทั่วไป", position: "หัวหน้างาน", phone: "082-345-6789", email: "somying@company.com", status: "ทำงานอยู่", type: "พนักงานประจำ", active: true },
  { id: "3", code: "EMP003", name: "วิชัย สร้างสรรค์ (ชัย)", nickname: "ชัย", division: "ฝ่ายผลิต", department: "แผนกผลิต A", position: "พนักงาน", phone: "083-456-7890", email: "wichai@company.com", status: "ทดลองงาน", type: "พนักงานสัญญาจ้าง", active: true },
  { id: "4", code: "EMP004", name: "นารี สุขสันต์ (นา)", nickname: "นา", division: "ฝ่ายบุคคล", department: "แผนกสรรหา", position: "เจ้าหน้าที่", phone: "084-567-8901", email: "naree@company.com", status: "ทำงานอยู่", type: "พนักงานประจำ", active: true },
  { id: "5", code: "EMP005", name: "ประเสริฐ ก้าวหน้า (เสริฐ)", nickname: "เสริฐ", division: "ฝ่ายคลังสินค้า", department: "แผนกจัดส่ง", position: "พนักงาน", phone: "085-678-9012", email: "prasert@company.com", status: "ทำงานอยู่", type: "พนักงานประจำ", active: true },
  { id: "6", code: "EMP006", name: "จิราพร มั่นคง (จิ)", nickname: "จิ", division: "ฝ่ายขาย", department: "แผนกขายต่างประเทศ", position: "ผู้ช่วย", phone: "086-789-0123", email: "jiraporn@company.com", status: "พ้นสภาพ", type: "พนักงานประจำ", active: false },
];

/* ── Reusable Components ── */

const Field = ({ label, value, onChange, required, disabled, type = "text", placeholder }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; disabled?: boolean; type?: string; placeholder?: string;
}) => (
  <div className="field-group">
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

const StatusBadge = ({ label, active }: { label: string; active: boolean }) => (
  <span className="px-3 py-1 rounded-full text-xs font-medium"
    style={{ background: active ? GREEN_L : "#FCEBEB", color: active ? GREEN : "#A32D2D" }}>
    {label}
  </span>
);

/* ── Collapsible Section ── */
const Section = ({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg border mb-4" style={{ borderColor: BORDER }}>
    <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-3 text-left">
      <span className="font-semibold text-sm" style={{ color: TEXT }}>{title}</span>
      <span className="text-lg" style={{ color: MUTED }}>{open ? "▲" : "▼"}</span>
    </button>
    {open && <div className="px-5 pb-5 border-t" style={{ borderColor: BORDER }}>{children}</div>}
  </div>
);

/* ══════════════════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════════════════ */

function EmployeeInner() {
  /* ── state ── */
  const [screen, setScreen] = useState<"list" | "add">("list");
  const [tab, setTab] = useState("current");
  const [filterDept, setFilterDept] = useState("");
  const [filterPos, setFilterPos] = useState("");
  const [search, setSearch] = useState("");

  /* ── form state ── */
  const [sections, setSections] = useState({ general: true, contact: true, work: true, salary: true, docs: true });
  const toggle = (s: keyof typeof sections) => setSections((p) => ({ ...p, [s]: !p[s] }));

  // ข้อมูลทั่วไป
  const [empCode, setEmpCode] = useState("");
  const [prefix, setPrefix] = useState("");
  const [firstNameTH, setFirstNameTH] = useState("");
  const [lastNameTH, setLastNameTH] = useState("");
  const [firstNameEN, setFirstNameEN] = useState("");
  const [lastNameEN, setLastNameEN] = useState("");
  const [idCard, setIdCard] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [race, setRace] = useState("");
  const [nationality, setNationality] = useState("ไทย");
  const [marital, setMarital] = useState("");
  const [military, setMilitary] = useState("");

  // ข้อมูลการติดต่อ
  const [address, setAddress] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");
  const [facebook, setFacebook] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");

  // ข้อมูลการทำงาน
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [empType, setEmpType] = useState("");
  const [workStatus, setWorkStatus] = useState("");
  const [dept, setDept] = useState("");
  const [position, setPosition] = useState("");
  const [socialSecurity, setSocialSecurity] = useState(false);

  // ช่องทางรับเงินเดือน
  const [payMethod, setPayMethod] = useState<"bank" | "cash">("bank");
  const [bank, setBank] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchNo, setBranchNo] = useState("");

  // เอกสารแนบ
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [docs, setDocs] = useState<string[]>([]);

  /* ── toast ── */
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err" = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  /* ── filter employees ── */
  const filtered = mockEmployees.filter((e) => {
    if (tab === "current" && !e.active) return false;
    if (tab === "resigned" && e.active) return false;
    if (filterDept && e.department !== filterDept && e.division !== filterDept) return false;
    if (filterPos && e.position !== filterPos) return false;
    if (search) {
      const s = search.toLowerCase();
      return e.code.toLowerCase().includes(s) || e.name.toLowerCase().includes(s) || e.email.toLowerCase().includes(s);
    }
    return true;
  });

  /* ── calculate age ── */
  const calcAge = (bd: string) => {
    if (!bd) return "";
    const diff = Date.now() - new Date(bd).getTime();
    return String(Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))) + " ปี";
  };

  /* ── breadcrumb ── */
  const breadcrumb = screen === "list"
    ? ["บุคคล", "พนักงาน"]
    : ["บุคคล", "พนักงาน", "เพิ่มพนักงาน"];

  /* ── handle save ── */
  const handleSave = () => {
    if (!empCode || !prefix || !firstNameTH || !lastNameTH || !nationality) {
      showToast("กรุณากรอกข้อมูลที่จำเป็นให้ครบ", "err");
      return;
    }
    showToast("บันทึกข้อมูลพนักงานเรียบร้อย");
    setScreen("list");
  };

  /* ══════════════════════════════════════ */
  /* ── LIST SCREEN ── */
  /* ══════════════════════════════════════ */
  if (screen === "list") {
    return (
      <TenantShell breadcrumb={breadcrumb} activeModule="hr">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium"
            style={{ background: toast.type === "ok" ? GREEN_L : "#FCEBEB", color: toast.type === "ok" ? GREEN : "#A32D2D", border: `1px solid ${toast.type === "ok" ? GREEN : RED}33` }}>
            {toast.msg}
          </div>
        )}

        <div className="p-6">
          <h1 className="text-lg font-bold mb-4" style={{ color: TEXT }}>รายชื่อพนักงาน</h1>

          {/* Sub-tabs */}
          <SubTabs active={tab} tabs={[{ id: "current", label: "พนักงานปัจจุบัน" }, { id: "resigned", label: "พนักงานที่ลาออก" }]} onTab={setTab} />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={{ borderColor: OR, color: OR }}
              onMouseEnter={(e) => { e.currentTarget.style.background = OR_L; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              ส่งออกรายงาน
            </button>

            <div className="flex-1" />

            {/* Filter: แผนก */}
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, color: TEXT, minWidth: 140 }}>
              <option value="">แผนก: ดูทั้งหมด</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Filter: ตำแหน่ง */}
            <select value={filterPos} onChange={(e) => setFilterPos(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, color: TEXT, minWidth: 140 }}>
              <option value="">ตำแหน่ง: ดูทั้งหมด</option>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* Search */}
            <div className="relative">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหา..."
                className="pl-9 pr-3 py-2 rounded-lg text-sm border" style={{ borderColor: BORDER, width: 200 }} />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: MUTED }}>🔍</span>
            </div>

            {/* Add button */}
            <button onClick={() => setScreen("add")}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: OR }}
              onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
              onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
              + เพิ่มพนักงาน
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: BORDER }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ color: TEXT }}>
                <thead>
                  <tr style={{ background: "#F8F8F8" }}>
                    {["รหัสพนักงาน", "ชื่อ-นามสกุล(ชื่อเล่น)", "ส่วนงาน", "แผนก", "ตำแหน่ง", "เบอร์โทร", "E-Mail", "สถานะ", "จัดการ"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-xs whitespace-nowrap" style={{ color: MUTED, borderBottom: `1px solid ${BORDER}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-10" style={{ color: MUTED }}>ไม่พบข้อมูลพนักงาน</td></tr>
                  ) : filtered.map((emp) => (
                    <tr key={emp.id} className="hover:bg-indigo-50 transition-colors" style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td className="px-4 py-3 font-medium cursor-pointer" style={{ color: OR }}>{emp.code}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{emp.name}</td>
                      <td className="px-4 py-3">{emp.division}</td>
                      <td className="px-4 py-3">{emp.department}</td>
                      <td className="px-4 py-3">{emp.position}</td>
                      <td className="px-4 py-3">{emp.phone}</td>
                      <td className="px-4 py-3">{emp.email}</td>
                      <td className="px-4 py-3"><StatusBadge label={emp.type} active={emp.active} /></td>
                      <td className="px-4 py-3">
                        <button className="text-base hover:opacity-70" title="แก้ไข">✏️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row count */}
          <div className="mt-3 text-xs" style={{ color: MUTED }}>แสดง {filtered.length} จาก {mockEmployees.length} รายการ</div>
        </div>
      </TenantShell>
    );
  }

  /* ══════════════════════════════════════ */
  /* ── ADD EMPLOYEE FORM ── */
  /* ══════════════════════════════════════ */
  return (
    <TenantShell breadcrumb={breadcrumb} activeModule="hr">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium"
          style={{ background: toast.type === "ok" ? GREEN_L : "#FCEBEB", color: toast.type === "ok" ? GREEN : "#A32D2D", border: `1px solid ${toast.type === "ok" ? GREEN : RED}33` }}>
          {toast.msg}
        </div>
      )}

      <div className="p-6">
        <h1 className="text-lg font-bold mb-5" style={{ color: TEXT }}>เพิ่มพนักงาน</h1>

        {/* ── Section 1: ข้อมูลทั่วไป ── */}
        <Section title="ข้อมูลทั่วไป" open={sections.general} onToggle={() => toggle("general")}>
          {/* Photo upload */}
          <div className="flex items-start gap-6 mt-4 mb-6">
            <div className="w-28 h-28 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 transition-colors"
              style={{ borderColor: BORDER, background: "#FAFAFA" }}>
              <span className="text-2xl mb-1">📷</span>
              <span className="text-[10px]" style={{ color: MUTED }}>อัพโหลดรูป</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="รหัสพนักงาน" value={empCode} onChange={setEmpCode} required />
            <Select label="คำนำหน้า" value={prefix} onChange={setPrefix} options={PREFIXES} required />
            <Field label="ชื่อ(TH)" value={firstNameTH} onChange={setFirstNameTH} required />
            <Field label="นามสกุล(TH)" value={lastNameTH} onChange={setLastNameTH} required />
            <Field label="ชื่อ(ENG)" value={firstNameEN} onChange={setFirstNameEN} />
            <Field label="นามสกุล(ENG)" value={lastNameEN} onChange={setLastNameEN} />
          </div>

          {/* ID Card - 13 digit boxes */}
          <div className="mt-4 mb-4">
            <label className="text-xs font-medium mb-2 block" style={{ color: MUTED }}>หมายเลขบัตรประชาชน (13 หลัก)</label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 13 }).map((_, i) => (
                <input key={i} maxLength={1} value={idCard[i] || ""}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/, "");
                    const arr = idCard.split("");
                    arr[i] = v;
                    setIdCard(arr.join(""));
                    if (v && i < 12) {
                      const next = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                      next?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !idCard[i] && i > 0) {
                      const prev = (e.target as HTMLElement).parentElement?.children[i - 1] as HTMLInputElement;
                      prev?.focus();
                    }
                  }}
                  className="w-9 h-10 text-center border rounded text-sm font-mono focus:outline-none"
                  style={{ borderColor: BORDER }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = OR; e.currentTarget.style.boxShadow = `0 0 0 2px ${OR}1F`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="ชื่อเล่น" value={nickname} onChange={setNickname} />
            <Select label="เพศ" value={gender} onChange={setGender} options={["ชาย", "หญิง"]} />
            <Field label="วันเกิด" value={birthDate} onChange={setBirthDate} type="date" />
            <Field label="อายุ" value={calcAge(birthDate)} disabled />
            <Field label="เชื้อชาติ" value={race} onChange={setRace} />
            <Field label="สัญชาติ" value={nationality} onChange={setNationality} required />
            <Select label="สถานะสมรส" value={marital} onChange={setMarital} options={MARITAL} />
            <Select label="สถานะทางทหาร" value={military} onChange={setMilitary} options={MILITARY} />
          </div>
        </Section>

        {/* ── Section 2: ข้อมูลการติดต่อ ── */}
        <Section title="ข้อมูลการติดต่อ" open={sections.contact} onToggle={() => toggle("contact")}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="lg:col-span-4">
              <Field label="ที่อยู่" value={address} onChange={setAddress} required />
            </div>
            <Field label="แขวง/ตำบล" value={subDistrict} onChange={setSubDistrict} />
            <Field label="อำเภอ/เขต" value={district} onChange={setDistrict} />
            <Field label="จังหวัด" value={province} onChange={setProvince} />
            <Field label="รหัสไปรษณีย์" value={zipcode} onChange={setZipcode} />
            <Field label="E-mail" value={email} onChange={setEmail} type="email" />
            <Field label="เบอร์โทรศัพท์" value={phone} onChange={setPhone} />
            <Field label="Line ID" value={lineId} onChange={setLineId} />
            <Field label="Facebook" value={facebook} onChange={setFacebook} />
          </div>

          {/* Emergency contact */}
          <div className="mt-5 pt-4 border-t" style={{ borderColor: BORDER }}>
            <p className="text-xs font-semibold mb-3" style={{ color: TEXT }}>บุคคลติดต่อในกรณีฉุกเฉิน</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="ชื่อ-นามสกุล" value={emergencyName} onChange={setEmergencyName} />
              <Field label="เบอร์โทรศัพท์" value={emergencyPhone} onChange={setEmergencyPhone} />
              <Select label="ความสัมพันธ์" value={emergencyRelation} onChange={setEmergencyRelation} options={RELATIONSHIPS} />
            </div>
          </div>
        </Section>

        {/* ── Section 3: ข้อมูลการทำงาน ── */}
        <Section title="ข้อมูลการทำงาน" open={sections.work} onToggle={() => toggle("work")}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Field label="วันที่เริ่มทำงาน" value={startDate} onChange={setStartDate} type="date" />
            <Field label="วันที่สิ้นสุด" value={endDate} onChange={setEndDate} type="date" />
            <Select label="ประเภทพนักงาน" value={empType} onChange={setEmpType} options={EMP_TYPES} />
            <Select label="สถานะ" value={workStatus} onChange={setWorkStatus} options={STATUSES_WORK} />
            <Select label="แผนก" value={dept} onChange={setDept} options={DEPARTMENTS} />
            <Select label="ตำแหน่ง" value={position} onChange={setPosition} options={POSITIONS} />
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={socialSecurity} onChange={(e) => setSocialSecurity(e.target.checked)}
              className="w-4 h-4 rounded" style={{ accentColor: OR }} />
            <span className="text-sm" style={{ color: TEXT }}>ขึ้นทะเบียนประกันสังคม</span>
          </label>
        </Section>

        {/* ── Section 4: ช่องทางการรับเงินเดือน ── */}
        <Section title="ช่องทางการรับเงินเดือน" open={sections.salary} onToggle={() => toggle("salary")}>
          <div className="flex items-center gap-6 mt-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payMethod" checked={payMethod === "bank"} onChange={() => setPayMethod("bank")} style={{ accentColor: OR }} />
              <span className="text-sm" style={{ color: TEXT }}>บัญชีธนาคาร</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payMethod" checked={payMethod === "cash"} onChange={() => setPayMethod("cash")} style={{ accentColor: OR }} />
              <span className="text-sm" style={{ color: TEXT }}>เงินสด</span>
            </label>
          </div>

          {payMethod === "bank" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select label="ธนาคาร" value={bank} onChange={setBank} options={BANKS} />
              <Select label="ประเภทบัญชี" value={accountType} onChange={setAccountType} options={ACCOUNT_TYPES} />
              <Field label="ชื่อบัญชี" value={accountName} onChange={setAccountName} />
              <Field label="เลขบัญชี" value={accountNo} onChange={setAccountNo} />
              <Field label="ชื่อสาขา (ถ้ามี)" value={branchName} onChange={setBranchName} />
              <Field label="เลขที่สาขา (ถ้ามี)" value={branchNo} onChange={setBranchNo} />
            </div>
          )}
        </Section>

        {/* ── Section 5: เอกสารแนบ ── */}
        <Section title="เอกสารแนบ" open={sections.docs} onToggle={() => toggle("docs")}>
          <div className="mt-4">
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: OR }}
              onMouseEnter={(e) => (e.currentTarget.style.background = OR_D)}
              onMouseLeave={(e) => (e.currentTarget.style.background = OR)}>
              + เพิ่มเอกสาร
            </button>
            <p className="text-xs mt-2" style={{ color: MUTED }}>รองรับไฟล์ PDF, JPG, PNG ขนาดไม่เกิน 5MB</p>
          </div>
        </Section>

        {/* ── Footer Buttons ── */}
        <div className="flex items-center justify-end gap-3 mt-6 pb-6">
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
    </TenantShell>
  );
}

export default function EmployeePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm" style={{ color: "#777" }}>กำลังโหลด...</div>}>
      <EmployeeInner />
    </Suspense>
  );
}
