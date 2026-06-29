/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNotifications } from "./hooks/useNotifications";

// Import Modular Components
import { NotificationsDashboard } from "./components/NotificationsDashboard";
import { SubscriptionExpiryView } from "./components/SubscriptionExpiryView";
import { FailedPaymentsView } from "./components/FailedPaymentsView";
import { DeliveryChannelsView } from "./components/DeliveryChannelsView";
import { NotificationHistoryView } from "./components/NotificationHistoryView";
import { NotificationSettingsView } from "./components/NotificationSettingsView";

// Import Lucide Icons
import {
  Bell,
  Calendar,
  CreditCard,
  Shield,
  Radio,
  History,
  Settings,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  BellRing,
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
    handleSaveTemplate,
  } = useNotifications();

  // Navigation Items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BellRing, group: "General" },
    
    {
      id: "expiry",
      label: "Subscription Expiry Alerts",
      icon: Calendar,
      group: "Event Monitors",
    },
    {
      id: "failedPayments",
      label: "Failed Payments",
      icon: CreditCard,
      group: "Event Monitors",
    },
   
    {
      id: "channels",
      label: "Delivery Channels",
      icon: Radio,
      group: "Delivery Channels",
    },
    {
      id: "history",
      label: "Notification History Logs",
      icon: History,
      group: "Configuration",
    },
    {
      id: "settings",
      label: "Notification Settings",
      icon: Settings,
      group: "Configuration",
    },
  ] as const;

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
      case "expiry":
        return (
          <SubscriptionExpiryView
            expiryAlerts={state.expiryAlerts}
            onSendReminder={handleSendReminder}
          />
        );
      case "failedPayments":
        return (
          <FailedPaymentsView
            failedPayments={state.failedPayments}
            onRetryPayment={handleRetryPayment}
          />
        );
  
      case "channels":
        return <DeliveryChannelsView />;
      case "history":
        return <NotificationHistoryView history={state.history} />;
      case "settings":
        return (
          <NotificationSettingsView
            settings={state.settings}
            onSaveSettings={handleSaveSettings}
          />
        );
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
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
            alertType === "success"
              ? "bg-teal-50 border-teal-200 text-teal-800"
              : alertType === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : alertType === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-indigo-50 border-indigo-200 text-indigo-800"
          }`}
        >
          {alertType === "success" && (
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          )}
          {alertType === "error" && (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          {alertType === "warning" && (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          {alertType === "info" && (
            <Info className="w-5 h-5 text-indigo-650 shrink-0" />
          )}
          <span className="text-xs font-bold">{alertMsg}</span>
        </div>
      )}

      {/* Header Grid */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-650 font-semibold" />
            Alerts & Notifications
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1 font-semibold">
            Real-time platform warnings monitor. Oversee server status,
            subscription renewals schedules, payment gateways transactions and
            brute force threat parameters.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Alert Engine Connected
        </div>
      </div>

      {/* Top Tab Navigation Bar */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
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
                {navItems.find((i) => i.id === activeTab)?.label}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Super Admin notification control panel for {activeTab}{" "}
                operations.
              </p>
            </div>
          </div>

          {/* Content Field Render block */}
          <div className="p-6">{renderActiveTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsView;
