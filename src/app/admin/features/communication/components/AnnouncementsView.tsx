/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Megaphone, Trash2, Calendar, ShieldAlert } from "lucide-react";
import { CommunicationState, Announcement } from "../types/communication.types";

interface AnnouncementsViewProps {
  state: CommunicationState;
  annTitle: string;
  setAnnTitle: (val: string) => void;
  annContent: string;
  setAnnContent: (val: string) => void;
  annPriority: Announcement["priority"];
  setAnnPriority: (val: Announcement["priority"]) => void;
  annTarget: string;
  setAnnTarget: (val: string) => void;
  annDisplay: string;
  setAnnDisplay: (val: string) => void;
  handleCreateAnnouncement: (e: React.FormEvent) => void;
  handleToggleAnnouncement: (id: string) => void;
  handleDeleteAnnouncement: (id: string) => void;
}

export function AnnouncementsView({
  state,
  annTitle,
  setAnnTitle,
  annContent,
  setAnnContent,
  annPriority,
  setAnnPriority,
  annTarget,
  setAnnTarget,
  annDisplay,
  setAnnDisplay,
  handleCreateAnnouncement,
  handleToggleAnnouncement,
  handleDeleteAnnouncement
}: AnnouncementsViewProps) {
  const priorities: Announcement["priority"][] = ["Low", "Medium", "High", "Critical"];
  const targetOptions = ["Everyone", "ABC Tech Group", "XYZ Global Ltd", "Enterprise Customers", "Trial Accounts"];
  const displayOptions = ["Dashboard Banner", "Popup Card", "Email Notice", "Mobile Push Alert"];

  return (
    <div className="space-y-6">
      {/* Launch Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-1.5">
          <Megaphone className="w-4 h-4 text-indigo-500 animate-pulse" /> Launch New Platform Announcement
        </h4>
        
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Announcement Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Scheduled Core Database Patching"
                value={annTitle}
                onChange={e => setAnnTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Priority Level</label>
                <select
                  value={annPriority}
                  onChange={e => setAnnPriority(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Target Audience</label>
                <select
                  value={annTarget}
                  onChange={e => setAnnTarget(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
                >
                  {targetOptions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Display Options</label>
                <select
                  value={annDisplay}
                  onChange={e => setAnnDisplay(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
                >
                  {displayOptions.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Announcement Message Content</label>
            <textarea
              required
              rows={3}
              placeholder="Provide clean markdown details about the upcoming change..."
              value={annContent}
              onChange={e => setAnnContent(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold cursor-pointer border-none transition-all shadow-sm"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </div>

      {/* Announcements Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
          <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Active Platform Announcements</span>
        </div>

        {state.announcements.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400 font-bold">
            No announcements logged. Use the form above to deploy alert banners.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Title & Message</th>
                  <th className="px-5 py-4 text-center">Priority</th>
                  <th className="px-5 py-4">Audience Target</th>
                  <th className="px-5 py-4">Display Option</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {state.announcements.map(ann => (
                  <tr key={ann.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4 max-w-[280px]">
                      <div className="font-medium text-gray-900 leading-tight">{ann.title}</div>
                      <div className="text-xs text-gray-500 truncate mt-1">{ann.content}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        ann.priority === "Critical"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : ann.priority === "High"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : ann.priority === "Medium"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}>{ann.priority}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{ann.targetAudience}</td>
                    <td className="px-5 py-4 text-gray-600 font-mono">{ann.displayOption}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleAnnouncement(ann.id)}
                        className="bg-transparent border-none cursor-pointer p-0"
                        title="Toggle Status"
                      >
                        {ann.status === "Active" ? (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer p-1"
                        title="Delete Announcement"
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
