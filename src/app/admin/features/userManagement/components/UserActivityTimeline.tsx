import React from "react";
import { Activity } from "lucide-react";
import { db } from "../../../mockData";

export function UserActivityTimeline() {
  const activities = db.activityLogs.get().slice(0, 10); // get latest 10 activities

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Recent User Activity
          </h2>
          <p className="text-xs text-gray-500">
            Global timeline of actions across all managed users.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs relative">
        <div className="absolute top-4 bottom-4 left-6 w-px bg-gray-200"></div>
        <div className="space-y-6 relative">
          {activities.map((log) => (
            <div key={log.id} className="flex gap-4 items-start">
              <div className="w-4 h-4 rounded-full bg-indigo-100 border-2 border-indigo-500 mt-1 z-10"></div>
              <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                  <span className="text-[10px] font-mono text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{log.description}</p>
                <div className="flex items-center gap-3 text-[10px] font-medium">
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    User: {log.user}
                  </span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    Org: {log.organization}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center text-xs text-gray-400 py-6">
              No recent activity logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
