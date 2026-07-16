import React from "react";
import { motion } from "motion/react";
import { TabType } from "../types/offboarding.types";

interface TabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  stats: {
    activeExits: number;
    completedThisMonth: number;
  };
  scheduledCount: number;
  requestsCount?: number;
  templatesCount?: number;
}

export const Tabs: React.FC<TabsProps> = ({
  activeTab,
  setActiveTab,
  stats,
  scheduledCount,
  requestsCount = 0,
  templatesCount = 0,
}) => {
  const tabsList: TabType[] = [
    "Active",
    "Completed",
    "Scheduled",
    "Exit Analytics",
    "Templates",
    "Requests",
  ];

  return (
    <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide">
      {tabsList.map((tab) => {
        const isActive = activeTab === tab;
        const count =
          tab === "Requests"
            ? requestsCount
            : tab === "Active"
            ? stats.activeExits
            : tab === "Completed"
              ? stats.completedThisMonth
              : tab === "Scheduled"
                ? scheduledCount
                : tab === "Templates"
                  ? templatesCount
                  : null;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-[13px] font-semibold tracking-wider uppercase transition-all relative whitespace-nowrap ${
              isActive
                ? "text-[#00B87C]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {count !== null ? ` (${count})` : ""}
            {isActive && (
              <motion.div
                layoutId="offboardingTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00B87C]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
