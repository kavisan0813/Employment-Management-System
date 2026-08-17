import { LEGEND_ITEMS } from "./attendance.service";

export function AttendanceLegend() {
  return (
    <div className="flex items-center flex-wrap gap-x-5 gap-y-2 px-4 py-2.5 rounded-xl border bg-card" style={{ borderColor: "var(--border)" }}>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-[11px] font-bold text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
