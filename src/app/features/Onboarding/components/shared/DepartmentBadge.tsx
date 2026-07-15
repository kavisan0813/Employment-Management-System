/* ─── Department Badge ─── */

export function DepartmentBadge({ dept, color }: { dept: string; color: string }) {
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
      style={{
        backgroundColor: `${color}15`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {dept}
    </div>
  );
}
