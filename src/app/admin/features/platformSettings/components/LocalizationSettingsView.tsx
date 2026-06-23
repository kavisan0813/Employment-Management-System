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
  getFormattedNumberPreview
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Default Language</label>
            <select
              value={config.localization.defaultLanguage}
              onChange={e => setConfig(p => ({ ...p, localization: { ...p.localization, defaultLanguage: e.target.value } }))}
              className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="French">French (Français)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Supported Languages Checklist</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 border border-gray-150 rounded-xl font-bold text-xs text-gray-700">
              {["English", "Tamil", "Hindi", "Arabic", "French"].map(lang => {
                const isChecked = config.localization.supportedLanguages.includes(lang);
                return (
                  <label key={lang} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const next = isChecked
                          ? config.localization.supportedLanguages.filter(l => l !== lang)
                          : [...config.localization.supportedLanguages, lang];
                        if (next.length > 0) {
                          setConfig(p => ({ ...p, localization: { ...p.localization, supportedLanguages: next } }));
                        }
                      }}
                      className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
                    />
                    {lang}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Date Format</label>
              <select
                value={config.localization.dateFormat}
                onChange={e => setConfig(p => ({ ...p, localization: { ...p.localization, dateFormat: e.target.value as any } }))}
                className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (India)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (USA)</option>
                <option value="DD.MM.YYYY">DD.MM.YYYY (Europe)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Calendar Type</label>
              <select
                value={config.localization.calendarFormat}
                onChange={e => setConfig(p => ({ ...p, localization: { ...p.localization, calendarFormat: e.target.value as any } }))}
                className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer"
              >
                <option value="Gregorian">Gregorian Calendar</option>
                <option value="Islamic">Islamic Calendar</option>
                <option value="Fiscal Calendar">Fiscal Year Calendar</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Number separator notation</label>
            <select
              value={config.localization.numberFormat}
              onChange={e => setConfig(p => ({ ...p, localization: { ...p.localization, numberFormat: e.target.value as any } }))}
              className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer"
            >
              <option value="India">Indian Scale (1,00,000)</option>
              <option value="International">International Scale (100,000)</option>
            </select>
          </div>

        </div>

        {/* Regional formatting simulator outputs */}
        <div className="bg-indigo-50/20 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-indigo-955 uppercase tracking-wide flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-650" />
              Regional Formatter Outputs
            </h4>
            <p className="text-[10px] text-indigo-500 font-semibold mt-1">
              Displays how regional format data renders in employee profiles, logs, and worksheets under selected parameters:
            </p>
          </div>

          <div className="space-y-3 font-semibold text-xs text-gray-700 bg-white border border-indigo-100/60 p-4 rounded-xl shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">Default Language</span>
              <span className="text-indigo-900 font-extrabold">{config.localization.defaultLanguage}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">Formatted Local Date</span>
              <span className="font-mono text-indigo-900">{getFormattedDatePreview()}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">Number Scale Representation</span>
              <span className="font-mono text-indigo-900">{getFormattedNumberPreview()}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold text-[10px] uppercase">Mock Calendar Display</span>
              <span className="text-indigo-900 font-extrabold">{config.localization.calendarFormat} Calendar</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-[10px] text-indigo-800 leading-normal">
            <strong>Tamil Support Active:</strong> In Tamil translation modes, UI dates represent regional translations dynamically.
          </div>
        </div>

      </div>
    </div>
  );
}
