"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TenantShell from "@/components/layout/TenantShell";
import { useToast } from "@/components/ui/Toast";
import FormDialog from "@/components/ui/FormDialog";
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
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

/* ── colours ── */
import { TENANT_PRIMARY as OR, GREEN, GREEN_L, RED_D as RED, RED_L, BORDER, TEXT } from "@/lib/theme";

type Screen = "s1" | "s2" | "s3" | "s3e" | "s4" | "s5" | "s5e" | "s6";

/* ── mock data ── */
const systemRoles = [
  { code: "TEST_REDIRECT", name: "TEST_REDIRECT", users: 1, status: "active" as const, editable: true },
  { code: "MASTER2", name: "MASTER2", users: 1, status: "active" as const, editable: true },
  { code: "SALE", name: "SALE", users: 1, status: "active" as const, editable: true },
  { code: "ADMIN", name: "ผู้ดูแลระบบ", users: 2, status: "active" as const, editable: false },
];

const erpRoles = [
  { code: "SaleP", name: "SaleP", users: 2, status: "active" as const, editable: true },
  { code: "Admin", name: "Admin", users: 2, status: "active" as const, editable: true },
  { code: "test", name: "test", users: 0, status: "inactive" as const, editable: true },
  { code: "1", name: "1", users: 0, status: "inactive" as const, editable: true },
  { code: "เ", name: "เ", users: 0, status: "inactive" as const, editable: true },
  { code: "test edit", name: "test", users: 1, status: "inactive" as const, editable: true },
  { code: "EMP001", name: "Employee", users: 0, status: "inactive" as const, editable: false },
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

/* ══════════════════════════════════════════════════
   F-03 MAIN PAGE
   ══════════════════════════════════════════════════ */
function RolePermissionInner() {
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  const { t } = useLocale();
  const initialScreen = (searchParams.get("screen") as Screen) || "s1";
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [search, setSearch] = useState("");

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
  const [showDeleteBlock, setShowDeleteBlock] = useState(false);

  // Resizable columns for S1
  const s1Cols = useResizableColumns([160, 250, 200, 150, 100]);
  // Resizable columns for S2
  const s2Cols = useResizableColumns([160, 250, 200, 150, 100]);

  // Sync screen from URL query param
  useEffect(() => {
    const s = searchParams.get("screen") as Screen;
    if (s && ["s1", "s2", "s3", "s3e", "s4", "s5", "s5e", "s6"].includes(s)) {
      setScreen(s);
    }
  }, [searchParams]);

  const go = (s: Screen) => { setScreen(s); window.scrollTo(0, 0); };

  /* ── Sub tabs component ── */
  const SubTabs = ({ active, tabs, onTab }: { active: string; tabs: { id: string; label: string }[]; onTab: (id: string) => void }) => (
    <Stack direction="row" spacing={0.5} sx={{ mb: 2.5 }}>
      {tabs.map((t) => (
        <Button
          key={t.id}
          onClick={() => onTab(t.id)}
          variant={active === t.id ? "contained" : "text"}
          sx={{
            borderRadius: 99,
            textTransform: "none",
            fontWeight: 500,
            fontSize: 14,
            ...(active === t.id
              ? { bgcolor: OR, color: "#fff", "&:hover": { bgcolor: OR } }
              : { color: OR }),
          }}
        >
          {t.label}
        </Button>
      ))}
    </Stack>
  );

  /* ── Resizable Table Header Cell ── */
  const TH = ({ children, width, onResize, isLast }: { children: React.ReactNode; width: number; onResize?: (e: React.MouseEvent) => void; isLast?: boolean }) => (
    <TableCell
      sx={{
        width, minWidth: 60, fontWeight: 600, fontSize: 12, color: TEXT,
        bgcolor: "#F9F9F9", position: "relative", userSelect: "none",
      }}
    >
      {children}
      {!isLast && onResize && (
        <Box
          onMouseDown={onResize}
          sx={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 6,
            cursor: "col-resize", "&:hover": { bgcolor: "primary.light" },
          }}
        />
      )}
    </TableCell>
  );

  /* ── Status badge ── */
  const StatusBadge = ({ status }: { status: string }) => (
    <Chip
      label={status === "active" ? t("common.active") : t("common.inactive")}
      size="small"
      sx={{
        fontSize: 11, fontWeight: 500, height: 24,
        bgcolor: status === "active" ? GREEN_L : RED_L,
        color: status === "active" ? GREEN : RED,
      }}
    />
  );

  const breadcrumbForScreen = (): string[] => {
    switch (screen) {
      case "s1": case "s2": return [t("employee.hr"), t("rolePermission.title")];
      case "s3": case "s3e": return [t("employee.hr"), t("rolePermission.title"), t("rolePermission.createSystemRole")];
      case "s4": return [t("employee.hr"), t("rolePermission.title"), t("rolePermission.createSystemRole")];
      case "s5": case "s5e": return [t("employee.hr"), t("rolePermission.title"), t("rolePermission.createErpRole")];
      case "s6": return [t("employee.hr"), t("rolePermission.title")];
      default: return [];
    }
  };

  /* ── Pagination row ── */
  const PaginationRow = ({ total }: { total: number }) => (
    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end" sx={{ px: 2, py: 1.5, borderTop: `1px solid ${BORDER}` }}>
      <Typography variant="caption" color="text.secondary">{t("common.perPage")}</Typography>
      <TextField select size="small" defaultValue="25" sx={{ width: 70, "& .MuiInputBase-input": { fontSize: 12, py: 0.5 } }}>
        <MenuItem value="25">25</MenuItem>
        <MenuItem value="50">50</MenuItem>
        <MenuItem value="100">100</MenuItem>
      </TextField>
      <Typography variant="caption" color="text.secondary">1-{total} of {total}</Typography>
      <IconButton size="small" disabled><Typography variant="caption">&lt;</Typography></IconButton>
      <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: OR, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>1</Box>
      <IconButton size="small" disabled><Typography variant="caption">&gt;</Typography></IconButton>
    </Stack>
  );

  /* ── Role table (shared between S1 & S2) ── */
  const RoleTable = ({ roles, cols, onAdd, addLabel }: {
    roles: { code: string; name: string; users: number; status: string; editable: boolean }[];
    cols: ReturnType<typeof useResizableColumns>;
    onAdd: () => void;
    addLabel: string;
  }) => (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      {/* Toolbar */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, borderBottom: `1px solid ${BORDER}` }}>
        <Button variant="outlined" startIcon={<FileUploadIcon />} sx={{ textTransform: "none", color: TEXT, borderColor: BORDER }}>
          {t("common.export")}
        </Button>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <TextField
            size="small"
            label={t("rolePermission.searchByPermission")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 260 }}
          />
          <Button variant="contained" onClick={onAdd} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700 }}>
            {addLabel}
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TH width={cols.widths[0]} onResize={(e) => cols.onMouseDown(0, e)}>{t("rolePermission.roleCode")}</TH>
              <TH width={cols.widths[1]} onResize={(e) => cols.onMouseDown(1, e)}>{t("rolePermission.roleName")}</TH>
              <TH width={cols.widths[2]} onResize={(e) => cols.onMouseDown(2, e)}>{t("rolePermission.userCount")}</TH>
              <TH width={cols.widths[3]} onResize={(e) => cols.onMouseDown(3, e)}>{t("employee.status")}</TH>
              <TH width={cols.widths[4]} isLast>{t("common.manage")}</TH>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((r) => (
              <TableRow key={r.code} hover sx={{ borderBottom: `1px solid ${BORDER}` }}>
                <TableCell sx={{ fontWeight: 500, color: OR, cursor: "pointer", fontSize: 14 }}>{r.code}</TableCell>
                <TableCell sx={{ fontSize: 14 }}>{r.name}</TableCell>
                <TableCell sx={{ fontSize: 14, textAlign: "center" }}>{r.users}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell>
                  {r.editable ? (
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small"><EditIcon fontSize="small" sx={{ color: "text.secondary" }} /></IconButton>
                      <IconButton size="small" onClick={() => setShowDeleteBlock(true)}><DeleteIcon fontSize="small" sx={{ color: "text.secondary" }} /></IconButton>
                    </Stack>
                  ) : (
                    <IconButton size="small"><VisibilityIcon fontSize="small" sx={{ color: "text.secondary" }} /></IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <PaginationRow total={roles.length} />
    </Paper>
  );

  return (
    <TenantShell breadcrumb={breadcrumbForScreen()} activeModule="hr">

      {/* ═══════ S1 — Role List (สิทธิ์จัดการเมนู) ═══════ */}
      {screen === "s1" && (
        <Box sx={{ px: 2.5, pt: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: TEXT }}>{t("rolePermission.title")}</Typography>
          <SubTabs active="system" tabs={[
            { id: "system", label: t("rolePermission.menuPermission") },
            { id: "erp", label: t("rolePermission.erpPermission") },
          ]} onTab={(id) => id === "erp" && go("s2")} />
          <RoleTable roles={systemRoles} cols={s1Cols} onAdd={() => go("s3")} addLabel={t("rolePermission.addSystemRole")} />
        </Box>
      )}

      {/* ═══════ S2 — Role List (สิทธิ์จัดการส่วนงาน) ═══════ */}
      {screen === "s2" && (
        <Box sx={{ px: 2.5, pt: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: TEXT }}>{t("rolePermission.title")}</Typography>
          <SubTabs active="erp" tabs={[
            { id: "system", label: t("rolePermission.menuPermission") },
            { id: "erp", label: t("rolePermission.erpPermission") },
          ]} onTab={(id) => id === "system" && go("s1")} />
          <RoleTable roles={erpRoles} cols={s2Cols} onAdd={() => go("s5")} addLabel={t("rolePermission.erpPermission")} />
        </Box>
      )}

      {/* Delete block dialog */}
      <Dialog open={showDeleteBlock} onClose={() => setShowDeleteBlock(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogContent sx={{ textAlign: "center", pt: 3 }}>
          <WarningAmberIcon sx={{ fontSize: 48, color: RED, mb: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: RED, mb: 1 }}>ไม่สามารถลบได้</Typography>
          <Typography variant="body2" sx={{ color: TEXT }}>
            Role นี้มีผู้ใช้งานอยู่ <strong>2 คน</strong><br />กรุณาย้ายผู้ใช้ออกก่อนจึงจะลบได้
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2.5 }}>
          <Button variant="contained" onClick={() => setShowDeleteBlock(false)} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700, minWidth: 200 }}>
            เข้าใจแล้ว
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════ S3 — สร้างสิทธิ์ SYSTEM ═══════ */}
      {(screen === "s3" || screen === "s3e" || screen === "s4") && (
        <Box sx={{ px: 2.5, pt: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: TEXT }}>{t("rolePermission.title")}</Typography>

          {/* Form card */}
          <Paper variant="outlined" sx={{ borderRadius: 2, mb: 2, p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: TEXT }}>{t("rolePermission.createSystemPermission")}</Typography>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <TextField
                size="small"
                label={t("rolePermission.roleCode")}
                value={roleCode}
                onChange={(e) => setRoleCode(e.target.value)}
                required
                error={screen === "s3e"}
                helperText={screen === "s3e" ? t("rolePermission.duplicateCode") : ""}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label={t("rolePermission.roleName")}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
                sx={{ flex: 1 }}
              />
              <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 0.5 }}>
                <Switch
                  checked={roleActive}
                  onChange={() => setRoleActive(!roleActive)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: OR }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: OR } }}
                />
                <Typography variant="body2">{t("common.active")}</Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Menu permission table */}
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#F9F9F9" }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>เมนู</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, textAlign: "center", width: 140 }}>ห้ามเข้าดู</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, textAlign: "center", width: 140 }}>เข้าดูได้</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12, textAlign: "center", width: 180 }}>ตั้งค่าสิทธิ์เฉพาะกรณี</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((m) => (
                  <TableRow key={m}>
                    <TableCell sx={{ color: OR, fontSize: 14 }}>{m}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Radio
                        checked={menuAccess[m] === "deny"}
                        onChange={() => setMenuAccess((p) => ({ ...p, [m]: "deny" }))}
                        size="small"
                        sx={{ color: OR, "&.Mui-checked": { color: OR } }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Radio
                        checked={menuAccess[m] === "view"}
                        onChange={() => setMenuAccess((p) => ({ ...p, [m]: "view" }))}
                        size="small"
                        sx={{ color: OR, "&.Mui-checked": { color: OR } }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => go("s4")}
                        disabled={menuAccess[m] !== "view"}
                        sx={{
                          bgcolor: menuAccess[m] === "view" ? OR : "#ccc",
                          "&:hover": { bgcolor: OR },
                          textTransform: "none", fontWeight: 700, fontSize: 12,
                        }}
                      >
                        ตั้งค่า
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Action buttons */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2.5, mb: 2.5 }}>
            <Button variant="outlined" onClick={() => go("s1")} sx={{ textTransform: "none", color: TEXT, borderColor: BORDER }}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={() => { showSuccess(t("rolePermission.saveSuccess")); go("s1"); }}
              disabled={screen === "s3e"}
              sx={{ bgcolor: screen === "s3e" ? "#ccc" : OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700 }}
            >
              {t("common.save")}
            </Button>
          </Stack>
        </Box>
      )}

      {/* S4 — Popup ตั้งค่าสิทธิ์เฉพาะกรณี */}
      <FormDialog
        title="ตั้งค่าสิทธิ์เฉพาะกรณี — สินค้า"
        open={screen === "s4"}
        onClose={() => go("s3")}
        maxWidth="xs"
        footer={
          <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ width: "100%", pb: 1 }}>
            <Button variant="outlined" onClick={() => go("s3")} sx={{ textTransform: "none", color: TEXT, borderColor: BORDER }}>
              {t("common.cancel")}
            </Button>
            <Button variant="contained" onClick={() => go("s3")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700 }}>
              {t("common.save")}
            </Button>
          </Stack>
        }
      >
        <Typography variant="subtitle2" sx={{ mb: 2, color: TEXT }}>Action ที่อนุญาต</Typography>
        {["สร้าง", "แก้ไข", "อนุมัติ", t("common.cancel")].map((action) => (
          <FormControlLabel
            key={action}
            control={<Checkbox defaultChecked sx={{ color: OR, "&.Mui-checked": { color: OR } }} />}
            label={<Typography variant="body2">{action}</Typography>}
            sx={{ display: "flex", borderBottom: "1px solid #f0f0f0", py: 0.5 }}
          />
        ))}
      </FormDialog>

      {/* ═══════ S5 — สร้างสิทธิ์ ERP Permission ═══════ */}
      {(screen === "s5" || screen === "s5e") && (
        <Box sx={{ px: 2.5, pt: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: TEXT }}>{t("rolePermission.title")}</Typography>

          <Paper variant="outlined" sx={{ borderRadius: 2, mb: 2, p: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2.5, color: TEXT }}>{t("rolePermission.createErpPermission")}</Typography>

            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
              <TextField
                size="small"
                label={t("rolePermission.roleCode")}
                value={erpCode}
                onChange={(e) => setErpCode(e.target.value)}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label={t("rolePermission.roleName")}
                value={erpName}
                onChange={(e) => setErpName(e.target.value)}
                required
                sx={{ flex: 1 }}
              />
              <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 0.5 }}>
                <Switch
                  checked={erpActive}
                  onChange={() => setErpActive(!erpActive)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: OR }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: OR } }}
                />
                <Typography variant="body2">{erpActive ? t("common.active") : t("common.inactive")}</Typography>
              </Stack>
            </Stack>

            {/* Branch & Warehouse dropdowns */}
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label={t("rolePermission.accessibleBranch")}
                  value={selectedBranches[0] || ""}
                  onChange={(e) => setSelectedBranches(e.target.value ? [e.target.value] : [])}
                  required
                  error={screen === "s5e"}
                  helperText={screen === "s5e" ? t("rolePermission.selectAtLeastOne") : ""}
                >
                  <MenuItem value="" disabled>กรอกส่วนงานที่เข้าถึง</MenuItem>
                  {branchOptions.map((b) => <MenuItem key={b.code} value={b.code}>{b.code}</MenuItem>)}
                </TextField>
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label={t("rolePermission.accessibleWarehouse")}
                  value={selectedWarehouses[0] || ""}
                  onChange={(e) => setSelectedWarehouses(e.target.value ? [e.target.value] : [])}
                  required
                  error={screen === "s5e"}
                  helperText={screen === "s5e" ? t("rolePermission.selectAtLeastOne") : ""}
                >
                  <MenuItem value="" disabled>กรอกคลังที่เข้าถึง</MenuItem>
                  {warehouseOptions.map((w) => <MenuItem key={w.code} value={w.code}>{w.code}</MenuItem>)}
                </TextField>
              </Box>
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2.5, mb: 2.5 }}>
            <Button variant="outlined" onClick={() => go("s2")} sx={{ textTransform: "none", color: TEXT, borderColor: BORDER }}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={() => { showSuccess(t("rolePermission.saveErpSuccess")); go("s2"); }}
              disabled={screen === "s5e"}
              sx={{ bgcolor: screen === "s5e" ? "#ccc" : OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700 }}
            >
              {t("common.save")}
            </Button>
          </Stack>
        </Box>
      )}

      {/* ═══════ S6 — Error States ═══════ */}
      {screen === "s6" && (
        <Box sx={{ px: 2.5, pt: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: TEXT }}>Error States</Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {/* Error 1 */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ color: RED, mb: 0.5 }}>Error 1 — รหัสสิทธิ์ซ้ำ</Typography>
              <Typography variant="caption" color="text.secondary">error inline ทันที - ปุ่ม{t("common.save")} disabled</Typography>
              <Box sx={{ mt: 1.5 }}>
                <Button variant="contained" size="small" onClick={() => go("s3e")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700 }}>
                  ดูหน้าจอ
                </Button>
              </Box>
            </Paper>
            {/* Error 2 */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ color: RED, mb: 0.5 }}>Error 2 — ไม่เลือก Branch/WH</Typography>
              <Typography variant="caption" color="text.secondary">Validation block - ต้องเลือก 1 ขึ้นไป</Typography>
              <Box sx={{ mt: 1.5 }}>
                <Button variant="contained" size="small" onClick={() => go("s5e")} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700 }}>
                  ดูหน้าจอ
                </Button>
              </Box>
            </Paper>
            {/* Error 3 */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ color: RED, mb: 0.5 }}>Error 3 — ลบ Role ที่มี User</Typography>
              <Typography variant="caption" color="text.secondary">ระบบ block - แสดงจำนวน User</Typography>
              <Box sx={{ mt: 1.5 }}>
                <Button variant="contained" size="small" onClick={() => { go("s1"); setTimeout(() => setShowDeleteBlock(true), 300); }} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700 }}>
                  ดูหน้าจอ
                </Button>
              </Box>
            </Paper>
            {/* Error 4 */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ color: RED, mb: 0.5 }}>Error 4 — DB Error</Typography>
              <Typography variant="caption" color="text.secondary">แสดง toast error - ข้อมูลไม่หาย</Typography>
              <Box sx={{ mt: 1.5 }}>
                <Button variant="contained" size="small" onClick={() => showError(t("rolePermission.saveFailed"))} sx={{ bgcolor: OR, "&:hover": { bgcolor: OR }, textTransform: "none", fontWeight: 700 }}>
                  ดู Toast
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

    </TenantShell>
  );
}

export default function RolePermissionPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">Loading...</Typography>
      </Box>
    }>
      <RolePermissionInner />
    </Suspense>
  );
}
