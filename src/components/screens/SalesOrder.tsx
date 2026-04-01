"use client";

import ScreenMeta from "@/components/ScreenMeta";
import { salesOrders } from "@/data/mock";

const statusBadge: Record<string, { bg: string; text: string; dot: string }> = {
  Draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  Confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Shipped: { bg: "bg-green-50", text: "text-erp-success", dot: "bg-erp-success" },
};

export default function SalesOrder() {
  return (
    <div>
      <ScreenMeta id="MD-6" name="งานขาย" actor="พนักงานขาย" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-erp-text">รายการใบสั่งขาย</h2>
          <div className="flex items-center gap-2">
            {Object.entries(statusBadge).map(([status, s]) => (
              <span key={status} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {status} ({salesOrders.filter((o) => o.status === status).length})
              </span>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">เลข SO</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">วันที่</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">ลูกค้า</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">พนักงานขาย</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500">สถานะ</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">ยอดรวม</th>
              </tr>
            </thead>
            <tbody>
              {salesOrders.map((so) => {
                const badge = statusBadge[so.status];
                return (
                  <tr key={so.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-brand-primary">{so.soNumber}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{so.date}</td>
                    <td className="px-4 py-3 font-medium text-erp-text">{so.customer}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{so.salesperson}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {so.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      ฿{so.total.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {(["Draft", "Confirmed", "Shipped"] as const).map((status) => {
            const orders = salesOrders.filter((o) => o.status === status);
            const total = orders.reduce((s, o) => s + o.total, 0);
            const badge = statusBadge[status];
            return (
              <div key={status} className={`${badge.bg} rounded-lg p-4`}>
                <p className={`text-xs ${badge.text} font-medium mb-1`}>{status}</p>
                <p className="text-lg font-bold text-erp-text">฿{total.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{orders.length} รายการ</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
