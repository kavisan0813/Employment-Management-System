import React from "react";
import { Bug, AlertTriangle, Link2 } from "lucide-react";
import type { Issue } from "../types/types";

export function IssueTracker({ issues, actions }: { issues: Issue[], actions: any }) {
  const severityColor = (s: string) => {
    if (s === "Critical") return "bg-red-50 text-red-700 border-red-200";
    if (s === "Major") return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };
  const statusColor = (s: string) => {
    if (s === "Open") return "bg-blue-50 text-blue-700";
    if (s === "Investigation") return "bg-purple-50 text-purple-700";
    if (s === "Fix In Progress") return "bg-amber-50 text-amber-700";
    if (s === "Testing") return "bg-indigo-50 text-indigo-700";
    if (s === "Resolved") return "bg-emerald-50 text-emerald-700";
    return "bg-gray-50 text-gray-700";
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Issue Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">Track system-level problems linked to customer tickets.</p>
      </div>

      <div className="space-y-4">
        {issues.map(issue => (
          <div key={issue.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${issue.severity === 'Critical' ? 'bg-red-50 text-red-600' : issue.severity === 'Major' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-gray-400">{issue.issueNo}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityColor(issue.severity)}`}>{issue.severity}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mt-1">{issue.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-lg">{issue.description}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColor(issue.status)}`}>{issue.status}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500">
              <span><strong className="text-gray-700">Developer:</strong> {issue.assignedDeveloper || "Unassigned"}</span>
              <span><strong className="text-gray-700">Root Cause:</strong> {issue.rootCause || "Under investigation"}</span>
              <span className="flex items-center gap-1"><Link2 className="w-3 h-3" /> {issue.linkedTicketIds.length} linked ticket(s)</span>
            </div>
          </div>
        ))}
        {issues.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">No tracked issues.</div>
        )}
      </div>
    </div>
  );
}
