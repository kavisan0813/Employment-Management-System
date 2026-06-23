/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Clock, Mail, ToggleLeft, ToggleRight, Trash2, CalendarRange } from "lucide-react";
import { ReportsState, ReportSchedule } from "../types/reports.types";

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
  state,
  schedTemplateId,
  setSchedTemplateId,
  schedFrequency,
  setSchedFrequency,
  schedEmail,
  setSchedEmail,
  handleCreateSchedule,
  handleToggleSchedule,
  handleDeleteSchedule
}: ScheduledReportsViewProps) {
  return (
    <div className="space-y-6">
      {/* Create schedule form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-1.5">
          <CalendarRange className="w-4 h-4 text-indigo-500" /> Configure Automated Email Report Schedule
        </h4>
        
        <form onSubmit={handleCreateSchedule} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Report Template</label>
            <select
              value={schedTemplateId}
              onChange={e => setSchedTemplateId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
            >
              {state.templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Frequency</label>
            <select
              value={schedFrequency}
              onChange={e => setSchedFrequency(e.target.value as any)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
            >
              <option value="Daily">Daily Dispatch</option>
              <option value="Weekly">Weekly Dispatch</option>
              <option value="Monthly">Monthly Dispatch</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Recipient Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="ceo@ems.io"
                value={schedEmail}
                onChange={e => setSchedEmail(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg px-4 py-2 text-xs font-bold cursor-pointer border-none transition-all shadow-sm"
              >
                Schedule Task
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Active schedules list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-150">
          <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">Active Automated Schedules</span>
        </div>

        {state.schedules.length === 0 ? (
          <div className="p-10 text-center text-xs text-gray-400 font-bold">
            No active schedules configured. Use the builder form above to create automated dispatch tasks.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-150 bg-gray-50/50">
                  <th className="p-3.5 font-bold uppercase tracking-wider">Report Template Target</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Frequency</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Recipient Address
                  </th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-center">Status</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {state.schedules.map(sch => (
                  <tr key={sch.id} className="hover:bg-gray-50/20">
                    <td className="p-3.5 font-bold text-gray-900">{sch.reportName}</td>
                    <td className="p-3.5 font-semibold text-gray-550 font-mono">{sch.frequency}</td>
                    <td className="p-3.5 font-bold text-indigo-750 font-mono">{sch.email}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleSchedule(sch.id)}
                        className="bg-transparent border-none cursor-pointer p-0 inline-flex"
                        title={sch.active ? "Click to Suspend" : "Click to Activate"}
                      >
                        {sch.active ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                            Suspended
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteSchedule(sch.id)}
                        className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer p-1"
                        title="Delete Schedule"
                      >
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
  );
}
