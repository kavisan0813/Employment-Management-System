/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, Play, Download, HelpCircle, FileText } from "lucide-react";

interface CustomReportsViewProps {
  customFilters: {
    orgId: string;
    dateRange: string;
    plan: string;
    industry: string;
  };
  setCustomFilters: React.Dispatch<React.SetStateAction<{
    orgId: string;
    dateRange: string;
    plan: string;
    industry: string;
  }>>;
  customReportResult: any[];
  handleCompileCustomReport: () => void;
  handleCreateExport: (reportName: string, exportType: "PDF" | "CSV" | "Excel") => void;
}

export function CustomReportsView({
  customFilters,
  setCustomFilters,
  customReportResult,
  handleCompileCustomReport,
  handleCreateExport
}: CustomReportsViewProps) {
  // Organizations selector options
  const orgOptions = [
    { id: "all", name: "All Organizations" },
    { id: "org-1", name: "Acme Enterprise" },
    { id: "org-2", name: "Apex Global" },
    { id: "org-3", name: "Stellar Tech SRL" },
    { id: "org-4", name: "Nova Media Ltd" },
    { id: "org-7", name: "Cyberdyne Systems" },
    { id: "org-9", name: "Wayne Enterprises" }
  ];

  // Industry options
  const industries = ["all", "Technology", "Healthcare", "Manufacturing", "Finance", "Education"];

  // Plan options
  const plans = ["all", "Basic", "Professional", "Enterprise", "Trial"];

  // Time ranges
  const dateRanges = [
    { id: "7d", label: "Past 7 Days" },
    { id: "30d", label: "Past 30 Days" },
    { id: "90d", label: "Past 90 Days" },
    { id: "1y", label: "Past Year" }
  ];

  const handleExportAction = (format: "PDF" | "CSV" | "Excel") => {
    if (customReportResult.length === 0) {
      alert("Please compile the report before exporting.");
      return;
    }
    const name = `custom_report_org_${customFilters.orgId}_plan_${customFilters.plan}`;
    handleCreateExport(name, format);
  };

  return (
    <div className="space-y-6">
      {/* Parameter selection panel */}
      <div className="bg-white border border-gray-250 rounded-2xl p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Dynamic Report Compiler Parameters</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Client Organization</label>
            <select
              value={customFilters.orgId}
              onChange={e => setCustomFilters(prev => ({ ...prev, orgId: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
            >
              {orgOptions.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Subscription Plan</label>
            <select
              value={customFilters.plan}
              onChange={e => setCustomFilters(prev => ({ ...prev, plan: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
            >
              {plans.map(p => (
                <option key={p} value={p}>{p === "all" ? "All Plans" : `${p} Plan`}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Industry vertical</label>
            <select
              value={customFilters.industry}
              onChange={e => setCustomFilters(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind === "all" ? "All Industries" : ind}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Query window date range</label>
            <select
              value={customFilters.dateRange}
              onChange={e => setCustomFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
            >
              {dateRanges.map(d => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Compiling queries aggregates tenant database entries securely.
          </div>
          <button
            onClick={handleCompileCustomReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer border-none transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-3.5 h-3.5" /> Compile Custom Report
          </button>
        </div>
      </div>

      {/* Grid dataset results preview */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-150 flex justify-between items-center">
          <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">Tabular Dataset Preview</span>
          {customReportResult.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportAction("CSV")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer border border-gray-200"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
              <button
                onClick={() => handleExportAction("PDF")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer border border-gray-200"
              >
                <Download className="w-3 h-3" /> Export PDF
              </button>
            </div>
          )}
        </div>

        {customReportResult.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500 font-bold">No report compiled yet.</p>
            <p className="text-[10px] text-gray-400 font-medium">Select parameters and click "Compile Custom Report" to render raw preview records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-150 bg-gray-50/50">
                  <th className="p-3 font-bold uppercase tracking-wider">Record ID</th>
                  <th className="p-3 font-bold uppercase tracking-wider">Organization Target</th>
                  <th className="p-3 font-bold uppercase tracking-wider">Plan</th>
                  <th className="p-3 font-bold uppercase tracking-wider">Industry</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-center">Users</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-center">Health</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-right">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customReportResult.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50/30">
                    <td className="p-3 font-mono font-bold text-gray-400">{rec.id}</td>
                    <td className="p-3 font-bold text-gray-900">{rec.org}</td>
                    <td className="p-3 font-semibold text-gray-600">{rec.plan}</td>
                    <td className="p-3 font-semibold text-gray-500">{rec.industry}</td>
                    <td className="p-3 text-center font-extrabold text-gray-700 font-mono">{rec.usersCount}</td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] font-extrabold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-mono">
                        {rec.healthIndex}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-indigo-650 font-mono">
                      {rec.revenueContribution > 0 ? `$${rec.revenueContribution}` : "$0"}
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
