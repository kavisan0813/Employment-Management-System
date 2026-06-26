/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sliders, AlertCircle } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export function PreferencesSettingsView({ config, setConfig }: Props) {
  const updatePref = (key: keyof SystemConfig["preferences"], value: any) => {
    setConfig((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  const inputClass =
    "w-full text-sm p-2.5 border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors";
  const labelClass =
    "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-6">
            <label className="flex items-start justify-between cursor-pointer group">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-gray-900">
                  Enforce Maintenance State
                </span>
                <p className="text-xs text-gray-500 font-medium max-w-[240px]">
                  Blocks non-admin logins and displays global maintenance
                  message.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.preferences.maintenanceMode}
                onChange={(e) =>
                  updatePref("maintenanceMode", e.target.checked)
                }
                className="mt-1 w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <div className="border-t border-gray-200" />

            <label className="flex items-start justify-between cursor-pointer group">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-gray-900">
                  Allow Self-Service Registry
                </span>
                <p className="text-xs text-gray-500 font-medium max-w-[240px]">
                  Enables registration access for new companies on public login
                  pages.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.preferences.allowSelfRegistration}
                onChange={(e) =>
                  updatePref("allowSelfRegistration", e.target.checked)
                }
                className="mt-1 w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Security Audit Logs Retention</label>
            <select
              value={config.preferences.logRetentionDays}
              onChange={(e) =>
                updatePref("logRetentionDays", Number(e.target.value))
              }
              className={inputClass}
            >
              <option value={90}>90 Days (Standard)</option>
              <option value={180}>180 Days (Corporate)</option>
              <option value={365}>365 Days (SOC2 Compliance)</option>
            </select>
          </div>
        </div>

        {/* Right: Preview Simulator */}
        <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-6 space-y-6">
          <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
            <Sliders className="w-4 h-4" /> System Status Preview
          </h4>

          <div className="space-y-3 bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-500 uppercase">
                Maintenance Mode
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${config.preferences.maintenanceMode ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}
              >
                {config.preferences.maintenanceMode
                  ? "ENFORCED"
                  : "OPERATIONAL"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-gray-100 pt-3">
              <span className="font-semibold text-gray-500 uppercase">
                Self-Service Access
              </span>
              <span className="font-bold text-indigo-700">
                {config.preferences.allowSelfRegistration
                  ? "Enabled"
                  : "Disabled (Invite Only)"}
              </span>
            </div>
          </div>

          {config.preferences.maintenanceMode && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-800 leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong>Global Outage Mode Active:</strong> All standard user
                accounts are currently being redirected to the maintenance
                landing page.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
