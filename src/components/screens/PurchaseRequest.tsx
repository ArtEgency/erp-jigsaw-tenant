"use client";

import { useState } from "react";
import ScreenMeta from "@/components/ScreenMeta";
import SlidePanel from "@/components/SlidePanel";
import FloatingField from "@/components/FloatingField";
import { purchaseRequests } from "@/data/mock";

const statusColor: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-600",
  Pending: "bg-yellow-50 text-erp-warning",
  Approved: "bg-green-50 text-erp-success",
  Rejected: "bg-red-50 text-erp-error",
};

export default function PurchaseRequest() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState({
    requester: "",
    department: "",
    productName: "",
    qty: "",
    unit: "",
    unitPrice: "",
    note: "",
  });

  return (
    <div>
      <ScreenMeta id="MD-3" name="ใบขอซื้อ" actor="เจ้าหน้าที่จัดซื้อ" />
      <div className="p-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-erp-text">รายการใบขอซื้อ</h2>
          <button
            onClick={() => {
              setForm({ requester: "", department: "", productName: "", qty: "", unit: "", unitPrice: "", note: "" });
              setPanelOpen(true);
            }}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm rounded-lg font-medium transition-colors"
          >
            + สร้างใบขอซื้อ
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {purchaseRequests.map((pr) => (
            <div
              key={pr.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-erp-text">{pr.prNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[pr.status]}`}>
                      {pr.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">วันที่: {pr.date}</p>
                </div>
                <span className="font-mono text-sm font-semibold text-erp-text">
                  ฿{pr.total.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>ผู้ขอ: {pr.requester}</span>
                <span>แผนก: {pr.department}</span>
                <span>{pr.items.length} รายการ</span>
              </div>
              {/* Items */}
              <div className="mt-2 border-t border-gray-50 pt-2">
                {pr.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-0.5">
                    <span className="text-gray-600">{item.productName}</span>
                    <span className="text-gray-400">
                      {item.qty} {item.unit} × ฿{item.unitPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create PR Panel */}
      <SlidePanel
        open={panelOpen}
        title="สร้างใบขอซื้อใหม่"
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
          <FloatingField label="ผู้ขอซื้อ" value={form.requester} onChange={(v) => setForm({ ...form, requester: v })} />
          <FloatingField label="แผนก" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-500 mb-3">รายการสินค้า</p>
            <FloatingField label="ชื่อสินค้า" value={form.productName} onChange={(v) => setForm({ ...form, productName: v })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FloatingField label="จำนวน" value={form.qty} onChange={(v) => setForm({ ...form, qty: v })} type="number" />
            <FloatingField label="หน่วย" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
            <FloatingField label="ราคา/หน่วย" value={form.unitPrice} onChange={(v) => setForm({ ...form, unitPrice: v })} type="number" />
          </div>
          <button className="text-brand-primary text-xs hover:underline">+ เพิ่มรายการ</button>
          <FloatingField label="หมายเหตุ" value={form.note} onChange={(v) => setForm({ ...form, note: v })} textarea />
        </div>
      </SlidePanel>
    </div>
  );
}
