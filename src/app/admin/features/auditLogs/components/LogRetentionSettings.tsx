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
      onSavePolicy({ retentionDays, archiveEnabled, immutableLock, complianceStandard });
      setSaving(false);
    }, 600);
  };

  const handleImmutableLockToggle = (checked: boolean) => {
    if (checked) {
      if (window.confirm("WARNING: Enabling SOC2 Compliance Lock (WORM) is IRREVERSIBLE. Logs will become immutable. Proceed?")) {
        setImmutableLock(true);
      }
    } else if (policy.immutableLock) {
      alert("COMPLIANCE BLOCK: SOC2 WORM lock is enforced and cannot be disabled.");
    } else {
      setImmutableLock(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-500" /> Compliance & Retention
          </h3>
          <p className="text-xs text-gray-500 mt-1">Configure regulatory log storage and audit ledger behaviors.</p>
        </div>
        <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
          SOC2 Ready
        </span>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 uppercase">Log Retention Horizon</label>
          <select
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-700 px-3 py-2 rounded-lg outline-none focus:border-indigo-400"
          >
            <option value={90}>90 Days (Standard Sandbox)</option>
            <option value={365}>1 Year (SOC2 Compliance)</option>
            <option value={2555}>7 Years (Audit Compliance)</option>
            <option value={99999}>Forever (No truncation)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 uppercase">Regulatory Framework</label>
          <select
            value={complianceStandard}
            onChange={(e) => setComplianceStandard(e.target.value as any)}
            className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-700 px-3 py-2 rounded-lg outline-none focus:border-indigo-400"
          >
            <option value="SOC2">SOC2 Type II (Security & Access)</option>
            <option value="ISO27018">ISO 27018 (Cloud Privacy)</option>
            <option value="GDPR">GDPR Article 30</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex items-start justify-between gap-4 pt-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Archive className="w-4 h-4 text-indigo-500" /> Automated Cold Archive
              </label>
              <p className="text-xs text-gray-500 max-w-sm">Archive pruned log segments to secure, read-only storage.</p>
            </div>
            <input type="checkbox" checked={archiveEnabled} onChange={(e) => setArchiveEnabled(e.target.checked)} className="toggle-checkbox" />
          </div>

          <div className="flex items-start justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-500" /> SOC2 Immutable Ledger (WORM)
              </label>
              <p className="text-xs text-gray-500 max-w-sm">Prevent all administrative log deletion. This action is irreversible.</p>
            </div>
            <input type="checkbox" checked={immutableLock} onChange={(e) => handleImmutableLockToggle(e.target.checked)} className="toggle-checkbox" />
          </div>
        </div>

        {immutableLock && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="text-rose-800 font-medium">Compliance Mode Active: Platform ledgers are set to WORM. Administrative truncation is physically blocked.</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Commit Policies"}
        </button>
      </div>
    </div>
  );
}