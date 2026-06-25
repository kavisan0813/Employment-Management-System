import React from "react";
import { Organization } from "../../../types";
import { db } from "../../../mockData";
import { Activity } from "lucide-react";

export function OrgActivityLogs({ org }: { org: Organization }) {
  const logs = db.auditLogs
    .get()
    .filter((l) => l.organization === org.name)
    .slice(0, 20);

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Activity Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Recent activity and audit events for {org.name}.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Activity className="w-4 h-4" />
                </div>

                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-gray-900 text-sm">
                      {log.event}
                    </div>
                    <time className="font-mono text-[10px] text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </time>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    User{" "}
                    <span className="font-semibold text-gray-900">
                      {log.actor}
                    </span>{" "}
                    triggered{" "}
                    <span className="font-medium">{log.eventCategory}</span>{" "}
                    event.
                  </div>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-500 relative z-10 bg-white">
                No recent activity logs found for this organization.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
