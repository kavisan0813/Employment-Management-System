/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Download, Trash2, Search, FileText } from "lucide-react";
import { ReportsState } from "../types/reports.types";

interface ExportCenterViewProps {
  state: ReportsState;
  handleDeleteExport: (id: string) => void;
  triggerAlert: (msg: string, type?: "success" | "info" | "error" | "warning") => void;
}

export function ExportCenterView({ state, handleDeleteExport, triggerAlert }: ExportCenterViewProps) {
  const [query, setQuery] = useState("");

  const handleDownload = (filename: string, ext: string) => {
    triggerAlert(`Initiating file transfer. Downloading '${filename}.${ext.toLowerCase()}' to local Downloads folder.`, "success");
  };

  const filteredExports = state.exports.filter(exp => 
    exp.reportName.toLowerCase().includes(query.toLowerCase()) || 
    exp.exportType.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Filter input */}
      <div className="bg-white border border-gray-250 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">Completed Reports Downloads Registry</span>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents logs..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-indigo-500"
          />
        </div>
      </div>

      {/* Exports registry table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        {filteredExports.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500 font-bold">No documents match the query filter.</p>
            <p className="text-[10px] text-gray-400 font-medium">Verify naming queries or compile a new custom report dataset.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-150 bg-gray-50/50">
                  <th className="p-3.5 font-bold uppercase tracking-wider">Document File Name</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center">Format</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Generated Date</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center">File Size</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center">Status</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExports.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50/20">
                    <td className="p-3.5 font-bold text-gray-900 font-mono">
                      {exp.reportName}.{exp.exportType.toLowerCase()}
                    </td>
                    <td className="p-3.5 text-center font-bold text-indigo-750 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        exp.exportType === "PDF" 
                          ? "bg-rose-50 text-rose-700 border border-rose-100" 
                          : exp.exportType === "CSV"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-sky-50 text-sky-700 border border-sky-100"
                      }`}>{exp.exportType}</span>
                    </td>
                    <td className="p-3.5 text-gray-500 font-semibold font-mono">
                      {new Date(exp.generatedAt).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center text-gray-500 font-semibold font-mono">{exp.size}</td>
                    <td className="p-3.5 text-center">
                      <span className="text-[9px] font-extrabold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">
                        {exp.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-2 h-full">
                      <button
                        onClick={() => handleDownload(exp.reportName, exp.exportType)}
                        className="text-indigo-600 hover:text-indigo-800 bg-transparent border-none cursor-pointer p-1"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExport(exp.id)}
                        className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer p-1"
                        title="Delete Document Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
