import React, { useState } from "react";
import { ConnectedAppsSection } from "./ConnectedAppsSection";
import { ApiSettingsSection } from "./ApiSettingsSection";
import { WebhooksSection } from "./WebhooksSection";

export function IntegrationsSection() {
  const [activeTab, setActiveTab] = useState<"apps" | "api" | "webhooks">("apps");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-bold text-foreground">
          Connected Apps & API Management
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage third-party application connectors, REST API tokens, and webhook events.
        </p>
      </div>

      {/* HORIZONTAL TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("apps")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "apps"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Connected Apps
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("api")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "api"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          API & Tokens
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("webhooks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "webhooks"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Webhooks
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "apps" && <ConnectedAppsSection />}
        {activeTab === "api" && <ApiSettingsSection />}
        {activeTab === "webhooks" && <WebhooksSection />}
      </div>
    </div>
  );
}
