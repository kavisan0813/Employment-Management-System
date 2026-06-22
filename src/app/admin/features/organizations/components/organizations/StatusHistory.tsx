/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AuditLogEntry } from "../../../../types";

interface StatusHistoryProps {
  logs: AuditLogEntry[];
}

export function StatusHistory({ logs }: StatusHistoryProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        Recent activity
      </h4>
      {logs.length === 0 ? (
        <div className="p-8 text-center text-gray-400 bg-gray-50 border border-gray-100 border-dashed rounded-2xl">
          No audit log entries for this organization.
        </div>
      ) : (
        <div className="max-h-[360px] overflow-y-auto border border-gray-250 rounded-2xl divide-y divide-gray-100">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 text-[11px] flex gap-3 items-start hover:bg-gray-50"
            >
              <span className="text-gray-400 font-mono shrink-0 pt-0.5">
                {new Date(log.timestamp).toLocaleDateString()}
              </span>
              <div>
                <p className="font-medium text-gray-900 font-mono">
                  {log.event}
                </p>
                <p className="text-gray-400 mt-0.5">by {log.actor}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusHistory;
