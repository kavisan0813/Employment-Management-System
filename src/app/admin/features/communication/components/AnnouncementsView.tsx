import React from "react";
import { Megaphone, Trash2 } from "lucide-react";
import { Announcement } from "../types/communication.types";

interface AnnouncementsViewProps {
  state: any;
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
  state, annTitle, setAnnTitle, annContent, setAnnContent, annPriority, 
  setAnnPriority, annTarget, setAnnTarget, annDisplay, setAnnDisplay, 
  handleCreateAnnouncement, handleToggleAnnouncement, handleDeleteAnnouncement
}: AnnouncementsViewProps) {
  const priorities: Announcement["priority"][] = ["Low", "Medium", "High", "Critical"];
  const targetOptions = ["Everyone", "ABC Tech Group", "XYZ Global Ltd", "Enterprise Customers", "Trial Accounts"];
  const displayOptions = ["Dashboard Banner", "Popup Card", "Email Notice", "Mobile Push Alert"];

  return (
    <div className="space-y-6">
      {/* Launch Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-1.5">
          <Megaphone className="w-4 h-4 text-indigo-500" /> Launch New Platform Announcement
        </h4>
        
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Announcement Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Scheduled Core Database Patching"
                value={annTitle}
                onChange={e => setAnnTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Priority</label>
                <select
                  value={annPriority}
                  onChange={e => setAnnPriority(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none cursor-pointer"
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Target</label>
                <select
                  value={annTarget}
                  onChange={e => setAnnTarget(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none cursor-pointer"
                >
                  {targetOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Display</label>
                <select
                  value={annDisplay}
                  onChange={e => setAnnDisplay(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none cursor-pointer"
                >
                  {displayOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Announcement Message Content</label>
            <textarea
              required
              rows={3}
              placeholder="Provide clean markdown details about the upcoming change..."
              value={annContent}
              onChange={e => setAnnContent(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
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
          <div className="p-10 text-center text-sm font-medium text-gray-500">
            No announcements logged. Use the form above to deploy alert banners.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Title & Message</th>
                  <th className="px-5 py-4 text-center">Priority</th>
                  <th className="px-5 py-4">Target</th>
                  <th className="px-5 py-4">Display</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {state.announcements.map((ann: any) => (
                  <tr key={ann.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4 max-w-[280px]">
                      <div className="font-medium text-gray-700 leading-tight">{ann.title}</div>
                      <div className="text-xs text-gray-500 truncate mt-1">{ann.content}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600">{ann.priority}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-medium">{ann.targetAudience}</td>
                    <td className="px-5 py-4 text-gray-600 font-medium">{ann.displayOption}</td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => handleToggleAnnouncement(ann.id)} className="cursor-pointer">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${ann.status === "Active" ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                          {ann.status}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-gray-400 hover:text-rose-600 transition-colors p-1">
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