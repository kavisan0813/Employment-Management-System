/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, FileText } from "lucide-react";
import { CommunicationState } from "../types/communication.types";

interface CommunicationHistoryViewProps {
  state: CommunicationState;
}

export function CommunicationHistoryView({ state }: CommunicationHistoryViewProps) {
  const [query, setQuery] = useState("");

  const filteredLogs = state.logs.filter(log => 
    log.recipient.toLowerCase().includes(query.toLowerCase()) || 
    log.type.toLowerCase().includes(query.toLowerCase()) ||
    log.status.toLowerCase().includes(query.toLowerCase()) ||
    log.details.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Query Filter panel */}
      <div className="bg-white border border-gray-250 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">Outbound Transmission Logs database</span>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search logs by recipient/type/details..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-indigo-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm text-gray-500 font-bold">No matching transmission logs found.</p>
            <p className="text-xs text-gray-400 font-medium">Verify your search query filters or send a new broadcast campaign.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Date & Timestamp</th>
                  <th className="px-5 py-4 text-center">Type</th>
                  <th className="px-5 py-4">Recipient Target</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4">Log Transmission Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4 text-gray-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        log.type === "Email"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : log.type === "SMS"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}>{log.type}</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900 font-mono">{log.recipient}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        log.status === "Delivered" || log.status === "Viewed" || log.status === "Opened" || log.status === "Clicked"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : log.status === "Failed" || log.status === "Bounced"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}>{log.status}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 leading-tight max-w-[320px] truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
