import { PLAN_DISTRIBUTION } from "../../constants/dashboard";

export function PlanDistributionCard() {
  return (
    <div className="rounded-xl border border-border/40 bg-card px-6 py-5 shadow-sm dark:bg-card/40 dark:backdrop-blur-md">
      <div className="mb-4 text-sm font-semibold tracking-wide uppercase text-foreground">
        Plan Distribution
      </div>
      <div className="flex flex-col gap-2.5">
        {PLAN_DISTRIBUTION.map((p) => (
          <div key={p.name}>
            <div className="mb-1 flex justify-between text-xs font-medium text-foreground/80">
              <span>{p.name}</span>
              <span className="text-muted-foreground">{p.pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-background dark:bg-muted/30">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${p.pct}%`, backgroundColor: p.colorVar }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PlanDistributionCard;
