import React from "react";
import { Download, UploadCloud } from "lucide-react";

export function ImportExportUsers() {
  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            Import / Export Users
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Bulk manage users via CSV file transfers.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Import Users</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Upload a CSV file to bulk create or update user records.
            </p>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer w-full">
              Select CSV File
            </button>
            <button className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700 mt-3 underline">
              Download Template
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Export Users</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Download a complete roster of all platform users.
            </p>
            <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer w-full">
              Export to CSV
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
