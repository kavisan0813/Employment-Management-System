/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export function GeneralSettingsView({ config, setConfig }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Application Name</label>
          <input
            type="text"
            value={config.general.appName}
            onChange={e => setConfig(p => ({ ...p, general: { ...p.general, appName: e.target.value } }))}
            className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Company Name</label>
          <input
            type="text"
            value={config.general.companyName}
            onChange={e => setConfig(p => ({ ...p, general: { ...p.general, companyName: e.target.value } }))}
            className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Platform Website</label>
          <input
            type="text"
            value={config.general.website}
            onChange={e => setConfig(p => ({ ...p, general: { ...p.general, website: e.target.value } }))}
            className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Support Email</label>
          <input
            type="email"
            value={config.general.supportEmail}
            onChange={e => setConfig(p => ({ ...p, general: { ...p.general, supportEmail: e.target.value } }))}
            className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Support Phone / Mobile</label>
          <input
            type="text"
            value={config.general.supportPhone}
            onChange={e => setConfig(p => ({ ...p, general: { ...p.general, supportPhone: e.target.value } }))}
            className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Default Employee Status</label>
          <select
            value={config.general.defaultEmployeeStatus}
            onChange={e => setConfig(p => ({ ...p, general: { ...p.general, defaultEmployeeStatus: e.target.value as any } }))}
            className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Onboarding">Onboarding</option>
          </select>
        </div>
      </div>

      <hr className="border-gray-150" />

      <div className="bg-indigo-50/20 p-4 border border-indigo-100 rounded-2xl space-y-4">
        <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wide">System Session & Authentication Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">User Session Timeout</label>
            <select
              value={config.general.sessionTimeout}
              onChange={e => setConfig(p => ({ ...p, general: { ...p.general, sessionTimeout: Number(e.target.value) } }))}
              className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white outline-none cursor-pointer"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes</option>
              <option value={120}>120 Minutes</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Password Expiry Cycle</label>
            <select
              value={config.general.passwordExpiryDays}
              onChange={e => setConfig(p => ({ ...p, general: { ...p.general, passwordExpiryDays: Number(e.target.value) } }))}
              className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white outline-none cursor-pointer"
            >
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
              <option value={180}>180 Days</option>
              <option value={365}>Never Expire</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Max Login Attempts</label>
            <select
              value={config.general.maxLoginAttempts}
              onChange={e => setConfig(p => ({ ...p, general: { ...p.general, maxLoginAttempts: Number(e.target.value) } }))}
              className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white outline-none cursor-pointer"
            >
              <option value={3}>3 Attempts</option>
              <option value={5}>5 Attempts</option>
              <option value={10}>10 Attempts</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
