/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Eye, ArrowUpRight } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export function BrandingSettingsView({ config, setConfig }: Props) {
  const inputClass = "w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-white outline-none focus:border-indigo-500 transition-all";
  const labelClass = "text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Branding form inputs */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className={labelClass}>Theme Palette customization</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "PRIMARY", key: "primaryColor" as const },
                { label: "SECONDARY", key: "secondaryColor" as const },
                { label: "BUTTONS", key: "buttonColor" as const }
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <span className="text-[10px] text-gray-400 block font-bold">{item.label}</span>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.branding[item.key]}
                      onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, [item.key]: e.target.value } }))}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={config.branding[item.key]}
                      onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, [item.key]: e.target.value } }))}
                      className="w-full text-[11px] font-mono p-1 border border-gray-200 rounded outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Welcome Header (Login screen)</label>
              <input type="text" value={config.branding.welcomeText} onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, welcomeText: e.target.value } }))} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Welcome Tagline</label>
              <input type="text" value={config.branding.tagline} onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, tagline: e.target.value } }))} className={inputClass} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
            <input type="checkbox" checked={config.branding.whiteLabelEnabled} onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, whiteLabelEnabled: e.target.checked } }))} className="w-4 h-4 rounded cursor-pointer accent-indigo-650" />
            Enable White-Labeling (Tenant logo override support)
          </label>

          <div className="space-y-3 bg-gray-50 p-4 border border-gray-150 rounded-xl">
            <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Email Branding Details</span>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Header Text" value={config.branding.emailHeaderLogo} onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, emailHeaderLogo: e.target.value } }))} className={inputClass} />
              <input type="text" placeholder="Footer Text" value={config.branding.emailFooterText} onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, emailFooterText: e.target.value } }))} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Right: Live Branding Preview */}
        <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 flex flex-col justify-center items-center">
          <div className="flex items-center gap-2.5 text-[10px] uppercase font-extrabold tracking-widest text-gray-400 mb-6">
            <Eye className="w-3.5 h-3.5" /> Live Login Portal Preview
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-xl space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-sm" style={{ backgroundColor: config.branding.primaryColor }}>EP</div>
                <span className="text-xs font-black text-gray-800 tracking-wider">
                  {config.branding.whiteLabelEnabled ? "Tenant App" : config.general.appName}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-gray-900">{config.branding.welcomeText || "Welcome"}</h4>
              <p className="text-[10px] text-gray-400 font-semibold">{config.branding.tagline || "Tagline here"}</p>
            </div>

            <div className="space-y-2">
              <div className="h-9 bg-gray-50 border border-gray-100 rounded-lg" />
              <div className="h-9 bg-gray-50 border border-gray-100 rounded-lg" />
            </div>

            <button type="button" className="w-full text-white text-[10px] font-black rounded-lg py-3 flex items-center justify-center gap-1 shadow-sm transition-all pointer-events-none" style={{ backgroundColor: config.branding.buttonColor }}>
              Sign In <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}