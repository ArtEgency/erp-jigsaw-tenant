import { PageCondition } from "./types";

export const productCondition: PageCondition = {
  page: "Product (สินค้า)",
  path: "/product",
  description: "หน้าจัดการสินค้าของ Tenant — แสดงรายการ, เพิ่ม, แก้ไข, ลบ",

  requirements: [
    "แสดงรายการสินค้าทั้งหมดในตาราง DataGrid",
    "ค้นหาตามชื่อสินค้า (TH/EN)",
    "กรองตามหมวดหมู่สินค้า",
    "กรองตามสถานะ (Active/Inactive)",
    "เพิ่มสินค้าใหม่ → เปิด Modal/Page",
    "แก้ไขสินค้า → เปิด Modal/Page",
    "ลบสินค้า → confirm dialog",
    "i18n รองรับ TH/EN (ชื่อสินค้ามี nameEn)",
  ],

  validations: [
    { field: "name", rule: "required", when: "เพิ่ม/แก้ไขสินค้า" },
    { field: "sku", rule: "required, unique", when: "เพิ่มสินค้า" },
    { field: "price", rule: "required, number, min: 0", when: "เพิ่ม/แก้ไขสินค้า" },
    { field: "category", rule: "required", when: "เพิ่ม/แก้ไขสินค้า" },
  ],

  flow: [
    "1. User เข้าหน้า /{slug}/product → โหลดสินค้าของ tenant",
    "2. ค้นหา/กรอง → filter ตาราง",
    "3. กดเพิ่มสินค้า → เปิด form",
    "4. กรอกข้อมูล → Validate",
    "5. กดบันทึก → สร้างสินค้าใหม่",
    "6. กดแก้ไข → เปิด form พร้อมข้อมูลเดิม",
    "7. กดลบ → confirm → ลบสินค้า",
  ],

  dataModel: [
    { field: "id", type: "string", unique: true },
    { field: "name", type: "string", required: true },
    { field: "nameEn", type: "string" },
    { field: "sku", type: "string", required: true, unique: true },
    { field: "price", type: "number", required: true },
    { field: "category", type: "string", required: true },
    { field: "status", type: "enum", example: "Active/Inactive" },
  ],
};
