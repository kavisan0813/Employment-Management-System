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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4 font-semibold text-xs text-gray-700">
          
          <div className="space-y-1.5 p-4 bg-gray-55 border border-gray-150 rounded-xl space-y-3">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>
                Enforce System Maintenance State
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Displays a maintenance message globally, blocking non-admin logins.</p>
              </span>
              <input
                type="checkbox"
                checked={config.preferences.maintenanceMode}
                onChange={e => setConfig(p => ({ ...p, preferences: { ...p.preferences, maintenanceMode: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
              />
            </label>
            <hr className="border-gray-200/50" />
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span>
                Allow Self-Service Registry
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Enables the registration buttons for new companies on the login pages.</p>
              </span>
              <input
                type="checkbox"
                checked={config.preferences.allowSelfRegistration}
                onChange={e => setConfig(p => ({ ...p, preferences: { ...p.preferences, allowSelfRegistration: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Security Audit Logs Retention Cycle</label>
            <select
              value={config.preferences.logRetentionDays}
              onChange={e => setConfig(p => ({ ...p, preferences: { ...p.preferences, logRetentionDays: Number(e.target.value) } }))}
              className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white cursor-pointer"
            >
              <option value={90}>90 Days (Standard SLA)</option>
              <option value={180}>180 Days (Corporate SLA)</option>
              <option value={365}>365 Days (Enforces SOC2 Compliance)</option>
            </select>
          </div>

        </div>

        {/* Right: Visual layout showing maintenance simulation banner */}
        <div className="bg-indigo-50/20 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-650" />
              Platform Global status Preview
            </h4>
            <p className="text-[10px] text-indigo-500 font-semibold mt-1">
              Evaluates how system preferences affect global platforms:
            </p>
          </div>

          <div className="space-y-3 bg-white border border-indigo-100/60 p-4 rounded-xl shadow-xs text-xs font-semibold text-gray-700">
            <div className="flex justify-between items-center">
              <span>Maintenance Flag status</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${config.preferences.maintenanceMode ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                {config.preferences.maintenanceMode ? "MAINTENANCE ENFORCED" : "OPERATIONAL"}
              </span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center font-bold">
              <span>Self-Service registry Access</span>
              <span className="text-indigo-900 font-extrabold">{config.preferences.allowSelfRegistration ? "Enabled" : "Disabled (Invite Only)"}</span>
            </div>
          </div>

          {config.preferences.maintenanceMode && (
            <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-[10px] text-rose-800 leading-normal font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Global Outage Mode Active:</strong> All non-operator accounts will read a maintenance screen immediately when trying to load their tenant links.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
