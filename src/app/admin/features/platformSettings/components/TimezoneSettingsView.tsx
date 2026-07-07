/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Clock, Globe } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export function TimezoneSettingsView({ config, setConfig }: Props) {
  function updateTZ<K extends keyof SystemConfig["timezone"]>(
    key: K,
    value: SystemConfig["timezone"][K],
  ) {
    setConfig((prev) => ({
      ...prev,
      timezone: { ...prev.timezone, [key]: value },
    }));
  }

  const inputClass =
    "w-full text-sm p-2.5 border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors";
  const labelClass =
    "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Global Default Timezone</label>
            <select
              value={config.timezone.defaultTimezone}
              onChange={(e) => updateTZ("defaultTimezone", e.target.value)}
              className={inputClass}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Supported Timezone Pool</label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-40 overflow-y-auto">
              {[
                "Asia/Kolkata",
                "Asia/Dubai",
                "America/New_York",
                "Europe/London",
              ].map((tz) => (
                <label
                  key={tz}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={config.timezone.supportedTimezones.includes(tz)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...config.timezone.supportedTimezones, tz]
                        : config.timezone.supportedTimezones.filter(
                            (t) => t !== tz,
                          );
                      updateTZ("supportedTimezones", next);
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  {tz}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={config.timezone.useLocalTimeForPunches}
              onChange={(e) =>
                updateTZ("useLocalTimeForPunches", e.target.checked)
              }
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Use Local Device Timezone for Attendance
          </label>
        </div>

        {/* Right: Time Synchronization Audit */}
        <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-6 space-y-6">
          <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Time Synchronization Audit
          </h4>

          <div className="space-y-3 bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
            {[
              {
                label: "Platform Default",
                val: config.timezone.defaultTimezone,
              },
              {
                label: "UTC Server Reference",
                val: new Date().toUTCString().slice(17, 25) + " UTC",
              },
              {
                label: "Simulated Local Display",
                val: new Date().toLocaleTimeString("en-US", {
                  timeZone: config.timezone.defaultTimezone,
                }),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0"
              >
                <span className="font-semibold text-gray-400 uppercase">
                  {item.label}
                </span>
                <span className="font-semibold text-indigo-700 font-mono">
                  {item.val}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white rounded-xl border border-indigo-100 text-xs font-medium text-indigo-900 leading-relaxed">
            <Globe className="w-4 h-4 inline-block mr-2 text-indigo-500" />
            <strong>Compliance Note:</strong> Strictly enforcing server-side
            timezones prevents attendance spoofing by client-side clock
            manipulation.
          </div>
        </div>
      </div>
    </div>
  );
}
