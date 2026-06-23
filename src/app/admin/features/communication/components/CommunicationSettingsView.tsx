/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Settings, Mail, MessageSquare, Bell, ShieldAlert } from "lucide-react";
import { CommunicationState, CommunicationSettings } from "../types/communication.types";

interface CommunicationSettingsViewProps {
  state: CommunicationState;
  handleSaveSettings: (settings: CommunicationSettings) => void;
}

export function CommunicationSettingsView({ state, handleSaveSettings }: CommunicationSettingsViewProps) {
  const [smtpHost, setSmtpHost] = useState(state.settings.smtpHost);
  const [smtpPort, setSmtpPort] = useState(state.settings.smtpPort);
  const [smtpUser, setSmtpUser] = useState(state.settings.smtpUser);
  const [senderEmail, setSenderEmail] = useState(state.settings.senderEmail);
  const [senderName, setSenderName] = useState(state.settings.senderName);
  
  const [smsGateway, setSmsGateway] = useState(state.settings.smsGateway);
  const [smsApiKey, setSmsApiKey] = useState(state.settings.smsApiKey);
  
  const [fcmConfig, setFcmConfig] = useState(state.settings.fcmConfig);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveSettings({
      smtpHost,
      smtpPort,
      smtpUser,
      senderEmail,
      senderName,
      smsGateway,
      smsApiKey,
      fcmConfig
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      
      {/* SMTP Email Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-indigo-500" /> Platform Outbound SMTP Configuration
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">SMTP Mail Server Host</label>
            <input
              type="text"
              required
              value={smtpHost}
              onChange={e => setSmtpHost(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Server TCP Port</label>
            <input
              type="number"
              required
              value={smtpPort}
              onChange={e => setSmtpPort(parseInt(e.target.value) || 25)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">SMTP Auth User Name</label>
            <input
              type="text"
              required
              value={smtpUser}
              onChange={e => setSmtpUser(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Outbound Sender Email Address</label>
            <input
              type="email"
              required
              value={senderEmail}
              onChange={e => setSenderEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Sender Display Name</label>
            <input
              type="text"
              required
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* SMS Gateway Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-teal-600" /> Mobile SMS Gateway Credentials
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">SMS Service Gateway API</label>
            <select
              value={smsGateway}
              onChange={e => setSmsGateway(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
            >
              <option value="Twilio SMS Gateway">Twilio API Gateway</option>
              <option value="MSG91 Service Gate">MSG91 Indian Carrier</option>
              <option value="TextLocal Provider">TextLocal Global</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Gateway Auth Key / Token</label>
            <input
              type="password"
              required
              value={smsApiKey}
              onChange={e => setSmsApiKey(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* FCM configurations */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-sky-500" /> Firebase Cloud Messaging Configuration Payload
        </h4>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">FCM App Configuration object (JSON string)</label>
          <textarea
            required
            rows={4}
            value={fcmConfig}
            onChange={e => setFcmConfig(e.target.value)}
            className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-semibold text-gray-900 focus:outline-indigo-500 font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Save action buttons */}
      <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl">
        <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
          <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" /> Altering credentials updates outbound service variables.
        </span>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-none transition-all hover:scale-105 active:scale-95"
        >
          <Settings className="w-4 h-4" /> Save Credentials Settings
        </button>
      </div>

    </form>
  );
}
