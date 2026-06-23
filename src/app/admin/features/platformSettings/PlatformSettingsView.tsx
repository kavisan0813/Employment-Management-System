/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePlatformSettings } from "./hooks/usePlatformSettings";
import { SystemConfig } from "./types/platformSettings.types";

// Import Modular Components
import { GeneralSettingsView } from "./components/GeneralSettingsView";
import { BrandingSettingsView } from "./components/BrandingSettingsView";
import { LocalizationSettingsView } from "./components/LocalizationSettingsView";
import { CurrencySettingsView } from "./components/CurrencySettingsView";
import { TimezoneSettingsView } from "./components/TimezoneSettingsView";
import { EmailSettingsView } from "./components/EmailSettingsView";
import { NotificationSettingsView } from "./components/NotificationSettingsView";
import { SecuritySettingsView } from "./components/SecuritySettingsView";
import { StorageSettingsView } from "./components/StorageSettingsView";
import { PreferencesSettingsView } from "./components/PreferencesSettingsView";
import { TenantOverrideSimulator } from "./components/TenantOverrideSimulator";

// Import Icons
import {
  Settings,
  Palette,
  Globe,
  Coins,
  Clock,
  Mail,
  Bell,
  Lock,
  HardDrive,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown
} from "lucide-react";

export function PlatformSettingsView() {
  const {
    config,
    setConfig,
    activeTab,
    setActiveTab,
    showAlert,
    alertMsg,
    alertType,
    triggerAlert,
    handleSave,
    getFormattedDatePreview,
    getFormattedNumberPreview,
    getFormattedCurrencyPreview
  } = usePlatformSettings();

  const settingsNavItems = [
    { id: "general", label: "General Settings", icon: Settings, group: "Foundation" },
    { id: "branding", label: "Branding Settings", icon: Palette, group: "Foundation" },
    { id: "localization", label: "Localization & Regional", icon: Globe, group: "Foundation" },
    { id: "currency", label: "Currency Settings", icon: Coins, group: "Foundation" },
    { id: "timezone", label: "Time Zones", icon: Clock, group: "Foundation" },
    { id: "email", label: "Email Settings", icon: Mail, group: "Channels" },
    { id: "notifications", label: "Notifications Rules", icon: Bell, group: "Channels" },
    { id: "security", label: "Security & MFA", icon: Lock, group: "Governance" },
    { id: "storage", label: "File Storage Policies", icon: HardDrive, group: "Governance" },
    { id: "preferences", label: "System Preferences", icon: Sliders, group: "Governance" },
  ] as const;

  const groups = ["Foundation", "Channels", "Governance"] as const;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettingsView config={config} setConfig={setConfig} />;
      case "branding":
        return <BrandingSettingsView config={config} setConfig={setConfig} />;
      case "localization":
        return (
          <LocalizationSettingsView
            config={config}
            setConfig={setConfig}
            getFormattedDatePreview={getFormattedDatePreview}
            getFormattedNumberPreview={getFormattedNumberPreview}
          />
        );
      case "currency":
        return (
          <CurrencySettingsView
            config={config}
            setConfig={setConfig}
            getFormattedCurrencyPreview={getFormattedCurrencyPreview}
          />
        );
      case "timezone":
        return <TimezoneSettingsView config={config} setConfig={setConfig} />;
      case "email":
        return <EmailSettingsView config={config} setConfig={setConfig} triggerAlert={triggerAlert} />;
      case "notifications":
        return <NotificationSettingsView config={config} setConfig={setConfig} />;
      case "security":
        return <SecuritySettingsView config={config} setConfig={setConfig} triggerAlert={triggerAlert} />;
      case "storage":
        return <StorageSettingsView config={config} setConfig={setConfig} />;
      case "preferences":
        return <PreferencesSettingsView config={config} setConfig={setConfig} />;
      default:
        return <GeneralSettingsView config={config} setConfig={setConfig} />;
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
            : "bg-indigo-50 border-indigo-200 text-indigo-800"
        }`}>
          {alertType === "success" && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
          {alertType === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {alertType === "info" && <Info className="w-5 h-5 text-indigo-650 shrink-0" />}
          <span className="text-xs font-bold">{alertMsg}</span>
        </div>
      )}

      {/* Header Title Grid */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-950 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-650" />
            System Configuration
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Configure system-wide settings that apply globally to all organizations. Individual tenants can override specific parameters in their local portals.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Central Platform Control Active
        </div>
      </div>

      {/* Top Tab Navigation Bar (Grouped on Hover) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs relative">
        <div className="flex items-center gap-2 p-1.5">
          {groups.map((groupName) => {
            const isGroupActive = settingsNavItems.some(item => item.group === groupName && item.id === activeTab);
            const activeItemInGroup = settingsNavItems.find(item => item.group === groupName && item.id === activeTab);
            
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
                    {settingsNavItems
                      .filter((item) => item.group === groupName)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as keyof SystemConfig)}
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
                {settingsNavItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Configure default values and limits for the {activeTab} domain.
              </p>
            </div>
            <button
              onClick={() => handleSave(activeTab)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer border-none"
            >
              Save {settingsNavItems.find(i => i.id === activeTab)?.label}
            </button>
          </div>

          {/* Content Field Render block */}
          <div className="p-6">
            {renderActiveTabContent()}
          </div>
        </div>

        {/* Tenant Override Sandbox Card */}
        <TenantOverrideSimulator config={config} />
      </div>
    </div>
  );
}

export default PlatformSettingsView;
