"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTenantBySlug } from "@/data/tenants";
import {
  TextField, Button, Alert, IconButton, InputAdornment,
  Typography, Box, Stack, Avatar, Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";

export default function TenantLoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const tenant = getTenantBySlug(slug);
  const { login } = useAuth();
  const { t } = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!tenant) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#F4F4F4" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{t("auth.companyNotFound")}</Typography>
          <Typography variant="body2" sx={{ color: "#999", mb: 2 }}>{t("auth.tenantNotFound")} &quot;{slug}&quot;</Typography>
          <Button variant="contained" onClick={() => router.push("/")} sx={{ bgcolor: "#565DFF", textTransform: "none" }}>
            {t("nav.backToHome")}
          </Button>
        </Box>
      </Box>
    );
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t("auth.fillRequired"));
      return;
    }
    await login(email, password);
    router.push(`/${slug}`);
  };

  const PC = tenant.primaryColor;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Panel — Branding */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: 480, flexShrink: 0, flexDirection: "column", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden", bgcolor: PC,
        }}
      >
        <Box sx={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", opacity: 0.1, bgcolor: "white", top: -200, left: -200 }} />
        <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", opacity: 0.1, bgcolor: "white", bottom: -80, right: -80 }} />
        <Box sx={{ position: "relative", zIndex: 10, textAlign: "center", px: 6 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 80, height: 80, fontSize: 28, fontWeight: 700, mx: "auto", mb: 3, borderRadius: 3 }}>
            {tenant.initials}
          </Avatar>
          <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 1 }}>{tenant.name}</Typography>
          {tenant.description && <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>{tenant.description}</Typography>}
          <Chip label={tenant.domain} sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", fontSize: 12 }} />
          <Chip label={tenant.package} sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 12, ml: 1 }} />
        </Box>
      </Box>

      {/* Right Panel — Login Form */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "white", px: 4 }}>
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          {/* Mobile: tenant name */}
          <Box sx={{ display: { lg: "none" }, mb: 3, textAlign: "center" }}>
            <Avatar sx={{ bgcolor: PC, width: 56, height: 56, fontSize: 20, fontWeight: 700, mx: "auto", mb: 1.5, borderRadius: 2 }}>
              {tenant.initials}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{tenant.name}</Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{t("auth.login")}</Typography>
          <Typography variant="body2" sx={{ color: "#999", mb: 3 }}>{tenant.domain}</Typography>

          {error && <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>{error}</Alert>}

          <Stack spacing={2}>
            <TextField
              label={t("auth.email")} size="small" fullWidth
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="email@company.com"
            />
            <TextField
              label={t("auth.password")} size="small" fullWidth
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
            <Button
              fullWidth variant="contained" onClick={handleLogin}
              sx={{ bgcolor: PC, "&:hover": { opacity: 0.9 }, py: 1.2, fontWeight: 600, textTransform: "none" }}
            >
              {t("auth.login")}
            </Button>
          </Stack>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button startIcon={<ArrowBackIcon />} size="small" onClick={() => router.push("/")}
              sx={{ color: "#999", textTransform: "none", fontSize: 12, "&:hover": { color: PC } }}>
              {t("nav.backToHome")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
