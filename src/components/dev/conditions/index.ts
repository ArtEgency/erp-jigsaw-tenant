import { PageCondition } from "./types";
import { productCondition } from "./product";

/**
 * Registry รวม condition ทุกหน้า — Tenant
 * key = pathname (ไม่รวม slug เช่น /product ไม่ใช่ /bakermart/product)
 */
export const CONDITIONS: Record<string, PageCondition> = {
  "/product": productCondition,
  // เพิ่มได้เรื่อยๆ:
  // "/employee": employeeCondition,
  // "/settings/business": businessSettingsCondition,
};

export type { PageCondition } from "./types";
export type { ValidationRule, DataField } from "./types";
