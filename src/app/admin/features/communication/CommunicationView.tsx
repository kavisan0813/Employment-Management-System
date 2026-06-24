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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "reports", label: "Delivery Reports", icon: Activity },

  { id: "emailTemplates", label: "Email Templates", icon: Mail },
  { id: "smsTemplates", label: "SMS Templates", icon: MessageCircle },
  { id: "pushNotifications", label: "Notifications", icon: BellRing },

  { id: "broadcast", label: "Broadcast Messages", icon: Send },
  { id: "history", label: "Communication History", icon: History },
  { id: "settings", label: "Communication", icon: Settings }
] as const;

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

     {/* Top Tab Navigation Bar */}
<div className="w-full overflow-hidden">
  <div className="flex items-center gap-0.3 p-0.5 overflow-x-auto no-scrollbar scroll-smooth">
    {navItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeTab === item.id;

      return (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            isActive
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          {item.label}
        </button>
      );
    })}
  </div>
</div>

      {/* Form Workspace View */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header of Active Tab */}
          <div className="px-6 py-4 bg-gray-50/50 font-semibold border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-wide">
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
