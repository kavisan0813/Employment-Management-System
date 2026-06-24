/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Send, Eye, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Announcement } from "../types/communication.types";

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
  bcStep, setBcStep, bcTitle, setBcTitle, bcCampaign, setBcCampaign,
  bcAudience, setBcAudience, bcChannels, setBcChannels, bcMessageText,
  setBcMessageText, handleSendBroadcast
}: BroadcastMessagesViewProps) {

  const audiences = [
    { id: "Everyone", label: "Everyone (All Organizations)" },
    { id: "Enterprise Only", label: "Enterprise Customers Only" },
    { id: "Trial Only", label: "Trial Orgs (Lead Nurturing)" }
  ];

  const channelsList = ["Email", "SMS", "Push"];

  const handleToggleChannel = (ch: string) => {
    setBcChannels(prev => prev.includes(ch) ? prev.filter(item => item !== ch) : [...prev, ch]);
  };

  const nextStep = () => {
    if (bcStep === 1 && (!bcTitle.trim() || !bcCampaign.trim() || !bcMessageText.trim())) return;
    if (bcStep === 3 && bcChannels.length === 0) return;
    setBcStep(bcStep + 1);
  };

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl text-xs font-medium text-gray-500 shadow-sm">
        {[
          { step: 1, label: "Compose" },
          { step: 2, label: "Target" },
          { step: 3, label: "Channels" },
          { step: 4, label: "Review" }
        ].map(item => (
          <div key={item.step} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-semibold ${
              bcStep === item.step ? "bg-indigo-600 text-white border-indigo-600" :
              bcStep > item.step ? "bg-teal-50 text-teal-700 border-teal-100" : "bg-white text-gray-400 border-gray-200"
            }`}>
              {item.step}
            </span>
            <span className={bcStep === item.step ? "text-gray-900 font-semibold" : ""}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Steps Content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
        <div className="space-y-6">
          {bcStep === 1 && (
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-gray-700">Compose Message</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Campaign Name</label>
                  <input type="text" value={bcCampaign} onChange={e => setBcCampaign(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Subject / Title</label>
                  <input type="text" value={bcTitle} onChange={e => setBcTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Broadcast Message Body</label>
                <textarea rows={5} value={bcMessageText} onChange={e => setBcMessageText(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 outline-none" />
              </div>
            </div>
          )}

          {bcStep === 2 && (
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-gray-700">Target Audience</h5>
              <div className="space-y-1 max-w-sm">
                <label className="text-xs font-medium text-gray-500">Select Segment</label>
                <select value={bcAudience} onChange={e => setBcAudience(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none">
                  {audiences.map(aud => <option key={aud.id} value={aud.id}>{aud.label}</option>)}
                </select>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-medium text-indigo-800">
                Estimated reach: 500 Organizations (47,000 employees).
              </div>
            </div>
          )}

          {bcStep === 3 && (
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-gray-700">Communication Channels</h5>
              <div className="flex gap-4">
                {channelsList.map(ch => (
                  <button key={ch} onClick={() => handleToggleChannel(ch)} className={`flex-1 p-4 border rounded-xl text-center text-sm font-semibold transition-all ${bcChannels.includes(ch) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          )}

          {bcStep === 4 && (
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Eye className="w-4 h-4" /> Review & Dispatch</h5>
              <div className="grid grid-cols-2 gap-6 text-sm border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <div className="space-y-2">
                  <p><span className="text-gray-500">Campaign:</span> <span className="font-semibold">{bcCampaign}</span></p>
                  <p><span className="text-gray-500">Audience:</span> <span className="font-semibold">{bcAudience}</span></p>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Channels:</span> <span className="font-semibold">{bcChannels.join(", ")}</span></p>
                  <p><span className="text-gray-500">Subject:</span> <span className="font-semibold">{bcTitle}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
          <button onClick={() => setBcStep(bcStep - 1)} disabled={bcStep === 1} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          
          {bcStep < 4 ? (
            <button onClick={nextStep} className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSendBroadcast} className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all">
              <Send className="w-4 h-4" /> Send Broadcast
            </button>
          )}
        </div>
      </div>
    </div>
  );
}