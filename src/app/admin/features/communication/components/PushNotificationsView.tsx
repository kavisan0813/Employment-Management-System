/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Bell, Smartphone, Chrome, HelpCircle, Send } from "lucide-react";
import { pushAuditLog } from "../../../mockData";

interface PushNotificationsViewProps {
  pushTitle: string;
  setPushTitle: (val: string) => void;
  pushMessage: string;
  setPushMessage: (val: string) => void;
  pushRedirect: string;
  setPushRedirect: (val: string) => void;
  pushTargetChannels: string[];
  setPushTargetChannels: React.Dispatch<React.SetStateAction<string[]>>;
  triggerAlert: (msg: string, type?: "success" | "info" | "error" | "warning") => void;
}

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export function PushNotificationsView({
  pushTitle,
  setPushTitle,
  pushMessage,
  setPushMessage,
  pushRedirect,
  setPushRedirect,
  pushTargetChannels,
  setPushTargetChannels,
  triggerAlert
}: PushNotificationsViewProps) {

  const handleToggleChannel = (channel: string) => {
    if (pushTargetChannels.includes(channel)) {
      setPushTargetChannels(prev => prev.filter(c => c !== channel));
    } else {
      setPushTargetChannels(prev => [...prev, channel]);
    }
  };

  const handleSendTestPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) {
      triggerAlert("Title and Message body are required.", "error");
      return;
    }
    if (pushTargetChannels.length === 0) {
      triggerAlert("Please select at least one delivery target device channel.", "error");
      return;
    }

    triggerAlert(`Test push alert '${pushTitle}' dispatched to active user sessions.`, "success");
    pushAuditLog(
      "push_notification.test_sent",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { title: pushTitle, channels: pushTargetChannels.join(", "), redirect_url: pushRedirect }
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor Form */}
        <form onSubmit={handleSendTestPush} className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-indigo-500" /> Dispatch Test Push Alert
          </h4>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Push Alert Title</label>
            <input
              type="text"
              required
              placeholder="e.g. System Update Completed"
              value={pushTitle}
              onChange={e => setPushTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Push Message Body</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Recruitment Module V2.4 is now available in your workspace."
              value={pushMessage}
              onChange={e => setPushMessage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:outline-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Redirect Destination URL</label>
            <input
              type="text"
              required
              placeholder="e.g. /platform-admin/features"
              value={pushRedirect}
              onChange={e => setPushRedirect(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Delivery Channel Targets</label>
            <div className="flex items-center gap-6 text-xs font-bold">
              {["Android Mobile", "iOS Mobile", "Web Push"].map(channel => {
                const isActive = pushTargetChannels.includes(channel);
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => handleToggleChannel(channel)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                      isActive 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-850" 
                        : "bg-transparent border-gray-200 text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={isActive} 
                      readOnly 
                      className="accent-indigo-650 cursor-pointer pointer-events-none" 
                    />
                    <span>{channel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Dispatches instantly using Firebase FCM tokens mapping.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-2xl text-xs font-bold cursor-pointer border-none transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Send Test Push Alert
            </button>
          </div>
        </form>

        {/* Device Lockscreen mockup */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col items-center">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block self-start">Mobile OS Push Notification Preview</span>
          
          {/* Mock device structure */}
          <div className="w-64 h-96 border-[6px] border-gray-800 rounded-[32px] bg-slate-900 relative p-4 flex flex-col justify-start overflow-hidden shadow-lg select-none">
            {/* Phone speaker notch */}
            <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gray-800 rounded-full" />
            
            {/* Lockscreen clock */}
            <div className="text-center text-white mt-4 space-y-0.5">
              <div className="text-2xl font-light tracking-wide">10:42 AM</div>
              <div className="text-[8px] uppercase tracking-widest opacity-60">Tuesday, June 23</div>
            </div>

            {/* Notification alert banner */}
            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white space-y-1 shadow-md animate-pulse">
              <div className="flex items-center justify-between text-[8px] font-bold opacity-80">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-indigo-400" />
                  <span>EMS APP</span>
                </div>
                <span>now</span>
              </div>
              <div className="text-[10px] font-black tracking-tight truncate">
                {pushTitle.trim() || "Notification Header"}
              </div>
              <div className="text-[9px] opacity-90 leading-tight line-clamp-2">
                {pushMessage.trim() || "Message body will render here dynamically as you compose..."}
              </div>
            </div>

            {/* Bottom swipe indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-white/40 rounded-full" />
          </div>
        </div>

      </div>
    </div>
  );
}
