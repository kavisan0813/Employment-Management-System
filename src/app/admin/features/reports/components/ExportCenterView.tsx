/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
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
    triggerAlert(`Initiating file transfer. Downloading '${filename}.${ext.toLowerCase()}'.`, "success");
  };

  const filteredExports = state.exports.filter(exp => 
    exp.reportName.toLowerCase().includes(query.toLowerCase()) || 
    exp.exportType.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            Export Center
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Download previously generated reports and analytics files.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      {/* Search Filter input */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed Reports Registry</span>
        
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Exports registry table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {filteredExports.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-medium text-gray-500">No documents match the search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-4">Document File Name</th>
                  <th className="p-4 text-center">Format</th>
                  <th className="p-4">Generated Date</th>
                  <th className="p-4 text-center">Size</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExports.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 font-mono text-xs">
                      {exp.reportName}.{exp.exportType.toLowerCase()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        exp.exportType === "PDF" ? "bg-rose-50 text-rose-700 border-rose-100" :
                        exp.exportType === "CSV" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        "bg-sky-50 text-sky-700 border-sky-100"
                      }`}>{exp.exportType}</span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {new Date(exp.generatedAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-center text-gray-600 font-medium">{exp.size}</td>
                    <td className="p-4 text-center">
                      <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-100">
                        {exp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleDownload(exp.reportName, exp.exportType)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExport(exp.id)}
                        className="text-gray-400 hover:text-rose-600 transition-colors"
                        title="Delete"
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
      </div>
    
  );
}