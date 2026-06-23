import React, { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Bug,
  Lightbulb,
  Star,
  Shield,
  BookOpen,
  Zap,
  BarChart3,
  Headphones,
} from "lucide-react";
import { useSupportTickets } from "./hooks/useSupportTickets";

import { SupportDashboard } from "./components/SupportDashboard";
import { TicketsTable } from "./components/TicketsTable";
import { IssueTracker } from "./components/IssueTracker";
import { FeatureRequests } from "./components/FeatureRequests";
import { FeedbackManagement } from "./components/FeedbackManagement";
import { SLAManagement } from "./components/SLAManagement";
import { KnowledgeBase } from "./components/KnowledgeBase";
import { EscalationRules } from "./components/EscalationRules";
import { SupportReports } from "./components/SupportReports";

type Tab =
  | "dashboard"
  | "tickets"
  | "issues"
  | "features"
  | "feedback"
  | "sla"
  | "kb"
  | "escalation"
  | "reports";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tickets", label: "Support Tickets", icon: MessageSquare },
  { id: "issues", label: "Issue Tracking", icon: Bug },
  { id: "features", label: "Feature Requests", icon: Lightbulb },
  { id: "feedback", label: "Feedback", icon: Star },
  { id: "sla", label: "SLA Management", icon: Shield },
  { id: "kb", label: "Knowledge Base", icon: BookOpen },
  { id: "escalation", label: "Escalation Rules", icon: Zap },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
];

export default function SupportTicketsView() {
  const hook = useSupportTickets();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <SupportDashboard stats={hook.stats} />;
      case "tickets":
        return <TicketsTable hook={hook} />;
      case "issues":
        return <IssueTracker issues={hook.issues} actions={hook.actions} />;
      case "features":
        return (
          <FeatureRequests
            featureRequests={hook.featureRequests}
            actions={hook.actions}
          />
        );
      case "feedback":
        return <FeedbackManagement feedback={hook.feedback} />;
      case "sla":
        return (
          <SLAManagement
            slaPolicies={hook.slaPolicies}
            actions={hook.actions}
          />
        );
      case "kb":
        return <KnowledgeBase kbArticles={hook.kbArticles} />;
      case "escalation":
        return (
          <EscalationRules
            escalationRules={hook.escalationRules}
            actions={hook.actions}
          />
        );
      case "reports":
        return (
          <SupportReports tickets={hook.tickets} feedback={hook.feedback} />
        );
      default:
        return <SupportDashboard stats={hook.stats} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#F8F9FA]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col relative z-10 shadow-xs">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2 text-indigo-700">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">
              Support & Tickets
            </h2>
            <p className="text-[10px] font-medium text-indigo-400">
              Help Desk CRM
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-2">
            Navigation
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700 shadow-xs"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Summary footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white rounded-lg p-2 border border-gray-100 shadow-xs">
              <p className="text-lg font-bold text-blue-600">
                {hook.stats.open}
              </p>
              <p className="text-[9px] font-bold text-gray-400 uppercase">
                Open
              </p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-100 shadow-xs">
              <p className="text-lg font-bold text-red-600">
                {hook.stats.slaBreached}
              </p>
              <p className="text-[9px] font-bold text-gray-400 uppercase">
                Breached
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="p-8 max-w-6xl mx-auto pb-32">{renderContent()}</div>
      </div>
    </div>
  );
}
