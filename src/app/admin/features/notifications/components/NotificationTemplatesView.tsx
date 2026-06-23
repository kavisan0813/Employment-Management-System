/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, MessageSquare, PhoneCall, Info, LayoutTemplate } from "lucide-react";
import { NotificationTemplate } from "../types/notifications.types";

interface Props {
  templates: NotificationTemplate[];
  onSaveTemplate: (tpl: NotificationTemplate) => void;
}

export function NotificationTemplatesView({ templates, onSaveTemplate }: Props) {
  const [selectedId, setSelectedId] = useState("tpl-001");
  const [activeChannelTab, setActiveChannelTab] = useState<"email" | "sms" | "whatsapp">("email");

  const currentTemplate = templates.find(t => t.id === selectedId) || templates[0];

  // Temporary local state for modifications
  const [subject, setSubject] = useState(currentTemplate.subject);
  const [emailBody, setEmailBody] = useState(currentTemplate.emailBody);
  const [smsBody, setSmsBody] = useState(currentTemplate.smsBody);
  const [whatsappBody, setWhatsappBody] = useState(currentTemplate.whatsappBody);

  // Sync state when selection changes
  React.useEffect(() => {
    setSubject(currentTemplate.subject);
    setEmailBody(currentTemplate.emailBody);
    setSmsBody(currentTemplate.smsBody);
    setWhatsappBody(currentTemplate.whatsappBody);
  }, [selectedId, currentTemplate]);

  const handleSave = () => {
    onSaveTemplate({
      ...currentTemplate,
      subject,
      emailBody,
      smsBody,
      whatsappBody
    });
  };

  const getTemplateLabel = (type: string) => {
    switch (type) {
      case "welcome": return "New Organization Onboarding";
      case "billingFailed": return "Failed Payment Invoice Alert";
      case "expiry": return "Subscription Renewal Warning";
      case "securityAlert": return "Suspicious Access Attempt Alert";
      default: return type;
    }
  };

  // Parsed body template previewer helper
  const getParsedPreview = (bodyText: string) => {
    return bodyText
      .replace("{{user_name}}", "Pradeep Kumar")
      .replace("{{org_name}}", "Acme Corporation")
      .replace("{{invoice_id}}", "INV-928")
      .replace("{{days}}", "7")
      .replace("{{location}}", "USA / Dallas")
      .replace("{{user_email}}", "admin@acme.com");
  };

  return (
    <div className="space-y-6">
      
      {/* Side-by-side template list and editing board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Templates list (Column span: 4) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs space-y-1.5 font-bold text-xs">
          <span className="text-[10px] text-gray-450 block font-extrabold uppercase tracking-wide px-2 mb-2">Available Notification Slates</span>
          {templates.map(tpl => {
            const isSelected = tpl.id === selectedId;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-left transition-all border ${
                  isSelected 
                    ? "bg-indigo-50 border-indigo-150 text-indigo-800" 
                    : "bg-transparent text-gray-600 hover:bg-gray-50 border-transparent hover:text-gray-900"
                }`}
              >
                <LayoutTemplate className="w-4 h-4 shrink-0 text-indigo-600" />
                <div className="overflow-hidden">
                  <div className="truncate font-black">{getTemplateLabel(tpl.type)}</div>
                  <div className="text-[10px] text-gray-450 truncate font-semibold mt-0.5">{tpl.subject}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Interactive Editor (Column span: 8) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
          
          {/* Subtab selection for delivery channel Email, SMS, WhatsApp */}
          <div className="px-5 py-4 border-b border-gray-150 bg-gray-50/50 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-650">Configuring slate</span>
              <h3 className="text-xs font-black text-gray-900">{getTemplateLabel(currentTemplate.type)}</h3>
            </div>
            
            <div className="flex gap-1.5 font-bold text-xs shrink-0 self-end sm:self-center">
              <button
                onClick={() => setActiveChannelTab("email")}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border ${
                  activeChannelTab === "email" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
              <button
                onClick={() => setActiveChannelTab("sms")}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border ${
                  activeChannelTab === "sms" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-55"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> SMS
              </button>
              <button
                onClick={() => setActiveChannelTab("whatsapp")}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border ${
                  activeChannelTab === "whatsapp" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-55"
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" /> WhatsApp
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            
            {/* Subject editor (For email only) */}
            {activeChannelTab === "email" && (
              <div className="space-y-1 text-xs font-bold text-gray-700">
                <label className="text-[10px] text-gray-400 block mb-1">EMAIL SUBJECT HEADER</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl"
                />
              </div>
            )}

            {/* Template Body Editor based on selected active tab */}
            <div className="space-y-1 text-xs font-bold text-gray-700">
              <label className="text-[10px] text-gray-400 block mb-1 uppercase">
                {activeChannelTab} Template Content Slate
              </label>
              <textarea
                value={
                  activeChannelTab === "email" ? emailBody :
                  activeChannelTab === "sms" ? smsBody : whatsappBody
                }
                onChange={e => {
                  const val = e.target.value;
                  if (activeChannelTab === "email") setEmailBody(val);
                  else if (activeChannelTab === "sms") setSmsBody(val);
                  else setWhatsappBody(val);
                }}
                rows={6}
                className="w-full p-3 font-mono text-[11px] leading-relaxed border border-gray-200 rounded-xl bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Visual template simulation dispatcher card */}
            <div className="bg-gray-50/50 border border-gray-150 rounded-xl p-4 space-y-2">
              <span className="text-[9px] uppercase font-black text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3 text-indigo-500" />
                Parsed output Preview (Simulated tokens)
              </span>
              <div className="bg-white border border-gray-200 rounded-lg p-3 font-medium text-[11px] leading-relaxed text-gray-700 min-h-20 whitespace-pre-wrap">
                {getParsedPreview(
                  activeChannelTab === "email" ? emailBody :
                  activeChannelTab === "sms" ? smsBody : whatsappBody
                )}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all self-end"
            >
              Commit Template changes
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
