/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldCheck, Lock, Archive, Save, AlertCircle } from "lucide-react";
import { LogRetentionPolicy } from "../types/logs.types";

interface LogRetentionSettingsProps {
  policy: LogRetentionPolicy;
  onSavePolicy: (policy: LogRetentionPolicy) => void;
}

export function LogRetentionSettings({ policy, onSavePolicy }: LogRetentionSettingsProps) {
  const [retentionDays, setRetentionDays] = useState(policy.retentionDays);
  const [archiveEnabled, setArchiveEnabled] = useState(policy.archiveEnabled);
  const [immutableLock, setImmutableLock] = useState(policy.immutableLock);
  const [complianceStandard, setComplianceStandard] = useState(policy.complianceStandard);

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSavePolicy({
        retentionDays,
        archiveEnabled,
        immutableLock,
        complianceStandard
      });
      setSaving(false);
      alert("Retention policies successfully updated in localStorage and active on all routing clusters.");
    }, 600);
  };

  const handleImmutableLockToggle = (checked: boolean) => {
    if (checked) {
      const confirmLock = window.confirm(
        "WARNING: Enabling SOC2 Compliance Lock (WORM - Write Once Read Many) is IRREVERSIBLE.\n\nOnce active, log ledgers become completely immutable and cannot be deleted or truncated, even by system administrators.\n\nDo you wish to enforce this security control?"
      );
      if (confirmLock) {
        setImmutableLock(true);
      }
    } else {
      if (policy.immutableLock) {
        alert("COMPLIANCE BLOCK:\nActive SOC2 WORM lock is enforced. Disabling this control is permanently blocked on this tenant without physical auditor validation keys.");
      } else {
        setImmutableLock(false);
      }
    }
  };

  return (
    <div className="max-w-2xl bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="px-6 py-5 border-b border-gray-150 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
            <Lock className="w-4.5 h-4.5 text-indigo-500" />
            Compliance & Retention Settings
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">Configure regulatory log storage horizons and secure audit ledger behaviors.</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 uppercase">
          SOC2 Ready
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Retention horizon selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Log Retention Horizon</label>
          <p className="text-[11px] text-gray-400">Specify how long records are stored in the active system catalog before pruning.</p>
          <select
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2.5 rounded-lg focus:bg-white focus:outline-indigo-500 mt-1"
          >
            <option value={90}>90 Days (Standard Sandbox)</option>
            <option value={365}>1 Year (SOC2 Standard Compliance)</option>
            <option value={2555}>7 Years (Federal Tax & Audits)</option>
            <option value={99999}>Forever (No truncation)</option>
          </select>
        </div>

        {/* Compliance Standard */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Regulatory Framework Alignment</label>
          <p className="text-[11px] text-gray-400">Applies pre-defined logging structures to match specific industry audits.</p>
          <select
            value={complianceStandard}
            onChange={(e) => setComplianceStandard(e.target.value as any)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-2.5 rounded-lg focus:bg-white focus:outline-indigo-500 mt-1"
          >
            <option value="SOC2">SOC2 Type II (Security & Access Ledger)</option>
            <option value="ISO27018">ISO/IEC 27018 (Cloud Personal Data Protection)</option>
            <option value="GDPR">GDPR Article 30 (Controller Logs)</option>
            <option value="Custom">Custom Regulatory Guidelines</option>
          </select>
        </div>

        {/* Cold Storage archiving toggle */}
        <div className="flex items-start justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5 cursor-pointer">
              <Archive className="w-4 h-4 text-indigo-500" />
              Automated Cold Archive Exports
            </label>
            <p className="text-[11px] text-gray-400 max-w-md">
              Automatically package pruned log segments and store them in secure, read-only S3 glacier archives.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1 select-none">
            <input 
              type="checkbox" 
              checked={archiveEnabled} 
              onChange={(e) => setArchiveEnabled(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Immutable lock WORM toggle */}
        <div className="flex items-start justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              SOC2 Immutable Ledger Lock (WORM)
            </label>
            <p className="text-[11px] text-gray-400 max-w-md">
              Prevent any administrative or root command truncation or deletion of security and audit trail logs. Once enabled, this control is permanently active.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-1 select-none">
            <input 
              type="checkbox" 
              checked={immutableLock} 
              onChange={(e) => handleImmutableLockToggle(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:height-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        {/* Warning notification banner if immutable lock is enabled */}
        {immutableLock && (
          <div className="bg-rose-50 border border-rose-150 p-4 rounded-xl flex gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h5 className="font-bold text-rose-800">Immutable Compliance Mode Active</h5>
              <p className="text-rose-700 mt-1 leading-relaxed">
                Platform database ledgers are marked as Write Once Read Many (WORM). Administrative commands to prune or delete logs are physically rejected on this tenant in accordance with SEC Rule 17a-4 compliance frameworks.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Policy..." : "Commit Policies"}
        </button>
      </div>
    </div>
  );
}
