import React from "react";
import { Organization } from "../../../types";
import { Database, HardDrive, AlertCircle } from "lucide-react";

export function StorageUsage({ org }: { org: Organization }) {
  const used = org.storageUsedGB || 0;
  const allocated = org.storageAllocatedGB || 50;
  const percentage = Math.min(100, Math.round((used / allocated) * 100));

  const isWarning = percentage > 80;
  const isCritical = percentage > 95;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Storage Usage</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor file storage capacity for {org.name}.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isCritical ? 'bg-red-50 text-red-600' : isWarning ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">{used} <span className="text-lg text-gray-500 font-medium">GB Used</span></h2>
              <p className="text-sm font-medium text-gray-500 mt-1">of {allocated} GB Total Allocation</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${isCritical ? 'text-red-600' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
              {percentage}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isWarning && (
          <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${isCritical ? 'bg-red-50 border border-red-100 text-red-800' : 'bg-amber-50 border border-amber-100 text-amber-800'}`}>
            <AlertCircle className={`w-5 h-5 shrink-0 ${isCritical ? 'text-red-600' : 'text-amber-600'}`} />
            <div>
              <h4 className="text-sm font-bold">Storage Capacity Alert</h4>
              <p className="text-xs mt-1">This organization is nearing its storage limit. Consider upgrading their plan or instructing them to clean up old files and archives.</p>
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="w-3 h-3 rounded bg-blue-400"></div> Employee Documents
            </div>
            <p className="text-xl font-bold text-gray-900 ml-5">{Math.round(used * 0.6 * 10)/10} GB</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="w-3 h-3 rounded bg-purple-400"></div> Payroll Archives
            </div>
            <p className="text-xl font-bold text-gray-900 ml-5">{Math.round(used * 0.3 * 10)/10} GB</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="w-3 h-3 rounded bg-gray-300"></div> Misc / Logs
            </div>
            <p className="text-xl font-bold text-gray-900 ml-5">{Math.round(used * 0.1 * 10)/10} GB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
