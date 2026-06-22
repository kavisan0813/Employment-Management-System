/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HardDrive } from "lucide-react";

interface StorageUsageProps {
  usedGB?: number;
  limitGB?: number;
}

export function StorageUsage({ usedGB = 12.4, limitGB = 100 }: StorageUsageProps) {
  const percentage = Math.min(100, Math.max(0, (usedGB / limitGB) * 100));

  return (
    <div className="border border-gray-200 bg-gray-50/50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-gray-500" />
          <h4 className="text-xs font-semibold text-gray-900">Storage Usage</h4>
        </div>
        <span className="text-[11px] text-gray-500 font-mono">
          {usedGB} GB / {limitGB} GB
        </span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-amber-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400">
        Active databases, timesheet assets, and payslip PDFs backup.
      </p>
    </div>
  );
}

export default StorageUsage;
