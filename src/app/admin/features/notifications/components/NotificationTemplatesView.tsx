/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, MessageSquare, PhoneCall, Info, LayoutTemplate, Save } from "lucide-react";
import { NotificationTemplate } from "../types/notifications.types";

interface Props {
  templates: NotificationTemplate[];
  onSaveTemplate: (tpl: NotificationTemplate) => void;
}

export function NotificationTemplatesView({ templates, onSaveTemplate }: Props) {
  const [selectedId, setSelectedId] = useState("tpl-001");
  const [activeChannelTab, setActiveChannelTab] = useState<"email" | "sms" | "whatsapp">("email");

  const currentTemplate = templates.find(t => t.id === selectedId) || templates[0];
  const [subject, setSubject] = useState(currentTemplate.subject);
  const [emailBody, setEmailBody] = useState(currentTemplate.emailBody);
  const [smsBody, setSmsBody] = useState(currentTemplate.smsBody);
  const [whatsappBody, setWhatsappBody] = useState(currentTemplate.whatsappBody);

  React.useEffect(() => {
    setSubject(currentTemplate.subject);
    setEmailBody(currentTemplate.emailBody);
    setSmsBody(currentTemplate.smsBody);
    setWhatsappBody(currentTemplate.whatsappBody);
  }, [selectedId, currentTemplate]);

  const handleSave = () => {
    onSaveTemplate({ ...currentTemplate, subject, emailBody, smsBody, whatsappBody });
  };

  const getTemplateLabel = (type: string) => ({
    welcome: "New Organization Onboarding",
    billingFailed: "Failed Payment Invoice Alert",
    expiry: "Subscription Renewal Warning",
    securityAlert: "Suspicious Access Alert"
  }[type] || type);

  const getParsedPreview = (bodyText: string) => bodyText
    .replace("{{user_name}}", "Pradeep Kumar")
    .replace("{{org_name}}", "Acme Corporation")
    .replace("{{invoice_id}}", "INV-928")
    .replace("{{days}}", "7")
    .replace("{{location}}", "USA / Dallas")
    .replace("{{user_email}}", "admin@acme.com");

  return (
    <div className="space-y-6 font-semibold">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Template List */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm space-y-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider px-2 mb-2 block font-medium">Available Templates</span>
          {templates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => setSelectedId(tpl.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all border ${
                tpl.id === selectedId ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-transparent border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              <LayoutTemplate className="w-4 h-4 flex-shrink-0" />
              <div className="overflow-hidden">
                <div className="truncate text-xs font-semibold">{getTemplateLabel(tpl.type)}</div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">{tpl.subject}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Editor Board */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-indigo-600 font-medium">Configuring Template</span>
              <h3 className="text-sm font-semibold text-gray-900">{getTemplateLabel(currentTemplate.type)}</h3>
            </div>
            
            <div className="flex gap-1 text-xs">
              {[
                { id: "email", label: "Email", icon: Mail },
                { id: "sms", label: "SMS", icon: MessageSquare },
                { id: "whatsapp", label: "WhatsApp", icon: PhoneCall }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChannelTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
                    activeChannelTab === tab.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-5">
            {activeChannelTab === "email" && (
              <div className="space-y-1.5 text-xs text-gray-700">
                <label className="text-[10px] text-gray-400 uppercase">Email Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-400 transition-colors" />
              </div>
            )}

            <div className="space-y-1.5 text-xs text-gray-700">
              <label className="text-[10px] text-gray-400 uppercase">{activeChannelTab} Template Content</label>
              <textarea
                value={activeChannelTab === "email" ? emailBody : activeChannelTab === "sms" ? smsBody : whatsappBody}
                onChange={e => {
                  const val = e.target.value;
                  if (activeChannelTab === "email") setEmailBody(val);
                  else if (activeChannelTab === "sms") setSmsBody(val);
                  else setWhatsappBody(val);
                }}
                rows={6}
                className="w-full p-3 font-mono text-[11px] border border-gray-200 rounded-lg bg-gray-50 focus:bg-white outline-none focus:border-indigo-400"
              />
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
              <span className="text-[9px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3 text-indigo-500" /> Parsed Preview
              </span>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-[11px] text-gray-600 min-h-[80px] whitespace-pre-wrap">
                {getParsedPreview(activeChannelTab === "email" ? emailBody : activeChannelTab === "sms" ? smsBody : whatsappBody)}
              </div>
            </div>

            <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2">
              <Save className="w-3.5 h-3.5" /> Save Template Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}