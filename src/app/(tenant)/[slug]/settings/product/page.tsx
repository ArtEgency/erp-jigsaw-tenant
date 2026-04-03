"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TenantShell from "@/components/layout/TenantShell";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Stack,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { TENANT_PRIMARY as OR, GREEN, RED } from "@/lib/theme";
import { useLocale } from "@/lib/locale";

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
/* ── Pagination component ── */
/* ══════════════════════════════════════════ */
function SimplePagination({ total }: { total: number }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary">จำนวนรายการต่อหน้า</Typography>
      <TextField size="small" select defaultValue="25" sx={{ width: 70, "& .MuiInputBase-root": { fontSize: 12 } }}>
        <MenuItem value="25">25</MenuItem>
        <MenuItem value="50">50</MenuItem>
        <MenuItem value="100">100</MenuItem>
      </TextField>
      <Typography variant="caption" color="text.secondary">1-{total} of {total}</Typography>
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
  );
}

/* ══════════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════════ */
function SettingsProductInner() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "product-type");
  const [search, setSearch] = useState("");

  /* ── toast ── */
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err" = "ok") => { setToast({ msg, type }); };

  /* ── Product Type state ── */
  const [ptSubTab, setPtSubTab] = useState(0);
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
  const currentLabel = SIDE_ITEMS.find((s) => s.id === activeTab)?.label || t("settings.product.productType");
  const breadcrumb = [t("nav.settings"), t("product.product"), currentLabel];

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

  /* ── sub-tab mapping for product-type ── */
  const ptSubTabIds = ["product-type", "main-cat", "sub-cat"];

  return (
    <TenantShell breadcrumb={breadcrumb} activeModule="settings">
      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.type === "ok" ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>

      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}>
          {currentLabel}
        </Typography>

        {/* ═══════════════════════════════════════════ */}
        {/* ── ประเภทสินค้า ── */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "product-type" && (
          <>
            <Tabs
              value={ptSubTab}
              onChange={(_, v) => setPtSubTab(v)}
              sx={{
                mb: 3,
                "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: 14, minHeight: 36, borderRadius: 5, px: 3, py: 0.5 },
                "& .Mui-selected": { color: "#fff !important", bgcolor: OR },
                "& .MuiTabs-indicator": { display: "none" },
              }}
            >
              <Tab label="ประเภทสินค้า" />
              <Tab label="หมวดหมู่หลัก" />
              <Tab label="หมวดหมู่ย่อย" />
            </Tabs>

            {/* ── Sub-tab: ประเภทสินค้า ── */}
            {ptSubTabIds[ptSubTab] === "product-type" && (
              <>
                {/* Toolbar */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
                  <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} sx={{ textTransform: "none", color: "text.primary", borderColor: "divider" }}>
                    EXPORT
                  </Button>
                  <Box sx={{ flex: 1 }} />
                  <TextField size="small" placeholder="ค้นหาชื่อประเภทสินค้า" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: 220 }} />
                  <Button variant="contained" size="small" onClick={() => { setPtCode(""); setPtNameTH(""); setPtNameEN(""); setPtModal(true); }}
                    sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600 }}>
                    เพิ่มประเภทสินค้า
                  </Button>
                </Stack>

                {/* Table */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#F8F8F8" }}>
                        {["รหัสประเภท", "ชื่อประเภท TH", "ชื่อประเภท ENG", "จำนวนหมวดหมู่หลัก", "จำนวนรายการสินค้า", "จัดการ"].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPT.length === 0 ? (
                        <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "text.secondary" }}>ไม่พบข้อมูล</TableCell></TableRow>
                      ) : filteredPT.map((p) => (
                        <TableRow key={p.id} hover>
                          <TableCell sx={{ fontWeight: 500, color: OR }}>{p.code}</TableCell>
                          <TableCell>{p.nameTH}</TableCell>
                          <TableCell>{p.nameEN}</TableCell>
                          <TableCell align="center">{p.categoryCount}</TableCell>
                          <TableCell align="center">{p.productCount}</TableCell>
                          <TableCell>
                            <IconButton size="small" sx={{ color: OR }}><EditIcon fontSize="small" /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
                <SimplePagination total={filteredPT.length} />

                {/* Modal */}
                <Dialog open={ptModal} onClose={() => setPtModal(false)} maxWidth="sm" fullWidth>
                  <DialogTitle sx={{ bgcolor: OR, color: "#fff", py: 1.5, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    เพิ่มประเภทสินค้า
                    <IconButton size="small" onClick={() => setPtModal(false)} sx={{ color: "#fff" }}><CloseIcon fontSize="small" /></IconButton>
                  </DialogTitle>
                  <DialogContent sx={{ pt: "20px !important" }}>
                    <Stack spacing={2.5}>
                      <TextField size="small" label="รหัสประเภทสินค้า" value={ptCode} onChange={(e) => setPtCode(e.target.value)} required fullWidth />
                      <TextField size="small" label="ชื่อประเภทสินค้า (TH)" value={ptNameTH} onChange={(e) => setPtNameTH(e.target.value)} required fullWidth />
                      <TextField size="small" label="ชื่อประเภทสินค้า (ENG)" value={ptNameEN} onChange={(e) => setPtNameEN(e.target.value)} fullWidth />
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}><TextField size="small" label="วันที่สร้าง" value={now} disabled fullWidth /></Grid>
                        <Grid size={{ xs: 6 }}><TextField size="small" label="ผู้ดำเนินการล่าสุด" value="dev dev1" disabled fullWidth /></Grid>
                      </Grid>
                    </Stack>
                  </DialogContent>
                  <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button variant="outlined" onClick={() => setPtModal(false)} sx={{ textTransform: "none", color: "text.secondary", borderColor: "divider" }}>ยกเลิก</Button>
                    <Button variant="contained" onClick={() => { if (!ptCode || !ptNameTH) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกประเภทสินค้าเรียบร้อย"); setPtModal(false); }}
                      sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600, px: 4 }}>
                      บันทึก
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}

            {/* ── Sub-tab: หมวดหมู่หลัก ── */}
            {ptSubTabIds[ptSubTab] === "main-cat" && (
              <>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
                  <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} sx={{ textTransform: "none", color: "text.primary", borderColor: "divider" }}>EXPORT</Button>
                  <Box sx={{ flex: 1 }} />
                  <TextField size="small" placeholder="ค้นหาหมวดหมู่หลัก" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: 220 }} />
                  <Button variant="contained" size="small" onClick={() => { setMcCode(""); setMcNameTH(""); setMcNameEN(""); setMcProductType(""); setMcModal(true); }}
                    sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600 }}>
                    เพิ่มหมวดหมู่หลัก
                  </Button>
                </Stack>

                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#F8F8F8" }}>
                        {["รหัสหมวดหมู่หลัก", "ชื่อหมวดหมู่หลัก (TH)", "ชื่อหมวดหมู่หลัก (ENG)", "ประเภทสินค้า", "จำนวนหมวดหมู่ย่อย", "จำนวนรายการสินค้า", "จัดการ"].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMainCats.length === 0 ? (
                        <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: "text.secondary" }}>ไม่พบข้อมูล</TableCell></TableRow>
                      ) : filteredMainCats.map((mc) => (
                        <TableRow key={mc.id} hover>
                          <TableCell sx={{ fontWeight: 500, color: OR }}>{mc.code}</TableCell>
                          <TableCell>{mc.nameTH}</TableCell>
                          <TableCell>{mc.nameEN}</TableCell>
                          <TableCell>{getPTName(mc.productTypeId)}</TableCell>
                          <TableCell align="center">{mc.subCatCount}</TableCell>
                          <TableCell align="center">{mc.productCount}</TableCell>
                          <TableCell><IconButton size="small" sx={{ color: OR }}><EditIcon fontSize="small" /></IconButton></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
                <SimplePagination total={filteredMainCats.length} />

                <Dialog open={mcModal} onClose={() => setMcModal(false)} maxWidth="sm" fullWidth>
                  <DialogTitle sx={{ bgcolor: OR, color: "#fff", py: 1.5, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    เพิ่มหมวดหมู่หลัก
                    <IconButton size="small" onClick={() => setMcModal(false)} sx={{ color: "#fff" }}><CloseIcon fontSize="small" /></IconButton>
                  </DialogTitle>
                  <DialogContent sx={{ pt: "20px !important" }}>
                    <Stack spacing={2.5}>
                      <TextField size="small" label="รหัสหมวดหมู่หลัก" value={mcCode} onChange={(e) => setMcCode(e.target.value)} required fullWidth />
                      <TextField size="small" label="ชื่อหมวดหมู่หลัก (TH)" value={mcNameTH} onChange={(e) => setMcNameTH(e.target.value)} required fullWidth />
                      <TextField size="small" label="ชื่อหมวดหมู่หลัก (ENG)" value={mcNameEN} onChange={(e) => setMcNameEN(e.target.value)} fullWidth />
                      <TextField size="small" label="ประเภทสินค้า" value={mcProductType} onChange={(e) => setMcProductType(e.target.value)} required select fullWidth>
                        <MenuItem value="">-- เลือกประเภทสินค้า --</MenuItem>
                        {mockProductTypes.map((pt) => (
                          <MenuItem key={pt.id} value={pt.id}>{pt.nameTH} ({pt.nameEN})</MenuItem>
                        ))}
                      </TextField>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}><TextField size="small" label="วันที่สร้าง" value={now} disabled fullWidth /></Grid>
                        <Grid size={{ xs: 6 }}><TextField size="small" label="ผู้ดำเนินการล่าสุด" value="dev dev1" disabled fullWidth /></Grid>
                      </Grid>
                    </Stack>
                  </DialogContent>
                  <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button variant="outlined" onClick={() => setMcModal(false)} sx={{ textTransform: "none", color: "text.secondary", borderColor: "divider" }}>ยกเลิก</Button>
                    <Button variant="contained" onClick={() => { if (!mcCode || !mcNameTH || !mcProductType) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกหมวดหมู่หลักเรียบร้อย"); setMcModal(false); }}
                      sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600, px: 4 }}>
                      บันทึก
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}

            {/* ── Sub-tab: หมวดหมู่ย่อย ── */}
            {ptSubTabIds[ptSubTab] === "sub-cat" && (
              <>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
                  <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} sx={{ textTransform: "none", color: "text.primary", borderColor: "divider" }}>EXPORT</Button>
                  <Box sx={{ flex: 1 }} />
                  <TextField size="small" placeholder="ค้นหาหมวดหมู่ย่อย" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: 220 }} />
                  <Button variant="contained" size="small" onClick={() => { setScCode(""); setScNameTH(""); setScNameEN(""); setScMainCat(""); setScProductType(""); setScModal(true); }}
                    sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600 }}>
                    เพิ่มหมวดหมู่ย่อย
                  </Button>
                </Stack>

                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#F8F8F8" }}>
                        {["รหัสหมวดหมู่ย่อย", "ชื่อหมวดหมู่ย่อย (TH)", "ชื่อหมวดหมู่ย่อย (ENG)", "ชื่อหมวดหมู่หลัก", "ประเภทสินค้า", "จำนวนรายการสินค้า", "จัดการ"].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredSubCats.length === 0 ? (
                        <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: "text.secondary" }}>ไม่พบข้อมูล</TableCell></TableRow>
                      ) : filteredSubCats.map((sc) => (
                        <TableRow key={sc.id} hover>
                          <TableCell sx={{ fontWeight: 500, color: OR }}>{sc.code}</TableCell>
                          <TableCell>{sc.nameTH}</TableCell>
                          <TableCell>{sc.nameEN}</TableCell>
                          <TableCell>{getMCName(sc.mainCatId)}</TableCell>
                          <TableCell>{getPTName(sc.productTypeId)}</TableCell>
                          <TableCell align="center">{sc.productCount}</TableCell>
                          <TableCell><IconButton size="small" sx={{ color: OR }}><EditIcon fontSize="small" /></IconButton></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
                <SimplePagination total={filteredSubCats.length} />

                <Dialog open={scModal} onClose={() => setScModal(false)} maxWidth="sm" fullWidth>
                  <DialogTitle sx={{ bgcolor: OR, color: "#fff", py: 1.5, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    เพิ่มหมวดหมู่ย่อย
                    <IconButton size="small" onClick={() => setScModal(false)} sx={{ color: "#fff" }}><CloseIcon fontSize="small" /></IconButton>
                  </DialogTitle>
                  <DialogContent sx={{ pt: "20px !important" }}>
                    <Stack spacing={2.5}>
                      <TextField size="small" label="รหัสหมวดหมู่ย่อย" value={scCode} onChange={(e) => setScCode(e.target.value)} required fullWidth />
                      <TextField size="small" label="ชื่อหมวดหมู่ย่อย (TH)" value={scNameTH} onChange={(e) => setScNameTH(e.target.value)} required fullWidth />
                      <TextField size="small" label="ชื่อหมวดหมู่ย่อย (ENG)" value={scNameEN} onChange={(e) => setScNameEN(e.target.value)} fullWidth />
                      <TextField size="small" label="หมวดหมู่หลัก" value={scMainCat} onChange={(e) => {
                        setScMainCat(e.target.value);
                        const mc = mockMainCategories.find((m) => m.id === e.target.value);
                        if (mc) setScProductType(mc.productTypeId);
                      }} required select fullWidth>
                        <MenuItem value="">-- เลือกหมวดหมู่หลัก --</MenuItem>
                        {mockMainCategories.map((mc) => (
                          <MenuItem key={mc.id} value={mc.id}>{mc.nameTH} ({mc.nameEN})</MenuItem>
                        ))}
                      </TextField>
                      <TextField size="small" label="ประเภทสินค้า" value={scProductType} onChange={(e) => setScProductType(e.target.value)} required select fullWidth>
                        <MenuItem value="">-- เลือกประเภทสินค้า --</MenuItem>
                        {mockProductTypes.map((pt) => (
                          <MenuItem key={pt.id} value={pt.id}>{pt.nameTH} ({pt.nameEN})</MenuItem>
                        ))}
                      </TextField>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}><TextField size="small" label="วันที่สร้าง" value={now} disabled fullWidth /></Grid>
                        <Grid size={{ xs: 6 }}><TextField size="small" label="ผู้ดำเนินการล่าสุด" value="dev dev1" disabled fullWidth /></Grid>
                      </Grid>
                    </Stack>
                  </DialogContent>
                  <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button variant="outlined" onClick={() => setScModal(false)} sx={{ textTransform: "none", color: "text.secondary", borderColor: "divider" }}>ยกเลิก</Button>
                    <Button variant="contained" onClick={() => { if (!scCode || !scNameTH || !scMainCat || !scProductType) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกหมวดหมู่ย่อยเรียบร้อย"); setScModal(false); }}
                      sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600, px: 4 }}>
                      บันทึก
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ── หน่วยนับ ── */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === "unit" && (
          <>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
              <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} sx={{ textTransform: "none", color: "text.primary", borderColor: "divider" }}>EXPORT</Button>
              <Box sx={{ flex: 1 }} />
              <TextField size="small" placeholder="ค้นหาชื่อหน่วยนับ" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: 200 }} />
              <Button variant="contained" size="small" onClick={() => { setUnitNameTH(""); setUnitNameEN(""); setUnitDesc(""); setUnitModal(true); }}
                sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600 }}>
                เพิ่มหน่วยนับ
              </Button>
            </Stack>

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F8F8F8" }}>
                    {["ชื่อหน่วยนับ (TH)", "ชื่อหน่วยนับ (ENG)", "รายละเอียดเพิ่มเติม", "จัดการ"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUnits.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5, color: "text.secondary" }}>ไม่พบข้อมูล</TableCell></TableRow>
                  ) : filteredUnits.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.nameTH}</TableCell>
                      <TableCell>{u.nameEN}</TableCell>
                      <TableCell>{u.desc}</TableCell>
                      <TableCell><IconButton size="small" sx={{ color: OR }}><EditIcon fontSize="small" /></IconButton></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <SimplePagination total={filteredUnits.length} />

            <Dialog open={unitModal} onClose={() => setUnitModal(false)} maxWidth="sm" fullWidth>
              <DialogTitle sx={{ bgcolor: OR, color: "#fff", py: 1.5, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                เพิ่มหน่วยนับ
                <IconButton size="small" onClick={() => setUnitModal(false)} sx={{ color: "#fff" }}><CloseIcon fontSize="small" /></IconButton>
              </DialogTitle>
              <DialogContent sx={{ pt: "20px !important" }}>
                <Stack spacing={2.5}>
                  <TextField size="small" label="ชื่อหน่วยนับ (TH)" value={unitNameTH} onChange={(e) => setUnitNameTH(e.target.value)} required fullWidth />
                  <TextField size="small" label="ชื่อหน่วยนับ (ENG)" value={unitNameEN} onChange={(e) => setUnitNameEN(e.target.value)} fullWidth />
                  <TextField size="small" label="รายละเอียดเพิ่มเติม" value={unitDesc} onChange={(e) => setUnitDesc(e.target.value)} required fullWidth />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}><TextField size="small" label="วันที่สร้าง" value={now} disabled fullWidth /></Grid>
                    <Grid size={{ xs: 6 }}><TextField size="small" label="ผู้ดำเนินการล่าสุด" value="dev dev1" disabled fullWidth /></Grid>
                  </Grid>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                <Button variant="outlined" onClick={() => setUnitModal(false)} sx={{ textTransform: "none", color: "text.secondary", borderColor: "divider" }}>ยกเลิก</Button>
                <Button variant="contained" onClick={() => { if (!unitNameTH || !unitDesc) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกหน่วยนับเรียบร้อย"); setUnitModal(false); }}
                  sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600, px: 4 }}>
                  บันทึก
                </Button>
              </DialogActions>
            </Dialog>
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
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
                <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} sx={{ textTransform: "none", color: "text.primary", borderColor: "divider" }}>EXPORT</Button>
                <Box sx={{ flex: 1 }} />
                <TextField size="small" select defaultValue="" sx={{ minWidth: 100 }}>
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  <MenuItem value="active">เปิดใช้งาน</MenuItem>
                  <MenuItem value="inactive">ปิดใช้งาน</MenuItem>
                </TextField>
                <TextField size="small" placeholder={c.searchPH} value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: 220 }} />
                <Button variant="contained" size="small" onClick={() => { setMasterNameTH(""); setMasterNameEN(""); setMasterStatus("active"); setMasterModal(true); }}
                  sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600 }}>
                  {c.addLabel}
                </Button>
              </Stack>

              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F8F8F8" }}>
                      {[c.colTH, c.colEN, "สถานะ", "จัดการ"].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5, color: "text.secondary" }}>ไม่พบข้อมูล</TableCell></TableRow>
                    ) : filtered.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.nameTH}</TableCell>
                        <TableCell>{item.nameEN}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                            size="small"
                            sx={{
                              bgcolor: item.active ? "#E8F5E9" : "#FCEBEB",
                              color: item.active ? GREEN : "#A32D2D",
                              fontWeight: 500,
                              fontSize: 12,
                            }}
                          />
                        </TableCell>
                        <TableCell><IconButton size="small" sx={{ color: OR }}><EditIcon fontSize="small" /></IconButton></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
              <SimplePagination total={filtered.length} />

              <Dialog open={masterModal} onClose={() => setMasterModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: OR, color: "#fff", py: 1.5, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {c.modalTitle}
                  <IconButton size="small" onClick={() => setMasterModal(false)} sx={{ color: "#fff" }}><CloseIcon fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: "20px !important" }}>
                  <Stack spacing={2.5}>
                    <TextField size="small" label={c.fieldTH} value={masterNameTH} onChange={(e) => setMasterNameTH(e.target.value)} required fullWidth />
                    <TextField size="small" label={c.fieldEN} value={masterNameEN} onChange={(e) => setMasterNameEN(e.target.value)} required fullWidth />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}><TextField size="small" label="วันที่สร้าง" value={now} disabled fullWidth /></Grid>
                      <Grid size={{ xs: 6 }}><TextField size="small" label="วันที่แก้ไขล่าสุด" value={now} disabled fullWidth /></Grid>
                    </Grid>
                    <FormControl>
                      <FormLabel sx={{ fontSize: 12, fontWeight: 600 }}>สถานะ</FormLabel>
                      <RadioGroup row value={masterStatus} onChange={(e) => setMasterStatus(e.target.value as "active" | "inactive")}>
                        <FormControlLabel value="active" control={<Radio size="small" sx={{ "&.Mui-checked": { color: OR } }} />} label="เปิดใช้งาน" />
                        <FormControlLabel value="inactive" control={<Radio size="small" sx={{ "&.Mui-checked": { color: OR } }} />} label="ปิดใช้งาน" />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                  <Button variant="outlined" onClick={() => setMasterModal(false)} sx={{ textTransform: "none", color: "text.secondary", borderColor: "divider" }}>ยกเลิก</Button>
                  <Button variant="contained" onClick={() => { if (!masterNameTH || !masterNameEN) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกเรียบร้อย"); setMasterModal(false); }}
                    sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600, px: 4 }}>
                    บันทึก
                  </Button>
                </DialogActions>
              </Dialog>
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
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
                <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} sx={{ textTransform: "none", color: "text.primary", borderColor: "divider" }}>EXPORT</Button>
                <Box sx={{ flex: 1 }} />
                <TextField size="small" placeholder="ค้นหายี่ห้อ" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: 200 }} />
                <Button variant="contained" size="small" onClick={() => { setBrandNameTH(""); setBrandNameEN(""); setBrandNote(""); setBrandStatus("active"); setBrandModal(true); }}
                  sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600 }}>
                  เพิ่มยี่ห้อ
                </Button>
              </Stack>

              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F8F8F8" }}>
                      {["ยี่ห้อ (แบรนด์) (TH)", "ยี่ห้อ (แบรนด์) (EN)", "สถานะ", "จัดการ"].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBrands.length === 0 ? (
                      <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5, color: "text.secondary" }}>ไม่พบข้อมูล</TableCell></TableRow>
                    ) : filteredBrands.map((b) => (
                      <TableRow key={b.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box sx={{ width: 32, height: 32, borderRadius: 1, border: 1, borderColor: "divider", bgcolor: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>IMG</Typography>
                            </Box>
                            <Typography variant="body2">{b.nameTH}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{b.nameEN}</TableCell>
                        <TableCell>
                          <Chip
                            label={b.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                            size="small"
                            sx={{
                              bgcolor: b.active ? "#E8F5E9" : "#FCEBEB",
                              color: b.active ? GREEN : "#A32D2D",
                              fontWeight: 500,
                              fontSize: 12,
                            }}
                          />
                        </TableCell>
                        <TableCell><IconButton size="small" sx={{ color: OR }}><EditIcon fontSize="small" /></IconButton></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

              <Dialog open={brandModal} onClose={() => setBrandModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: OR, color: "#fff", py: 1.5, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  เพิ่มยี่ห้อ (แบรนด์)
                  <IconButton size="small" onClick={() => setBrandModal(false)} sx={{ color: "#fff" }}><CloseIcon fontSize="small" /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: "20px !important" }}>
                  <Stack spacing={2.5}>
                    <TextField size="small" label="ชื่อยี่ห้อ (TH)" value={brandNameTH} onChange={(e) => setBrandNameTH(e.target.value)} required fullWidth />
                    <TextField size="small" label="ชื่อยี่ห้อ (EN)" value={brandNameEN} onChange={(e) => setBrandNameEN(e.target.value)} required fullWidth />

                    {/* Image upload area */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ width: 64, height: 64, borderRadius: 1, border: "2px dashed", borderColor: "divider", bgcolor: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ fontSize: 24 }}>IMG</Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button variant="contained" size="small" sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none" }}>
                          อัพโหลดรูปภาพ
                        </Button>
                        <Button variant="outlined" size="small" sx={{ textTransform: "none", color: RED, borderColor: RED }}>
                          ลบ
                        </Button>
                      </Stack>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      อัพโหลดไฟล์ JPG, GIF or PNG. ขนาดไม่เกิน 800K
                    </Typography>

                    <TextField size="small" label="หมายเหตุ" value={brandNote} onChange={(e) => setBrandNote(e.target.value)} multiline rows={3} fullWidth />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}><TextField size="small" label="วันที่สร้าง" value={now} disabled fullWidth /></Grid>
                      <Grid size={{ xs: 6 }}><TextField size="small" label="วันที่แก้ไขล่าสุด" value={now} disabled fullWidth /></Grid>
                    </Grid>

                    <FormControl>
                      <FormLabel sx={{ fontSize: 12, fontWeight: 600 }}>สถานะ</FormLabel>
                      <RadioGroup row value={brandStatus} onChange={(e) => setBrandStatus(e.target.value as "active" | "inactive")}>
                        <FormControlLabel value="active" control={<Radio size="small" sx={{ "&.Mui-checked": { color: OR } }} />} label="เปิดใช้งาน" />
                        <FormControlLabel value="inactive" control={<Radio size="small" sx={{ "&.Mui-checked": { color: OR } }} />} label="ปิดใช้งาน" />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
                  <Button variant="outlined" size="small" sx={{ textTransform: "none", color: RED, borderColor: RED }}>ลบ</Button>
                  <Stack direction="row" spacing={1.5}>
                    <Button variant="outlined" onClick={() => setBrandModal(false)} sx={{ textTransform: "none", color: "text.secondary", borderColor: "divider" }}>ยกเลิก</Button>
                    <Button variant="contained" onClick={() => { if (!brandNameTH || !brandNameEN) { showToast("กรุณากรอกข้อมูลที่จำเป็น", "err"); return; } showToast("บันทึกยี่ห้อเรียบร้อย"); setBrandModal(false); }}
                      sx={{ bgcolor: OR, "&:hover": { bgcolor: OR, opacity: 0.9 }, textTransform: "none", fontWeight: 600, px: 4 }}>
                      บันทึก
                    </Button>
                  </Stack>
                </DialogActions>
              </Dialog>
            </>
          );
        })()}

        {/* ═══════════════════════════════════════════ */}
        {/* ── Placeholder for remaining tabs ── */}
        {/* ═══════════════════════════════════════════ */}
        {!["product-type", "unit", "pack-size", "dimension", "weight", "brand"].includes(activeTab) && (
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              หน้า &ldquo;{currentLabel}&rdquo; — อยู่ระหว่างพัฒนา
            </Typography>
          </Paper>
        )}
      </Box>
    </TenantShell>
  );
}

export default function SettingsProductPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">กำลังโหลด...</Typography>
      </Box>
    }>
      <SettingsProductInner />
    </Suspense>
  );
}
