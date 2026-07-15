import React from "react";
import { motion } from "motion/react";
import { User, Check, Clock, Laptop, FileText, Star } from "lucide-react";

interface KPICardsProps {
  stats: {
    activeExits: number;
    completedThisMonth: number;
    pendingFF: number;
    assetsPending: number;
    docsPending: number;
    interviewsDone: string;
  };
}

export const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KpiCard
        icon={User}
        bgColor="#FEE2E2"
        iconColor="#EF4444"
        label="ACTIVE EXITS"
        value={`${stats.activeExits}`}
        valueColor="text-[#EF4444]"
        sub="in progress"
      />
      <KpiCard
        icon={Check}
        bgColor="#DCFCE7"
        iconColor="#00B87C"
        label="COMPLETED THIS MONTH"
        value={`${stats.completedThisMonth}`}
        valueColor="text-[#00B87C]"
        sub="fully settled"
      />
      <KpiCard
        icon={Clock}
        bgColor="#FEF3C7"
        iconColor="#F59E0B"
        label="PENDING F&F SETTLEMENT"
        value={`${stats.pendingFF}`}
        valueColor="text-amber-500"
        sub="awaiting Finance"
      />
      <KpiCard
        icon={Laptop}
        bgColor="#E0F2FE"
        iconColor="#0EA5E9"
        label="ASSETS PENDING RETURN"
        value={`${stats.assetsPending}`}
        valueColor="text-[#0EA5E9]"
        sub="from exiting employees"
      />
      <KpiCard
        icon={FileText}
        bgColor="#EDE9FE"
        iconColor="#8B5CF6"
        label="DOCS PENDING SIGNATURE"
        value={`${stats.docsPending}`}
        valueColor="text-[#8B5CF6]"
        sub="exit docs unsigned"
      />
      <KpiCard
        icon={Star}
        bgColor="#DCFCE7"
        iconColor="#00B87C"
        label="EXIT INTERVIEWS DONE"
        value={stats.interviewsDone}
        valueColor="text-[#00B87C]"
        sub="this cycle"
      />
    </div>
  );
};

interface KpiCardProps {
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  label: string;
  value: string;
  valueColor: string;
  sub: string;
}

function KpiCard({
  icon: Icon,
  bgColor,
  iconColor,
  label,
  value,
  valueColor,
  sub,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
          {label}
        </p>
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>
      <h3 className={`text-[28px] font-black tracking-tighter ${valueColor}`}>
        {value}
      </h3>
      <p className="text-[12px] font-bold text-[#6B7280] mt-1">{sub}</p>
    </motion.div>
  );
}
