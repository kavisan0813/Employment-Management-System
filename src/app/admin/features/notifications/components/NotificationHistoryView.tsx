/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, CheckCircle2, AlertCircle, History } from "lucide-react";
import { NotificationHistoryItem } from "../types/notifications.types";

interface Props {
  history: NotificationHistoryItem[];
}

export function NotificationHistoryView({ history }: Props) {
  const [search, setSearch] = useState("");

  const filtered = history.filter(h => 
    h.alertName.toLowerCase().includes(search.toLowerCase()) || 
    h.channel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-semibold">
      
      {/* Search Bar */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sent alerts history..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-indigo-50/50 border-b border-indigo-100 text-indigo-800 uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3">Dispatched Alert Event</th>
              <th className="px-5 py-3">Dispatch Date</th>
              <th className="px-5 py-3">Channel Used</th>
              <th className="px-5 py-3">Receipt Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-indigo-50/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{item.alertName}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-medium uppercase tracking-wider">ID: {item.id}</div>
                </td>
                <td className="px-5 py-4 text-gray-400 font-medium">
                  {new Date(item.date).toLocaleString()}
                </td>
                <td className="px-5 py-4 font-mono text-indigo-700">
                  {item.channel}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                    item.status === "Delivered" || item.status === "Sent" 
                      ? "text-emerald-600" 
                      : "text-rose-600"
                  }`}>
                    {item.status === "Delivered" ? (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</>
                    ) : item.status === "Sent" ? (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> Sent Relay</>
                    ) : (
                      <><AlertCircle className="w-3.5 h-3.5" /> Failed Delivery</>
                    )}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400 font-medium">
                  No sent log records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}