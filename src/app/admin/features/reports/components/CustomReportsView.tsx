import React from "react";
import { Play, Download, FileText } from "lucide-react";
import { CustomReportRecord } from "../types/reports.types";

interface CustomReportsViewProps {
  customFilters: {
    orgId: string;
    dateRange: string;
    plan: string;
    industry: string;
  };
  setCustomFilters: React.Dispatch<
    React.SetStateAction<{
      orgId: string;
      dateRange: string;
      plan: string;
      industry: string;
    }>
  >;
  customReportResult: CustomReportRecord[];
  handleCompileCustomReport: () => void;
  handleCreateExport: (
    reportName: string,
    exportType: "PDF" | "CSV" | "Excel",
  ) => void;
}

export function CustomReportsView({
  customFilters,
  setCustomFilters,
  customReportResult,
  handleCompileCustomReport,
  handleCreateExport,
}: CustomReportsViewProps) {
  const orgOptions = [
    { id: "all", name: "All Organizations" },
    { id: "org-1", name: "Acme Enterprise" },
    { id: "org-2", name: "Apex Global" },
  ];

  const industries = [
    "all",
    "Technology",
    "Healthcare",
    "Manufacturing",
    "Finance",
    "Education",
  ];
  const plans = ["all", "Basic", "Professional", "Enterprise", "Trial"];
  const dateRanges = [
    { id: "7d", label: "Past 7 Days" },
    { id: "30d", label: "Past 30 Days" },
    { id: "90d", label: "Past 90 Days" },
    { id: "1y", label: "Past Year" },
  ];

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Custom Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Compile customized analytical views across organizations.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Parameter selection panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">
            Report Compiler Parameters
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                {
                  label: "Organization",
                  key: "orgId",
                  opts: orgOptions.map((o) => ({ v: o.id, l: o.name })),
                },
                {
                  label: "Plan",
                  key: "plan",
                  opts: plans.map((p) => ({
                    v: p,
                    l: p === "all" ? "All Plans" : `${p} Plan`,
                  })),
                },
                {
                  label: "Industry",
                  key: "industry",
                  opts: industries.map((i) => ({
                    v: i,
                    l: i === "all" ? "All Industries" : i,
                  })),
                },
                {
                  label: "Date Range",
                  key: "dateRange",
                  opts: dateRanges.map((d) => ({ v: d.id, l: d.label })),
                },
              ] as const
            ).map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase">
                  {field.label}
                </label>
                <select
                  value={customFilters[field.key]}
                  onChange={(e) =>
                    setCustomFilters((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
                >
                  {field.opts.map((o) => (
                    <option key={o.v} value={o.v}>
                      {o.l}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCompileCustomReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              <Play className="w-3.5 h-3.5" /> Compile Custom Report
            </button>
          </div>
        </div>

        {/* Grid dataset results preview */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-700 uppercase">
              Tabular Dataset Preview
            </span>
            {customReportResult.length > 0 && (
              <div className="flex items-center gap-2">
                {(["CSV", "PDF"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleCreateExport("report", fmt)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50"
                  >
                    <Download className="w-3 h-3" /> Export {fmt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {customReportResult.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <FileText className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-sm font-medium text-gray-500">
                No report compiled yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                  <tr>
                    {[
                      "Record ID",
                      "Organization",
                      "Plan",
                      "Industry",
                      "Users",
                      "Health",
                      "Contribution",
                    ].map((h) => (
                      <th key={h} className="p-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customReportResult.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-mono text-gray-500 text-xs">
                        {rec.id}
                      </td>
                      <td className="p-3 font-medium text-gray-900">
                        {rec.org}
                      </td>
                      <td className="p-3 text-gray-600">{rec.plan}</td>
                      <td className="p-3 text-gray-600">{rec.industry}</td>
                      <td className="p-3 text-gray-700">{rec.usersCount}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded border border-teal-100 bg-teal-50 text-teal-700 text-xs font-medium">
                          {rec.healthIndex}
                        </span>
                      </td>
                      <td className="p-3 text-gray-900 font-semibold text-right">
                        {rec.revenueContribution > 0
                          ? `$${rec.revenueContribution}`
                          : "$0"}
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
