"use client";

import { useState } from "react";
import ScreenMeta from "@/components/ScreenMeta";
import SlidePanel from "@/components/SlidePanel";
import FloatingField from "@/components/FloatingField";
import { products, Product } from "@/data/mock";

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", sku: "", category: "", unit: "", price: "", stock: "" });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    const matchSearch = p.name.includes(search) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", sku: "", category: "", unit: "", price: "", stock: "" });
    setPanelOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      unit: p.unit,
      price: p.price.toString(),
      stock: p.stock.toString(),
    });
    setPanelOpen(true);
  };

  return (
    <div>
      <ScreenMeta id="MD-2" name="รายการสินค้า" actor="เจ้าหน้าที่สินค้า" />
      <div className="p-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border-[1.5px] border-erp-border rounded-lg text-sm w-64 focus:outline-none focus:border-brand-primary"
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 border-[1.5px] border-erp-border rounded-lg text-sm focus:outline-none focus:border-brand-primary"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="flex-1" />
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm rounded-lg font-medium transition-colors"
          >
            + เพิ่มสินค้า
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">รหัส</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">ชื่อสินค้า</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">SKU</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">หมวดหมู่</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">หน่วย</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">ราคา</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">คงเหลือ</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-erp-text">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">{p.unit}</td>
                  <td className="px-4 py-3 text-right font-mono">฿{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono ${p.stock < 100 ? "text-erp-error font-semibold" : ""}`}>
                      {p.stock.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-brand-primary hover:text-brand-hover text-xs"
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">แสดง {filtered.length} จาก {products.length} รายการ</p>
      </div>

      {/* Slide Panel */}
      <SlidePanel
        open={panelOpen}
        title={editing ? `แก้ไขสินค้า: ${editing.id}` : "เพิ่มสินค้าใหม่"}
        onClose={() => setPanelOpen(false)}
        footer={
          <>
            <button
              onClick={() => setPanelOpen(false)}
              className="px-4 py-2 border border-erp-border rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => setPanelOpen(false)}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm rounded-lg font-medium transition-colors"
            >
              บันทึก
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <FloatingField label="ชื่อสินค้า" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <FloatingField label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
          <FloatingField label="หมวดหมู่" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <FloatingField label="หน่วย" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
          <FloatingField label="ราคา (บาท)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" />
          <FloatingField label="จำนวนคงเหลือ" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} type="number" />
        </div>
      </SlidePanel>
    </div>
  );
}
