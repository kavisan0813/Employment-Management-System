import React from "react";
import { Key } from "lucide-react";

export function AccessControlSettings() {
  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600 font-semibold" />
            Access Control Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Global security policies and authentication requirements.
          </p>
        </div>
        <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer">
          Save Policies
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 font-semibold">
            Authentication Policies
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 font-semibold">Require MFA</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                Force all users to configure Multi-Factor Authentication.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 font-semibold">Google SSO</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                Allow logins using Google Workspace accounts.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 font-semibold">Microsoft SSO</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                Allow logins using Microsoft Azure AD.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 font-semibold">
            Session & IP Restrictions
          </h3>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-semibold">
              Session Timeout (Minutes)
            </label>
            <input
              type="number"
              defaultValue={60}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-indigo-400"
            />
            <p className="text-[10px] text-gray-500 mt-1 font-semibold">
              Users will be logged out after this period of inactivity.
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-semibold">
              Global IP Allowlist
            </label>
            <textarea
              rows={3}
              placeholder="e.g. 192.168.1.0/24"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900 outline-none focus:border-indigo-400"
            ></textarea>
            <p className="text-[10px] text-gray-500 mt-1 font-semibold">
              Leave blank to allow access from any IP.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
