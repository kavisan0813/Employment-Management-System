/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePlatformSettings } from "./hooks/usePlatformSettings";
import { GeneralSettingsView } from "./components/GeneralSettingsView";
import { LocalizationSettingsView } from "./components/LocalizationSettingsView";
import { CurrencySettingsView } from "./components/CurrencySettingsView";
import { TimezoneSettingsView } from "./components/TimezoneSettingsView";
import { TenantOverrideSimulator } from "./components/TenantOverrideSimulator";

// Import Icons
import {
  Settings,
  Palette,
  Globe,
  Coins,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
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
    handleSave,
    getFormattedDatePreview,
    getFormattedNumberPreview,
    getFormattedCurrencyPreview,
  } = usePlatformSettings();

  const settingsNavItems = [
    {
      id: "general",
      label: "General Settings",
      icon: Settings,
      group: "Foundation",
    },
    
    {
      id: "localization",
      label: "Localization & Regional",
      icon: Globe,
      group: "Foundation",
    },
    {
      id: "currency",
      label: "Currency Settings",
      icon: Coins,
      group: "Foundation",
    },
    { id: "timezone", label: "Time Zones", icon: Clock, group: "Foundation" },
    /* { id: "email", label: "Email Settings", icon: Mail, group: "Channels" }, */
    /*  { id: "notifications", label: "Notifications Rules", icon: Bell, group: "Channels" }, */
    /*   { id: "security", label: "Security & MFA", icon: Lock, group: "Governance" }, */
    

  ] as const;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettingsView config={config} setConfig={setConfig} />;
      case "branding":
       /*  return <BrandingSettingsView config={config} setConfig={setConfig} />;
      case "localization":
        return (
          <LocalizationSettingsView
            config={config}
            setConfig={setConfig}
            getFormattedDatePreview={getFormattedDatePreview}
            getFormattedNumberPreview={getFormattedNumberPreview}
          />
        ); */
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

      default:
        return <GeneralSettingsView config={config} setConfig={setConfig} />;
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
                : "bg-indigo-50 border-indigo-200 text-indigo-800"
          }`}
        >
          {alertType === "success" && (
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          )}
          {alertType === "error" && (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          {alertType === "info" && (
            <Info className="w-5 h-5 text-indigo-650 shrink-0" />
          )}
          <span className="text-xs font-bold">{alertMsg}</span>
        </div>
      )}

      {/* Header Title Grid */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-650 font-semibold" />
            System Configuration
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1 font-semibold">
            Configure system-wide settings that apply globally to all
            organizations. Individual tenants can override specific parameters
            in their local portals.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse font-semibold" />
          Central Platform Control Active
        </div>
      </div>

      {/* Flat Tab Navigation */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
          {settingsNavItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
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
                {settingsNavItems.find((i) => i.id === activeTab)?.label}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Configure default values and limits for the {activeTab} domain.
              </p>
            </div>
            <button
              onClick={() => handleSave(activeTab)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer border-none"
            >
              Save {settingsNavItems.find((i) => i.id === activeTab)?.label}
            </button>
          </div>

          {/* Content Field Render block */}
          <div className="p-6">{renderActiveTabContent()}</div>
        </div>

        {/* Tenant Override Sandbox Card */}
        <TenantOverrideSimulator config={config} />
      </div>
    </div>
  );
}

export default PlatformSettingsView;
