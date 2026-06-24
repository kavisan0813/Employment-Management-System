/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MessageSquare, Edit3, ShieldCheck, HelpCircle } from "lucide-react";
import { CommunicationState, SmsTemplate } from "../types/communication.types";

interface SmsTemplatesViewProps {
  state: CommunicationState;
  handleSaveSmsTemplate: (template: SmsTemplate) => void;
}

export function SmsTemplatesView({ state, handleSaveSmsTemplate }: SmsTemplatesViewProps) {
  const [selectedId, setSelectedId] = useState(state.smsTemplates[0]?.id || "");
  const [message, setMessage] = useState("");
  const [templateName, setTemplateName] = useState("");

  const currentTemplate = state.smsTemplates.find(t => t.id === selectedId);

  useEffect(() => {
    if (currentTemplate) {
      setMessage(currentTemplate.message);
      setTemplateName(currentTemplate.template_name);
    }
  }, [selectedId, currentTemplate]);

  const mockSmsVariables: Record<string, string> = {
    "{{otp}}": "882903",
    "{{employee_name}}": "Kumar Ananth",
    "{{leave_date}}": "25-Dec-2026",
    "{{organization}}": "Acme Corp"
  };

  const getMappedSmsPreview = (text: string) => {
    let output = text;
    Object.entries(mockSmsVariables).forEach(([variable, value]) => {
      const escapedVar = variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      output = output.replace(new RegExp(escapedVar, "g"), value);
    });
    return output;
  };

  const charCount = message.length;
  const segments = Math.max(1, Math.ceil(charCount / 160));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    handleSaveSmsTemplate({ id: selectedId, template_name: templateName, message });
  };

  const gateways = [
    { name: "Twilio Gateway API (Global)", status: "Active Connection", ping: "450ms", color: "bg-teal-50 text-teal-700 border-teal-200" },
    { name: "MSG91 Service (India Core)", status: "Active Connection", ping: "120ms", color: "bg-teal-50 text-teal-700 border-teal-200" },
    { name: "TextLocal API Gateway", status: "Suspended", ping: "Timeout", color: "bg-gray-100 text-gray-600 border-gray-200" }
  ];

  return (
    <div className="space-y-6">
      {/* Template selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Select SMS Message Template</span>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full sm:w-80 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none cursor-pointer font-mono"
        >
          {state.smsTemplates.map(temp => (
            <option key={temp.id} value={temp.id}>{temp.template_name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SMS message Editor */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 pb-2 border-b border-gray-100">
            <Edit3 className="w-4 h-4 text-indigo-500" /> SMS Text Content Editor
          </h4>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Template Label</label>
            <input
              type="text"
              required
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-medium text-gray-500">
              <label>SMS Message Body</label>
              <span className="font-mono">{charCount} / 160 (Segment: {segments})</span>
            </div>
            <textarea
              required
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Character length above 160 divides message into segments.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              Commit SMS Template
            </button>
          </div>
        </form>

        {/* SMS Live preview & Glossary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-semibold text-gray-700 block mb-2">SMS Template variables</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {Object.keys(mockSmsVariables).map((v) => (
                <div key={v} className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-indigo-600 font-mono block">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-semibold text-gray-700 block">SMS Message Output preview</span>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-sm text-gray-700 leading-relaxed font-mono">
              {getMappedSmsPreview(message) || "No message body defined."}
            </div>
          </div>
        </div>
      </div>

      {/* Gateway status list */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> SMS Gateway Core Interfaces Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gateways.map(g => (
            <div key={g.name} className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between text-xs font-medium">
              <div className="space-y-0.5">
                <span className="text-gray-700 block">{g.name}</span>
                <span className="text-xs text-gray-400">Ping: {g.ping}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${g.color}`}>{g.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}