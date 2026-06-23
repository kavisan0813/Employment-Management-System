import React from "react";
import { Organization } from "../../../types";
import { Settings, Save, Clock, DollarSign, Languages } from "lucide-react";

export function OrganizationSettings({ org }: { org: Organization }) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tenant Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configuration overrides for {org.name}.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Localization */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-500" /> Localization
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Timezone</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                <option>UTC (Coordinated Universal Time)</option>
                <option>America/New_York (EST)</option>
                <option>Europe/London (GMT)</option>
                <option>Asia/Kolkata (IST)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Currency</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <select className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
                  <option>INR - Indian Rupee</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" /> Employee & Time
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Employee ID Format</label>
              <input defaultValue="EMP-{0000}" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 font-mono" />
              <p className="text-[10px] text-gray-400 mt-1">Example: EMP-0001</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Standard Working Hours</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                <option>8 Hours / Day</option>
                <option>9 Hours / Day</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
