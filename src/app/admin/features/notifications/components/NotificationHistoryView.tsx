/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Link2, CheckCircle2, AlertCircle } from "lucide-react";
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
    <div className="space-y-6">
      
      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sent alerts history..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* History logs Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 uppercase text-[10px] tracking-wider font-extrabold select-none">
              <th className="px-5 py-3">Dispatched Alert event</th>
              <th className="px-5 py-3">Dispatch Date</th>
              <th className="px-5 py-3">Channel Used</th>
              <th className="px-5 py-3">Receipt status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            {filtered.map(item => {
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-extrabold text-gray-900 leading-snug">{item.alertName}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Log ID: {item.id}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 font-bold text-[10px]">
                    {new Date(item.date).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-indigo-700">
                    {item.channel}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      item.status === "Delivered" || item.status === "Sent" 
                        ? "text-emerald-600" 
                        : "text-rose-600 animate-pulse"
                    }`}>
                      {item.status === "Delivered" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Delivered
                        </>
                      ) : item.status === "Sent" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-450" /> Sent Relay
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Failed Delivery
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-455 font-bold">
                  No sent logs records found matching search queries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
