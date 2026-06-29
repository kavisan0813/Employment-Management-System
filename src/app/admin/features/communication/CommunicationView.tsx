import React from "react";
import { useCommunication } from "./hooks/useCommunication";

// Import subtab panels
import { BroadcastAnnouncementsTab } from "./components/BroadcastAnnouncementsTab";
import { NotificationTemplatesTab } from "./components/NotificationTemplatesTab";
import { NotificationSettingsTab } from "./components/NotificationSettingsTab";

// Import Lucide icons
import {
  MessageSquare,
  Megaphone,
  FileText,
  Settings,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";

export function CommunicationView() {
  const {
    activeTab,
    setActiveTab,
    toastMessage,
    showToast
  } = useCommunication();

  const navItems = [
    { id: "broadcast", label: "Broadcast Announcements", icon: Megaphone, desc: "Send platform-wide targeted messages" },
    { id: "templates", label: "Notification Templates", icon: FileText, desc: "Manage system automated email and SMS content" },
    { id: "settings", label: "Notification Settings", icon: Settings, desc: "Control mandatory policies per organization" },
  ] as const;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "broadcast":
        return <BroadcastAnnouncementsTab showToast={showToast} />;
      case "templates":
        return <NotificationTemplatesTab showToast={showToast} />;
      case "settings":
        return <NotificationSettingsTab showToast={showToast} />;
      default:
        return <BroadcastAnnouncementsTab showToast={showToast} />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4 relative">
      
      {/* Toast Alert overlay */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl border flex items-center gap-3 transition-all duration-300 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : toastMessage.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : toastMessage.type === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-indigo-50 border-indigo-200 text-indigo-800"
          }`}
        >
          {toastMessage.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {toastMessage.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {toastMessage.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
          {toastMessage.type === "info" && <Info className="w-5 h-5 text-indigo-650 shrink-0" />}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Notifications & Announcements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Platform-wide messaging center. Dispatch announcements, edit system templates, and configure notification policies.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Delivery Engines Ready
        </div>
      </div>

      {/* Top Tab Navigation Bar */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar scroll-smooth">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Workspace View */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          {/* Header of Active Tab */}
          <div className="px-6 py-4 bg-gray-50/50 font-semibold border-b border-gray-200 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 tracking-wide">
              {navItems.find((i) => i.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {navItems.find((i) => i.id === activeTab)?.desc}
            </p>
          </div>

          {/* Render block */}
          <div className="p-6">{renderActiveTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default CommunicationView;
