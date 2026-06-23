/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, Smartphone, Bell, MessageSquare, PhoneCall, CheckCircle2, AlertTriangle, PlayCircle } from "lucide-react";

export function DeliveryChannelsView() {
  const channels = [
    {
      id: "in-app",
      name: "In-App Notification Center",
      icon: Bell,
      rate: "99.9%",
      latency: "4ms",
      status: "Operational",
      provider: "Internal Socket Server",
      description: "Delivers notifications directly into client employee workspaces."
    },
    {
      id: "email",
      name: "SMTP Outbound Relay",
      icon: Mail,
      rate: "98.2%",
      latency: "1.2s",
      status: "Operational",
      provider: "smtp.emspro.com",
      description: "Delivers subscription billing invoices and renewal alerts."
    },
    {
      id: "sms",
      name: "SMS Gateway Relay",
      icon: MessageSquare,
      rate: "94.7%",
      latency: "2.8s",
      status: "Degraded Performance",
      provider: "Twilio SMS Hub API",
      description: "Dispatches critical security logs and MFA authentication codes."
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business API",
      icon: PhoneCall,
      rate: "96.5%",
      latency: "3.1s",
      status: "Operational",
      provider: "Meta WhatsApp Cloud API",
      description: "Dispatches friendly subscription warning notices."
    },
    {
      id: "push",
      name: "Web Push Browser Alerts",
      icon: Smartphone,
      rate: "99.0%",
      latency: "15ms",
      status: "Operational",
      provider: "Firebase Cloud Messaging",
      description: "Delivers live flash warning alerts directly to active user browsers."
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Channels Status overview grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {channels.map(ch => {
          const Icon = ch.icon;
          const isDegraded = ch.status !== "Operational";
          return (
            <div key={ch.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isDegraded ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-650"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 leading-tight">{ch.name}</h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 block">Provider: {ch.provider}</span>
                  </div>
                </div>

                <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                  isDegraded ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  {ch.status}
                </span>
              </div>

              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">{ch.description}</p>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-700 font-mono">
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-gray-400 block mb-0.5">Success Rate</span>
                  <span className="text-gray-900 font-black">{ch.rate}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-gray-400 block mb-0.5">Avg Delivery Delay</span>
                  <span className="text-gray-900 font-black">{ch.latency}</span>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* Degradation Alert if warning exists */}
      <div className="p-4 bg-amber-50/20 border border-amber-100 rounded-xl text-[10px] text-amber-900 leading-relaxed font-semibold flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
        <div>
          <strong>SMS Gateway Relay Warning:</strong> Twilio API report indicates increased latency (average 2.8s delay) for verification SMS dispatches on select regional carriers. Failover logic is routing messages smoothly.
        </div>
      </div>

    </div>
  );
}
