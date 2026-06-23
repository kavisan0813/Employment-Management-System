/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Shield, Key } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  triggerAlert: (msg: string, type?: "success" | "info" | "error") => void;
}

export function SecuritySettingsView({ config, setConfig, triggerAlert }: Props) {
  const [newIp, setNewIp] = useState("");
  const [newIpLabel, setNewIpLabel] = useState("");

  const handleAddIp = () => {
    if (!newIp) return;
    
    // CIDR pattern validation check
    const cidrRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    if (!cidrRegex.test(newIp)) {
      triggerAlert("Invalid IP address or CIDR notation format.", "error");
      return;
    }

    const newItem = { ip: newIp, label: newIpLabel || "Manual Admin Override" };
    setConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        ipWhitelist: [...prev.security.ipWhitelist, newItem]
      }
    }));
    setNewIp("");
    setNewIpLabel("");
    triggerAlert("IP range firewall exclusion added to list.", "info");
  };

  const handleRemoveIp = (ipToRemove: string) => {
    setConfig(prev => ({
      ...prev,
      security: {
        ...prev.security,
        ipWhitelist: prev.security.ipWhitelist.filter(i => i.ip !== ipToRemove)
      }
    }));
    triggerAlert("IP range firewall exclusion removed.", "info");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: password guidelines & policies */}
        <div className="space-y-4 text-xs font-semibold text-gray-700">
          <h3 className="text-xs font-extrabold text-gray-905 uppercase tracking-wide flex items-center gap-1">
            <Shield className="w-4 h-4 text-indigo-600" />
            Credential Strength Guidelines
          </h3>
          
          <div className="space-y-3 p-4 bg-gray-50 border border-gray-150 rounded-xl">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Minimum Password Character Length</label>
              <select
                value={config.security.passwordMinLength}
                onChange={e => setConfig(p => ({ ...p, security: { ...p.security, passwordMinLength: Number(e.target.value) } }))}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none cursor-pointer"
              >
                <option value={8}>8 Characters Minimum</option>
                <option value={10}>10 Characters Minimum</option>
                <option value={12}>12 Characters (Highly Secure)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.security.passwordRequireSpecial}
                  onChange={e => setConfig(p => ({ ...p, security: { ...p.security, passwordRequireSpecial: e.target.checked } }))}
                  className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
                />
                Require Special Character (e.g. @, #, $, !)
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.security.passwordRequireUppercase}
                  onChange={e => setConfig(p => ({ ...p, security: { ...p.security, passwordRequireUppercase: e.target.checked } }))}
                  className="w-4 h-4 rounded accent-indigo-650 cursor-pointer"
                />
                Require Uppercase Character (A-Z)
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">MFA Policy Enrollment</label>
            <select
              value={config.security.mfaRequirement}
              onChange={e => setConfig(p => ({ ...p, security: { ...p.security, mfaRequirement: e.target.value as any } }))}
              className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white cursor-pointer"
            >
              <option value="none">Optional enrollment for all accounts</option>
              <option value="admin">Enforce MFA strictly for Admin accounts only</option>
              <option value="all">Enforce MFA globally for all user accounts</option>
            </select>
          </div>
        </div>

        {/* Right: IP whitelist logs CIDR whitelist list */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-1">
            <Key className="w-4 h-4 text-indigo-650" />
            Firewall Security Boundaries (IP Exclusion Whitelist)
          </h3>
          
          <div className="p-4 border border-gray-205 bg-gray-50/50 rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <input
                type="text"
                placeholder="CIDR IP Block (e.g. 192.168.1.1/24)"
                value={newIp}
                onChange={e => setNewIp(e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded-lg font-mono text-[11px]"
              />
              <input
                type="text"
                placeholder="Description / Location Label"
                value={newIpLabel}
                onChange={e => setNewIpLabel(e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded-lg text-[11px]"
              />
            </div>
            <button
              type="button"
              onClick={handleAddIp}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase cursor-pointer"
            >
              Add CIDR Excluded segment
            </button>
          </div>

          <div className="border border-gray-150 rounded-xl overflow-hidden shadow-xs divide-y divide-gray-100 max-h-48 overflow-y-auto">
            {config.security.ipWhitelist.map((item, idx) => (
              <div key={idx} className="p-2.5 flex justify-between items-center bg-white hover:bg-gray-50 font-semibold text-[11px]">
                <div>
                  <code className="font-mono bg-gray-100 text-indigo-900 px-1 py-0.5 rounded text-[10px] font-bold">
                    {item.ip}
                  </code>
                  <span className="text-gray-400 pl-2 font-medium">{item.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveIp(item.ip)}
                  className="p-1 hover:bg-rose-50 rounded text-rose-600 font-bold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
            {config.security.ipWhitelist.length === 0 && (
              <div className="p-4 text-center text-gray-450 text-xs">No IP exclusion whitelists defined. Portal accessible from any network origin.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
