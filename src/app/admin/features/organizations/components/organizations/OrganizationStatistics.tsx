/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ChevronDown } from "lucide-react";

interface OrganizationStatisticsProps {
  totalCount: number;
  activeCount: number;
  totalMRR: number;
}

function MetricPill({
  label,
  value,
  dark,
  accent,
}: {
  label: string;
  value: string;
  dark?: boolean;
  accent?: "emerald";
}) {
  if (dark) {
    return (
      <div className="flex items-center gap-2.5 bg-gray-900 rounded-full pl-4 pr-1.5 py-1.5">
        <span className="text-[11px] text-gray-300 font-medium">{label}</span>
        <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full">
          {value}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5 bg-white rounded-full pl-4 pr-1.5 py-1.5 border border-gray-200/70">
      <span className="text-[11px] text-gray-400 font-medium">{label}</span>
      <span
        className={`text-xs font-bold px-3 py-1 rounded-full ${
          accent === "emerald"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function OrganizationStatistics({
  totalCount,
  activeCount,
  totalMRR,
}: OrganizationStatisticsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <MetricPill
        label="Organizations"
        value={String(totalCount)}
        dark
      />
      <MetricPill
        label="Active"
        value={String(activeCount)}
        accent="emerald"
      />
      <div className="flex items-center gap-2 bg-white rounded-full pl-4 pr-1.5 py-1.5 border border-gray-200/70">
        <span className="text-[11px] text-gray-400 font-medium">
          Total MRR
        </span>
        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
          ${totalMRR.toLocaleString()}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white px-3 py-2 rounded-full border border-gray-200/70">
          Directory <ChevronDown className="w-3 h-3" />
        </button>
        <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white px-3 py-2 rounded-full border border-gray-200/70">
          Insights <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default OrganizationStatistics;
