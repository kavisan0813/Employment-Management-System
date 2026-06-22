/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckSquare, Square, ShieldAlert } from "lucide-react";
import { Organization } from "../../../../types";

interface OrganizationsTableProps {
  orgs: Organization[];
  selectedOrgs: string[];
  toggleSelectAll: () => void;
  toggleSelect: (id: string, e: React.MouseEvent) => void;
  onRowClick: (id: string) => void;
  onEdit: (org: Organization, e: React.MouseEvent) => void;
  onSuspend: (org: Organization, e: React.MouseEvent) => void;
  onDelete: (org: Organization, e: React.MouseEvent) => void;
}

function ColHeader({ label }: { label: string }) {
  return (
    <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </th>
  );
}

function RowActionButton({
  onClick,
  label,
  tone = "gray",
}: {
  onClick: (e: React.MouseEvent) => void;
  label: string;
  tone?: "gray" | "rose" | "amber" | "emerald";
}) {
  const toneClass =
    tone === "rose"
      ? "text-rose-600 hover:bg-rose-50 border-rose-100 hover:text-rose-700"
      : tone === "amber"
        ? "text-amber-700 hover:bg-amber-50 border-amber-100 hover:text-amber-800"
        : tone === "emerald"
          ? "text-emerald-700 hover:bg-emerald-50 border-emerald-100 hover:text-emerald-800"
          : "text-gray-600 hover:bg-gray-105 border-gray-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 border rounded-full text-[11px] font-medium transition-colors focus:outline-none ${toneClass}`}
    >
      {label}
    </button>
  );
}

export function OrganizationsTable({
  orgs,
  selectedOrgs,
  toggleSelectAll,
  toggleSelect,
  onRowClick,
  onEdit,
  onSuspend,
  onDelete,
}: OrganizationsTableProps) {
  const planBadgeClass = (plan: Organization["plan"]) =>
    plan === "Enterprise"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : plan === "Growth"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const statusDotClass = (status: Organization["status"]) =>
    status === "Active"
      ? "bg-emerald-500"
      : status === "Trial"
        ? "bg-blue-500"
        : status === "Pending"
          ? "bg-gray-400"
          : "bg-rose-500";

  const statusTextClass = (status: Organization["status"]) =>
    status === "Active"
      ? "text-emerald-700"
      : status === "Trial"
        ? "text-blue-700"
        : status === "Pending"
          ? "text-gray-500"
          : "text-rose-600";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/75 border-b border-gray-100 font-medium">
            <th className="px-5 py-3.5 w-12 text-left">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {selectedOrgs.length === orgs.length && orgs.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-amber-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
            </th>
            <ColHeader label="Name" />
            <ColHeader label="Plan" />
            <ColHeader label="MRR" />
            <ColHeader label="Status" />
            <ColHeader label="Users" />
            <ColHeader label="Region" />
            <th className="px-5 py-3.5 text-right font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orgs.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-8 text-center text-gray-400 bg-gray-50 border border-gray-100 border-dashed rounded-b-2xl">
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <ShieldAlert className="w-8 h-8 text-gray-300 animate-pulse" />
                  <span className="font-medium text-gray-500">No organizations found.</span>
                  <span className="text-[11px] text-gray-400">Try adjusting your filters or search terms.</span>
                </div>
              </td>
            </tr>
          ) : (
            orgs.map((org) => {
              const isSelected = selectedOrgs.includes(org.id);
              return (
                <tr
                  key={org.id}
                  onClick={() => onRowClick(org.id)}
                  className={`hover:bg-gray-50/50 cursor-pointer transition-colors duration-150 ${
                    isSelected ? "bg-amber-50/30" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={(e) => toggleSelect(org.id, e)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900 leading-snug">
                      {org.name}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {org.domain}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${planBadgeClass(
                        org.plan
                      )}`}
                    >
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    ${org.mrr.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDotClass(
                          org.status
                        )}`}
                      />
                      <span
                        className={`font-semibold ${statusTextClass(
                          org.status
                        )}`}
                      >
                        {org.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {org.userCount} / {org.seatLimit}
                  </td>
                  <td className="px-5 py-4 text-gray-500 font-medium">
                    {org.region}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div
                      className="inline-flex gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RowActionButton
                        onClick={(e) => onEdit(org, e)}
                        label="Edit"
                      />
                      <RowActionButton
                        onClick={(e) => onSuspend(org, e)}
                        label={
                          org.status === "Suspended"
                            ? "Reactivate"
                            : "Suspend"
                        }
                        tone={
                          org.status === "Suspended" ? "emerald" : "amber"
                        }
                      />
                      <RowActionButton
                        onClick={(e) => onDelete(org, e)}
                        label="Delete"
                        tone="rose"
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizationsTable;
