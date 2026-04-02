/* ══════════════════════════════════════════════════
   ERP Jigsaw — Tenant Configuration (Mock Data)
   ตาม Account Structure v1.0
   ══════════════════════════════════════════════════ */

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  initials: string;
  domain: string;
  primaryColor: string;
  hoverColor: string;
  lightColor: string;
  package: string;
  modules: string[];
  description?: string;
}

/* ── Tenant List ── */
export const TENANTS: TenantConfig[] = [
  {
    id: "t1",
    slug: "june",
    name: "June Bakermart",
    initials: "JB",
    domain: "june.jigsawx.com",
    primaryColor: "#059669",
    hoverColor: "#047857",
    lightColor: "#ECFDF5",
    package: "Core Allder Now",
    modules: [
      "my-tasks", "products", "purchase", "inventory",
      "contacts", "sales", "hr", "reports", "settings",
    ],
    description: "วัตถุดิบ อุปกรณ์ เบเกอรี่ เครื่องดื่ม",
  },
  {
    id: "t2",
    slug: "sct",
    name: "SCT-Siam Coffee Trade",
    initials: "SC",
    domain: "sct.jigsawx.com",
    primaryColor: "#DC2626",
    hoverColor: "#B91C1C",
    lightColor: "#FEF2F2",
    package: "Core Allder Now + Core Coffice",
    modules: [
      "my-tasks", "products", "purchase", "inventory",
      "contacts", "sales", "finance", "manufacturing",
      "hr", "reports", "analytics", "settings",
    ],
    description: "ซื้อ-ขายสารกาแฟไทย ไปไกลทั่วโลก",
  },
];

/* ── Helpers ── */
export function getTenantBySlug(slug: string): TenantConfig | undefined {
  return TENANTS.find((t) => t.slug === slug);
}

export function getAllTenantSlugs(): string[] {
  return TENANTS.map((t) => t.slug);
}
