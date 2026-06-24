import React, { useState } from "react";
import { Organization } from "../../../types";
import { Settings, Save, Clock, DollarSign, Languages, Loader2, Check } from "lucide-react";

export function OrganizationSettings({ org, hook }: { org: Organization, hook?: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Local state for the settings form
  const [settings, setSettings] = useState({
    timezone: "UTC (Coordinated Universal Time)",
    currency: "USD - US Dollar",
    employeeIdFormat: "EMP-{0000}",
    workingHours: "8 Hours / Day"
  });

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save tenant settings
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Tenant Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Configuration overrides for {org.name}.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving || isSuccess}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl text-sm transition-all shadow-sm ${
            isSuccess 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-default'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
          }`}
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : isSuccess ? (
            <><Check className="w-4 h-4" /> Saved Successfully</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Localization */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-500" /> Localization
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Timezone</label>
              <select 
                value={settings.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
              >
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
                <select 
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                >
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
              <input 
                value={settings.employeeIdFormat}
                onChange={(e) => handleChange("employeeIdFormat", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 font-mono" 
              />
              <p className="text-[10px] text-gray-400 mt-1">Example: EMP-0001</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Standard Working Hours</label>
              <select 
                value={settings.workingHours}
                onChange={(e) => handleChange("workingHours", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
              >
                <option>8 Hours / Day</option>
                <option>9 Hours / Day</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
