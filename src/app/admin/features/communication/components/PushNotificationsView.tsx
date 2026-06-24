import React from "react";
import { Bell, Smartphone, HelpCircle, Send } from "lucide-react";
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
  pushTitle, setPushTitle, pushMessage, setPushMessage, 
  pushRedirect, setPushRedirect, pushTargetChannels, 
  setPushTargetChannels, triggerAlert
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
        <form onSubmit={handleSendTestPush} className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-indigo-500" /> Dispatch Test Push Alert
          </h4>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Push Alert Title</label>
            <input
              type="text"
              required
              placeholder="e.g. System Update Completed"
              value={pushTitle}
              onChange={e => setPushTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Push Message Body</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Recruitment Module V2.4 is now available in your workspace."
              value={pushMessage}
              onChange={e => setPushMessage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Redirect Destination URL</label>
            <input
              type="text"
              required
              placeholder="e.g. /platform-admin/features"
              value={pushRedirect}
              onChange={e => setPushRedirect(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 block">Delivery Channel Targets</label>
            <div className="flex items-center gap-4 text-xs font-medium">
              {["Android Mobile", "iOS Mobile", "Web Push"].map(channel => {
                const isActive = pushTargetChannels.includes(channel);
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => handleToggleChannel(channel)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      isActive 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-800" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input type="checkbox" checked={isActive} readOnly className="accent-indigo-600 cursor-pointer" />
                    <span>{channel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Dispatches instantly using Firebase FCM tokens.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Send Test Push Alert
            </button>
          </div>
        </form>

        {/* Device Preview */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-500 self-start">Mobile Preview</span>
          
          <div className="w-64 h-96 border-[6px] border-gray-800 rounded-[32px] bg-slate-900 relative p-4 flex flex-col justify-start overflow-hidden shadow-lg select-none">
            <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gray-800 rounded-full" />
            
            <div className="text-center text-white mt-4 space-y-0.5">
              <div className="text-2xl font-light tracking-wide">10:42 AM</div>
              <div className="text-[9px] uppercase tracking-widest opacity-60">Tuesday, June 23</div>
            </div>

            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white space-y-1 shadow-md">
              <div className="flex items-center justify-between text-[9px] font-semibold opacity-80">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-indigo-400" />
                  <span>EMS APP</span>
                </div>
                <span>now</span>
              </div>
              <div className="text-xs font-semibold tracking-tight truncate">
                {pushTitle.trim() || "Notification Header"}
              </div>
              <div className="text-[10px] opacity-90 leading-tight line-clamp-2">
                {pushMessage.trim() || "Message body will render here..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}