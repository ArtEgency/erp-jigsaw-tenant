"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useForm } from "react-hook-form";
import TenantShell from "@/components/TenantShell";
import {
  FormTextField,
  FormAutocomplete,
  ActionButtons,
  createActions,
  useToast,
} from "@/components/common";

/* ── MUI ── */
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

/* ── Theme ── */
import { TENANT_PRIMARY as OR } from "@/lib/theme";

/* ── Mock Data ── */
const DEPARTMENTS = ["ฝ่ายขาย", "ฝ่ายบัญชี", "ฝ่ายผลิต", "ฝ่ายบุคคล", "ฝ่ายคลังสินค้า"];
const POSITIONS = ["ผู้จัดการ", "หัวหน้างาน", "พนักงาน", "เจ้าหน้าที่", "ผู้ช่วย"];
const PREFIXES = [
  { id: "นาย", name: "นาย" },
  { id: "นาง", name: "นาง" },
  { id: "นางสาว", name: "นางสาว" },
];
const EMP_TYPES = [
  { id: "พนักงานประจำ", name: "พนักงานประจำ" },
  { id: "พนักงานสัญญาจ้าง", name: "พนักงานสัญญาจ้าง" },
  { id: "พนักงานชั่วคราว", name: "พนักงานชั่วคราว" },
  { id: "ฝึกงาน", name: "ฝึกงาน" },
];
const STATUSES_WORK = [
  { id: "ทำงานอยู่", name: "ทำงานอยู่" },
  { id: "ทดลองงาน", name: "ทดลองงาน" },
  { id: "พ้นสภาพ", name: "พ้นสภาพ" },
];
const DEPT_OPTIONS = DEPARTMENTS.map((d) => ({ id: d, name: d }));
const POS_OPTIONS = POSITIONS.map((p) => ({ id: p, name: p }));
const GENDER_OPTIONS = [
  { id: "ชาย", name: "ชาย" },
  { id: "หญิง", name: "หญิง" },
];
const MARITAL_OPTIONS = [
  { id: "โสด", name: "โสด" },
  { id: "สมรส", name: "สมรส" },
  { id: "หย่าร้าง", name: "หย่าร้าง" },
  { id: "หม้าย", name: "หม้าย" },
];
const MILITARY_OPTIONS = [
  { id: "ได้รับการยกเว้น", name: "ได้รับการยกเว้น" },
  { id: "ผ่านการเกณฑ์ทหาร", name: "ผ่านการเกณฑ์ทหาร" },
  { id: "ยังไม่ได้เกณฑ์", name: "ยังไม่ได้เกณฑ์" },
];
const BANKS = ["ธนาคารกสิกรไทย", "ธนาคารไทยพาณิชย์", "ธนาคารกรุงเทพ", "ธนาคารกรุงไทย", "ธนาคารทหารไทยธนชาต"];
const ACCOUNT_TYPES = ["ออมทรัพย์", "กระแสรายวัน"];
const RELATIONSHIPS = [
  { id: "บิดา", name: "บิดา" },
  { id: "มารดา", name: "มารดา" },
  { id: "พี่น้อง", name: "พี่น้อง" },
  { id: "คู่สมรส", name: "คู่สมรส" },
  { id: "บุตร", name: "บุตร" },
  { id: "อื่นๆ", name: "อื่นๆ" },
];

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

/* ── Form Type ── */
interface EmployeeForm {
  empCode: string;
  prefix: string;
  firstNameTH: string;
  lastNameTH: string;
  firstNameEN: string;
  lastNameEN: string;
  nickname: string;
  gender: string;
  birthDate: string;
  nationality: string;
  marital: string;
  military: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  zipcode: string;
  email: string;
  phone: string;
  lineId: string;
  facebook: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  startDate: string;
  endDate: string;
  empType: string;
  workStatus: string;
  dept: string;
  position: string;
  socialSecurity: boolean;
  bank: string;
  accountType: string;
  accountName: string;
  accountNo: string;
  branchName: string;
  branchNo: string;
}

/* ══════════════════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════════════════ */

function EmployeeInner() {
  const { showSuccess, showError } = useToast();

  /* ── state ── */
  const [screen, setScreen] = useState<"list" | "add">("list");
  const [tabIndex, setTabIndex] = useState(0);
  const [filterDept, setFilterDept] = useState("");
  const [filterPos, setFilterPos] = useState("");
  const [search, setSearch] = useState("");

  /* ── form (react-hook-form) ── */
  const { control, handleSubmit, reset } = useForm<EmployeeForm>({
    defaultValues: {
      empCode: "", prefix: "", firstNameTH: "", lastNameTH: "",
      firstNameEN: "", lastNameEN: "", nickname: "", gender: "",
      birthDate: "", nationality: "ไทย", marital: "", military: "",
      address: "", subDistrict: "", district: "", province: "", zipcode: "",
      email: "", phone: "", lineId: "", facebook: "",
      emergencyName: "", emergencyPhone: "", emergencyRelation: "",
      startDate: "", endDate: "", empType: "", workStatus: "",
      dept: "", position: "", socialSecurity: false,
      bank: "", accountType: "", accountName: "", accountNo: "",
      branchName: "", branchNo: "",
    },
  });

  /* ── accordion state ── */
  const [expanded, setExpanded] = useState<string[]>(["general", "contact", "work", "salary", "docs"]);
  const toggleAccordion = (panel: string) => {
    setExpanded((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel]
    );
  };

  /* ── ID card state ── */
  const [idCard, setIdCard] = useState("");

  /* ── pay method ── */
  const [payMethod, setPayMethod] = useState<"bank" | "cash">("bank");

  /* ── DataGrid pagination ── */
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  /* ── filter employees ── */
  const tabFilter = tabIndex === 0 ? "current" : tabIndex === 1 ? "cancelled" : "resigned";

  const filtered = useMemo(() => {
    return mockEmployees.filter((e) => {
      if (tabFilter === "current" && !e.active) return false;
      if (tabFilter === "resigned" && e.active) return false;
      if (filterDept && e.department !== filterDept && e.division !== filterDept) return false;
      if (filterPos && e.position !== filterPos) return false;
      if (search) {
        const s = search.toLowerCase();
        return e.code.toLowerCase().includes(s) || e.name.toLowerCase().includes(s) || e.email.toLowerCase().includes(s);
      }
      return true;
    });
  }, [tabFilter, filterDept, filterPos, search]);

  /* ── DataGrid columns ── */
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "code",
        headerName: "รหัสพนักงาน",
        width: 150,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ color: OR, fontWeight: 500, cursor: "pointer" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "name",
        headerName: "ชื่อ-นามสกุล (ชื่อเล่น)",
        flex: 1,
        minWidth: 280,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ height: "100%" }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: OR,
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {params.value?.charAt(0)}
            </Avatar>
            <Typography variant="body2">{params.value}</Typography>
          </Stack>
        ),
      },
      { field: "division", headerName: "ส่วนงาน", width: 160 },
      { field: "department", headerName: "แผนก", width: 180 },
      { field: "position", headerName: "ตำแหน่ง", width: 140 },
      { field: "phone", headerName: "เบอร์โทรศัพท์", width: 150 },
      { field: "email", headerName: "E-mail", width: 200 },
      {
        field: "type",
        headerName: "สถานะ",
        width: 160,
        renderCell: (params) => {
          const row = params.row as Employee;
          return (
            <Chip
              label={params.value}
              size="small"
              sx={{
                bgcolor: row.active ? "rgba(238,251,229,0.98)" : "#FCEBEB",
                color: row.active ? "#3B6D11" : "#A32D2D",
                fontWeight: 500,
                fontSize: "0.8rem",
              }}
            />
          );
        },
      },
      {
        field: "actions",
        headerName: "จัดการ",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: () => (
          <ActionButtons
            actions={[
              createActions.edit(() => {
                /* TODO: open edit */
              }),
              createActions.more(() => {
                /* TODO: more menu */
              }),
            ]}
          />
        ),
      },
    ],
    []
  );

  /* ── breadcrumb ── */
  const breadcrumb =
    screen === "list" ? ["บุคคล", "พนักงาน"] : ["บุคคล", "พนักงาน", "เพิ่มพนักงาน"];

  /* ── handle save ── */
  const onSubmit = (data: EmployeeForm) => {
    if (!data.empCode || !data.prefix || !data.firstNameTH || !data.lastNameTH) {
      showError("กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
      return;
    }
    showSuccess("บันทึกข้อมูลพนักงานเรียบร้อย");
    reset();
    setScreen("list");
  };

  /* ══════════════════════════════════════ */
  /* ── LIST SCREEN ── */
  /* ══════════════════════════════════════ */
  if (screen === "list") {
    return (
      <TenantShell breadcrumb={breadcrumb} activeModule="hr">
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", minHeight: "100%", bgcolor: "#F7F7F9" }}>
          <Box sx={{ width: "100%", maxWidth: 1920, px: 3, py: 3 }}>
            {/* Page Title */}
            <Typography variant="h5" sx={{ fontWeight: 500, py: 2.5, color: "#374151" }}>
              รายชื่อพนักงาน
            </Typography>

            {/* Sub-tabs */}
            <Tabs
              value={tabIndex}
              onChange={(_, v) => { setTabIndex(v); setPaginationModel((p) => ({ ...p, page: 0 })); }}
              sx={{
                mb: 2,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  minHeight: 42,
                  borderRadius: "8px",
                  mr: 1,
                },
                "& .Mui-selected": {
                  bgcolor: OR,
                  color: "#fff !important",
                  fontWeight: 600,
                },
                "& .MuiTabs-indicator": { display: "none" },
              }}
            >
              <Tab label="พนักงานปัจจุบัน" />
              <Tab label="พนักงานที่ยกเลิก" />
              <Tab label="พนักงานที่ลาออก" />
            </Tabs>

            {/* Content Card */}
            <Paper elevation={3} sx={{ borderRadius: "10px", overflow: "hidden" }}>
              {/* Filter Bar */}
              <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2.5 }}>
                <Button
                  variant="contained"
                  startIcon={<FileUploadOutlinedIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  ส่งออกรายงาน
                </Button>

                <TextField
                  select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  label="เลือกแผนก"
                  size="small"
                  sx={{ minWidth: 180 }}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  {DEPARTMENTS.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  value={filterPos}
                  onChange={(e) => setFilterPos(e.target.value)}
                  label="เลือกตำแหน่ง"
                  size="small"
                  sx={{ minWidth: 180 }}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  {POSITIONS.map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </TextField>

                <Box sx={{ flex: 1 }} />

                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหารหัส, ชื่อพนักงาน"
                  size="small"
                  sx={{ minWidth: 280 }}
                />

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => { reset(); setScreen("add"); }}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  เพิ่มพนักงาน
                </Button>
              </Stack>

              {/* DataGrid */}
              <DataGrid
                rows={filtered}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 25, 50]}
                checkboxSelection
                disableRowSelectionOnClick
                autoHeight
                getRowHeight={() => 60}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: "#F5F5F7",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#374151",
                  },
                  "& .MuiDataGrid-cell": {
                    fontSize: "0.875rem",
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-row:hover": {
                    bgcolor: "rgba(86,93,255,0.04)",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #F5F5F7",
                  },
                  "& .MuiCheckbox-root": {
                    color: "#ccc",
                    "&.Mui-checked": { color: OR },
                  },
                }}
                localeText={{
                  noRowsLabel: "ไม่พบข้อมูลพนักงาน",
                  footerRowSelected: (count) => `${count} รายการที่เลือก`,
                }}
              />
            </Paper>
          </Box>
        </Box>
      </TenantShell>
    );
  }

  /* ══════════════════════════════════════ */
  /* ── ADD EMPLOYEE FORM ── */
  /* ══════════════════════════════════════ */
  return (
    <TenantShell breadcrumb={breadcrumb} activeModule="hr">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: "#333" }}>
          เพิ่มพนักงาน
        </Typography>

        {/* ── Section 1: ข้อมูลทั่วไป ── */}
        <Accordion
          expanded={expanded.includes("general")}
          onChange={() => toggleAccordion("general")}
          sx={{ mb: 2, borderRadius: "8px !important", "&:before": { display: "none" } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>ข้อมูลทั่วไป</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Photo upload */}
            <Box
              sx={{
                width: 112,
                height: 112,
                borderRadius: 2,
                border: "2px dashed #E0E0E0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                mb: 3,
                "&:hover": { borderColor: OR },
              }}
            >
              <Typography sx={{ fontSize: "1.5rem", mb: 0.5 }}>📷</Typography>
              <Typography variant="caption" color="text.secondary">อัพโหลดรูป</Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }, gap: 2 }}>
              <FormTextField name="empCode" control={control} label="รหัสพนักงาน" required />
              <FormAutocomplete name="prefix" control={control} label="คำนำหน้า" options={PREFIXES} required />
              <FormTextField name="firstNameTH" control={control} label="ชื่อ (TH)" required />
              <FormTextField name="lastNameTH" control={control} label="นามสกุล (TH)" required />
              <FormTextField name="firstNameEN" control={control} label="ชื่อ (ENG)" />
              <FormTextField name="lastNameEN" control={control} label="นามสกุล (ENG)" />
            </Box>

            {/* ID Card */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                หมายเลขบัตรประชาชน (13 หลัก)
              </Typography>
              <Stack direction="row" spacing={0.5}>
                {Array.from({ length: 13 }).map((_, i) => (
                  <TextField
                    key={i}
                    value={idCard[i] || ""}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/, "");
                      const arr = idCard.split("");
                      arr[i] = v;
                      setIdCard(arr.join(""));
                      if (v && i < 12) {
                        const next = (e.target as HTMLElement).parentElement?.parentElement?.nextElementSibling?.querySelector("input") as HTMLInputElement;
                        next?.focus();
                      }
                    }}
                    inputProps={{ maxLength: 1, style: { textAlign: "center", fontFamily: "monospace" } }}
                    size="small"
                    sx={{ width: 38 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }, gap: 2 }}>
              <FormTextField name="nickname" control={control} label="ชื่อเล่น" />
              <FormAutocomplete name="gender" control={control} label="เพศ" options={GENDER_OPTIONS} />
              <FormTextField name="birthDate" control={control} label="วันเกิด" type="date" />
              <FormTextField name="nationality" control={control} label="สัญชาติ" required />
              <FormAutocomplete name="marital" control={control} label="สถานะสมรส" options={MARITAL_OPTIONS} />
              <FormAutocomplete name="military" control={control} label="สถานะทางทหาร" options={MILITARY_OPTIONS} />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Section 2: ข้อมูลการติดต่อ ── */}
        <Accordion
          expanded={expanded.includes("contact")}
          onChange={() => toggleAccordion("contact")}
          sx={{ mb: 2, borderRadius: "8px !important", "&:before": { display: "none" } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>ข้อมูลการติดต่อ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }, gap: 2 }}>
              <Box sx={{ gridColumn: { lg: "1 / -1" } }}>
                <FormTextField name="address" control={control} label="ที่อยู่" required />
              </Box>
              <FormTextField name="subDistrict" control={control} label="แขวง/ตำบล" />
              <FormTextField name="district" control={control} label="อำเภอ/เขต" />
              <FormTextField name="province" control={control} label="จังหวัด" />
              <FormTextField name="zipcode" control={control} label="รหัสไปรษณีย์" />
              <FormTextField name="email" control={control} label="E-mail" type="email" />
              <FormTextField name="phone" control={control} label="เบอร์โทรศัพท์" />
              <FormTextField name="lineId" control={control} label="Line ID" />
              <FormTextField name="facebook" control={control} label="Facebook" />
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: "#333" }}>
              บุคคลติดต่อในกรณีฉุกเฉิน
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
              <FormTextField name="emergencyName" control={control} label="ชื่อ-นามสกุล" />
              <FormTextField name="emergencyPhone" control={control} label="เบอร์โทรศัพท์" />
              <FormAutocomplete name="emergencyRelation" control={control} label="ความสัมพันธ์" options={RELATIONSHIPS} />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ── Section 3: ข้อมูลการทำงาน ── */}
        <Accordion
          expanded={expanded.includes("work")}
          onChange={() => toggleAccordion("work")}
          sx={{ mb: 2, borderRadius: "8px !important", "&:before": { display: "none" } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>ข้อมูลการทำงาน</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }, gap: 2 }}>
              <FormTextField name="startDate" control={control} label="วันที่เริ่มทำงาน" type="date" />
              <FormTextField name="endDate" control={control} label="วันที่สิ้นสุด" type="date" />
              <FormAutocomplete name="empType" control={control} label="ประเภทพนักงาน" options={EMP_TYPES} />
              <FormAutocomplete name="workStatus" control={control} label="สถานะ" options={STATUSES_WORK} />
              <FormAutocomplete name="dept" control={control} label="แผนก" options={DEPT_OPTIONS} />
              <FormAutocomplete name="position" control={control} label="ตำแหน่ง" options={POS_OPTIONS} />
            </Box>
            <FormControlLabel
              control={<Checkbox sx={{ "&.Mui-checked": { color: OR } }} />}
              label="ขึ้นทะเบียนประกันสังคม"
              sx={{ mt: 2 }}
            />
          </AccordionDetails>
        </Accordion>

        {/* ── Section 4: ช่องทางการรับเงินเดือน ── */}
        <Accordion
          expanded={expanded.includes("salary")}
          onChange={() => toggleAccordion("salary")}
          sx={{ mb: 2, borderRadius: "8px !important", "&:before": { display: "none" } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>ช่องทางการรับเงินเดือน</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup
              row
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value as "bank" | "cash")}
              sx={{ mb: 2 }}
            >
              <FormControlLabel value="bank" control={<Radio sx={{ "&.Mui-checked": { color: OR } }} />} label="บัญชีธนาคาร" />
              <FormControlLabel value="cash" control={<Radio sx={{ "&.Mui-checked": { color: OR } }} />} label="เงินสด" />
            </RadioGroup>

            {payMethod === "bank" && (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
                <FormAutocomplete
                  name="bank"
                  control={control}
                  label="ธนาคาร"
                  options={BANKS.map((b) => ({ id: b, name: b }))}
                />
                <FormAutocomplete
                  name="accountType"
                  control={control}
                  label="ประเภทบัญชี"
                  options={ACCOUNT_TYPES.map((t) => ({ id: t, name: t }))}
                />
                <FormTextField name="accountName" control={control} label="ชื่อบัญชี" />
                <FormTextField name="accountNo" control={control} label="เลขบัญชี" />
                <FormTextField name="branchName" control={control} label="ชื่อสาขา (ถ้ามี)" />
                <FormTextField name="branchNo" control={control} label="เลขที่สาขา (ถ้ามี)" />
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* ── Section 5: เอกสารแนบ ── */}
        <Accordion
          expanded={expanded.includes("docs")}
          onChange={() => toggleAccordion("docs")}
          sx={{ mb: 2, borderRadius: "8px !important", "&:before": { display: "none" } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>เอกสารแนบ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Button variant="contained" startIcon={<AddIcon />} size="small">
              เพิ่มเอกสาร
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              รองรับไฟล์ PDF, JPG, PNG ขนาดไม่เกิน 5MB
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* ── Footer Buttons ── */}
        <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => { reset(); setScreen("list"); }}
            sx={{ px: 4 }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{ px: 5 }}
          >
            บันทึก
          </Button>
        </Stack>
      </Box>
    </TenantShell>
  );
}

export default function EmployeePage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Typography color="text.secondary">กำลังโหลด...</Typography></Box>}>
      <EmployeeInner />
    </Suspense>
  );
}
