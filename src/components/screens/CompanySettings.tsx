"use client";

import { useState } from "react";
import ScreenMeta from "@/components/ScreenMeta";
import FloatingField from "@/components/FloatingField";
import { companyInfo } from "@/data/mock";

export default function CompanySettings() {
  const [form, setForm] = useState({ ...companyInfo });
  const [locked, setLocked] = useState(true);

  return (
    <div>
      <ScreenMeta id="MD-11" name="ตั้งค่าบริษัท" actor="ผู้ดูแลระบบ" />
      <div className="p-4 max-w-2xl">
        {/* Lock Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-erp-text">ข้อมูลบริษัท</h2>
            {locked && (
              <span className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                🔒 ล็อกอยู่
              </span>
            )}
          </div>
          <button
            onClick={() => setLocked(!locked)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              locked
                ? "bg-brand-primary hover:bg-brand-hover text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {locked ? "🔓 ปลดล็อก" : "🔒 ล็อก"}
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
          <FloatingField
            label="ชื่อบริษัท"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            disabled={locked}
          />
          <FloatingField
            label="เลขประจำตัวผู้เสียภาษี"
            value={form.taxId}
            onChange={(v) => setForm({ ...form, taxId: v })}
            disabled={locked}
          />
          <FloatingField
            label="ที่อยู่"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            disabled={locked}
            textarea
          />
          <div className="grid grid-cols-2 gap-4">
            <FloatingField
              label="โทรศัพท์"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              disabled={locked}
            />
            <FloatingField
              label="อีเมล"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              disabled={locked}
            />
          </div>
          <FloatingField
            label="เว็บไซต์"
            value={form.website}
            onChange={(v) => setForm({ ...form, website: v })}
            disabled={locked}
          />

          {/* Save Button */}
          {!locked && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setLocked(true)}
                className="px-6 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm rounded-lg font-medium transition-colors"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
