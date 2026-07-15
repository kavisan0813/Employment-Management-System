interface InfoBarProps {
  activeCount: number;
  overdueTasks: number;
  joiningThisWeek: number;
}

export function InfoBar({ activeCount, overdueTasks, joiningThisWeek }: InfoBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-5 px-5 py-3 rounded-2xl bg-[#00B87C]/[0.06] border border-[#00B87C]/15">
      <div className="flex items-center gap-2 text-[12px] font-bold text-[#00B87C]">
        <span className="w-2 h-2 rounded-full bg-[#00B87C]" /> {activeCount}{" "}
        new hires currently onboarding
      </div>
      <div className="w-px h-4 bg-[#00B87C]/20" />
      <div className="flex items-center gap-2 text-[12px] font-bold text-[#F59E0B]">
        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> {overdueTasks}{" "}
        tasks overdue across active onboardings
      </div>
      <div className="w-px h-4 bg-[#00B87C]/20" />
      <div className="flex items-center gap-2 text-[12px] font-bold text-[#14B8A6]">
        <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />{" "}
        {joiningThisWeek} new hires joining this week
      </div>
    </div>
  );
}
