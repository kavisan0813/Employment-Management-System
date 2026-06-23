/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Clock } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export function TimezoneSettingsView({ config, setConfig }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 font-semibold text-xs text-gray-700">
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Global Default Timezone</label>
            <select
              value={config.timezone.defaultTimezone}
              onChange={e => setConfig(p => ({ ...p, timezone: { ...p.timezone, defaultTimezone: e.target.value } }))}
              className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white cursor-pointer"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST - UTC+4:00)</option>
              <option value="America/New_York">America/New_York (EST - UTC-5:00)</option>
              <option value="Europe/London">Europe/London (GMT/BST - UTC+0:00/1:00)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Supported Timezones Pool</label>
            <div className="space-y-1 border border-gray-200 p-3 rounded-xl max-h-40 overflow-y-auto">
              {["Asia/Kolkata", "Asia/Dubai", "America/New_York", "Europe/London"].map(tz => {
                const isChecked = config.timezone.supportedTimezones.includes(tz);
                return (
                  <label key={tz} className="flex items-center gap-2 py-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const next = isChecked
                          ? config.timezone.supportedTimezones.filter(t => t !== tz)
                          : [...config.timezone.supportedTimezones, tz];
                        if (next.length > 0) {
                          setConfig(p => ({ ...p, timezone: { ...p.timezone, supportedTimezones: next } }));
                        }
                      }}
                      className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] font-bold text-gray-800">{tz}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={config.timezone.useLocalTimeForPunches}
                onChange={e => setConfig(p => ({ ...p, timezone: { ...p.timezone, useLocalTimeForPunches: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650"
              />
              Use Local Device Timezone for Attendance Punch-Ins
            </label>
            <p className="text-[10px] text-gray-400 font-semibold pl-6">
              If unchecked, attendance timestamp recordings are enforced strictly to the selected organization's default timezone center (prevents timezone spoofing).
            </p>
          </div>

        </div>

        <div className="bg-indigo-50/20 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-indigo-955 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-650" />
              Time Synchronization Audit
            </h4>
            <p className="text-[10px] text-indigo-500 font-semibold mt-1">
              Evaluates how local punch time records are aligned for audit checks:
            </p>
          </div>

          <div className="space-y-3 font-semibold text-xs bg-white border border-indigo-100/60 p-4 rounded-xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">Platform Timezone Default</span>
              <span className="text-indigo-900 font-extrabold">{config.timezone.defaultTimezone}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">UTC Server Reference</span>
              <span className="font-mono text-indigo-900">{new Date().toUTCString().slice(17, 25)} UTC</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">Simulated Local Display</span>
              <span className="font-mono text-indigo-900">{new Date().toLocaleTimeString('en-US', { timeZone: config.timezone.defaultTimezone })}</span>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1.5 text-[10px] text-indigo-850">
            <strong>Compliance Benefit:</strong> Enforcing strict organization boundary timezones prevents remote workers from cheating attendance stamps by changing their laptop clocks.
          </div>
        </div>

      </div>
    </div>
  );
}
