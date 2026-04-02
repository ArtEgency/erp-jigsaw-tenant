"use client";

import { useState, Suspense, useRef } from "react";
import TenantShell from "@/components/layout/TenantShell";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tabs,
  Tab,
  Stack,
  Paper,

  Checkbox,
  FormControlLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ImageIcon from "@mui/icons-material/Image";

import {
  TENANT_PRIMARY as OR,
  TENANT_HOVER as OR_D,
  GREEN,
  GREEN_L,
  RED,
  RED_L,
  BORDER,
  TEXT,
  MUTED,
  BG,
} from "@/lib/theme";

/* ══════════════════════════════════════════════════ */
/* ── TYPES ── */
/* ══════════════════════════════════════════════════ */

interface ProductUnit {
  barcode: string;
  unitName: string;
  ratio: number;
  container: string;
  isBuy: boolean;
  isSell: boolean;
  isTransfer: boolean;
  isUMS: boolean;
  isUML: boolean;
}

interface ProductSpec {
  barcode: string;
  unitName: string;
  weight: string;
  weightUnit: string;
  width: string;
  length: string;
  height: string;
  dimUnit: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  barcode: string;
  image: string;
  type: string;
  category: string;
  subCategory: string;
  brand: string;
  packSize: string;
  sellPrice: number;
  sellUnit: string;
  bulkPrice: number;
  bulkUnit: string;
  active: boolean;
  colorTag: string;
}

/* ══════════════════════════════════════════════════ */
/* ── MOCK DATA ── */
/* ══════════════════════════════════════════════════ */

const PRODUCT_TYPES = ["เครื่องสำอาง", "ของใช้ส่วนตัว", "อาหารเสริม", "เวชสำอาง"];
const CATEGORIES = ["เมคอัพปาก", "ดูแลช่องปาก", "ป้องกันแดด", "บำรุงผิว"];
const SUB_CATEGORIES = ["ลิปบาล์ม", "ลิปสติก", "ยาสีฟัน", "ครีมกันแดด", "เจล"];
const BRANDS = ["Srichand", "ฟลูโอคารีล", "บู๊ทส์", "นีเวีย", "มิสทีน"];
const UNITS = ["ชิ้น", "แผง", "กล่อง", "ลัง", "โหล"];
const WEIGHT_UNITS = ["กรัม", "กิโลกรัม", "มิลลิลิตร", "ลิตร"];
const DIM_UNITS = ["CM", "MM", "IN"];
const SUPPLIERS = [
  "GC450055487 บริษัท เอเอฟซ์ อีแอล จำกัด (สำนักงานใหญ่) - 00000",
  "GC450055488 บริษัท ไทยนครพัฒนา จำกัด - 00001",
];

const mockProducts: Product[] = [
  {
    id: "1", code: "SK12653", name: "ศรีจันทร์ เดย์ ทู ไกลว์ ไฮเดรติ้ง ลิป 2.5ก. 01 พริตตี้", barcode: "8854815084858, 8854815084859",
    image: "", type: "เครื่องสำอาง", category: "เมคอัพปาก", subCategory: "ลิปบาล์ม", brand: "Srichand",
    packSize: "40 กรัม", sellPrice: 40.00, sellUnit: "ชิ้น", bulkPrice: 3500.00, bulkUnit: "ลัง",
    active: true, colorTag: "#E8913A",
  },
  {
    id: "2", code: "SK12653", name: "ฟลูโอคารีล สเปร์ระงับกลิ่นปาก เฟรชมิ้นท์ 15 มล.", barcode: "8854815084858, 8854815084859",
    image: "", type: "ของใช้ส่วนตัว", category: "ดูแลช่องปาก", subCategory: "", brand: "ฟลูโอคารีล",
    packSize: "-", sellPrice: 149.00, sellUnit: "ชิ้น", bulkPrice: 0, bulkUnit: "",
    active: true, colorTag: "#3B82F6",
  },
  {
    id: "3", code: "1086584", name: "บู๊ทส์ อโลเวร่า ซูทติ้ง แอนด์ มอยเจอร์ไรซิ่ง เจล 300 กรัม", barcode: "5000167386646",
    image: "", type: "อาหารเสริม", category: "ป้องกันแดด", subCategory: "เจล", brand: "บู๊ทส์",
    packSize: "300 กรัม", sellPrice: 159.00, sellUnit: "ชิ้น", bulkPrice: 0, bulkUnit: "",
    active: true, colorTag: "#10B981",
  },
];

/* ══════════════════════════════════════════════════ */
/* ── REUSABLE COMPONENTS ── */
/* ══════════════════════════════════════════════════ */

const Section = ({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <Paper variant="outlined" sx={{ borderColor: BORDER, borderRadius: 2, mb: 2 }}>
    <Box
      onClick={onToggle}
      sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.5, cursor: "pointer" }}
    >
      <Typography fontWeight={700} fontSize={15} sx={{ color: OR }}>{title}</Typography>
      {open ? <ExpandLessIcon sx={{ color: MUTED }} /> : <ExpandMoreIcon sx={{ color: MUTED }} />}
    </Box>
    {open && (
      <Box sx={{ px: 2.5, pb: 2.5, borderTop: `1px solid ${BORDER}` }}>
        {children}
      </Box>
    )}
  </Paper>
);

/* ── Product Type Modal ── */
const ProductTypeModal = ({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (type: "general" | "variant" | "service") => void }) => {
  if (!open) return null;
  const types = [
    { id: "general" as const, title: "สินค้าทั่วไป", desc: "(สามารถสร้างหลายหน่วยอัตราส่วนได้)\nเช่น ชิ้น, โหล, ลัง", example: "เช่น 1 ลัง = 4 ขวด", color: "#E8913A", icon: "\uD83D\uDCE6" },
    { id: "variant" as const, title: "สินค้าหลายตัวเลือก", desc: "(สินค้าที่มีตัวเลือก สี, SIZE, ขนาด)", example: "", color: "#3B82F6", icon: "\uD83D\uDC55" },
    { id: "service" as const, title: "สินค้าบริการ", desc: "สินค้าประเภทให้บริการ\nหรือสินค้าไม่ควบคุมสต็อก", example: "NO STOCK", color: "#10B981", icon: "\uD83D\uDCE4" },
  ];

  return (
    <Box sx={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.4)" }}>
      <Paper sx={{ borderRadius: 3, width: 700, maxWidth: "95vw", overflow: "hidden", boxShadow: 24 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2, borderBottom: `1px solid ${BORDER}` }}>
          <Typography fontSize={18} fontWeight={700} sx={{ color: TEXT }}>เลือกรูปแบบสินค้า</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: MUTED }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Body */}
        <Stack direction="row" spacing={2} sx={{ p: 3 }}>
          {types.map((t) => (
            <Box
              key={t.id}
              onClick={() => onSelect(t.id)}
              sx={{
                flex: 1, borderRadius: 3, border: `2px solid ${t.color}40`, p: 2.5,
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                cursor: "pointer", transition: "all 0.2s",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)", borderColor: t.color },
              }}
            >
              <Typography fontSize={36} sx={{ mb: 1.5 }}>{t.icon}</Typography>
              <Typography fontWeight={700} fontSize={15} sx={{ color: t.color, mb: 0.5 }}>{t.title}</Typography>
              {t.example && <Typography fontSize={12} sx={{ color: t.color, mb: 1 }}>{t.example}</Typography>}
              <Typography fontSize={12} sx={{ color: t.color, whiteSpace: "pre-line" }}>{t.desc}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

/* ══════════════════════════════════════════════════ */
/* ── MAIN COMPONENT ── */
/* ══════════════════════════════════════════════════ */

function ProductInner() {
  /* ── screen state ── */
  const [screen, setScreen] = useState<"list" | "add">("list");
  const [tab, setTab] = useState("all");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterAll, setFilterAll] = useState("");
  const [search, setSearch] = useState("");

  /* ── add form state ── */
  const [sections, setSections] = useState({
    general: true, product: true, pricing: true, units: true, spec: true, images: true, history: true,
  });
  const toggleSection = (s: keyof typeof sections) => setSections((p) => ({ ...p, [s]: !p[s] }));

  // ข้อมูลทั่วไป
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [nameEN, setNameEN] = useState("");
  const [nameTH, setNameTH] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierCode, setSupplierCode] = useState("");
  const [supplierProductName, setSupplierProductName] = useState("");

  // ข้อมูลสินค้า
  const [prodType, setProdType] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  // กำหนดราคา
  const [costPrice, setCostPrice] = useState("");
  const [sellPriceVal, setSellPriceVal] = useState("");

  // ตั้งค่าเพิ่มเติม — multi-unit
  const [units, setUnits] = useState<ProductUnit[]>([
    { barcode: "", unitName: "แผง", ratio: 1, container: "1x10", isBuy: true, isSell: false, isTransfer: false, isUMS: false, isUML: false },
    { barcode: "", unitName: "ลัง", ratio: 10, container: "1x10", isBuy: false, isSell: true, isTransfer: false, isUMS: true, isUML: false },
    { barcode: "", unitName: "กล่อง", ratio: 10, container: "1x10", isBuy: false, isSell: false, isTransfer: true, isUMS: false, isUML: true },
  ]);

  // ข้อมูลจำเพาะ
  const [packWeight, setPackWeight] = useState("60");
  const [packWeightUnit, setPackWeightUnit] = useState("กรัม");
  const [specs, setSpecs] = useState<ProductSpec[]>([
    { barcode: "", unitName: "แผง", weight: "-", weightUnit: "กรัม", width: "-", length: "-", height: "-", dimUnit: "CM" },
    { barcode: "", unitName: "ลัง", weight: "-", weightUnit: "กรัม", width: "-", length: "-", height: "-", dimUnit: "CM" },
    { barcode: "", unitName: "กล่อง", weight: "-", weightUnit: "กรัม", width: "-", length: "-", height: "-", dimUnit: "CM" },
  ]);

  // สถานะ sidebar
  const [showOnShelf, setShowOnShelf] = useState(true);
  const [showInStock, setShowInStock] = useState(true);

  // toast
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err" = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  // ref for file input
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── section completion for sidebar ── */
  const sectionStatus = {
    general: !!(sku && barcode && nameTH),
    product: !!(prodType && mainCategory),
    pricing: !!(sellPriceVal),
    spec: true,
    images: false,
  };

  /* ── filter products ── */
  const filtered = mockProducts.filter((p) => {
    if (tab === "all" && !p.active) return false;
    if (tab === "cancelled" && p.active) return false;
    if (filterType && p.type !== filterType) return false;
    if (search) {
      const s = search.toLowerCase();
      return p.code.toLowerCase().includes(s) || p.name.toLowerCase().includes(s) || p.barcode.toLowerCase().includes(s);
    }
    return true;
  });

  /* ── breadcrumb ── */
  const breadcrumb = screen === "list"
    ? ["สินค้า", "จัดการสินค้า"]
    : ["สินค้า", "จัดการสินค้า", "สินค้า"];

  /* ── handle save ── */
  const handleSave = () => {
    if (!sku || !barcode || !nameTH || !prodType) {
      showToast("กรุณากรอกข้อมูลที่จำเป็นให้ครบ", "err");
      return;
    }
    showToast("บันทึกข้อมูลสินค้าเรียบร้อย");
    setScreen("list");
  };

  /* ── update unit ── */
  const updateUnit = (idx: number, key: keyof ProductUnit, val: string | number | boolean) => {
    setUnits((prev) => prev.map((u, i) => i === idx ? { ...u, [key]: val } : u));
  };

  /* ── update spec ── */
  const updateSpec = (idx: number, key: keyof ProductSpec, val: string) => {
    setSpecs((prev) => prev.map((s, i) => i === idx ? { ...s, [key]: val } : s));
  };

  /* ══════════════════════════════════════ */
  /* ── LIST SCREEN ── */
  /* ══════════════════════════════════════ */
  if (screen === "list") {
    return (
      <TenantShell breadcrumb={breadcrumb} activeModule="products">
        {toast && (
          <Box sx={{
            position: "fixed", top: 16, right: 16, zIndex: 50, px: 2.5, py: 1.5, borderRadius: 2,
            boxShadow: 3, fontSize: 14, fontWeight: 500,
            bgcolor: toast.type === "ok" ? GREEN_L : RED_L,
            color: toast.type === "ok" ? GREEN : RED,
            border: `1px solid ${toast.type === "ok" ? GREEN : RED}33`,
          }}>
            {toast.msg}
          </Box>
        )}

        <ProductTypeModal open={showTypeModal} onClose={() => setShowTypeModal(false)}
          onSelect={(type) => { setShowTypeModal(false); if (type === "general") setScreen("add"); }} />

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", width: "100%", minHeight: "100%", bgcolor: BG }}>
          <Box sx={{ width: "100%", maxWidth: 1920, px: 3, py: 3 }}>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, color: TEXT }}>จัดการสินค้า</Typography>

            {/* Sub-tabs */}
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                mb: 2.5,
                minHeight: 40,
                "& .MuiTab-root": {
                  textTransform: "none", fontWeight: 600, fontSize: 15, minHeight: 40, px: 2, borderRadius: 2,
                },
                "& .Mui-selected": { color: "white !important", bgcolor: OR, borderRadius: 2 },
                "& .MuiTabs-indicator": { display: "none" },
              }}
            >
              <Tab value="all" label="สินค้าทั้งหมด" />
              <Tab value="cancelled" label="สินค้ายกเลิกขาย" />
            </Tabs>

            {/* Content Card */}
            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 10px 0 rgba(76,78,100,0.22)" }}>

              {/* Toolbar / Filter */}
              <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={2} sx={{ p: 2.5 }}>
                {/* Export */}
                <Button variant="contained" startIcon={<DownloadIcon />} size="small"
                  sx={{ bgcolor: OR, "&:hover": { bgcolor: OR_D }, textTransform: "none", fontWeight: 500 }}>
                  EXPORT
                </Button>

                {/* Filter: ประเภทสินค้า */}
                <TextField
                  select size="small" value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{ minWidth: 160 }}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="">ประเภทสินค้า</MenuItem>
                  {PRODUCT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>

                {/* Filter: ทั้งหมด */}
                <TextField
                  select size="small" value={filterAll}
                  onChange={(e) => setFilterAll(e.target.value)}
                  sx={{ minWidth: 120 }}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>

                <Box sx={{ flex: 1 }} />

                {/* Search */}
                <TextField
                  size="small" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อสินค้า / รหัสสินค้า / บาร์โค้ด"
                  sx={{ width: 300 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: MUTED, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Add button */}
                <Button variant="contained" size="small"
                  onClick={() => setShowTypeModal(true)}
                  sx={{
                    bgcolor: OR, "&:hover": { bgcolor: OR_D },
                    textTransform: "none", fontWeight: 600, px: 2.5,
                    boxShadow: "0 4px 8px -4px rgba(76,78,100,0.42)",
                  }}>
                  เพิ่มสินค้า
                </Button>
              </Stack>

              {/* Table */}
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ "& td, & th": { color: TEXT } }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#F5F5F7" }}>
                      {["รหัสสินค้า", "รูปภาพ", "ชื่อรายการ", "ประเภทสินค้า", "หมวดหมู่", "แบรนด์", "ขนาดบรรจุ", "ราคาขาย", "จัดการ"].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 500, fontSize: 14, whiteSpace: "nowrap", color: "#374151", borderBottom: "1px solid #F5F5F7", borderTop: "1px solid #F5F5F7", px: 2.5, py: 1.5 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 5, color: MUTED }}>ไม่พบข้อมูลสินค้า</TableCell>
                      </TableRow>
                    ) : filtered.map((prod) => (
                      <TableRow key={prod.id} hover sx={{ "& td": { borderBottom: "1px solid rgba(76,78,100,0.12)" } }}>
                        {/* รหัสสินค้า with color tag */}
                        <TableCell sx={{ px: 2.5, py: 1.5, whiteSpace: "nowrap" }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 4, height: 40, borderRadius: 2, bgcolor: prod.colorTag }} />
                            <Typography fontSize={14} sx={{ color: OR, cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5 }}>
                              <AddIcon sx={{ fontSize: 14, color: OR }} />
                              {prod.code}
                            </Typography>
                          </Stack>
                        </TableCell>
                        {/* รูปภาพ */}
                        <TableCell sx={{ px: 2.5, py: 1.5 }}>
                          <Avatar variant="rounded" sx={{ width: 50, height: 50, bgcolor: "#f5f5f5", color: MUTED, fontSize: 12 }}>
                            {prod.image ? <Box component="img" src={prod.image} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "No img"}
                          </Avatar>
                        </TableCell>
                        {/* ชื่อรายการ */}
                        <TableCell sx={{ px: 2.5, py: 1.5, maxWidth: 300 }}>
                          <Typography fontSize={14} sx={{ color: "#374151" }}>{prod.name}</Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                            <Typography fontSize={12} sx={{ color: MUTED }}>
                              Barcode : {prod.barcode}
                            </Typography>
                            <IconButton size="small" sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}>
                              <ContentCopyIcon sx={{ fontSize: 12 }} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        {/* ประเภทสินค้า */}
                        <TableCell sx={{ px: 2.5, py: 1.5, fontSize: 14, color: "#374151" }}>{prod.type}</TableCell>
                        {/* หมวดหมู่ */}
                        <TableCell sx={{ px: 2.5, py: 1.5 }}>
                          <Typography fontSize={12} sx={{ color: "#374151" }}>{prod.category}</Typography>
                          <Typography fontSize={14} fontWeight={500} sx={{ color: "#374151" }}>{prod.subCategory}</Typography>
                        </TableCell>
                        {/* แบรนด์ */}
                        <TableCell sx={{ px: 2.5, py: 1.5, fontSize: 14, color: "#374151" }}>{prod.brand}</TableCell>
                        {/* ขนาดบรรจุ */}
                        <TableCell align="center" sx={{ px: 2.5, py: 1.5, fontSize: 14, color: "#374151" }}>{prod.packSize}</TableCell>
                        {/* ราคาขาย */}
                        <TableCell align="right" sx={{ px: 2.5, py: 1.5 }}>
                          <Typography fontWeight={600} sx={{ color: OR }}>{prod.sellPrice.toFixed(2)} / {prod.sellUnit}</Typography>
                          {prod.bulkPrice > 0 && (
                            <Typography fontSize={12} sx={{ color: MUTED }}>{prod.bulkPrice.toFixed(2)} / {prod.bulkUnit}</Typography>
                          )}
                        </TableCell>
                        {/* จัดการ */}
                        <TableCell sx={{ px: 2.5, py: 1.5 }}>
                          <IconButton size="small" sx={{ border: `1px solid ${BORDER}`, "&:hover": { bgcolor: "rgba(86,93,255,0.04)" } }}>
                            <EditIcon sx={{ fontSize: 16, color: OR }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              {/* Pagination */}
              <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2} sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${BORDER}` }}>
                <Typography fontSize={14} sx={{ color: "#9294A1" }}>จำนวนรายการต่อหน้า</Typography>
                <TextField select size="small" defaultValue="6" variant="standard"
                  sx={{ width: 50, "& .MuiInput-underline:before": { display: "none" }, "& .MuiInput-underline:after": { display: "none" } }}>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="25">25</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                </TextField>
                <Typography fontSize={14} sx={{ color: "#9294A1" }}>1-{filtered.length} of {filtered.length}</Typography>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <IconButton size="small" disabled sx={{ opacity: 0.4 }}>
                    <Typography fontSize={12}>&lt;</Typography>
                  </IconButton>
                  <Box sx={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: OR, color: "white", fontSize: 12 }}>
                    1
                  </Box>
                  <Box sx={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4C4E63", fontSize: 12, cursor: "pointer" }}>
                    2
                  </Box>
                  <IconButton size="small" sx={{ color: MUTED }}>
                    <Typography fontSize={12}>&gt;</Typography>
                  </IconButton>
                </Stack>
              </Stack>

            </Paper>{/* end card */}
          </Box>
        </Box>
      </TenantShell>
    );
  }

  /* ══════════════════════════════════════ */
  /* ── ADD PRODUCT FORM (สินค้าทั่วไป) ── */
  /* ══════════════════════════════════════ */

  const sidebarSections = [
    { key: "general", label: "ข้อมูลทั่วไป", done: sectionStatus.general },
    { key: "product", label: "ข้อมูลสินค้า", done: sectionStatus.product },
    { key: "pricing", label: "กำหนดราคาน่าเสนอ", done: sectionStatus.pricing },
    { key: "spec", label: "ข้อมูลจำเพาะสินค้า", done: sectionStatus.spec },
    { key: "images", label: "รูปภาพสินค้า", done: sectionStatus.images },
  ];

  return (
    <TenantShell breadcrumb={breadcrumb} activeModule="products">
      {toast && (
        <Box sx={{
          position: "fixed", top: 16, right: 16, zIndex: 50, px: 2.5, py: 1.5, borderRadius: 2,
          boxShadow: 3, fontSize: 14, fontWeight: 500,
          bgcolor: toast.type === "ok" ? GREEN_L : RED_L,
          color: toast.type === "ok" ? GREEN : RED,
          border: `1px solid ${toast.type === "ok" ? GREEN : RED}33`,
        }}>
          {toast.msg}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", width: "100%", minHeight: "100%", bgcolor: BG }}>
        <Box sx={{ width: "100%", maxWidth: 1920, px: 3, py: 3 }}>

          <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, color: TEXT }}>สินค้า</Typography>

          <Stack direction="row" spacing={3} alignItems="flex-start">
            {/* ── Main Content ── */}
            <Box sx={{ flex: 1, minWidth: 0 }}>

              {/* Section 1: ข้อมูลทั่วไป */}
              <Section title="ข้อมูลทั่วไป" open={sections.general} onToggle={() => toggleSection("general")}>
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
                  <Typography fontSize={12} sx={{ color: OR, textDecoration: "underline", cursor: "pointer" }}>ระบบสร้างรหัสสินค้าอัตโนมัติ</Typography>
                </Stack>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mt: 1 }}>
                  <TextField size="small" label="รหัสสินค้า (SKU)" value={sku} onChange={(e) => setSku(e.target.value)} required />
                  <Stack direction="row" spacing={1} alignItems="flex-end">
                    <TextField size="small" label="Barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} required fullWidth />
                    <IconButton sx={{ border: `1px solid ${BORDER}`, borderRadius: 2, width: 40, height: 40, mb: 0.25 }}>
                      <QrCodeScannerIcon sx={{ color: MUTED, fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                  <TextField size="small" label="ชื่อสินค้าภาษาไทย (TH)" value={nameTH} onChange={(e) => setNameTH(e.target.value)} required />
                  <TextField size="small" label="ชื่อสินค้าภาษาอังกฤษ (EN)" value={nameEN} onChange={(e) => setNameEN(e.target.value)} />
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2, mt: 2 }}>
                  <TextField size="small" select label="ชื่อผู้จำหน่าย (Supplier Name)" value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                    <MenuItem value="">เลือก...</MenuItem>
                    {SUPPLIERS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                    <TextField size="small" label="รหัสสินค้าจากผู้จำหน่าย (Supplier Code)" value={supplierCode} onChange={(e) => setSupplierCode(e.target.value)} />
                    <TextField size="small" label="ชื่อสินค้าจากผู้จำหน่าย (Supplier Product Name)" value={supplierProductName} onChange={(e) => setSupplierProductName(e.target.value)} />
                  </Box>
                </Box>
              </Section>

              {/* Section 2: ข้อมูลสินค้า */}
              <Section title="ข้อมูลสินค้า" open={sections.product} onToggle={() => toggleSection("product")}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mt: 1.5 }}>
                  <TextField size="small" select label="ประเภทสินค้า" value={prodType} onChange={(e) => setProdType(e.target.value)} required>
                    <MenuItem value="">เลือก...</MenuItem>
                    {PRODUCT_TYPES.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                  <TextField size="small" select label="หมวดหมู่หลัก" value={mainCategory} onChange={(e) => setMainCategory(e.target.value)}>
                    <MenuItem value="">เลือก...</MenuItem>
                    {CATEGORIES.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                  <TextField size="small" select label="หมวดหมู่ย่อย" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                    <MenuItem value="">เลือก...</MenuItem>
                    {SUB_CATEGORIES.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                  <TextField size="small" select label="ยี่ห้อ (แบรนด์)" value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <MenuItem value="">เลือก...</MenuItem>
                    {BRANDS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    size="small" fullWidth multiline rows={3}
                    label="รายละเอียดสินค้า"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ระบุรายละเอียดสินค้า..."
                  />
                </Box>
              </Section>

              {/* Section 3: กำหนดราคาน่าเสนอ */}
              <Section title="กำหนดราคาน่าเสนอ" open={sections.pricing} onToggle={() => toggleSection("pricing")}>
                <Stack direction="row" spacing={1.5} sx={{ mt: 1.5, mb: 1.5 }}>
                  <Button size="small" variant="outlined"
                    sx={{ textTransform: "none", color: MUTED, borderColor: BORDER, fontSize: 12 }}>
                    กำหนดราคาขาย
                  </Button>
                  <Button size="small" variant="contained"
                    sx={{ textTransform: "none", bgcolor: OR, "&:hover": { bgcolor: OR_D }, fontSize: 12 }}>
                    ตั้งค่าเพิ่มเติม
                  </Button>
                </Stack>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                  <TextField size="small" label="ราคาทุน" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} type="number" />
                  <TextField size="small" label="ราคาขาย" value={sellPriceVal} onChange={(e) => setSellPriceVal(e.target.value)} type="number" required />
                </Box>
              </Section>

              {/* Section 4: ตั้งค่าเพิ่มเติม — Multi-unit */}
              <Section title="ตั้งค่าเพิ่มเติม" open={sections.units} onToggle={() => toggleSection("units")}>
                <Paper variant="outlined" sx={{ mt: 1.5, mb: 1.5, p: 1.5, borderRadius: 2, bgcolor: "#FFF3E6", borderColor: "#E8913A33" }}>
                  <Typography fontSize={12} fontWeight={500} sx={{ color: "#E8913A" }}>แพ็คไซส์</Typography>
                  <Typography fontSize={14} fontWeight={600} sx={{ color: RED }}>1 กล่อง เท่ากับ 10 แผง</Typography>
                </Paper>

                {units.map((u, idx) => (
                  <Box key={idx} sx={{ mb: 2, pb: 2, borderBottom: idx < units.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5, mb: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="flex-end">
                        <TextField size="small" label="Barcode" value={u.barcode} onChange={(e) => updateUnit(idx, "barcode", e.target.value)} fullWidth />
                        <IconButton sx={{ border: `1px solid ${BORDER}`, borderRadius: 1, width: 32, height: 32, mb: 0.25 }}>
                          <QrCodeScannerIcon sx={{ fontSize: 14, color: MUTED }} />
                        </IconButton>
                      </Stack>
                      <TextField size="small" select label="หน่วย" value={u.unitName} onChange={(e) => updateUnit(idx, "unitName", e.target.value)}>
                        <MenuItem value="">เลือก...</MenuItem>
                        {UNITS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                      </TextField>
                      <TextField size="small" label="อัตราส่วน" value={String(u.ratio)} onChange={(e) => updateUnit(idx, "ratio", Number(e.target.value))} type="number" />
                      <TextField size="small" label="Container" value={u.container} onChange={(e) => updateUnit(idx, "container", e.target.value)} />
                    </Box>
                    <Stack direction="row" spacing={3} alignItems="center">
                      {[
                        { key: "isBuy" as const, label: "หน่วยซื้อ" },
                        { key: "isSell" as const, label: "หน่วยขาย" },
                        { key: "isTransfer" as const, label: "หน่วยโอน" },
                        { key: "isUMS" as const, label: "หน่วย UMS" },
                        { key: "isUML" as const, label: "หน่วยแปลงผล (UML)" },
                      ].map(({ key, label }) => (
                        <FormControlLabel
                          key={key}
                          control={
                            <Checkbox
                              checked={u[key] as boolean}
                              onChange={(e) => updateUnit(idx, key, e.target.checked)}
                              size="small"
                              sx={{ color: BORDER, "&.Mui-checked": { color: OR } }}
                            />
                          }
                          label={<Typography fontSize={12} sx={{ color: TEXT }}>{label}</Typography>}
                          sx={{ mr: 0 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Section>

              {/* Section 5: ข้อมูลจำเพาะสินค้า */}
              <Section title="ข้อมูลจำเพาะสินค้า" open={sections.spec} onToggle={() => toggleSection("spec")}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1.5, mb: 2 }}>
                  <TextField size="small" label="ขนาดบรรจุสินค้า" value={packWeight} onChange={(e) => setPackWeight(e.target.value)} />
                  <TextField size="small" select label="หน่วยบรรจุ" value={packWeightUnit} onChange={(e) => setPackWeightUnit(e.target.value)}>
                    <MenuItem value="">เลือก...</MenuItem>
                    {WEIGHT_UNITS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                </Box>

                {specs.map((s, idx) => (
                  <Box key={idx} sx={{ mb: 2, pb: 2, borderBottom: idx < specs.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5, mb: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="flex-end">
                        <TextField size="small" label="Barcode" value={s.barcode} onChange={(e) => updateSpec(idx, "barcode", e.target.value)} fullWidth />
                        <IconButton sx={{ border: `1px solid ${BORDER}`, borderRadius: 1, width: 32, height: 32, mb: 0.25 }}>
                          <QrCodeScannerIcon sx={{ fontSize: 14, color: MUTED }} />
                        </IconButton>
                      </Stack>
                      <TextField size="small" select label="หน่วย" value={s.unitName} onChange={(e) => updateSpec(idx, "unitName", e.target.value)}>
                        <MenuItem value="">เลือก...</MenuItem>
                        {UNITS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                      </TextField>
                      <TextField size="small" label="น้ำหนักสินค้า" value={s.weight} onChange={(e) => updateSpec(idx, "weight", e.target.value)} />
                      <TextField size="small" select label="หน่วยน้ำหนัก" value={s.weightUnit} onChange={(e) => updateSpec(idx, "weightUnit", e.target.value)}>
                        <MenuItem value="">เลือก...</MenuItem>
                        {WEIGHT_UNITS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                      </TextField>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5 }}>
                      <TextField size="small" label="ความกว้าง" value={s.width} onChange={(e) => updateSpec(idx, "width", e.target.value)} />
                      <TextField size="small" label="ความยาว" value={s.length} onChange={(e) => updateSpec(idx, "length", e.target.value)} />
                      <TextField size="small" label="ความสูง" value={s.height} onChange={(e) => updateSpec(idx, "height", e.target.value)} />
                      <TextField size="small" select label="หน่วย Dimension" value={s.dimUnit} onChange={(e) => updateSpec(idx, "dimUnit", e.target.value)}>
                        <MenuItem value="">เลือก...</MenuItem>
                        {DIM_UNITS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                      </TextField>
                    </Box>
                  </Box>
                ))}
              </Section>

              {/* Section 6: รูปภาพสินค้า */}
              <Section title="รูปภาพสินค้า" open={sections.images} onToggle={() => toggleSection("images")}>
                <Box sx={{ mt: 1.5 }}>
                  <Typography fontSize={14} fontWeight={500} sx={{ mb: 1.5, color: TEXT }}>ภาพสินค้ามาตรฐาน</Typography>
                  <Box
                    onClick={() => fileRef.current?.click()}
                    sx={{
                      width: 96, height: 96, borderRadius: 2, border: `2px dashed ${BORDER}`,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", bgcolor: "#FAFAFA", mb: 1,
                      "&:hover": { borderColor: "rgba(86,93,255,0.3)" },
                      transition: "border-color 0.2s",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 28, color: MUTED }} />
                    <Typography fontSize={10} sx={{ mt: 0.5, color: MUTED }}>อัพโหลด</Typography>
                  </Box>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} />
                  <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                    <Typography component="li" fontSize={12} sx={{ color: MUTED }}>- อัปโหลดรูปภาพความละเอียดไม่เกิน 2 MB</Typography>
                    <Typography component="li" fontSize={12} sx={{ color: MUTED }}>- รูปสินค้าจะแสดงหน้าสินค้า และหน้าสั่งสินค้า</Typography>
                  </Box>

                  <Typography fontSize={14} fontWeight={500} sx={{ mt: 2.5, mb: 1.5, color: TEXT }}>แกลเลอรี่</Typography>
                  <Box
                    sx={{
                      width: 96, height: 96, borderRadius: 2, border: `2px dashed ${BORDER}`,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", bgcolor: "#FAFAFA",
                      "&:hover": { borderColor: "rgba(86,93,255,0.3)" },
                      transition: "border-color 0.2s",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 28, color: MUTED }} />
                    <Typography fontSize={10} sx={{ mt: 0.5, color: MUTED, textAlign: "center" }}>เพิ่มรูปภาพ<br/>0/6</Typography>
                  </Box>
                  <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mt: 1 }}>
                    <Typography component="li" fontSize={12} sx={{ color: MUTED }}>- อัปโหลดรูปภาพความละเอียดไม่เกิน 2 MB</Typography>
                    <Typography component="li" fontSize={12} sx={{ color: MUTED }}>- รูปเป็นเพิ่มแสดงสินค้าได้เป็นสินค้าต่างๆ และหน้าสินค้าหลายๆ</Typography>
                  </Box>
                </Box>
              </Section>

              {/* Section 7: ประวัติการแก้ไข */}
              <Section title="ประวัติการแก้ไข" open={sections.history} onToggle={() => toggleSection("history")}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.5, mb: 1.5 }}>
                  <Typography fontSize={12} sx={{ color: MUTED }}>เลือกดูตามประเภท</Typography>
                  <TextField size="small" select defaultValue="" sx={{ minWidth: 100 }}>
                    <MenuItem value="">ทั้งหมด</MenuItem>
                  </TextField>
                </Stack>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ borderBottom: `1px solid ${BORDER}` }}>
                      {["วัน-เวลา", "ประเภท", "รายละเอียด", "ผู้ดำเนินการ"].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 500, color: MUTED, fontSize: 12, py: 1, px: 1.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: MUTED, fontSize: 12 }}>ยังไม่มีประวัติการแก้ไข</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Section>

              {/* Footer Buttons */}
              <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 2, pb: 3 }}>
                <Button variant="outlined" onClick={() => setScreen("list")}
                  sx={{
                    textTransform: "none", px: 3, py: 1, fontWeight: 500, fontSize: 14,
                    borderColor: BORDER, color: MUTED,
                    "&:hover": { borderColor: OR, color: OR },
                  }}>
                  ยกเลิก
                </Button>
                <Button variant="contained" onClick={handleSave}
                  sx={{
                    textTransform: "none", px: 4, py: 1, fontWeight: 600, fontSize: 14,
                    bgcolor: OR, "&:hover": { bgcolor: OR_D },
                  }}>
                  บันทึก
                </Button>
              </Stack>
            </Box>

            {/* ── Right Sidebar ── */}
            <Box sx={{ width: 240, flexShrink: 0, position: "sticky", top: 16 }}>
              {/* Section Navigator */}
              <Paper variant="outlined" sx={{ borderColor: BORDER, borderRadius: 2, p: 2, mb: 2 }}>
                {sidebarSections.map((s) => (
                  <Stack
                    key={s.key} direction="row" alignItems="center" spacing={1} sx={{ py: 0.75, cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                    onClick={() => { setSections((prev) => ({ ...prev, [s.key]: true })); document.getElementById(`section-${s.key}`)?.scrollIntoView({ behavior: "smooth" }); }}
                  >
                    <Box sx={{
                      width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      bgcolor: s.done ? GREEN : RED, color: "white", fontSize: 10,
                    }}>
                      {s.done ? "\u2713" : "!"}
                    </Box>
                    <Typography fontSize={14} sx={{ color: TEXT }}>{s.label}</Typography>
                  </Stack>
                ))}
              </Paper>

              {/* Info panel */}
              <Paper variant="outlined" sx={{ borderColor: BORDER, borderRadius: 2, p: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography fontSize={12} sx={{ color: MUTED }}>วันสร้าง</Typography>
                  <Typography fontSize={12} fontWeight={500} sx={{ color: TEXT }}>2025-04-17 15:38:42</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography fontSize={12} sx={{ color: MUTED }}>ผู้สร้าง</Typography>
                  <Typography fontSize={12} fontWeight={500} sx={{ color: TEXT }}>wachirawit chanchlaw</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography fontSize={12} sx={{ color: TEXT }}>สถานะรายการหน้าร้าน</Typography>
                  <Switch
                    checked={showOnShelf}
                    onChange={() => setShowOnShelf(!showOnShelf)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: OR },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: OR },
                    }}
                  />
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography fontSize={12} sx={{ color: TEXT }}>สถานะรับสินค้า</Typography>
                  <Switch
                    checked={showInStock}
                    onChange={() => setShowInStock(!showInStock)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: OR },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: OR },
                    }}
                  />
                </Stack>
              </Paper>
            </Box>
          </Stack>

        </Box>
      </Box>
    </TenantShell>
  );
}

/* ══════════════════════════════════════════════════ */
/* ── PAGE EXPORT ── */
/* ══════════════════════════════════════════════════ */

export default function ProductPage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#777" }}>กำลังโหลด...</Box>}>
      <ProductInner />
    </Suspense>
  );
}
