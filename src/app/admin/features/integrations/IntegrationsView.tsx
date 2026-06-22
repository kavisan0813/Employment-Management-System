/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { db, pushAuditLog } from "../../mockData";
import { Integration, Organization } from "../../types";
import {
  GitMerge,
  Search,
  Plus,
  Radio,
  ShieldAlert,
  CheckCircle2,
  Settings2,
  Activity,
  Play,
  X,
  Key,
  HelpCircle,
} from "lucide-react";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export default function IntegrationsView() {
  const [integs, setIntegs] = useState<Integration[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Configuration Drawer states
  const [configInteg, setConfigInteg] = useState<Integration | null>(null);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const refreshData = () => {
    setIntegs(db.integrations.get());
    setOrgs(db.organizations.get());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredIntegs = integs.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Action toggles
  const toggleStatus = (item: Integration, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = db.integrations.get();
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";

    db.integrations.save(
      current.map((i) => {
        if (i.id === item.id) {
          return { ...i, status: nextStatus as any };
        }
        return i;
      }),
    );

    pushAuditLog(
      "integration.status_toggled",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      {
        provider: item.provider,
        previous_status: item.status,
        next_status: nextStatus,
      },
    );

    refreshData();
  };

  // Test sync connection
  const testSyncHealth = (item: Integration, e: React.MouseEvent) => {
    e.stopPropagation();
    pushAuditLog(
      "integration.health_check",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { provider: item.provider, triggered_type: "manual" },
    );

    // Simulate diagnostic latency check
    alert(
      `Triggering health diagnostic ping to ${item.name} servers...\nResult: [HEALTHY] Latency: 145ms. Auth parameters validated.`,
    );
  };

  // Configure drawer openers
  const openConfigDrawer = (item: Integration, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfigInteg(item);

    // Default mock inputs
    setClientId("client_live_ax903Bv");
    setClientSecret("••••••••••••••••••••••••");
    setWebhookUrl(
      item.status === "Active"
        ? `https://api.emsplatform.com/v1/webhooks/${item.provider.toLowerCase()}`
        : "",
    );
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configInteg) return;

    const current = db.integrations.get();
    db.integrations.save(
      current.map((i) => {
        if (i.id === configInteg.id) {
          return {
            ...i,
            status: "Active" as const,
            healthStatus: "Healthy" as const,
            lastSyncAt: new Date().toISOString(),
          };
        }
        return i;
      }),
    );

    pushAuditLog(
      "integration.configured",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { provider: configInteg.provider, webhook_assigned: webhookUrl },
    );

    setConfigInteg(null);
    refreshData();
    alert(
      `Active connections configured successfully for ${configInteg.name}. Webhook endpoint initialized.`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-950 flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-indigo-500" />
            Active Sync Integrations
          </h1>
          <p className="text-xs text-gray-400">
            Control platform connectors, oauth endpoints, or sync triggers
            globally.
          </p>
        </div>
      </div>

      {/* filtration */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Query integrations by title or API provider key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-lg text-xs focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50/50 p-1 rounded-lg border border-gray-150">
            <span className="text-[10px] pl-1 font-semibold text-gray-400">
              CATEGORY
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-gray-800 text-xs py-0.5 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="SSO">SSO / Identity Gate</option>
              <option value="Communication">Communication Channels</option>
              <option value="Payroll">Payroll Providers</option>
              <option value="Calendar">Calendar Workspace</option>
              <option value="Storage">Asset S3 Storage</option>
              <option value="Analytics">Analytics Streams</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid view of Integration templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIntegs.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-800">
                    {item.provider.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">
                      {item.category} &bull; {item.authType}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.healthStatus === "Healthy"
                      ? "bg-teal-50 text-teal-700 font-bold"
                      : item.healthStatus === "Degraded"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.healthStatus === "Healthy"
                        ? "bg-teal-500"
                        : item.healthStatus === "Degraded"
                          ? "bg-amber-500"
                          : "bg-rose-500 animate-ping"
                    }`}
                  />
                  {item.healthStatus}
                </span>
              </div>

              {/* Adoption statistics info */}
              <div className="grid grid-cols-2 gap-2 bg-gray-50/50 rounded-lg p-3 text-[11px] font-medium border border-gray-100">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">
                    Tenant Adopters
                  </span>
                  <span className="text-gray-900 font-bold">
                    {item.connectedOrgCount} Corporate orgs
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider">
                    Last Sync
                  </span>
                  <span className="text-gray-900 truncate block">
                    {item.lastSyncAt
                      ? new Date(item.lastSyncAt).toLocaleTimeString()
                      : "Never Synced"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-150 mt-4 text-xs font-semibold">
              <button
                onClick={(e) => openConfigDrawer(item, e)}
                className="flex-1 py-1.5 border border-gray-250 hover:bg-gray-100 rounded-lg text-gray-700 text-center cursor-pointer flex items-center justify-center gap-1 font-semibold"
              >
                <Settings2 className="w-3.5 h-3.5" /> Configure ID
              </button>
              <button
                onClick={(e) => testSyncHealth(item, e)}
                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-center cursor-pointer font-bold"
                title="Test Ping Trigger"
              >
                Sync Test
              </button>
              <button
                onClick={(e) => toggleStatus(item, e)}
                className={`px-3 py-1.5 rounded-lg text-center font-bold cursor-pointer border ${
                  item.status === "Active"
                    ? "bg-rose-50 border-rose-250 text-rose-700 hover:bg-rose-100"
                    : "bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700"
                }`}
              >
                {item.status === "Active" ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CONFIGURE INTEGRATION DETAILS DRAWER */}
      {configInteg && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-100">
            <div className="p-4 bg-gray-50 border-b border-gray-150 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Settings2 className="w-4 h-4 text-indigo-500" />
                Configure Connection Credentials &bull; {configInteg.name}
              </h3>
              <button
                onClick={() => setConfigInteg(null)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleConfigSubmit}
              className="p-5 space-y-4 text-xs animate-transition"
            >
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  OAuth Client ID / Api Access Key *
                </label>
                <input
                  type="text"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2.5 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Client Secret Key (Protected) *
                </label>
                <input
                  type="password"
                  required
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2.5 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Synchronization Webhook Callback URL
                </label>
                <input
                  type="url"
                  placeholder="https://api.acme.com/hooks"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2.5 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfigInteg(null)}
                  className="px-3.5 py-1.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Save Active connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
