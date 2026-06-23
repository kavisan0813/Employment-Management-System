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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Branding form inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Theme Palette customization</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 block font-bold">PRIMARY</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.branding.primaryColor}
                    onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, primaryColor: e.target.value } }))}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={config.branding.primaryColor}
                    onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, primaryColor: e.target.value } }))}
                    className="w-full text-[11px] font-mono p-1 border border-gray-200 rounded outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 block font-bold">SECONDARY</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.branding.secondaryColor}
                    onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, secondaryColor: e.target.value } }))}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={config.branding.secondaryColor}
                    onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, secondaryColor: e.target.value } }))}
                    className="w-full text-[11px] font-mono p-1 border border-gray-200 rounded outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 block font-bold">BUTTONS</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.branding.buttonColor}
                    onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, buttonColor: e.target.value } }))}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={config.branding.buttonColor}
                    onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, buttonColor: e.target.value } }))}
                    className="w-full text-[11px] font-mono p-1 border border-gray-200 rounded outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Welcome Header (Login screen)</label>
            <input
              type="text"
              value={config.branding.welcomeText}
              onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, welcomeText: e.target.value } }))}
              className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Welcome Tagline</label>
            <input
              type="text"
              value={config.branding.tagline}
              onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, tagline: e.target.value } }))}
              className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">System logo & White label</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.branding.whiteLabelEnabled}
                  onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, whiteLabelEnabled: e.target.checked } }))}
                  className="w-4 h-4 rounded cursor-pointer accent-indigo-650"
                />
                Enable White-Labeling (Tenant logo override support)
              </label>
            </div>
          </div>

          <div className="space-y-1.5 bg-gray-50 p-4 border border-gray-150 rounded-xl">
            <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-2">Email Branding Details</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 block font-bold">Email Header text</span>
                <input
                  type="text"
                  value={config.branding.emailHeaderLogo}
                  onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, emailHeaderLogo: e.target.value } }))}
                  className="w-full text-[11px] font-bold p-2 border border-gray-200 rounded"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 block font-bold">Email Footer Text</span>
                <input
                  type="text"
                  value={config.branding.emailFooterText}
                  onChange={e => setConfig(p => ({ ...p, branding: { ...p.branding, emailFooterText: e.target.value } }))}
                  className="w-full text-[11px] font-bold p-2 border border-gray-200 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live branding login portal mock rendering */}
        <div className="bg-gray-100 rounded-2xl p-5 border border-gray-200 flex flex-col justify-center items-center space-y-4">
          <div className="flex items-center gap-2.5 text-[10px] uppercase font-extrabold tracking-widest text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            Live Login Portal Preview Mock
          </div>
          
          {/* Virtual Login Box */}
          <div className="bg-white border border-gray-250 rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-xs"
                  style={{ backgroundColor: config.branding.primaryColor }}
                >
                  EP
                </div>
                <span className="text-xs font-black text-gray-800 tracking-wider">
                  {config.branding.whiteLabelEnabled ? "Tenant App" : config.general.appName}
                </span>
              </div>
              <span className="text-[8px] uppercase tracking-wider font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                v2.0.4
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-black text-gray-900 leading-tight">
                {config.branding.welcomeText || "Welcome to Dashboard"}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                {config.branding.tagline || "The Consolidated Enterprise HRMS Solution"}
              </p>
            </div>

            {/* Visual Form Mocks */}
            <div className="space-y-2">
              <div className="h-8 bg-gray-50 border border-gray-150 rounded-lg text-[9px] flex items-center px-3 text-gray-400 font-semibold select-none">
                work.email@corp.com
              </div>
              <div className="h-8 bg-gray-50 border border-gray-150 rounded-lg text-[9px] flex items-center px-3 text-gray-400 font-semibold select-none">
                ••••••••
              </div>
            </div>

            <button
              type="button"
              className="w-full text-white text-[10px] font-black rounded-lg py-2.5 flex items-center justify-center gap-1 shadow-sm transition-all select-none pointer-events-none"
              style={{ backgroundColor: config.branding.buttonColor }}
            >
              Sign In
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
