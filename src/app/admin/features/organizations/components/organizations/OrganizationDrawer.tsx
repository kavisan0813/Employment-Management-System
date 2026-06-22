/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X } from "lucide-react";
import { Organization, PlatformUser, Subscription, AuditLogEntry } from "../../../../types";
import { DrawerTab } from "../../types/organization.types";
import { OrganizationProfile } from "./OrganizationProfile";
import { OrganizationSubscription } from "./OrganizationSubscription";
import { StatusHistory } from "./StatusHistory";
import { OrganizationSettings } from "./OrganizationSettings";

interface OrganizationDrawerProps {
  isOpen: boolean;
  org: Organization | null;
  users: PlatformUser[];
  subscriptions: Subscription[];
  logs: AuditLogEntry[];
  tab: DrawerTab;
  setTab: (tab: DrawerTab) => void;
  onClose: () => void;
  onNavigate: (view: string, targetId?: string) => void;
}

export function OrganizationDrawer({
  isOpen,
  org,
  users,
  subscriptions,
  logs,
  tab,
  setTab,
  onClose,
  onNavigate,
}: OrganizationDrawerProps) {
  if (!isOpen || !org) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:max-w-xl bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden">
      <div className="p-5 bg-[#F4F1EC] border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 flex items-center justify-center font-bold text-base">
            {org.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 truncate max-w-sm">
              {org.name}
            </h3>
            <p className="text-[11px] font-mono text-gray-400">
              {org.id}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full bg-white focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex border-b border-gray-200 text-xs font-medium text-gray-500 px-2">
        {(
          ["overview", "users", "billing", "activity", "settings"] as const
        ).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-center capitalize transition-colors relative focus:outline-none ${
              tab === t
                ? "text-gray-900 font-semibold"
                : "hover:text-gray-700"
            }`}
          >
            {t}
            {tab === t && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-amber-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-gray-700">
        {tab === "overview" && (
          <OrganizationProfile org={org} onNavigate={onNavigate} />
        )}

        {tab === "users" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                Users at this organization
              </h4>
              <button
                type="button"
                onClick={() => onNavigate("Global Users")}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 focus:outline-none"
              >
                + Invite user
              </button>
            </div>
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-50 border border-gray-100 border-dashed rounded-2xl">
                No users yet for this organization.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3.5 flex items-center justify-between hover:bg-gray-50/50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {user.email}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[11px] text-gray-600 font-medium">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "billing" && (
          <OrganizationSubscription subscriptions={subscriptions} />
        )}

        {tab === "activity" && (
          <StatusHistory logs={logs} />
        )}

        {tab === "settings" && (
          <OrganizationSettings />
        )}
      </div>

      <div className="p-4 bg-[#F4F1EC] border-t border-gray-200 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          All actions are audit-logged
        </span>
        <button
          type="button"
          onClick={() => onNavigate("Subscriptions")}
          className="px-3.5 py-2 text-xs border border-gray-300 hover:bg-white text-gray-700 rounded-full font-medium transition-colors focus:outline-none"
        >
          View subscription
        </button>
      </div>
    </div>
  );
}

export default OrganizationDrawer;
