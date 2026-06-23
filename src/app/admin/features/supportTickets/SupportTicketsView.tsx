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
  ChevronDown,
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

const tabs: { id: Tab; label: string; icon: any; group: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3, group: "Overview" },
  { id: "tickets", label: "Support Tickets", icon: MessageSquare, group: "Ticket Desk" },
  { id: "issues", label: "Issue Tracking", icon: Bug, group: "Ticket Desk" },
  { id: "features", label: "Feature Requests", icon: Lightbulb, group: "Ticket Desk" },
  { id: "feedback", label: "Feedback", icon: Star, group: "Ticket Desk" },
  { id: "sla", label: "SLA Management", icon: Shield, group: "Governance" },
  { id: "kb", label: "Knowledge Base", icon: BookOpen, group: "Governance" },
  { id: "escalation", label: "Escalation Rules", icon: Zap, group: "Governance" },
];

const groups = ["Overview", "Ticket Desk", "Governance"] as const;

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
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-950 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-indigo-650" />
            Support & Tickets
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Super Admin Help Desk CRM. Manage support tickets, track issues, handle feature requests, and monitor SLA policies.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-750 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Support Pipeline Active
        </div>
      </div>

      {/* Top Tab Navigation Bar (Grouped on Hover) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs relative">
        <div className="flex items-center gap-2 p-1.5">
          {groups.map((groupName) => {
            const isGroupActive = tabs.some(item => item.group === groupName && item.id === activeTab);
            const activeItemInGroup = tabs.find(item => item.group === groupName && item.id === activeTab);
            
            return (
              <div key={groupName} className="relative group/menu">
                {/* Main Group Button */}
                <button
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isGroupActive
                      ? "bg-indigo-50 text-indigo-750 border-indigo-100"
                      : "bg-transparent text-gray-600 hover:bg-gray-55 hover:text-gray-900 border-transparent"
                  }`}
                >
                  <span>{groupName}</span>
                  {activeItemInGroup && (
                    <span className="text-[10px] text-indigo-650 font-extrabold bg-indigo-100/50 px-1.5 py-0.5 rounded-md ml-1">
                      {activeItemInGroup.label}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover/menu:rotate-180 transition-transform duration-200" />
                </button>

                {/* Hover Dropdown Menu */}
                <div className="absolute left-0 top-full pt-1.5 z-40 hidden group-hover/menu:block min-w-[220px]">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 space-y-0.5 animate-in fade-in duration-100">
                    {tabs
                      .filter((item) => item.group === groupName)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                              isActive
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "text-gray-600 hover:text-gray-955 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Workspace View */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header of Active Tab */}
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                {tabs.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Detailed diagnostics workspace for {activeTab} operations.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-blue-750 font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Open: {hook.stats.open}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 rounded-lg text-[11px] text-red-750 font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Breached: {hook.stats.slaBreached}</span>
              </div>
            </div>
          </div>

          {/* Render block */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
