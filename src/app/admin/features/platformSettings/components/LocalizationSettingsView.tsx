/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Globe } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  getFormattedDatePreview: () => string;
  getFormattedNumberPreview: () => string;
}

export function LocalizationSettingsView({
  config,
  setConfig,
  getFormattedDatePreview,
  getFormattedNumberPreview,
}: Props) {
  const updateLoc = (
    key: keyof SystemConfig["localization"],
    value: string | string[],
  ) => {
    setConfig((prev) => ({
      ...prev,
      localization: {
        ...prev.localization,
        [key]: value,
      } as unknown as SystemConfig["localization"],
    }));
  };

  const inputClass =
    "w-full text-sm p-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-400 transition-colors";
  const labelClass =
    "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Default Language</label>
            <select
              value={config.localization.defaultLanguage}
              onChange={(e) => updateLoc("defaultLanguage", e.target.value)}
              className={inputClass}
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="French">French (Français)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Supported Languages</label>
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {["English", "Tamil", "Hindi", "Arabic", "French"].map((lang) => (
                <label
                  key={lang}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={config.localization.supportedLanguages.includes(
                      lang,
                    )}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...config.localization.supportedLanguages, lang]
                        : config.localization.supportedLanguages.filter(
                            (l) => l !== lang,
                          );
                      updateLoc("supportedLanguages", next);
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Date Format</label>
              <select
                value={config.localization.dateFormat}
                onChange={(e) => updateLoc("dateFormat", e.target.value)}
                className={inputClass}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD.MM.YYYY">DD.MM.YYYY</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Calendar Type</label>
              <select
                value={config.localization.calendarFormat}
                onChange={(e) => updateLoc("calendarFormat", e.target.value)}
                className={inputClass}
              >
                <option value="Gregorian">Gregorian</option>
                <option value="Islamic">Islamic</option>
                <option value="Fiscal Calendar">Fiscal Year</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Number Separator</label>
            <select
              value={config.localization.numberFormat}
              onChange={(e) => updateLoc("numberFormat", e.target.value)}
              className={inputClass}
            >
              <option value="India">Indian (1,0,00,000)</option>
              <option value="International">International (100,000)</option>
            </select>
          </div>
        </div>

        {/* Right: Regional Simulator */}
        <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Regional Format Preview
          </h4>

          <div className="space-y-3 bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
            {[
              {
                label: "Default Language",
                val: config.localization.defaultLanguage,
              },
              { label: "Date Preview", val: getFormattedDatePreview() },
              { label: "Number Scale", val: getFormattedNumberPreview() },
              {
                label: "Calendar",
                val: `${config.localization.calendarFormat} Calendar`,
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

          <div className="p-4 bg-white rounded-xl border border-indigo-100 text-xs font-medium text-indigo-800 leading-relaxed">
            <strong>Tamil Language Support:</strong> Enabling regional
            translations will dynamically adjust UI labels, dates, and number
            formats for localized users.
          </div>
        </div>
      </div>
    </div>
  );
}
