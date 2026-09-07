import React from "react";
import { AlertCircle, CheckCircle2, Cpu, Clock, TrendingDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

interface AttendanceAlertsProps {
  onOpenHardwareConfig?: () => void;
}

export function AttendanceAlerts({ onOpenHardwareConfig }: AttendanceAlertsProps) {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl border bg-card shadow-sm p-5 space-y-4"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-500" />
          <span>System Alerts & Workforce Insights</span>
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Real-time Monitoring</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Alert 1: Late Attendance Peak */}
        <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock size={16} />
          </div>
          <div>
            <p className="text-xs font-extrabold text-amber-900 dark:text-amber-300">Late Attendance Anomaly</p>
            <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400 mt-0.5 leading-snug">
              Marketing department recorded 4 late check-ins this week beyond the 15-minute grace threshold.
            </p>
          </div>
        </div>

        {/* Alert 2: Attendance Goal Met */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-300">Attendance Goal Achieved</p>
            <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5 leading-snug">
              Engineering team reached 98% present attendance rate yesterday across HQ and Remote.
            </p>
          </div>
        </div>

        {/* Alert 3: Hardware Integration Status */}
        <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3 justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cpu size={16} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-blue-900 dark:text-blue-300">Biometric Sync Active</p>
              <p className="text-[11px] font-medium text-blue-700 dark:text-blue-400 mt-0.5 leading-snug">
                3 of 4 attendance terminals online. Branch Office RFID retry scheduled in 5m.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
