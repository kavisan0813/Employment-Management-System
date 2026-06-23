/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNotifications } from "./hooks/useNotifications";

// Import Modular Components
import { NotificationsDashboard } from "./components/NotificationsDashboard";
import { SystemAlertsView } from "./components/SystemAlertsView";
import { SubscriptionExpiryView } from "./components/SubscriptionExpiryView";
import { FailedPaymentsView } from "./components/FailedPaymentsView";
import { SecurityAlertsView } from "./components/SecurityAlertsView";
import { NotificationTemplatesView } from "./components/NotificationTemplatesView";
import { DeliveryChannelsView } from "./components/DeliveryChannelsView";
import { NotificationHistoryView } from "./components/NotificationHistoryView";
import { NotificationSettingsView } from "./components/NotificationSettingsView";

// Import Lucide Icons
import {
  Bell,
  Activity,
  Calendar,
  CreditCard,
  Shield,
  LayoutTemplate,
  Radio,
  History,
  Settings,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  BellRing,
  ChevronDown
} from "lucide-react";

export function NotificationsView() {
  const {
    state,
    activeTab,
    setActiveTab,
    showAlert,
    alertMsg,
    alertType,
    handleRetryPayment,
    handleSendReminder,
    handleAcknowledgeAlert,
    handleSecurityAction,
    handleSaveSettings,
    handleSaveTemplate
  } = useNotifications();

  // Navigation Items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BellRing, group: "General" },
    { id: "system", label: "System Health Alerts", icon: Activity, group: "Event Monitors" },
    { id: "expiry", label: "Subscription Expiry Alerts", icon: Calendar, group: "Event Monitors" },
    { id: "failedPayments", label: "Failed Payments", icon: CreditCard, group: "Event Monitors" },
    { id: "security", label: "Security & MFA Alerts", icon: Shield, group: "Event Monitors" },
    { id: "templates", label: "Notification Templates", icon: LayoutTemplate, group: "Delivery Channels" },
    { id: "channels", label: "Delivery Channels", icon: Radio, group: "Delivery Channels" },
    { id: "history", label: "Notification History Logs", icon: History, group: "Configuration" },
    { id: "settings", label: "Notification Settings", icon: Settings, group: "Configuration" },
  ] as const;

  const groups = ["General", "Event Monitors", "Delivery Channels", "Configuration"] as const;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <NotificationsDashboard
            state={state}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onRetryPayment={handleRetryPayment}
            onSecurityAction={handleSecurityAction}
            onSendReminder={handleSendReminder}
            setActiveTab={setActiveTab}
          />
        );
      case "system":
        return <SystemAlertsView alerts={state.systemAlerts} onAcknowledgeAlert={handleAcknowledgeAlert} />;
      case "expiry":
        return <SubscriptionExpiryView expiryAlerts={state.expiryAlerts} onSendReminder={handleSendReminder} />;
      case "failedPayments":
        return <FailedPaymentsView failedPayments={state.failedPayments} onRetryPayment={handleRetryPayment} />;
      case "security":
        return <SecurityAlertsView securityAlerts={state.securityAlerts} onSecurityAction={handleSecurityAction} />;
      case "templates":
        return <NotificationTemplatesView templates={state.templates} onSaveTemplate={handleSaveTemplate} />;
      case "channels":
        return <DeliveryChannelsView />;
      case "history":
        return <NotificationHistoryView history={state.history} />;
      case "settings":
        return <NotificationSettingsView settings={state.settings} onSaveSettings={handleSaveSettings} />;
      default:
        return (
          <NotificationsDashboard
            state={state}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onRetryPayment={handleRetryPayment}
            onSecurityAction={handleSecurityAction}
            onSendReminder={handleSendReminder}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">
      {/* Alert Banner */}
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

      {/* Header Grid */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-950 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-650" />
            Alerts & Notifications
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Real-time platform warnings monitor. Oversee server status, subscription renewals schedules, payment gateways transactions and brute force threat parameters.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Alert Engine Connected
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
                Super Admin notification control panel for {activeTab} operations.
              </p>
            </div>
          </div>

          {/* Content Field Render block */}
          <div className="p-6">
            {renderActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsView;
