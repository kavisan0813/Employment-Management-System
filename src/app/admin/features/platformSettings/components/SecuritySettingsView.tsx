/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Key, Trash2 } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  triggerAlert: (msg: string, type?: "success" | "info" | "error") => void;
}

export function SecuritySettingsView({ config, setConfig, triggerAlert }: Props) {
  const [newIp, setNewIp] = useState("");
  const [newIpLabel, setNewIpLabel] = useState("");

  const updateSecurity = (key: keyof SystemConfig["security"], value: any) => {
    setConfig(prev => ({ ...prev, security: { ...prev.security, [key]: value } }));
  };

  const handleAddIp = () => {
    const cidrRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (!cidrRegex.test(newIp)) {
      triggerAlert("Invalid IP or CIDR format.", "error");
      return;
    }
    updateSecurity("ipWhitelist", [...config.security.ipWhitelist, { ip: newIp, label: newIpLabel || "Manual Override" }]);
    setNewIp(""); setNewIpLabel("");
    triggerAlert("IP range added to firewall.", "success");
  };

  const handleRemoveIp = (ip: string) => {
    updateSecurity("ipWhitelist", config.security.ipWhitelist.filter(i => i.ip !== ip));
    triggerAlert("IP range removed.", "info");
  };

  const inputClass = "w-full text-sm p-2.5 border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Credential Policies */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" /> Credential Policies
          </h3>
          
          <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
            <div className="space-y-1.5">
              <label className={labelClass}>Min Password Length</label>
              <select value={config.security.passwordMinLength} onChange={e => updateSecurity("passwordMinLength", Number(e.target.value))} className={inputClass}>
                <option value={8}>8 Characters</option>
                <option value={10}>10 Characters</option>
                <option value={12}>12 Characters (High Security)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input type="checkbox" checked={config.security.passwordRequireSpecial} onChange={e => updateSecurity("passwordRequireSpecial", e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                Require Special Character
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input type="checkbox" checked={config.security.passwordRequireUppercase} onChange={e => updateSecurity("passwordRequireUppercase", e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                Require Uppercase
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>MFA Enrollment Policy</label>
            <select value={config.security.mfaRequirement} onChange={e => updateSecurity("mfaRequirement", e.target.value)} className={inputClass}>
              <option value="none">Optional for all</option>
              <option value="admin">Enforce for Admins</option>
              <option value="all">Global MFA Enforcement</option>
            </select>
          </div>
        </div>

        {/* IP Whitelist */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-500" /> Firewall Boundaries
          </h3>

          <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="192.168.1.1/24" value={newIp} onChange={e => setNewIp(e.target.value)} className={inputClass} />
              <input type="text" placeholder="Office Location" value={newIpLabel} onChange={e => setNewIpLabel(e.target.value)} className={inputClass} />
            </div>
            <button onClick={handleAddIp} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors">
              Add IP Range
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm max-h-60 overflow-y-auto">
            {config.security.ipWhitelist.length === 0 ? (
              <p className="p-4 text-center text-xs text-gray-500">No exclusions defined.</p>
            ) : (
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-gray-100">
                  {config.security.ipWhitelist.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-medium text-indigo-700">{item.ip}</td>
                      <td className="p-3 text-gray-600">{item.label}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleRemoveIp(item.ip)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}