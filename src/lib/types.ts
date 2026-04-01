/* ══════════════════════════════════════════════════ */
/* ── Centralized Type Definitions ── */
/* ══════════════════════════════════════════════════ */

/* ── Common ── */
export interface MultiLangText {
  th: string;
  en?: string;
  zh?: string;
  ja?: string;
}

export interface SelectOption {
  id: string | number;
  name: string;
}

/* ── Auth & User ── */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  tenantId: string;
}

/* ── Tenant / Company ── */
export interface Tenant {
  id: string;
  name: string;
  taxId: string;
  logo?: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  active: boolean;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  tenantId: string;
  isHQ: boolean;
  active: boolean;
}

/* ── Employee / HR ── */
export interface Employee {
  id: string;
  code: string;
  prefix: string;
  firstNameTH: string;
  lastNameTH: string;
  firstNameEN?: string;
  lastNameEN?: string;
  nickname?: string;
  idCard?: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  department: string;
  position: string;
  division?: string;
  type: string;
  status: string;
  active: boolean;
  avatar?: string;
}

export interface Role {
  id: string;
  code: string;
  name: MultiLangText;
  description?: string;
  permissions: string[];
  active: boolean;
}

/* ── Product ── */
export type ProductType = "general" | "variant" | "service";

export interface ProductUnit {
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

export interface ProductSpec {
  barcode: string;
  unitName: string;
  weight: string;
  weightUnit: string;
  width: string;
  length: string;
  height: string;
  dimUnit: string;
}

export interface Product {
  id: string;
  code: string;
  name: MultiLangText;
  barcode: string;
  type: ProductType;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
  supplierId?: string;
  description?: string;
  units: ProductUnit[];
  specs: ProductSpec[];
  images: string[];
  sellPrice: number;
  costPrice?: number;
  packSize?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── Master Data ── */
export interface Category {
  id: string;
  name: MultiLangText;
  parentId?: string;
  active: boolean;
}

export interface Brand {
  id: string;
  name: string;
  active: boolean;
}

export interface Unit {
  id: string;
  name: MultiLangText;
  active: boolean;
}

/* ── Purchase / Sales ── */
export interface PurchaseRequest {
  id: string;
  prNumber: string;
  date: string;
  requester: string;
  department: string;
  status: "draft" | "pending" | "approved" | "rejected";
  items: PurchaseRequestItem[];
  total: number;
}

export interface PurchaseRequestItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface SalesOrder {
  id: string;
  soNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  status: "draft" | "confirmed" | "shipped" | "completed" | "cancelled";
  items: SalesOrderItem[];
  total: number;
  salesperson?: string;
}

export interface SalesOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount?: number;
  total: number;
}

/* ── Activity Log ── */
export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userName: string;
  detail?: string;
  createdAt: string;
}
