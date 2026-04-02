"use client";

import { useParams } from "next/navigation";
import { getTenantBySlug } from "@/data/tenants";
import TenantShell from "@/components/layout/TenantShell";

export default function TenantAppPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tenant = getTenantBySlug(slug);

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Sarabun', sans-serif" }}>
        <p>Tenant not found</p>
      </div>
    );
  }

  return (
    <TenantShell breadcrumb={[tenant.name, "Dashboard"]} activeModule="my-tasks">
      <div style={{ padding: 32, fontFamily: "'Sarabun', sans-serif" }}>
        {/* Tenant Info Banner */}
        <div style={{
          background: tenant.lightColor,
          border: `1.5px solid ${tenant.primaryColor}30`,
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: tenant.primaryColor,
            color: "#fff", fontWeight: 700, fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {tenant.initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#333" }}>{tenant.name}</div>
            <div style={{ fontSize: 13, color: "#777", marginTop: 2 }}>
              {tenant.domain} — Package: {tenant.package}
            </div>
          </div>
          <div style={{
            background: `${tenant.primaryColor}15`,
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 12,
            color: tenant.primaryColor,
            fontWeight: 600,
          }}>
            {tenant.modules.length} Modules
          </div>
        </div>

        {/* Module Grid */}
        <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 14, color: "#555" }}>
          Module ที่เปิดใช้งาน ({tenant.package})
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {tenant.modules.map((mod) => (
            <div key={mod} style={{
              background: "#fff",
              border: "1px solid #E0E0E0",
              borderRadius: 10,
              padding: "14px 16px",
              fontSize: 13,
              color: "#555",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: tenant.primaryColor,
              }} />
              {mod}
            </div>
          ))}
        </div>
      </div>
    </TenantShell>
  );
}
