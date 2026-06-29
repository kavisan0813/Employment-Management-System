/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import { Bell, MessageSquare, AlertTriangle } from "lucide-react";

export function DeliveryChannelsView() {
  const channels = [
    { id: "in-app", name: "In-App Notification Center", icon: Bell, rate: "99.9%", latency: "4ms", status: "Operational", provider: "Internal Socket", desc: "Delivers notifications directly into client workspaces." },
    { id: "sms", name: "SMS Gateway Relay", icon: MessageSquare, rate: "94.7%", latency: "2.8s", status: "Degraded", provider: "Twilio Hub API", desc: "Dispatches critical logs and MFA codes." },

  ];

  return (
    <div className="space-y-6 font-semibold">
      
      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map(ch => {
          const Icon = ch.icon;
          const isDegraded = ch.status !== "Operational";
          
          return (
            <div key={ch.id} className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${isDegraded ? "border-amber-200" : "border-gray-200"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDegraded ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900">{ch.name}</h4>
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">Provider: {ch.provider}</span>
                  </div>
                </div>

                <span className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded border ${
                  isDegraded ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  {ch.status}
                </span>
              </div>

              <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4">{ch.desc}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="text-[9px] font-semibold text-gray-400 uppercase block mb-0.5">Success Rate</span>
                  <span className="text-xs text-gray-900">{ch.rate}</span>
                </div>
                <div>
                  <span className="text-[9px] font-semibold text-gray-400 uppercase block mb-0.5">Delivery Delay</span>
                  <span className="text-xs text-gray-900">{ch.latency}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Degradation Alert */}
      <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-900 font-medium flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>SMS Gateway Relay Warning:</strong> Twilio API report indicates increased latency (average 2.8s delay) for verification SMS. Failover logic is currently active.
        </div>
      </div>

    </div>
  );
}