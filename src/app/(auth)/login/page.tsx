"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TextField, Button, Alert, Checkbox, FormControlLabel,
  IconButton, InputAdornment, Typography, Box, Stack, Avatar,
  List, ListItemButton, ListItemAvatar, ListItemText, Badge, Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TENANTS } from "@/data/tenants";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";

/* ── Mock Companies ── */
const MOCK_COMPANIES = TENANTS.map((t, i) => ({
  id: t.id, slug: t.slug, name: t.name, domain: t.domain,
  initials: t.initials, color: t.primaryColor,
  notifications: i === 1 ? 3 : 0,
}));

type LoginStep = "login" | "select-company";

export default function BackofficeLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<LoginStep>("login");
  const [companySearch, setCompanySearch] = useState("");
  const [activeCompanyId, setActiveCompanyId] = useState(MOCK_COMPANIES[0]?.id || "");

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return MOCK_COMPANIES;
    const s = companySearch.toLowerCase();
    return MOCK_COMPANIES.filter(
      (c) => c.name.toLowerCase().includes(s) || c.domain.toLowerCase().includes(s)
    );
  }, [companySearch]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t("auth.fillRequired"));
      return;
    }
    await login(email, password);
    if (MOCK_COMPANIES.length > 1) {
      setStep("select-company");
    } else {
      router.push(`/${MOCK_COMPANIES[0]?.slug ?? "june"}`);
    }
  };

  const handleConfirmCompany = () => {
    const selected = MOCK_COMPANIES.find((c) => c.id === activeCompanyId);
    router.push(`/${selected?.slug ?? "june"}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left: Decorative Panel */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <Typography variant="h1" sx={{ fontSize: "5rem", fontWeight: 800, letterSpacing: "0.3em", color: "rgba(86,93,255,0.18)", mb: 2 }}>
            ERP
          </Typography>
          <Typography variant="body2" sx={{ letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(86,93,255,0.35)" }}>
            Enterprise Resource Planning
          </Typography>
        </Box>
      </Box>

      {/* Right: Login / Company Selection */}
      <Box sx={{ width: { xs: "100%", lg: 480, xl: 520 }, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "white", px: { xs: 3, lg: 7 } }}>

        {/* ── Step 1: Login Form ── */}
        {step === "login" && (
          <Box sx={{ width: "100%", maxWidth: 360 }}>
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <Avatar sx={{ bgcolor: "#565DFF", width: 48, height: 48, mx: "auto", mb: 1, fontSize: 24 }}>🧩</Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "0.15em", color: "#565DFF" }}>JIGSAW</Typography>
            </Box>
            <Typography variant="body2" sx={{ textAlign: "center", color: "#565DFF", mb: 0.5 }}>{t("auth.welcome")}</Typography>
            <Typography variant="caption" sx={{ textAlign: "center", display: "block", color: "#999", mb: 3 }}>JIGSAW ERP for Business</Typography>

            <Typography variant="subtitle1" sx={{ textAlign: "center", fontWeight: 700, mb: 2.5 }}>{t("auth.login")}</Typography>

            {error && <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>{error}</Alert>}

            <Stack spacing={2}>
              <TextField
                label={t("auth.email")}
                size="small"
                fullWidth
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
              />
              <TextField
                label={t("auth.password")}
                size="small"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} size="small" sx={{ color: "#565DFF", "&.Mui-checked": { color: "#565DFF" } }} />}
                label={<Typography variant="body2" sx={{ color: "#777" }}>{t("auth.remember")}</Typography>}
              />
              <Button variant="text" size="small" sx={{ color: "#565DFF", textTransform: "none", fontSize: 13 }}>
                {t("auth.forgot")}
              </Button>
            </Box>

            <Button
              fullWidth variant="contained" onClick={handleLogin}
              sx={{ bgcolor: "#565DFF", "&:hover": { bgcolor: "#4349E0" }, py: 1.2, fontWeight: 600, textTransform: "none" }}
            >
              {t("auth.login")}
            </Button>

            <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 3, color: "#999" }}>
              {t("auth.helpText")}{" "}
              <Button variant="text" size="small" sx={{ color: "#565DFF", textTransform: "none", fontSize: 11, p: 0, minWidth: 0 }}>
                {t("auth.contactAdmin")}
              </Button>
            </Typography>
          </Box>
        )}

        {/* ── Step 2: Company Selection ── */}
        {step === "select-company" && (
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#565DFF", width: 36, height: 36, mx: "auto", mb: 1, fontSize: 18 }}>🧩</Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "0.12em", color: "#565DFF" }}>JIGSAW</Typography>
            </Box>

            <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 700, mb: 0.5 }}>{t("auth.yourCompanies")}</Typography>
            <Typography variant="caption" sx={{ textAlign: "center", display: "block", color: "#999", mb: 2.5 }}>{t("auth.selectCompany")}</Typography>

            <TextField
              size="small" fullWidth placeholder={t("auth.searchCompany")}
              value={companySearch} onChange={(e) => setCompanySearch(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> }}
            />

            <List sx={{ maxHeight: 360, overflow: "auto" }}>
              {filteredCompanies.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: "center", py: 4, color: "#999" }}>{t("common.noData")}</Typography>
              ) : (
                filteredCompanies.map((c) => {
                  const isActive = c.id === activeCompanyId;
                  return (
                    <ListItemButton
                      key={c.id}
                      selected={isActive}
                      onClick={() => setActiveCompanyId(c.id)}
                      sx={{
                        borderRadius: 2, mb: 0.5, border: "1px solid",
                        borderColor: isActive ? "#565DFF" : "#E0E0E0",
                        bgcolor: isActive ? "#565DFF08" : "white",
                        "&.Mui-selected": { bgcolor: "#565DFF08" },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: c.color, width: 40, height: 40, fontSize: 14, fontWeight: 700 }}>{c.initials}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: 600, color: isActive ? "#565DFF" : "#333" }}>{c.name}</Typography>}
                        secondary={isActive ? <Chip label={t("auth.active")} size="small" color="primary" sx={{ fontSize: 10, height: 20 }} /> : c.notifications > 0 ? <Typography variant="caption" sx={{ color: "#FF6B6B" }}>{c.notifications} {t("auth.notifications")}</Typography> : <Typography variant="caption" sx={{ color: "#999" }}>{c.domain}</Typography>}
                      />
                      {isActive && <CheckCircleIcon sx={{ color: "#565DFF" }} />}
                      {!isActive && c.notifications > 0 && <Badge badgeContent={c.notifications} color="error" />}
                    </ListItemButton>
                  );
                })
              )}
            </List>

            <Button
              fullWidth variant="contained" onClick={handleConfirmCompany}
              sx={{ bgcolor: "#565DFF", "&:hover": { bgcolor: "#4349E0" }, py: 1.2, fontWeight: 600, textTransform: "none", mt: 2.5 }}
            >
              {t("auth.enterSystem")}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button startIcon={<ArrowBackIcon />} size="small" onClick={() => { setStep("login"); setCompanySearch(""); }}
                sx={{ color: "#bbb", textTransform: "none", fontSize: 12, "&:hover": { color: "#565DFF" } }}>
                {t("nav.backToLogin")}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
