import { UserPlus, CheckCircle2, Clock, Calendar, FileText, Clock8 } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardsProps {
  activeCount: number;
  completedCount: number;
  overdueTasks: number;
  pendingDocs: number;
}

export function StatsCards({ activeCount, completedCount, overdueTasks, pendingDocs }: StatsCardsProps) {
  const cards = [
    { icon: UserPlus, bg: "#DCFCE7", iconColor: "#00B87C", label: "Active Onboardings", value: `${activeCount}`, valColor: "text-[#00B87C]", sub: "in progress right now" },
    { icon: CheckCircle2, bg: "#DCFCE7", iconColor: "#00B87C", label: "Completed This Month", value: `${completedCount}`, valColor: "text-[#00B87C]", sub: "fully onboarded" },
    { icon: Clock, bg: "#FEF3C7", iconColor: "#F59E0B", label: "Tasks Overdue", value: `${overdueTasks}`, valColor: "text-[#F59E0B]", sub: "across all onboardings" },
    { icon: Calendar, bg: "#E0F2FE", iconColor: "#0EA5E9", label: "Joining This Week", value: "2", valColor: "text-[#0EA5E9]", sub: "Priya + Dev — Apr 8" },
    { icon: FileText, bg: "#EDE9FE", iconColor: "#8B5CF6", label: "Pending Documents", value: `${pendingDocs}`, valColor: "text-[#8B5CF6]", sub: "not yet uploaded" },
    { icon: Clock8, bg: "#F3F4F6", iconColor: "#6B7280", label: "Avg Completion Time", value: "14d", valColor: "text-[#6B7280]", sub: "from joining to complete" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C]/50 hover:shadow-[0_8px_30px_rgb(0,184,124,0.08)] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[1.5px]">
              {card.label}
            </p>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
              <card.icon size={16} style={{ color: card.iconColor }} />
            </div>
          </div>
          <h3 className={`text-lg font-black tracking-tighter ${card.valColor}`}>
            {card.value}
          </h3>
          <p className="text-[9px] font-bold text-muted-foreground mt-1">
            {card.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
