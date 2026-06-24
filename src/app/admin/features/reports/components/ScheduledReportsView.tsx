/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, CalendarRange, Trash2 } from "lucide-react";
import { ReportsState } from "../types/reports.types";

interface ScheduledReportsViewProps {
  state: ReportsState;
  schedTemplateId: string;
  setSchedTemplateId: (val: string) => void;
  schedFrequency: "Daily" | "Weekly" | "Monthly";
  setSchedFrequency: (val: "Daily" | "Weekly" | "Monthly") => void;
  schedEmail: string;
  setSchedEmail: (val: string) => void;
  handleCreateSchedule: (e: React.FormEvent) => void;
  handleToggleSchedule: (id: string) => void;
  handleDeleteSchedule: (id: string) => void;
}

export function ScheduledReportsView({
  state, schedTemplateId, setSchedTemplateId, schedFrequency, 
  setSchedFrequency, schedEmail, setSchedEmail, handleCreateSchedule, 
  handleToggleSchedule, handleDeleteSchedule
}: ScheduledReportsViewProps) {
  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-indigo-600" />
            Scheduled Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Automate and manage recurring report dispatch schedules.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      {/* Create schedule form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-1.5">
          <CalendarRange className="w-4 h-4 text-indigo-500" /> Configure Automated Report Schedule
        </h4>
        
        <form onSubmit={handleCreateSchedule} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Report Template</label>
            <select
              value={schedTemplateId}
              onChange={e => setSchedTemplateId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
            >
              {state.templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Frequency</label>
            <select
              value={schedFrequency}
              onChange={e => setSchedFrequency(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="Daily">Daily Dispatch</option>
              <option value="Weekly">Weekly Dispatch</option>
              <option value="Monthly">Monthly Dispatch</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Recipient Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="ceo@ems.io"
                value={schedEmail}
                onChange={e => setSchedEmail(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
              >
                Schedule
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Active schedules list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Automated Schedules</span>
        </div>

        {state.schedules.length === 0 ? (
          <div className="p-10 text-center text-sm font-medium text-gray-500">
            No active schedules configured.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-4">Report Template</th>
                  <th className="p-4">Frequency</th>
                  <th className="p-4 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Recipient</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {state.schedules.map(sch => (
                  <tr key={sch.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-900">{sch.reportName}</td>
                    <td className="p-4 text-gray-600 font-medium">{sch.frequency}</td>
                    <td className="p-4 text-gray-700 font-medium font-mono">{sch.email}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleToggleSchedule(sch.id)} className="cursor-pointer">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${sch.active ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                          {sch.active ? "Active" : "Suspended"}
                        </span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteSchedule(sch.id)} className="text-gray-400 hover:text-rose-600 p-1 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
      </div>
    
  );
}