/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Globe, Building2, Mail, Users, MapPin, Activity, ArrowUpRight 
} from "lucide-react";
import { Organization } from "../../../../types";
import { StorageUsage } from "./StorageUsage";

interface OrganizationProfileProps {
  org: Organization;
  onNavigate: (view: string, targetId?: string) => void;
}

function InfoTile({
  icon: Icon,
  label,
  value,
  mono,
  truncate,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
      <span className="text-gray-400 text-[10px] uppercase font-semibold tracking-wide">
        {label}
      </span>
      <p
        className={`text-gray-900 mt-1 flex items-center gap-1.5 font-medium ${mono ? "font-mono" : ""}`}
        title={truncate ? value : undefined}
      >
        <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className={truncate ? "truncate" : ""}>{value}</span>
      </p>
    </div>
  );
}

export function OrganizationProfile({ org, onNavigate }: OrganizationProfileProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InfoTile
          icon={Globe}
          label="Domain"
          value={org.domain}
          mono
        />
        <InfoTile
          icon={Building2}
          label="Plan"
          value={org.plan}
        />
        <InfoTile
          icon={Mail}
          label="Owner"
          value={org.ownerEmail}
          truncate
        />
        <InfoTile
          icon={Users}
          label="Seats"
          value={`${org.userCount} / ${org.seatLimit}`}
        />
        <InfoTile
          icon={MapPin}
          label="Region"
          value={org.region}
        />
        <InfoTile
          icon={Activity}
          label="Joined"
          value={new Date(org.joinedAt).toLocaleDateString()}
        />
      </div>

      <StorageUsage 
        usedGB={org.plan === "Enterprise" ? 38.6 : org.plan === "Growth" ? 14.2 : 2.5} 
        limitGB={org.plan === "Enterprise" ? 500 : org.plan === "Growth" ? 100 : 20} 
      />

      <div className="border border-amber-200 bg-amber-50/70 rounded-2xl p-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-amber-700" />
          <h4 className="text-xs font-semibold text-amber-900">
            Tenant health
          </h4>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Based on usage, support load, and payment history, this
          organization currently scores{" "}
          <strong className="text-amber-950">
            91 / 100 (Healthy)
          </strong>
          . No alerts flagged.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigate("Login as Tenant", org.id)}
          className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full text-xs flex items-center gap-1.5 focus:outline-none"
        >
          Impersonate org admin
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default OrganizationProfile;
