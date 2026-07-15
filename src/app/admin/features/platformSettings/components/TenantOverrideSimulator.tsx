/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Building, ArrowRight } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
}

export function TenantOverrideSimulator({ config }: Props) {
  const [selectedDemoTenant, setSelectedDemoTenant] = useState<
    "Acme India" | "viyan Dubai" | "Viyan Singapore"
  >("Acme India");

  const getDemoTenantData = () => {
    switch (selectedDemoTenant) {
      case "Acme India":
        return {
          tz: "Asia/Kolkata",
          cur: "INR (₹)",
          lang: "English",
          wl: "Disabled",
          size: `${config.storage?.maxUploadSizeMb ?? 50} MB`,
        };
      case "viyan Dubai":
        return {
          tz: "Asia/Dubai",
          cur: "AED (د.إ)",
          lang: "Arabic",
          wl: "Enabled",
          size: "50 MB",
        };
      case "Viyan Singapore":
        return {
          tz: "Europe/London",
          cur: "SGD (S$)",
          lang: "English",
          wl: "Disabled",
          size: `${config.storage?.maxUploadSizeMb ?? 50} MB`,
        };
    }
  };

  const data = getDemoTenantData();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-500" /> Tenant Override
            Simulator
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Validate how platform settings propagate or override at the tenant
            level.
          </p>
        </div>

        <select
          value={selectedDemoTenant}
          onChange={(e) =>
            setSelectedDemoTenant(
              e.target.value as
                | "Acme India"
                | "viyan Dubai"
                | "Viyan Singapore",
            )
          }
          className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none focus:border-indigo-400"
        >
          <option value="Acme India">Acme India</option>
          <option value="viyan Dubai">viyan Dubai</option>
          <option value="Viyan Singapore">Viyan Singapore</option>
        </select>
      </div>

      {/* Grid Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Defaults */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            System Defaults
          </p>
          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-gray-500">Timezone</span>
              <span className="text-gray-800">
                {config.timezone.defaultTimezone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Currency</span>
              <span className="text-gray-800">
                {config.currency.defaultCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Language</span>
              <span className="text-gray-800">
                {config.localization.defaultLanguage}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Upload Cap</span>
              <span className="text-gray-800">
                {config.storage?.maxUploadSizeMb ?? 50} MB
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Visual */}
        <div className="flex flex-col items-center justify-center gap-2 text-indigo-400">
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Inheritance
          </span>
          <ArrowRight className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Override
          </span>
        </div>

        {/* Tenant Values */}
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
          <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
            {selectedDemoTenant} Values
          </p>
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-indigo-900/60">Timezone</span>
              <span className="text-indigo-900">{data.tz}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-900/60">Currency</span>
              <span className="text-indigo-900">{data.cur}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-900/60">Language</span>
              <span className="text-indigo-900">{data.lang}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-900/60">Upload Cap</span>
              <span className="text-indigo-900">{data.size}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-800 leading-relaxed font-medium">
        <strong>Note:</strong> Tenant overrides for Timezones and Currency
        automatically bind local attendance and payroll calculations to the
        tenant's regional constraints, bypassing global platform defaults.
      </div>
    </div>
  );
}
