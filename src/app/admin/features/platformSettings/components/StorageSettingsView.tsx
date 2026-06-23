/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HardDrive } from "lucide-react";
import { SystemConfig } from "../types/platformSettings.types";

interface Props {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}

export function StorageSettingsView({ config, setConfig }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 font-semibold text-xs text-gray-700">
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Storage Provider</label>
            <select
              value={config.storage.provider}
              onChange={e => setConfig(p => ({ ...p, storage: { ...p.storage, provider: e.target.value as any } }))}
              className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white cursor-pointer"
            >
              <option value="local">Local Server Disk storage</option>
              <option value="s3">AWS S3 Relational Cloud Buckets</option>
              <option value="azure">Azure Blob Binary Storage Container</option>
              <option value="gcs">Google Cloud Object Storage Bucket</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Maximum Upload File Size</label>
            <select
              value={config.storage.maxUploadSizeMb}
              onChange={e => setConfig(p => ({ ...p, storage: { ...p.storage, maxUploadSizeMb: Number(e.target.value) } }))}
              className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer"
            >
              <option value={5}>5 MB (Standard resumes/documents)</option>
              <option value={10}>10 MB (Default size)</option>
              <option value={20}>20 MB (Allows media clips)</option>
              <option value={50}>50 MB (High capacity limits)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Default Per-Tenant Storage Limit cap</label>
            <select
              value={config.storage.tenantStorageLimitGb}
              onChange={e => setConfig(p => ({ ...p, storage: { ...p.storage, tenantStorageLimitGb: Number(e.target.value) } }))}
              className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer"
            >
              <option value={10}>10 GB Storage capacity limit</option>
              <option value={50}>50 GB Storage capacity limit</option>
              <option value={100}>100 GB (Default tier limit)</option>
              <option value={500}>500 GB (Enterprise capacity tier)</option>
            </select>
          </div>

        </div>

        <div className="bg-indigo-50/20 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-indigo-650" />
              Platform File Limits visual Allocation
            </h4>
            <p className="text-[10px] text-indigo-500 font-semibold mt-1">
              Evaluates how local and cloud partition sizes display resource allocation boundaries:
            </p>
          </div>

          <div className="space-y-4 bg-white border border-indigo-100/60 p-4 rounded-xl shadow-xs font-semibold">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-[10px] text-gray-400">
                <span>MOCK STORAGE CAP INDEX</span>
                <span className="text-indigo-900 font-mono">32.4 GB / {config.storage.tenantStorageLimitGb} GB Allocated</span>
              </div>
              
              {/* Visual progress bar */}
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(32.4 / config.storage.tenantStorageLimitGb) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] text-gray-500 leading-normal font-semibold space-y-1">
              <div>&bull; Maximum Upload: <strong className="text-gray-900">{config.storage.maxUploadSizeMb} MB</strong> per file</div>
              <div>&bull; Object Bucket: <strong className="text-indigo-900 font-mono">ems-hrms-storage-{config.storage.provider}-bucket</strong></div>
            </div>
          </div>

          <div className="p-3 bg-white border border-gray-150 rounded-xl text-[10px] text-gray-500 leading-relaxed font-semibold">
            SaaS organizations exceeding {config.storage.tenantStorageLimitGb} GB allocations are automatically blocked from uploading files until administrators upgrade subscription tiers.
          </div>
        </div>

      </div>
    </div>
  );
}
