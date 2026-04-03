"use client";

import { useState, Suspense } from "react";
import TenantShell from "@/components/layout/TenantShell";
import { useToast } from "@/components/ui/Toast";
import { useLocale } from "@/lib/locale";

/* ── MUI ── */
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiMenuItem from "@mui/material/MenuItem";

/* ── Palette ── */
import { TENANT_PRIMARY as OR, TENANT_HOVER as OR_D } from "@/lib/theme";

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

/* ══════════════════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════════════════ */

function AssignPermissionInner() {
  const { showSuccess, showError } = useToast();
  const { t } = useLocale();
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
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);

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
  };

  /* ── save ── */
  const handleSave = () => {
    if (!selectedEmployee || !formEmail) {
      showError(t("common.fillRequired"));
      return;
    }
    if (!formMenuRole || !formErpRole) {
      showError(t("assignPermission.selectPermission"));
      return;
    }
    showSuccess(t("assignPermission.saveSuccess"));
    setScreen("list");
  };

  /* ── reset form ── */
  const resetForm = () => {
    setSelectedEmployee(""); setFormCode(""); setFormFirstName(""); setFormLastName("");
    setFormEmail(""); setFormMenuRole(""); setFormErpRole("");
  };

  /* ── breadcrumb ── */
  const breadcrumb = [t("employee.hr"), t("assignPermission.managePermission"), t("assignPermission.title")];

  const TABLE_HEADERS = [t("employee.code"), t("employee.fullName"), t("employee.department"), t("employee.position"), t("assignPermission.permission"), t("common.manage")];

  /* ══════════════════════════════════════ */
  /* ── LIST SCREEN ── */
  /* ══════════════════════════════════════ */
  if (screen === "list") {
    return (
      <TenantShell breadcrumb={breadcrumb} activeModule="hr">
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: "text.primary" }}>
            {t("assignPermission.title")}
          </Typography>

          {/* Toolbar */}
          <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: "wrap", alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              sx={{ bgcolor: OR, "&:hover": { bgcolor: OR_D }, textTransform: "none", fontWeight: 600 }}
            >
              {t("common.export")}
            </Button>

            <TextField
              select
              size="small"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              sx={{ minWidth: 140 }}
              label={t("employee.department")}
            >
              <MenuItem value="">{t("common.viewAll")}</MenuItem>
              {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>

            <TextField
              select
              size="small"
              value={filterPos}
              onChange={(e) => setFilterPos(e.target.value)}
              sx={{ minWidth: 140 }}
              label={t("employee.position")}
            >
              <MenuItem value="">{t("common.viewAll")}</MenuItem>
              {POSITIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>

            <Box sx={{ flex: 1 }} />

            <TextField
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("assignPermission.searchPlaceholder")}
              sx={{ width: 260 }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => { resetForm(); setScreen("add"); }}
              sx={{ bgcolor: OR, "&:hover": { bgcolor: OR_D }, textTransform: "none", fontWeight: 600 }}
            >
              {t("assignPermission.assign")}
            </Button>
          </Stack>

          {/* Table */}
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#F8F8F8" }}>
                  {TABLE_HEADERS.map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                      {t("common.noData")}
                    </TableCell>
                  </TableRow>
                ) : filtered.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ fontWeight: 500, color: OR, cursor: "pointer" }}>{u.code}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: u.avatar ? "#E8E8E8" : "#F0F0F0", color: "text.secondary" }}>
                          {u.avatar || "👤"}
                        </Avatar>
                        <Typography variant="body2">{u.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{u.department || "—"}</TableCell>
                    <TableCell>{u.position || "—"}</TableCell>
                    <TableCell>
                      {(u.menuRole || u.erpRole) ? (
                        <Typography variant="body2" sx={{ fontWeight: 500, color: OR }}>{u.menuRole || u.erpRole}</Typography>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => { setMenuAnchorEl(e.currentTarget); setMenuUserId(u.id); }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Meatball Menu */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => { setMenuAnchorEl(null); setMenuUserId(null); }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MuiMenuItem onClick={() => {
              const u = mockUsers.find((x) => x.id === menuUserId);
              showSuccess(`ส่งคำเชิญซ้ำไปยัง ${u?.name} แล้ว`);
              setMenuAnchorEl(null); setMenuUserId(null);
            }}>
              <ListItemIcon><MailOutlineIcon fontSize="small" /></ListItemIcon>
              <ListItemText>{t("assignPermission.resendInvite")}</ListItemText>
            </MuiMenuItem>
            <MuiMenuItem onClick={() => { setMenuAnchorEl(null); setMenuUserId(null); }}>
              <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
              <ListItemText>{t("common.edit")}</ListItemText>
            </MuiMenuItem>
            <MuiMenuItem onClick={() => { setMenuAnchorEl(null); setMenuUserId(null); }} sx={{ color: "error.main" }}>
              <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>
              <ListItemText>{t("common.delete")}</ListItemText>
            </MuiMenuItem>
          </Menu>
        </Box>
      </TenantShell>
    );
  }

  /* ══════════════════════════════════════ */
  /* ── ADD / ASSIGN FORM ── */
  /* ══════════════════════════════════════ */
  return (
    <TenantShell breadcrumb={breadcrumb} activeModule="hr">
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: "text.primary" }}>
          กำหนดสิทธิ์ผู้ใช้งาน
        </Typography>

        {/* ── Section 1: ดึงข้อมูลพนักงาน ── */}
        <Paper variant="outlined" sx={{ borderRadius: 2, mb: 2.5, p: 2.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: "text.primary" }}>
            {t("assignPermission.fetchEmployee")}
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
            <TextField
              select
              size="small"
              label={t("assignPermission.searchEmployee")}
              value={selectedEmployee}
              onChange={(e) => handleSelectEmployee(e.target.value)}
              required
            >
              <MenuItem value="">{t("assignPermission.selectEmployee")}</MenuItem>
              {EMPLOYEE_LIST.map((e) => (
                <MenuItem key={e.code} value={e.code}>{`${e.firstName} ${e.lastName} (${e.code})`}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2, mt: 2 }}>
            <TextField size="small" label={t("employee.code")} value={formCode} disabled />
            <TextField size="small" label={t("employee.firstName")} value={formFirstName} disabled />
            <TextField size="small" label={t("employee.lastName")} value={formLastName} disabled />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2, mt: 2 }}>
            <TextField
              size="small"
              label="E-mail"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              type="email"
              placeholder={t("assignPermission.enterEmail")}
            />
          </Box>
        </Paper>

        {/* ── Section 2: กำหนดสิทธิ์ผู้ใช้งาน ── */}
        <Paper variant="outlined" sx={{ borderRadius: 2, mb: 2.5, p: 2.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: "text.primary" }}>
            {t("assignPermission.title")}
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <TextField
              select
              size="small"
              label={t("rolePermission.menuPermission")}
              value={formMenuRole}
              onChange={(e) => setFormMenuRole(e.target.value)}
              required
            >
              <MenuItem value="">{t("assignPermission.selectMenuRole")}</MenuItem>
              {MENU_ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>

            <TextField
              select
              size="small"
              label={t("rolePermission.erpPermission")}
              value={formErpRole}
              onChange={(e) => setFormErpRole(e.target.value)}
              required
            >
              <MenuItem value="">{t("assignPermission.selectErpRole")}</MenuItem>
              {ERP_ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
          </Box>
        </Paper>

        {/* ── Footer Buttons ── */}
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 1, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setScreen("list")}
            sx={{ textTransform: "none", color: "text.secondary", borderColor: "divider" }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: OR, "&:hover": { bgcolor: OR_D }, textTransform: "none", fontWeight: 600 }}
          >
            {t("assignPermission.saveAndInvite")}
          </Button>
        </Stack>
      </Box>
    </TenantShell>
  );
}

export default function AssignPermissionPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">Loading...</Typography>
      </Box>
    }>
      <AssignPermissionInner />
    </Suspense>
  );
}
