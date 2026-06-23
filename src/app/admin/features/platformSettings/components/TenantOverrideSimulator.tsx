/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Building } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
}

export function TenantOverrideSimulator({ config }: Props) {
  const [selectedDemoTenant, setSelectedDemoTenant] = useState<"Acme India" | "Nexus Dubai" | "Viyan Singapore">("Acme India");

  const getDemoTenantData = () => {
    switch (selectedDemoTenant) {
      case "Acme India":
        return {
          timezone: "Asia/Kolkata (Overridden)",
          currency: "INR (Overridden - ₹)",
          lang: "English (Default Inherited)",
          whiteLabel: "Disabled (Inherited)",
          uploadSize: `${config.storage.maxUploadSizeMb} MB (Default Inherited)`,
          status: "Acme Corporate Portal Active"
        };
      case "Nexus Dubai":
        return {
          timezone: "Asia/Dubai (Overridden)",
          currency: "AED (Overridden - د.إ)",
          lang: "Arabic (Overridden)",
          whiteLabel: "Enabled (Overridden)",
          uploadSize: "50 MB (Overridden - Enterprise Tier)",
          status: "Nexus Dubai Enterprise Console Active"
        };
      case "Viyan Singapore":
        return {
          timezone: "Europe/London (Overridden - Remote Hub)",
          currency: "SGD (Overridden - S$)",
          lang: "English (Default Inherited)",
          whiteLabel: "Disabled (Inherited)",
          uploadSize: `${config.storage.maxUploadSizeMb} MB (Default Inherited)`,
          status: "Viyan HR Space Active"
        };
    }
  };

  const demoTenant = getDemoTenantData();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-150 pb-3 gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-indigo-650" />
            Tenant Inheritance & Override Simulator
          </h3>
          <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
            This tool validates how regional configurations and branding parameters inherit or override platform values in client portals.
          </p>
        </div>

        {/* Selector for demo tenants */}
        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <span className="text-[10px] uppercase font-bold text-gray-400">Select Mock Tenant:</span>
          <select
            value={selectedDemoTenant}
            onChange={e => setSelectedDemoTenant(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-[11px] font-bold text-gray-800 outline-none cursor-pointer"
          >
            <option value="Acme India">Acme India Corporate Space</option>
            <option value="Nexus Dubai">Nexus Dubai Middle East</option>
            <option value="Viyan Singapore">Viyan Remote Asia Hub</option>
          </select>
        </div>
      </div>

      {/* Simulated Data Grid comparison table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Inherited Defaults */}
        <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 space-y-3 text-xs font-semibold text-gray-700">
          <span className="text-[10px] text-gray-450 block font-extrabold uppercase tracking-wide">SYSTEM DEFAULTS</span>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span>Timezone</span>
              <span className="font-mono text-gray-900">{config.timezone.defaultTimezone}</span>
            </div>
            <hr className="border-gray-200/50" />
            <div className="flex justify-between items-center text-[11px]">
              <span>Currency</span>
              <span className="font-mono text-gray-900">{config.currency.defaultCode} ({config.currency.symbol})</span>
            </div>
            <hr className="border-gray-200/50" />
            <div className="flex justify-between items-center text-[11px]">
              <span>Default Language</span>
              <span className="text-gray-900">{config.localization.defaultLanguage}</span>
            </div>
            <hr className="border-gray-200/50" />
            <div className="flex justify-between items-center text-[11px]">
              <span>Max Upload Size</span>
              <span className="text-gray-900">{config.storage.maxUploadSizeMb} MB</span>
            </div>
          </div>
        </div>

        {/* Comparison Arrow */}
        <div className="flex flex-col justify-center items-center p-3 text-center bg-indigo-50/20 border border-indigo-100/60 rounded-xl">
          <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-widest block mb-1">Inheritance Pipeline</span>
          <span className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs shadow-xs my-2">&rarr;</span>
          <span className="text-[9px] text-indigo-500 font-semibold px-2">System settings apply automatically to organizations unless overridden.</span>
        </div>

        {/* Inherited/Overridden Values for Tenant */}
        <div className="bg-emerald-50/20 border border-emerald-100 rounded-xl p-4 space-y-3 text-xs font-semibold text-emerald-900">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-emerald-700 block font-extrabold uppercase tracking-wide">ORGANIZATION VALUES</span>
            <span className="text-[8px] uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {selectedDemoTenant}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-emerald-700">Timezone</span>
              <span className="font-mono text-emerald-955 font-bold">{demoTenant.timezone}</span>
            </div>
            <hr className="border-emerald-100/50" />
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-emerald-700">Currency</span>
              <span className="font-mono text-emerald-955 font-bold">{demoTenant.currency}</span>
            </div>
            <hr className="border-emerald-100/50" />
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-emerald-700">Default Language</span>
              <span className="text-emerald-955 font-bold">{demoTenant.lang}</span>
            </div>
            <hr className="border-emerald-100/50" />
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-emerald-700">Max Upload Size</span>
              <span className="text-emerald-955 font-bold">{demoTenant.uploadSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* visual statement explaining how standard overrides work in SaaS */}
      <div className="p-3.5 bg-gray-55 border border-gray-150 rounded-xl text-[10px] text-gray-550 leading-relaxed font-semibold">
        <strong>Tenant Compliance Policy:</strong> When the organization timezones are overridden (e.g. <code>Asia/Dubai</code> in Nexus Dubai), attendance punches, scheduling clocks, and local payroll calculation deadlines automatically bind to that local timezone instead of the platform default.
      </div>
    </div>
  );
}
