/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, Smartphone, Bell, FileText, Coins, Shield } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export function NotificationSettingsView({ config, setConfig }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Global notification channel toggles */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">Global Dispatch Channels</h3>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            Enable or disable transport layers globally across the entire platform ecosystem:
          </p>

          <div className="space-y-3 font-semibold text-xs text-gray-700 bg-gray-55/50 p-4 border border-gray-150 rounded-xl">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-650" />
                Email Dispatch Routing
              </span>
              <input
                type="checkbox"
                checked={config.notifications.enableEmail}
                onChange={e => setConfig(p => ({ ...p, notifications: { ...p.notifications, enableEmail: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
              />
            </label>
            <hr className="border-gray-200/50" />
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-650" />
                SMS Gateway Dispatch (Twilio)
              </span>
              <input
                type="checkbox"
                checked={config.notifications.enableSms}
                onChange={e => setConfig(p => ({ ...p, notifications: { ...p.notifications, enableSms: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
              />
            </label>
            <hr className="border-gray-200/50" />
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-650" />
                Push Web Browser Notifications
              </span>
              <input
                type="checkbox"
                checked={config.notifications.enablePush}
                onChange={e => setConfig(p => ({ ...p, notifications: { ...p.notifications, enablePush: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Right: Business Event Toggles */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">System Trigger Events</h3>
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            Define which HRMS core operations dispatch notification alerts downstream:
          </p>

          <div className="space-y-3 font-semibold text-xs text-gray-700 bg-gray-55/50 p-4 border border-gray-150 rounded-xl">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-650" />
                Leave Request & Approvals
              </span>
              <input
                type="checkbox"
                checked={config.notifications.notifyOnLeave}
                onChange={e => setConfig(p => ({ ...p, notifications: { ...p.notifications, notifyOnLeave: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
              />
            </label>
            <hr className="border-gray-200/50" />
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-indigo-650" />
                Payroll Generation & Cutoffs
              </span>
              <input
                type="checkbox"
                checked={config.notifications.notifyOnPayroll}
                onChange={e => setConfig(p => ({ ...p, notifications: { ...p.notifications, notifyOnPayroll: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
              />
            </label>
            <hr className="border-gray-200/50" />
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-650" />
                Security Audits & Suspicious Logs
              </span>
              <input
                type="checkbox"
                checked={config.notifications.notifyOnSecurityAlert}
                onChange={e => setConfig(p => ({ ...p, notifications: { ...p.notifications, notifyOnSecurityAlert: e.target.checked } }))}
                className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
              />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
