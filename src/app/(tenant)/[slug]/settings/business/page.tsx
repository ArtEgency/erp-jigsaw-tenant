"use client";

import { useState } from "react";
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
  Switch,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControl,

  Grid,
} from "@mui/material";
import { TENANT_PRIMARY as OR } from "@/lib/theme";
import { useLocale } from "@/lib/locale";

/* ═══════════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════════ */
export default function SettingsBusinessPage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState(0);

  /* ── Mock data from Onboarding (locked) ── */
  const onboardingData = {
    entityType: "นิติบุคคล",
    taxId: "223372271000",
    companyType: "บริษัทจำกัด",
    prefix: "บริษัท",
    companyName: "Pardesco Retail and Trading",
    suffix: "จำกัด",
    shortName: "Pardesco",
    country: "Laos",
    address: "",
    subDistrict: "Phontan",
    district: "Xaysettha",
    province: "Vientiane",
    postalCode: "",
    phoneCode: "+856",
    phoneFlag: "🇱🇦",
    phone: "02092975143",
    phone2: "",
    email: "pardesco.lao@gmail.com",
    currency: "บาท",
    vatEnabled: true,
    vatRate: "10",
    vatRegDate: "31/12/2024",
    vatCalcMethod: "แยกภาษี",
  };

  return (
    <TenantShell breadcrumb={[t("settings.businessSettings"), t("settings.business.title")]} activeModule="settings">
      <Box sx={{ p: "24px 32px" }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          {/* ── Tab bar ── */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: 14 },
              "& .Mui-selected": { color: OR, fontWeight: 600 },
              "& .MuiTabs-indicator": { backgroundColor: OR },
            }}
          >
            <Tab label={t("settings.business.general")} />
            <Tab label={t("settings.business.contact")} />
            <Tab label={t("settings.business.sales")} />
          </Tabs>

          {/* ── Tab content ── */}
          <Box sx={{ p: 4 }}>
            {activeTab === 0 && <TabGeneral data={onboardingData} />}
            {activeTab === 1 && <TabContact />}
            {activeTab === 2 && <TabSales data={onboardingData} />}
          </Box>
        </Paper>
      </Box>
    </TenantShell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Tab 1 — ข้อมูลทั่วไป
   ═══════════════════════════════════════════════════════════════ */
function TabGeneral({ data }: { data: Record<string, unknown> }) {
  const { t } = useLocale();
  const d = data as Record<string, string | boolean>;

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: OR }}>
        {t("settings.business.general")}
      </Typography>

      {/* Profile image placeholder */}
      <Box
        sx={{
          width: 96,
          height: 96,
          borderRadius: 2,
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F4F4F4",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 32, color: "#999" }}>🖼</Typography>
      </Box>

      {/* Entity type radio + Tax ID */}
      <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 3, flexWrap: "wrap" }}>
        <FormControl>
          <RadioGroup row value={String(d.entityType)}>
            <FormControlLabel
              value="บุคคลธรรมดา"
              control={<Radio size="small" sx={{ "&.Mui-checked": { color: OR } }} />}
              label="บุคคลธรรมดา"
              disabled
            />
            <FormControlLabel
              value="นิติบุคคล"
              control={<Radio size="small" sx={{ "&.Mui-checked": { color: OR } }} />}
              label="นิติบุคคล"
              disabled
            />
          </RadioGroup>
        </FormControl>
        <TextField
          size="small"
          label="เลขที่ประจำตัวผู้เสียภาษี"
          value={String(d.taxId)}
          required
          disabled
          sx={{ width: 280 }}
        />
      </Stack>

      {/* Row: ประเภท, คำนำหน้า, ชื่อบริษัท, คำลงท้าย, ชื่อย่อ */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField size="small" label="ประเภท" value={String(d.companyType)} required disabled select fullWidth>
            <MenuItem value={String(d.companyType)}>{String(d.companyType)}</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="คำนำหน้า" value={String(d.prefix)} required disabled select fullWidth>
            <MenuItem value={String(d.prefix)}>{String(d.prefix)}</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField size="small" label="ชื่อบริษัท" value={String(d.companyName)} required disabled fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="คำลงท้าย" value={String(d.suffix)} disabled fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="ชื่อย่อ" value={String(d.shortName)} disabled fullWidth />
        </Grid>
      </Grid>

      {/* Row: ประเทศ, ที่อยู่, แขวง/ตำบล, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์ */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="ประเทศ" value={String(d.country)} required disabled select fullWidth>
            <MenuItem value={String(d.country)}>{String(d.country)}</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="ที่อยู่" value={String(d.address)} disabled fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="แขวง/ตำบล" value={String(d.subDistrict)} disabled fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="อำเภอ/เขต" value={String(d.district)} disabled fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="จังหวัด" value={String(d.province)} disabled fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField size="small" label="รหัสไปรษณีย์" value={String(d.postalCode)} disabled fullWidth placeholder="กรอกรหัสไปรษณีย์" />
        </Grid>
      </Grid>

      {/* Row: Phone, phone2, email */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="รหัสประเทศ"
              value={String(d.phoneCode)}
              required
              disabled
              sx={{ width: 110 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">{String(d.phoneFlag)}</InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              size="small"
              label="เบอร์โทรศัพท์"
              value={String(d.phone)}
              required
              disabled
              fullWidth
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField size="small" label="เบอร์โทร" value={String(d.phone2)} disabled fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField size="small" label="อีเมล" value={String(d.email)} disabled fullWidth />
        </Grid>
      </Grid>

      {/* Edit button */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: OR,
            "&:hover": { bgcolor: OR, opacity: 0.9 },
            textTransform: "none",
            fontWeight: 600,
            px: 4,
          }}
        >
          {t("common.edit")}
        </Button>
      </Stack>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Tab 2 — ข้อมูลการติดต่อ
   ═══════════════════════════════════════════════════════════════ */
function TabContact() {
  const { t } = useLocale();
  return (
    <Box>
      {/* Row 1 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField size="small" label="เบอร์โทรศัพท์" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField size="small" label="เบอร์มือถือ" fullWidth />
        </Grid>
      </Grid>

      {/* Row 2 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField size="small" label="E-mail" required fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField size="small" label="Website" fullWidth />
        </Grid>
      </Grid>

      {/* Row 3 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField size="small" label="Facebook" fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField size="small" label="Line" fullWidth />
        </Grid>
      </Grid>

      {/* Row 4 */}
      <Box sx={{ mb: 3 }}>
        <TextField size="small" label="URL Google Map" fullWidth />
      </Box>

      {/* Edit button */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: OR,
            "&:hover": { bgcolor: OR, opacity: 0.9 },
            textTransform: "none",
            fontWeight: 600,
            px: 4,
          }}
        >
          {t("common.edit")}
        </Button>
      </Stack>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Tab 3 — ตั้งค่าการขาย
   ═══════════════════════════════════════════════════════════════ */
function TabSales({ data }: { data: Record<string, unknown> }) {
  const { t } = useLocale();
  const d = data as Record<string, string | boolean>;

  return (
    <Box sx={{ maxWidth: 560 }}>
      {/* สกุลเงิน */}
      <Box sx={{ mb: 3 }}>
        <TextField size="small" label="สกุลเงิน" value={String(d.currency)} required disabled select fullWidth>
          <MenuItem value={String(d.currency)}>{String(d.currency)}</MenuItem>
        </TextField>
      </Box>

      {/* VAT toggle + rate */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(d.vatEnabled)}
              disabled
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: OR },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: OR },
              }}
            />
          }
          label=""
        />
        <TextField
          size="small"
          label="ภาษีมูลค่าเพิ่ม (VAT)"
          value={String(d.vatRate)}
          required
          disabled
          fullWidth
        />
      </Stack>

      {/* VAT registration date */}
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          label="วันที่จดทะเบียนภาษีมูลค่าเพิ่ม"
          value={String(d.vatRegDate)}
          required
          disabled
          fullWidth
          type="text"
        />
      </Box>

      {/* VAT calculation method */}
      <Box sx={{ mb: 3 }}>
        <TextField size="small" label="วิธีคิดภาษีมูลค่าเพิ่ม" value={String(d.vatCalcMethod)} required disabled select fullWidth>
          <MenuItem value={String(d.vatCalcMethod)}>{String(d.vatCalcMethod)}</MenuItem>
        </TextField>
      </Box>

      {/* Edit button */}
      <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: OR,
            "&:hover": { bgcolor: OR, opacity: 0.9 },
            textTransform: "none",
            fontWeight: 600,
            px: 8,
            py: 1.2,
          }}
        >
          {t("common.edit")}
        </Button>
      </Stack>
    </Box>
  );
}
