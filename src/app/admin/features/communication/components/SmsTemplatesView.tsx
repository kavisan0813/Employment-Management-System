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

  // SMS mapping variables
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

  // Segment logic: 160 characters per SMS segment
  const charCount = message.length;
  const segments = Math.max(1, Math.ceil(charCount / 160));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("SMS Message body cannot be empty.");
      return;
    }
    handleSaveSmsTemplate({
      id: selectedId,
      template_name: templateName,
      message
    });
  };

  // Gateway status seeds
  const gateways = [
    { name: "Twilio Gateway API (Global)", status: "Active Connection", ping: "450ms", color: "bg-teal-50 text-teal-800 border-teal-100" },
    { name: "MSG91 Service (India Core)", status: "Active Connection", ping: "120ms", color: "bg-teal-50 text-teal-800 border-teal-100" },
    { name: "TextLocal API Gateway", status: "Suspended", ping: "Timeout", color: "bg-gray-50 text-gray-650 border-gray-200" }
  ];

  return (
    <div className="space-y-6">
      {/* Template selector */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">Select SMS Message Template</span>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full sm:w-80 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer font-mono"
        >
          {state.smsTemplates.map(temp => (
            <option key={temp.id} value={temp.id}>{temp.template_name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SMS message Editor */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-indigo-500" /> SMS Text Content Editor
            </h4>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Template Label</label>
            <input
              type="text"
              required
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              <label>SMS Message Body (GSM-7 Alphabet)</label>
              <span className="font-mono">{charCount} / 160 (Segment: {segments})</span>
            </div>
            <textarea
              required
              rows={5}
              placeholder="Enter message layout..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:outline-indigo-500 font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Character length above 160 divides message into segments.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-2xl text-xs font-bold cursor-pointer border-none transition-all shadow-sm"
            >
              Commit SMS Template
            </button>
          </div>
        </form>

        {/* SMS Live preview & Glossary */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SMS variables list */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">SMS Template variables</span>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-semibold">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-150">
                <span className="text-indigo-650 font-mono font-bold block mb-0.5">{"{{otp}}"}</span>
                <span className="text-gray-550">One time passwords packet</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-150">
                <span className="text-indigo-650 font-mono font-bold block mb-0.5">{"{{employee_name}}"}</span>
                <span className="text-gray-550">Full staff profile name</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-150">
                <span className="text-indigo-650 font-mono font-bold block mb-0.5">{"{{leave_date}}"}</span>
                <span className="text-gray-550">Absence date target</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-150">
                <span className="text-indigo-650 font-mono font-bold block mb-0.5">{"{{organization}}"}</span>
                <span className="text-gray-550">Tenant label abbreviation</span>
              </div>
            </div>
          </div>

          {/* SMS preview render */}
          <div className="bg-white border border-gray-250 rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-extrabold text-indigo-750 uppercase tracking-widest block">SMS Message Output preview</span>
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-105/50 relative overflow-hidden">
              {/* Mock phone wrapper outline */}
              <div className="text-[11px] text-gray-800 leading-relaxed font-semibold font-mono bg-white p-3 rounded-lg border border-gray-150 shadow-2xs">
                {getMappedSmsPreview(message) || "No message body defined."}
              </div>
              <div className="text-[9px] text-gray-400 font-bold text-right mt-1.5">
                Segments count: {segments} ({charCount} chars)
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Gateway status list */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" /> SMS Gateway Core Interfaces Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gateways.map(g => (
            <div key={g.name} className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between text-xs font-semibold">
              <div className="space-y-0.5">
                <span className="text-gray-800 block">{g.name}</span>
                <span className="text-[10px] text-gray-400 font-medium">Ping latency: {g.ping}</span>
              </div>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${g.color}`}>{g.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
