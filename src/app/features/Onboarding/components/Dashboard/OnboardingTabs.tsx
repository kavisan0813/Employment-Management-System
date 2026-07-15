import { motion } from "motion/react";
import { TEMPLATES } from "../../constants/templates";

interface OnboardingTabsProps {
  activeTab: "active" | "pre-joining" | "completed" | "templates";
  setActiveTab: (tab: "active" | "pre-joining" | "completed" | "templates") => void;
  activeCount: number;
  preJoiningCount: number;
  completedCount: number;
}

export function OnboardingTabs({ activeTab, setActiveTab, activeCount, preJoiningCount, completedCount }: OnboardingTabsProps) {
  const tabs = [
    { key: "pre-joining" as const, label: "Pending", count: preJoiningCount },
    { key: "active" as const, label: "In Progress", count: activeCount },
    { key: "completed" as const, label: "Completed", count: completedCount },
    { key: "templates" as const, label: "Templates", count: TEMPLATES.length },
  ];

  return (
    <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-6 py-4 text-[13px] font-semibold tracking-wider uppercase transition-all relative whitespace-nowrap ${activeTab === tab.key ? "text-[#00B87C]" : "text-muted-foreground hover:text-foreground"}`}
        >
          {tab.label} ({tab.count})
          {activeTab === tab.key && (
            <motion.div
              layoutId="onboardingTab"
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00B87C]"
            />
          )}
        </button>
      ))}
    </div>
  );
}
