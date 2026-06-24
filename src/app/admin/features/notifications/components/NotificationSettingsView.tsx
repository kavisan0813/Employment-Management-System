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
      [category]: { ...prev[category], [channel]: !prev[category][channel] }
    }));
  };

  const categories = [
    { id: "systemAlerts", label: "System & Server Health", desc: "CPU loads, database status, and delivery errors." },
    { id: "subscriptionExpiry", label: "Subscription Expiry", desc: "Renewal reminders and access freeze warnings." },
    { id: "failedPayments", label: "Failed Payments", desc: "Billing timeouts and card rejections." },
    { id: "securityAlerts", label: "Security & MFA", desc: "Unauthorized logins and permission changes." }
  ] as const;

  return (
    <div className="space-y-6 font-semibold">
      
      {/* Settings Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-indigo-50/50 border-b border-indigo-100 text-indigo-800 uppercase text-[10px] tracking-wider">
              <th className="px-6 py-4">Alert Trigger Category</th>
              <th className="px-6 py-4 text-center"><span className="flex items-center justify-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span></th>
              <th className="px-6 py-4 text-center"><span className="flex items-center justify-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> SMS</span></th>
              <th className="px-6 py-4 text-center"><span className="flex items-center justify-center gap-1.5"><Bell className="w-3.5 h-3.5" /> Push</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-indigo-50/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">{cat.label}</div>
                  <div className="text-[11px] text-gray-500 font-medium mt-0.5">{cat.desc}</div>
                </td>
                {(["email", "sms", "push"] as const).map((channel) => (
                  <td key={channel} className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={localSettings[cat.id][channel]}
                      onChange={() => toggleSetting(cat.id, channel)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500" /> Configurations apply platform-wide across all relay engines.
          </span>
          <button
            onClick={() => onSaveSettings(localSettings)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" /> Save Dispatch Channels
          </button>
        </div>
      </div>
    </div>
  );
}