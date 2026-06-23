/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Smartphone, Bell, Save, Info } from "lucide-react";
import { NotificationSettings } from "../types/notifications.types";

interface Props {
  settings: NotificationSettings;
  onSaveSettings: (settings: NotificationSettings) => void;
}

export function NotificationSettingsView({ settings, onSaveSettings }: Props) {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>({ ...settings });

  const toggleSetting = (category: keyof NotificationSettings, channel: "email" | "sms" | "push") => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel]
      }
    }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
  };

  return (
    <div className="space-y-6">
      
      {/* Settings Grid Matrix Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        
        {/* Table representation */}
        <table className="w-full text-left border-collapse text-xs font-semibold">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-450 uppercase text-[10px] tracking-wider font-extrabold select-none">
              <th className="px-6 py-4">Alert Trigger Category</th>
              <th className="px-6 py-4 text-center">
                <span className="flex items-center justify-center gap-1"><Mail className="w-3.5 h-3.5" /> Email Alerts</span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="flex items-center justify-center gap-1"><Smartphone className="w-3.5 h-3.5" /> SMS Alerts</span>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="flex items-center justify-center gap-1"><Bell className="w-3.5 h-3.5" /> Push Alerts</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            
            {/* Row 1: System Alerts */}
            <tr>
              <td className="px-6 py-4">
                <div className="font-extrabold text-gray-900 leading-snug">System & Server Health Alerts</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-normal">High CPU loads, database down, S3 storage warnings, SMTP delivery errors.</div>
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.systemAlerts.email}
                  onChange={() => toggleSetting("systemAlerts", "email")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.systemAlerts.sms}
                  onChange={() => toggleSetting("systemAlerts", "sms")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.systemAlerts.push}
                  onChange={() => toggleSetting("systemAlerts", "push")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
            </tr>

            {/* Row 2: Expiry Alerts */}
            <tr>
              <td className="px-6 py-4">
                <div className="font-extrabold text-gray-900 leading-snug">SaaS Tenant Subscription Expiry Alerts</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-normal">Triggers reminders at 30, 15, 7, and 1 days left before account freezing actions.</div>
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.subscriptionExpiry.email}
                  onChange={() => toggleSetting("subscriptionExpiry", "email")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.subscriptionExpiry.sms}
                  onChange={() => toggleSetting("subscriptionExpiry", "sms")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.subscriptionExpiry.push}
                  onChange={() => toggleSetting("subscriptionExpiry", "push")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
            </tr>

            {/* Row 3: Failed Payments */}
            <tr>
              <td className="px-6 py-4">
                <div className="font-extrabold text-gray-900 leading-snug">Failed Payments & Invoice Issues</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-normal">Card charge timeout limits, insufficient balance rejections, expired card notices.</div>
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.failedPayments.email}
                  onChange={() => toggleSetting("failedPayments", "email")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.failedPayments.sms}
                  onChange={() => toggleSetting("failedPayments", "sms")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.failedPayments.push}
                  onChange={() => toggleSetting("failedPayments", "push")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
            </tr>

            {/* Row 4: Security Alerts */}
            <tr>
              <td className="px-6 py-4">
                <div className="font-extrabold text-gray-900 leading-snug">Security Threats & Brute Force Logins</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-normal">Impossible geological location changes, password resets, unauthorized group permissions overrides.</div>
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.securityAlerts.email}
                  onChange={() => toggleSetting("securityAlerts", "email")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.securityAlerts.sms}
                  onChange={() => toggleSetting("securityAlerts", "sms")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={localSettings.securityAlerts.push}
                  onChange={() => toggleSetting("securityAlerts", "push")}
                  className="w-4.5 h-4.5 rounded cursor-pointer accent-indigo-650"
                />
              </td>
            </tr>

          </tbody>
        </table>

        {/* Footer save bar */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-[10px] text-gray-450 font-bold flex items-center gap-1 select-none">
            <Info className="w-3.5 h-3.5 text-indigo-500" /> Configurations apply platform-wide across active relay engines.
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-sm shadow-indigo-600/10"
          >
            <Save className="w-3.5 h-3.5" /> Save Dispatch Channels
          </button>
        </div>

      </div>

    </div>
  );
}
