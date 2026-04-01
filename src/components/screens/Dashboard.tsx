"use client";

import ScreenMeta from "@/components/ScreenMeta";
import { products, salesOrders, purchaseRequests, recentActivities } from "@/data/mock";

const kpis = [
  {
    label: "ยอดขายเดือนนี้",
    value: `฿${(salesOrders.reduce((s, o) => s + o.total, 0)).toLocaleString()}`,
    sub: `${salesOrders.length} ใบสั่งขาย`,
    color: "bg-brand-primary",
  },
  {
    label: "สินค้าในสต็อก",
    value: `${products.reduce((s, p) => s + p.stock, 0).toLocaleString()} หน่วย`,
    sub: `${products.length} รายการ`,
    color: "bg-erp-success",
  },
  {
    label: "ใบขอซื้อรออนุมัติ",
    value: `${purchaseRequests.filter((p) => p.status === "Pending").length} รายการ`,
    sub: `฿${purchaseRequests.filter((p) => p.status === "Pending").reduce((s, p) => s + p.total, 0).toLocaleString()}`,
    color: "bg-erp-warning",
  },
  {
    label: "งานขายค้าง (Draft)",
    value: `${salesOrders.filter((s) => s.status === "Draft").length} รายการ`,
    sub: `฿${salesOrders.filter((s) => s.status === "Draft").reduce((s, o) => s + o.total, 0).toLocaleString()}`,
    color: "bg-blue-600",
  },
];

export default function Dashboard() {
  return (
    <div>
      <ScreenMeta id="MD-1" name="แดชบอร์ด" actor="ผู้ใช้ทั่วไป" />
      <div className="p-4 space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                  <p className="text-xl font-bold text-erp-text">{k.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
                </div>
                <div className={`w-10 h-10 ${k.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                  {i === 0 ? "💰" : i === 1 ? "📦" : i === 2 ? "📋" : "🛒"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-sm text-erp-text mb-3">กิจกรรมล่าสุด</h3>
            <div className="space-y-3">
              {recentActivities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-[10px] font-mono text-gray-400 w-10">{a.time}</span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      a.type === "create"
                        ? "bg-blue-500"
                        : a.type === "approve"
                        ? "bg-erp-success"
                        : a.type === "ship"
                        ? "bg-purple-500"
                        : "bg-brand-primary"
                    }`}
                  />
                  <span className="text-sm text-erp-text flex-1">{a.action}</span>
                  <span className="text-xs text-gray-400">{a.user}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-sm text-erp-text mb-3">สถิติด่วน</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>สินค้าคงเหลือต่ำ</span>
                  <span className="text-erp-error font-medium">2 รายการ</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-erp-error rounded-full w-1/5" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>ส่งสินค้าแล้ว</span>
                  <span className="text-erp-success font-medium">1/5 SO</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-erp-success rounded-full w-1/5" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>ใบขอซื้อ อนุมัติแล้ว</span>
                  <span className="text-brand-primary font-medium">1/4 PR</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-brand-primary rounded-full w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
