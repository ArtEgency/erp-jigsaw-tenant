"use client";

import { useState } from "react";
import TenantShell from "@/components/layout/TenantShell";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Drawer,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { TENANT_PRIMARY as OR, RED } from "@/lib/theme";

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
const WAREHOUSE_QUOTA = 2;

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

  /* Open edit */
  const openEdit = (wh: Warehouse) => {
    setEditForm({ ...wh });
    setEditingId(wh.id);
  };

  /* Open add */
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

  const closeDrawer = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <TenantShell breadcrumb={["ตั้งค่า", "คลังสินค้าทั้งหมด"]} activeModule="settings">
      <Box sx={{ p: "24px 32px" }}>
        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: OR }}>
          คลังสินค้าทั้งหมด
        </Typography>

        {/* Card */}
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          {/* Toolbar */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, flexWrap: "wrap", gap: 2 }}>
            <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} sx={{ textTransform: "none", color: "text.primary", borderColor: "divider" }}>
              EXPORT
            </Button>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, justifyContent: "flex-end" }}>
              <TextField
                size="small"
                placeholder="ค้นหาเลขที่, ชื่อคลังสินค้า"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 300 }}
              />
              <Button
                variant="contained"
                size="small"
                disabled={!canAdd}
                onClick={() => canAdd && openAdd()}
                sx={{
                  bgcolor: canAdd ? OR : "#ccc",
                  "&:hover": { bgcolor: canAdd ? OR : "#ccc", opacity: canAdd ? 0.9 : 0.6 },
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                เพิ่มคลังสินค้า
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: 11,
                    fontWeight: 700,
                    bgcolor: canAdd ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)",
                  }}
                >
                  {usedQuota}/{WAREHOUSE_QUOTA}
                </Box>
              </Button>
            </Stack>
          </Stack>

          {/* Table */}
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#FAFAFA" }}>
                <TableCell sx={{ fontWeight: 500, color: "text.secondary", width: "20%" }}>รหัสคลังสินค้า</TableCell>
                <TableCell sx={{ fontWeight: 500, color: "text.secondary" }}>ชื่อคลังสินค้า</TableCell>
                <TableCell sx={{ fontWeight: 500, color: "text.secondary", width: "18%" }}>ประเภทคลังสินค้า</TableCell>
                <TableCell sx={{ fontWeight: 500, color: "text.secondary", width: "12%" }} align="center">จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((wh) => (
                <TableRow key={wh.id} hover>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => openEdit(wh)}
                      sx={{ textTransform: "none", fontWeight: 500, color: OR, p: 0, minWidth: 0, "&:hover": { textDecoration: "underline", bgcolor: "transparent" } }}
                    >
                      {wh.code}
                    </Button>
                  </TableCell>
                  <TableCell>{wh.name}</TableCell>
                  <TableCell>{wh.type}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={0.5}>
                      <IconButton size="small" onClick={() => openEdit(wh)} sx={{ color: OR }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: RED }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    ไม่พบข้อมูลคลังสินค้า
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1} sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary">จำนวนรายการต่อหน้า</Typography>
            <TextField size="small" select defaultValue="25" sx={{ width: 70, "& .MuiInputBase-root": { fontSize: 12 } }}>
              <MenuItem value="25">25</MenuItem>
            </TextField>
            <Typography variant="caption" color="text.secondary">1-{filtered.length} of {filtered.length}</Typography>
            <Button size="small" disabled sx={{ minWidth: 28 }}>&lt;</Button>
            <Button
              size="small"
              variant="contained"
              sx={{ minWidth: 28, bgcolor: OR, "&:hover": { bgcolor: OR }, borderRadius: "50%", fontSize: 12 }}
            >
              1
            </Button>
            <Button size="small" disabled sx={{ minWidth: 28 }}>&gt;</Button>
          </Stack>
        </Paper>
      </Box>

      {/* ══════ Edit / Add Drawer (SlidePanel) ══════ */}
      <Drawer
        anchor="right"
        open={!!editingId && !!editForm}
        onClose={closeDrawer}
        PaperProps={{ sx: { width: "100%", maxWidth: 520 } }}
      >
        {editForm && (
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header */}
            <Box sx={{ bgcolor: OR, px: 2.5, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                {editingId === "new" ? "เพิ่มคลังสินค้า" : "แก้ไขคลังสินค้า"}
              </Typography>
              <IconButton size="small" onClick={closeDrawer} sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff" } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Body — scrollable */}
            <Box sx={{ flex: 1, overflow: "auto", p: 2.5 }}>
              <Stack spacing={2.5}>
                {/* รหัสคลังสินค้า */}
                <TextField
                  size="small"
                  label="รหัสคลังสินค้า"
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  required
                  fullWidth
                />

                {/* ชื่อคลังสินค้า */}
                <TextField
                  size="small"
                  label="ชื่อคลังสินค้า"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  fullWidth
                />

                {/* ประเภทคลังสินค้า */}
                <FormControl>
                  <FormLabel sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>
                    ประเภทคลังสินค้า<Typography component="span" sx={{ color: RED }}>*</Typography>
                  </FormLabel>
                  <RadioGroup
                    row
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Warehouse["type"] })}
                  >
                    <FormControlLabel
                      value="คลังสินค้ากลาง"
                      control={<Radio size="small" sx={{ "&.Mui-checked": { color: OR } }} />}
                      label="คลังสินค้ากลาง"
                    />
                    <FormControlLabel
                      value="คลังสาขา"
                      control={<Radio size="small" sx={{ "&.Mui-checked": { color: OR } }} />}
                      label="คลังสินค้าสาขา"
                    />
                  </RadioGroup>
                </FormControl>

                {/* เลือกสาขา */}
                <TextField
                  size="small"
                  label="เลือกสาขา"
                  value={editForm.branch}
                  onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                  required
                  select
                  fullWidth
                >
                  <MenuItem value="B1-WH-HQ">B1-WH-HQ</MenuItem>
                  <MenuItem value="B2-WH-EANG">B2-WH-EANG</MenuItem>
                </TextField>

                {/* ประเทศ + ที่อยู่ */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      size="small"
                      label="ประเทศ"
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      required
                      select
                      fullWidth
                    >
                      <MenuItem value="Thailand">Thailand</MenuItem>
                      <MenuItem value="Laos">Laos</MenuItem>
                      <MenuItem value="Vietnam">Vietnam</MenuItem>
                      <MenuItem value="Cambodia">Cambodia</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      size="small"
                      label="ที่อยู่"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* แขวง/ตำบล + อำเภอ/เขต */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      size="small"
                      label="แขวง/ตำบล"
                      value={editForm.subDistrict}
                      onChange={(e) => setEditForm({ ...editForm, subDistrict: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      size="small"
                      label="อำเภอ/เขต"
                      value={editForm.district}
                      onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* จังหวัด + รหัสไปรษณีย์ */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      size="small"
                      label="จังหวัด"
                      value={editForm.province}
                      onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      size="small"
                      label="รหัสไปรษณีย์"
                      value={editForm.postalCode}
                      onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* URL Google Map */}
                <TextField
                  size="small"
                  label="URL Google Map"
                  value={editForm.googleMap}
                  onChange={(e) => setEditForm({ ...editForm, googleMap: e.target.value })}
                  placeholder="กรอก URL Google Map"
                  fullWidth
                />

                {/* หมายเหตุ */}
                <TextField
                  size="small"
                  label="หมายเหตุ"
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  placeholder="ระบุหมายเหตุ"
                  multiline
                  rows={4}
                  fullWidth
                />
              </Stack>
            </Box>

            {/* Footer */}
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, py: 2 }}>
              {editingId !== "new" ? (
                <Button
                  variant="outlined"
                  onClick={handleDelete}
                  sx={{ textTransform: "none", fontWeight: 600, color: RED, borderColor: RED, "&:hover": { borderColor: RED, bgcolor: "#FFF5F5" } }}
                >
                  ลบ
                </Button>
              ) : <Box />}
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  onClick={closeDrawer}
                  sx={{ textTransform: "none", color: "text.primary", borderColor: "divider" }}
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    bgcolor: OR,
                    "&:hover": { bgcolor: OR, opacity: 0.9 },
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                  }}
                >
                  ยืนยัน
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Drawer>
    </TenantShell>
  );
}
