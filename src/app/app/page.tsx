"use client";

import { useState } from "react";
import TenantShell from "@/components/TenantShell";
import Dashboard from "@/components/screens/Dashboard";
import ProductList from "@/components/screens/ProductList";
import PurchaseRequest from "@/components/screens/PurchaseRequest";
import SalesOrder from "@/components/screens/SalesOrder";
import CompanySettings from "@/components/screens/CompanySettings";

type ScreenId = "dashboard" | "products" | "purchase" | "sales" | "settings";

const screenMap: Record<string, ScreenId> = {
  "my-tasks": "dashboard",
  "products": "products",
  "products-list": "products",
  "products-category": "products",
  "products-unit": "products",
  "purchase": "purchase",
  "purchase-request": "purchase",
  "purchase-order": "purchase",
  "purchase-receive": "purchase",
  "sales": "sales",
  "sales-quotation": "sales",
  "sales-order": "sales",
  "sales-delivery": "sales",
  "settings": "settings",
  "settings-company": "settings",
  "settings-system": "settings",
  "settings-permissions": "settings",
};

const breadcrumbMap: Record<ScreenId, string[]> = {
  dashboard: [],
  products: ["สินค้า", "จัดการสินค้า"],
  purchase: ["จัดซื้อ", "ใบขอซื้อ"],
  sales: ["ขาย", "ใบสั่งขาย"],
  settings: ["ตั้งค่า", "ตั้งค่าบริษัท"],
};

const moduleIdMap: Record<ScreenId, string> = {
  dashboard: "my-tasks",
  products: "products",
  purchase: "purchase",
  sales: "sales",
  settings: "settings",
};

const screens: Record<ScreenId, React.ComponentType> = {
  dashboard: Dashboard,
  products: ProductList,
  purchase: PurchaseRequest,
  sales: SalesOrder,
  settings: CompanySettings,
};

export default function TenantApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("dashboard");

  const Screen = screens[currentScreen];

  const handleModuleClick = (id: string) => {
    const screen = screenMap[id];
    if (screen) setCurrentScreen(screen);
  };

  return (
    <TenantShell
      breadcrumb={breadcrumbMap[currentScreen]}
      activeModule={moduleIdMap[currentScreen]}
      onModuleClick={handleModuleClick}
    >
      <Screen />
    </TenantShell>
  );
}
