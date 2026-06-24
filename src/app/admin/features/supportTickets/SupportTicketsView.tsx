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
  { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
  { id: "tickets", label: "Support Tickets", icon: MessageSquare },
  { id: "issues", label: "Issue Tracking", icon: Bug },
  { id: "features", label: "Feature Requests", icon: Lightbulb },
  { id: "feedback", label: "Feedback", icon: Star },
  { id: "sla", label: "SLA Management", icon: Shield },
  { id: "kb", label: "Knowledge Base", icon: BookOpen },
  { id: "escalation", label: "Escalation Rules", icon: Zap },
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
        return (
          <IssueTracker
            issues={hook.issues}
            actions={hook.actions}
          />
        );

      case "features":
        return (
          <FeatureRequests
            featureRequests={hook.featureRequests}
            actions={hook.actions}
          />
        );

      case "feedback":
        return (
          <FeedbackManagement
            feedback={hook.feedback}
          />
        );

      case "sla":
        return (
          <SLAManagement
            slaPolicies={hook.slaPolicies}
            actions={hook.actions}
          />
        );

      case "kb":
        return (
          <KnowledgeBase
            kbArticles={hook.kbArticles}
          />
        );

      case "escalation":
        return (
          <EscalationRules
            escalationRules={hook.escalationRules}
            actions={hook.actions}
          />
        );

      case "reports":
        return (
          <SupportReports
            tickets={hook.tickets}
            feedback={hook.feedback}
          />
        );

      default:
        return <SupportDashboard stats={hook.stats} />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4 font-semibold">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-950 flex items-center gap-2">
            <Headphones className="w-6 h-6 text-indigo-600" />
            Support & Tickets
          </h1>

          <p className="text-xs text-gray-500 font-medium mt-1">
            Super Admin Help Desk CRM. Manage support tickets, track issues,
            handle feature requests, and monitor SLA policies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 self-start md:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Support Pipeline Active
        </div>
      </div>

      {/* Top Tab Navigation Bar */}
      <div className="w-full overflow-hidden">
  <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="pt-2 font-semibold">
        {renderContent()}
      </div>
    </div>
  );
}