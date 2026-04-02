"use client";

import { useParams } from "next/navigation";
import { getTenantBySlug } from "@/data/tenants";
import TenantShell from "@/components/layout/TenantShell";
import { Box, Typography, Avatar, Chip, Stack, Paper } from "@mui/material";
import { useLocale } from "@/lib/locale";

export default function TenantDashboardPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tenant = getTenantBySlug(slug);
  const { t } = useLocale();

  if (!tenant) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Tenant not found</Typography>
      </Box>
    );
  }

  return (
    <TenantShell breadcrumb={[tenant.name, "Dashboard"]} activeModule="my-tasks">
      <Box sx={{ p: 4 }}>
        {/* Tenant Info Banner */}
        <Paper
          variant="outlined"
          sx={{
            p: 3, mb: 3, display: "flex", alignItems: "center", gap: 2,
            borderColor: `${tenant.primaryColor}30`, bgcolor: tenant.lightColor,
            borderRadius: 3,
          }}
        >
          <Avatar
            sx={{
              width: 48, height: 48, borderRadius: 3,
              bgcolor: tenant.primaryColor, fontWeight: 700, fontSize: 18,
            }}
          >
            {tenant.initials}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{tenant.name}</Typography>
            <Typography variant="caption" sx={{ color: "#777" }}>
              {tenant.domain} — Package: {tenant.package}
            </Typography>
          </Box>
          <Chip
            label={`${tenant.modules.length} Modules`}
            size="small"
            sx={{ bgcolor: `${tenant.primaryColor}15`, color: tenant.primaryColor, fontWeight: 600 }}
          />
        </Paper>

        {/* Module Grid */}
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#555", mb: 2 }}>
          {t("tenant.modules")} ({tenant.package})
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1.5}>
          {tenant.modules.map((mod) => (
            <Paper
              key={mod}
              variant="outlined"
              sx={{
                px: 2, py: 1.5, borderRadius: 2, display: "flex", alignItems: "center", gap: 1,
                minWidth: 160, fontSize: 13, color: "#555", fontWeight: 500,
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: tenant.primaryColor }} />
              {mod}
            </Paper>
          ))}
        </Stack>
      </Box>
    </TenantShell>
  );
}
