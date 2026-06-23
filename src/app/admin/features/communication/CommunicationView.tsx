/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useCommunication } from "./hooks/useCommunication";

// Import subtab panels
import { CommunicationDashboard } from "./components/CommunicationDashboard";
import { AnnouncementsView } from "./components/AnnouncementsView";
import { EmailTemplatesView } from "./components/EmailTemplatesView";
import { SmsTemplatesView } from "./components/SmsTemplatesView";
import { PushNotificationsView } from "./components/PushNotificationsView";
import { BroadcastMessagesView } from "./components/BroadcastMessagesView";
import { CommunicationHistoryView } from "./components/CommunicationHistoryView";
import { DeliveryReportsView } from "./components/DeliveryReportsView";
import { CommunicationSettingsView } from "./components/CommunicationSettingsView";

// Import Lucide icons
import {
  MessageSquare,
  LayoutDashboard,
  Megaphone,
  Mail,
  MessageCircle,
  BellRing,
  Send,
  History,
  Activity,
  Settings,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown
} from "lucide-react";

export function CommunicationView() {
  const {
    state,
    activeTab,
    setActiveTab,
    showAlert,
    alertMsg,
    alertType,
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
    pushTitle,
    setPushTitle,
    pushMessage,
    setPushMessage,
    pushRedirect,
    setPushRedirect,
    pushTargetChannels,
    setPushTargetChannels,
    bcStep,
    setBcStep,
    bcTitle,
    setBcTitle,
    bcCampaign,
    setBcCampaign,
    bcAudience,
    setBcAudience,
    bcChannels,
    setBcChannels,
    bcMessageText,
    setBcMessageText,
    triggerAlert,
    handleCreateAnnouncement,
    handleToggleAnnouncement,
    handleDeleteAnnouncement,
    handleSaveEmailTemplate,
    handleSaveSmsTemplate,
    handleSendBroadcast,
    handleSaveSettings
  } = useCommunication();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
    { id: "announcements", label: "Announcements", icon: Megaphone, group: "Overview" },
    { id: "reports", label: "Delivery Reports", icon: Activity, group: "Overview" },

    { id: "emailTemplates", label: "Email Templates", icon: Mail, group: "Channels Editors" },
    { id: "smsTemplates", label: "SMS Templates", icon: MessageCircle, group: "Channels Editors" },
    { id: "pushNotifications", label: "Push Notifications", icon: BellRing, group: "Channels Editors" },

    { id: "broadcast", label: "Broadcast Messages", icon: Send, group: "Messaging Ops" },
    { id: "history", label: "Communication History", icon: History, group: "Messaging Ops" },
    { id: "settings", label: "Communication Settings", icon: Settings, group: "Messaging Ops" }
  ] as const;

  const groups = ["Overview", "Channels Editors", "Messaging Ops"] as const;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <CommunicationDashboard setActiveTab={setActiveTab} />;
      case "announcements":
        return (
          <AnnouncementsView
            state={state}
            annTitle={annTitle}
            setAnnTitle={setAnnTitle}
            annContent={annContent}
            setAnnContent={setAnnContent}
            annPriority={annPriority}
            setAnnPriority={setAnnPriority}
            annTarget={annTarget}
            setAnnTarget={setAnnTarget}
            annDisplay={annDisplay}
            setAnnDisplay={setAnnDisplay}
            handleCreateAnnouncement={handleCreateAnnouncement}
            handleToggleAnnouncement={handleToggleAnnouncement}
            handleDeleteAnnouncement={handleDeleteAnnouncement}
          />
        );
      case "reports":
        return <DeliveryReportsView />;
      case "emailTemplates":
        return <EmailTemplatesView state={state} handleSaveEmailTemplate={handleSaveEmailTemplate} />;
      case "smsTemplates":
        return <SmsTemplatesView state={state} handleSaveSmsTemplate={handleSaveSmsTemplate} />;
      case "pushNotifications":
        return (
          <PushNotificationsView
            pushTitle={pushTitle}
            setPushTitle={setPushTitle}
            pushMessage={pushMessage}
            setPushMessage={setPushMessage}
            pushRedirect={pushRedirect}
            setPushRedirect={setPushRedirect}
            pushTargetChannels={pushTargetChannels}
            setPushTargetChannels={setPushTargetChannels}
            triggerAlert={triggerAlert}
          />
        );
      case "broadcast":
        return (
          <BroadcastMessagesView
            bcStep={bcStep}
            setBcStep={setBcStep}
            bcTitle={bcTitle}
            setBcTitle={setBcTitle}
            bcCampaign={bcCampaign}
            setBcCampaign={setBcCampaign}
            bcAudience={bcAudience}
            setBcAudience={setBcAudience}
            bcChannels={bcChannels}
            setBcChannels={setBcChannels}
            bcMessageText={bcMessageText}
            setBcMessageText={setBcMessageText}
            handleSendBroadcast={handleSendBroadcast}
          />
        );
      case "history":
        return <CommunicationHistoryView state={state} />;
      case "settings":
        return <CommunicationSettingsView state={state} handleSaveSettings={handleSaveSettings} />;
      default:
        return <CommunicationDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">
      {/* Alert banner overlay */}
      {showAlert && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
          alertType === "success" 
            ? "bg-teal-50 border-teal-200 text-teal-800" 
            : alertType === "error" 
            ? "bg-rose-50 border-rose-200 text-rose-800" 
            : alertType === "warning"
            ? "bg-amber-50 border-amber-200 text-amber-800"
            : "bg-indigo-50 border-indigo-200 text-indigo-800"
        }`}>
          {alertType === "success" && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
          {alertType === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {alertType === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
          {alertType === "info" && <Info className="w-5 h-5 text-indigo-650 shrink-0" />}
          <span className="text-xs font-bold">{alertMsg}</span>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Communication Control Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            SaaS Central messaging engine. Dispatch mass bulletins, configure mail templates parameters, review carrier SMS log queues, and monitor mobile device FCM pushes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Delivery Engines Ready
        </div>
      </div>

      {/* Top Tab Navigation Bar (Grouped on Hover) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs relative">
        <div className="flex items-center gap-2 p-1.5">
          {groups.map((groupName) => {
            const isGroupActive = navItems.some(item => item.group === groupName && item.id === activeTab);
            const activeItemInGroup = navItems.find(item => item.group === groupName && item.id === activeTab);
            
            return (
              <div key={groupName} className="relative group/menu">
                {/* Main Group Button */}
                <button
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isGroupActive
                      ? "bg-indigo-50 text-indigo-750 border-indigo-100"
                      : "bg-transparent text-gray-600 hover:bg-gray-55 hover:text-gray-900 border-transparent"
                  }`}
                >
                  <span>{groupName}</span>
                  {activeItemInGroup && (
                    <span className="text-[10px] text-indigo-650 font-extrabold bg-indigo-100/50 px-1.5 py-0.5 rounded-md ml-1">
                      {activeItemInGroup.label}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover/menu:rotate-180 transition-transform duration-200" />
                </button>

                {/* Hover Dropdown Menu */}
                <div className="absolute left-0 top-full pt-1.5 z-40 hidden group-hover/menu:block min-w-[220px]">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 space-y-0.5 animate-in fade-in duration-100">
                    {navItems
                      .filter((item) => item.group === groupName)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-gray-600 hover:text-gray-955 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Workspace View */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header of Active Tab */}
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Detailed diagnostics workspace for {activeTab} operations.
              </p>
            </div>
          </div>

          {/* Render block */}
          <div className="p-6">
            {renderActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunicationView;
