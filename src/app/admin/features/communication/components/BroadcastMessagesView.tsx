/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Send, Eye, Users, CheckCircle, Sliders, ChevronLeft, ChevronRight } from "lucide-react";

interface BroadcastMessagesViewProps {
  bcStep: number;
  setBcStep: (val: number) => void;
  bcTitle: string;
  setBcTitle: (val: string) => void;
  bcCampaign: string;
  setBcCampaign: (val: string) => void;
  bcAudience: string;
  setBcAudience: (val: string) => void;
  bcChannels: string[];
  setBcChannels: React.Dispatch<React.SetStateAction<string[]>>;
  bcMessageText: string;
  setBcMessageText: (val: string) => void;
  handleSendBroadcast: () => void;
}

export function BroadcastMessagesView({
  bcStep,
  setBcStep,
  bcTitle,
  setBcTitle,
  bcCampaign,
  setBcCampaign,
  bcAudience,
  setBcAudience,
  bcChannels,
  setBcChannels,
  bcMessageText,
  setBcMessageText,
  handleSendBroadcast
}: BroadcastMessagesViewProps) {

  const audiences = [
    { id: "Everyone", label: "Everyone (All Organizations)" },
    { id: "Enterprise Only", label: "Enterprise Customers Only" },
    { id: "Trial Only", label: "Trial Orgs (Lead Nurturing)" }
  ];

  const channelsList = ["Email", "SMS", "Push"];

  const handleToggleChannel = (ch: string) => {
    if (bcChannels.includes(ch)) {
      setBcChannels(prev => prev.filter(item => item !== ch));
    } else {
      setBcChannels(prev => [...prev, ch]);
    }
  };

  const nextStep = () => {
    if (bcStep === 1 && (!bcTitle.trim() || !bcCampaign.trim() || !bcMessageText.trim())) {
      alert("Please complete the message details.");
      return;
    }
    if (bcStep === 3 && bcChannels.length === 0) {
      alert("Please select at least one delivery channel.");
      return;
    }
    setBcStep(bcStep + 1);
  };

  const prevStep = () => {
    setBcStep(bcStep - 1);
  };

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-2xl text-xs font-bold font-mono">
        {[
          { step: 1, label: "Compose" },
          { step: 2, label: "Target" },
          { step: 3, label: "Channels" },
          { step: 4, label: "Review & Send" }
        ].map(item => (
          <div key={item.step} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono ${
              bcStep === item.step
                ? "bg-indigo-600 text-white border-indigo-650"
                : bcStep > item.step
                ? "bg-teal-50 text-teal-700 border-teal-100"
                : "bg-white text-gray-400 border-gray-200"
            }`}>
              {item.step}
            </span>
            <span className={bcStep === item.step ? "text-gray-900" : "text-gray-400"}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Steps View Contents */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs min-h-[220px] flex flex-col justify-between">
        
        {bcStep === 1 && (
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Step 1: Compose Message Content</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Feature Release"
                  value={bcCampaign}
                  onChange={e => setBcCampaign(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Broadcast Subject/Title</label>
                <input
                  type="text"
                  placeholder="e.g. New Payroll Integration Shipped!"
                  value={bcTitle}
                  onChange={e => setBcTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Broadcast Message Body</label>
              <textarea
                rows={5}
                placeholder="Write your announcement details here..."
                value={bcMessageText}
                onChange={e => setBcMessageText(e.target.value)}
                className="w-full bg-gray-50 border border-gray-205 rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:outline-indigo-500 font-mono"
              />
            </div>
          </div>
        )}

        {bcStep === 2 && (
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1">
              <Users className="w-4 h-4 text-indigo-500" /> Step 2: Target Audience Segmentation
            </h5>
            
            <div className="space-y-1 max-w-md">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Audience Filter Segment</label>
              <select
                value={bcAudience}
                onChange={e => setBcAudience(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:outline-indigo-500 cursor-pointer"
              >
                {audiences.map(aud => (
                  <option key={aud.id} value={aud.id}>{aud.label}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl max-w-md text-xs font-semibold text-indigo-850">
              Estimated Recipient Size: <span className="font-extrabold text-indigo-950 font-mono">500 Organizations</span> (approx. 47,000 active employees).
            </div>
          </div>
        )}

        {bcStep === 3 && (
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider">Step 3: Select Communication Channels</h5>
            <div className="flex gap-4">
              {channelsList.map(ch => {
                const isSelected = bcChannels.includes(ch);
                return (
                  <button
                    key={ch}
                    onClick={() => handleToggleChannel(ch)}
                    className={`flex-1 p-4 border rounded-2xl text-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-xs font-extrabold block">{ch} Campaign</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {bcStep === 4 && (
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider flex items-center gap-1">
              <Eye className="w-4 h-4 text-indigo-500" /> Step 4: Campaign Review & Dispatch
            </h5>
            
            <div className="grid grid-cols-2 gap-6 text-xs border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Campaign Name</span>
                  <span className="font-extrabold text-gray-900">{bcCampaign}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Segment Audience</span>
                  <span className="font-extrabold text-indigo-750">{bcAudience}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Delivery Channels</span>
                  <span className="font-extrabold text-teal-700">{bcChannels.join(" + ")}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Subject / Header</span>
                  <span className="font-extrabold text-gray-900">{bcTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Message Text Outline</span>
                  <div className="text-[11px] text-gray-600 leading-tight font-medium font-sans truncate">{bcMessageText}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          {bcStep > 1 ? (
            <button
              onClick={prevStep}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold cursor-pointer border border-gray-200 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {bcStep < 4 ? (
            <button
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-2xl text-xs font-bold cursor-pointer border-none transition-all shadow-sm active:scale-95 ml-auto"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSendBroadcast}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-705 text-white rounded-2xl text-xs font-black cursor-pointer border-none transition-all shadow-md shadow-emerald-600/10 hover:scale-105 active:scale-95 ml-auto"
            >
              <Send className="w-4 h-4" /> Send Campaign Broadcast Now
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
