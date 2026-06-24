/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HardDrive, Database, ShieldCheck } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export function StorageSettingsView({ config, setConfig }: Props) {
  const updateStorage = (key: keyof SystemConfig["storage"], value: any) => {
    setConfig(prev => ({ ...prev, storage: { ...prev.storage, [key]: value } }));
  };

  const inputClass = "w-full text-sm p-2.5 border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className={labelClass}>Storage Provider</label>
            <select value={config.storage.provider} onChange={e => updateStorage("provider", e.target.value)} className={inputClass}>
              <option value="local">Local Server Disk</option>
              <option value="s3">AWS S3 (Cloud Buckets)</option>
              <option value="azure">Azure Blob Storage</option>
              <option value="gcs">Google Cloud Storage</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Max Upload File Size (MB)</label>
            <select value={config.storage.maxUploadSizeMb} onChange={e => updateStorage("maxUploadSizeMb", Number(e.target.value))} className={inputClass}>
              <option value={5}>5 MB</option>
              <option value={10}>10 MB</option>
              <option value={20}>20 MB</option>
              <option value={50}>50 MB</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Tenant Storage Limit (GB)</label>
            <select value={config.storage.tenantStorageLimitGb} onChange={e => updateStorage("tenantStorageLimitGb", Number(e.target.value))} className={inputClass}>
              <option value={10}>10 GB</option>
              <option value={50}>50 GB</option>
              <option value={100}>100 GB</option>
              <option value={500}>500 GB</option>
            </select>
          </div>
        </div>

        {/* Right: Storage Allocation Preview */}
        <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-6 space-y-6">
          <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4" /> Allocation Overview
          </h4>

          <div className="space-y-4 bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase">
                <span>Usage Monitor</span>
                <span className="font-mono text-indigo-700">32.4 GB / {config.storage.tenantStorageLimitGb} GB</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(32.4 / config.storage.tenantStorageLimitGb) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" /> 
              Bucket: <span className="font-mono font-semibold text-gray-900">ems-{config.storage.provider}-bucket</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 
              Status: <span className="font-semibold text-emerald-700">Storage Partition Active</span>
            </div>
          </div>
          
          <div className="p-4 bg-indigo-100/50 rounded-xl text-xs font-medium text-indigo-900">
            <strong>Capacity Alert:</strong> Organizations exceeding their {config.storage.tenantStorageLimitGb} GB limit will trigger an automatic upload block.
          </div>
        </div>
      </div>
    </div>
  );
}