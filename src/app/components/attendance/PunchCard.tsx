import { useState, useEffect } from "react";
import { useAttendance, formatTime12Hour } from "../../context/AttendanceContext";

export function PunchCard() {
  const {
    todayRecord,
    derivedState,
    isOnBreak,
    handlePunchIn,
    handlePunchOut,
    handleStartBreak,
    handleEndBreak,
  } = useAttendance();

  const [tickerTime, setTickerTime] = useState<string>("");

  useEffect(() => {
    if (derivedState !== "punched-in" || !todayRecord?.punchIn) {
      setTickerTime("");
      return;
    }

    const updateTicker = () => {
      const start = new Date(todayRecord.punchIn!).getTime();
      const now = Date.now();
      const elapsedMs = now - start;
      
      const elapsedSecs = Math.floor(elapsedMs / 1000);
      const hrs = Math.floor(elapsedSecs / 3600);
      const mins = Math.floor((elapsedSecs % 3600) / 60);
      const secs = elapsedSecs % 60;
      
      setTickerTime(`${hrs}h ${mins}m ${secs}s`);
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);

    return () => clearInterval(interval);
  }, [derivedState, todayRecord?.punchIn]);

  const inTimeStr = todayRecord?.punchIn ? formatTime12Hour(todayRecord.punchIn) : "-";
  const outTimeStr = todayRecord?.punchOut ? formatTime12Hour(todayRecord.punchOut) : "-";

  return (
    <div className="bg-card rounded-2xl p-7 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-black text-foreground">
          Today's Shift Attendance
        </h3>
        <span className="text-[12px] font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-lg border border-border">
          {new Date().toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-secondary/50 rounded-2xl p-6 border-l-[4px] border-primary">
        <div className="flex-1 w-full">
          <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">
            MORNING SHIFT (09:00 – 18:00)
          </p>

          {derivedState === "punched-in" ? (
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-[16px] font-black text-foreground flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                Active Shift In Progress
              </p>
              <p className="text-[13px] font-semibold text-muted-foreground">
                Punched in at:{" "}
                <span className="text-foreground font-bold">{inTimeStr}</span>
              </p>
              {tickerTime && (
                <p className="text-[13px] font-semibold text-muted-foreground">
                  Time elapsed:{" "}
                  <span className="text-primary font-black">{tickerTime}</span>
                </p>
              )}
            </div>
          ) : derivedState === "punched-out" ? (
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-[16px] font-black text-emerald-600 dark:text-emerald-500 flex items-center gap-2">
                ✓ Shift Completed
              </p>
              <p className="text-[13px] font-semibold text-muted-foreground">
                In: <span className="text-foreground font-bold">{inTimeStr}</span> | Out:{" "}
                <span className="text-foreground font-bold">{outTimeStr}</span>
              </p>
              <p className="text-[13px] font-semibold text-muted-foreground">
                Total worked:{" "}
                <span className="text-primary font-black">{todayRecord?.hours || "-"}</span>
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-[16px] font-black text-muted-foreground">
                Not Punched In Yet
              </p>
              <p className="text-[13px] font-semibold text-muted-foreground">
                Please punch in to record your attendance.
              </p>
            </div>
          )}

          {/* Display Today's Logs Timeline */}
          {todayRecord?.logs && todayRecord.logs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-3">
                Today's Activity Timeline
              </p>
              <div className="space-y-3">
                {todayRecord.logs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        log.type === "in" || log.type === "break_end"
                          ? "bg-emerald-500"
                          : log.type === "break_start"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                    <span className="text-[12px] font-bold text-foreground w-[65px]">
                      {log.time}
                    </span>
                    <span className="text-[12px] font-medium text-muted-foreground">
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {derivedState === "punched-in" && (
            <>
              {!isOnBreak ? (
                <button
                  type="button"
                  onClick={handleStartBreak}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
                >
                  Take Break
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEndBreak}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
                >
                  End Break
                </button>
              )}
              <button
                type="button"
                onClick={handlePunchOut}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
              >
                Punch Out
              </button>
            </>
          )}

          {derivedState === "not-punched" && (
            <button
              type="button"
              onClick={handlePunchIn}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00B87C] to-[#009966] hover:from-[#00c987] hover:to-[#00a36d] text-white font-black text-[13px] uppercase tracking-wider hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all border-none cursor-pointer"
            >
              Punch In
            </button>
          )}

          {/* Summary card has no action buttons when punched out */}
        </div>
      </div>
    </div>
  );
}
