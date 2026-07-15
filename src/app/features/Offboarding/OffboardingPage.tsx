import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TabType } from "./types/offboarding.types";
import { useOffboarding } from "./hooks/useOffboarding";
import { Header } from "./components/Header";
import { InfoBar } from "./components/InfoBar";
import { KPICards } from "./components/KPICards";
import { Tabs } from "./components/Tabs";
import { ExitCard } from "./components/ExitCard";
import { OffboardingDetail } from "./detail/OffboardingDetail";
import { InitiateExitModal } from "./modals/InitiateExitModal";
import { ReminderModal } from "./modals/ReminderModal";
import { CompleteExitModal } from "./modals/CompleteExitModal";
import { ExitInterviewModal } from "./modals/ExitInterviewModal";
import { RequestsTab } from "./components/RequestsTab";

export function OffboardingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Active");
  const [requestsCount, setRequestsCount] = useState(0);
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showReminder, setShowReminder] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState<{
    id: string;
    type: "interview" | "clearance";
  } | null>(null);

  const {
    exits,
    stats,
    activeExits,
    completedExits,
    scheduledExits,
    handleExportCSV,
    handleVerifyDocument,
    handleGenerateDoc,
    handleSendToFinance,
    handleConfirmComplete,
    handleCompleteInterview,
    handleInitiateExit,
  } = useOffboarding();

  const currentExit = showDetail ? exits.find((e) => e.id === showDetail) : null;
  const completeExit = showComplete ? exits.find((e) => e.id === showComplete) : null;

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <Header
        onExport={handleExportCSV}
        onInitiateExit={() => setShowInitiateModal(true)}
      />

      {/* INFO BAR */}
      <InfoBar
        activeExitsCount={stats.activeExits}
        pendingFFCount={stats.pendingFF}
      />

      {/* KPI CARDS */}
      <KPICards stats={stats} />

      {/* TABS */}
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        scheduledCount={scheduledExits.length}
        requestsCount={requestsCount}
      />

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Requests" && <RequestsTab onCountChange={setRequestsCount} />}

          {activeTab === "Active" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {activeExits.map((exit) => (
                <ExitCard
                  key={exit.id}
                  exit={exit}
                  onViewDetail={() => setShowDetail(exit.id)}
                  onSendReminder={() => setShowReminder(exit.id)}
                  onComplete={() => setShowComplete(exit.id)}
                  onScheduleInterview={() =>
                    setShowSchedule({ id: exit.id, type: "interview" })
                  }
                />
              ))}
            </div>
          )}

          {activeTab === "Completed" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {completedExits.map((exit) => (
                <ExitCard
                  key={exit.id}
                  exit={exit}
                  onViewDetail={() => setShowDetail(exit.id)}
                  onSendReminder={() => setShowReminder(exit.id)}
                  onComplete={() => setShowComplete(exit.id)}
                  onScheduleInterview={() =>
                    setShowSchedule({ id: exit.id, type: "interview" })
                  }
                />
              ))}
              {completedExits.length === 0 && (
                <div className="col-span-2 flex items-center justify-center h-40 text-muted-foreground font-bold text-sm">
                  No completed exits this period.
                </div>
              )}
            </div>
          )}

          {activeTab === "Scheduled" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {scheduledExits.map((exit) => (
                <ExitCard
                  key={exit.id}
                  exit={exit}
                  onViewDetail={() => setShowDetail(exit.id)}
                  onSendReminder={() => setShowReminder(exit.id)}
                  onComplete={() => setShowComplete(exit.id)}
                  onScheduleInterview={() =>
                    setShowSchedule({ id: exit.id, type: "interview" })
                  }
                />
              ))}
              {scheduledExits.length === 0 && (
                <div className="col-span-2 flex items-center justify-center h-40 text-muted-foreground font-bold text-sm">
                  No scheduled exits.
                </div>
              )}
            </div>
          )}

          {activeTab === "Exit Analytics" && (
            <div className="flex items-center justify-center h-40 text-muted-foreground font-bold text-sm">
              Exit analytics coming soon.
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* INITIATE EXIT MODAL */}
      {showInitiateModal && (
        <InitiateExitModal
          onClose={() => setShowInitiateModal(false)}
          onInitiate={handleInitiateExit}
        />
      )}

      {/* OFFBOARDING DETAIL SCREEN */}
      {showDetail && currentExit && (
        <OffboardingDetail
          exit={currentExit}
          onClose={() => setShowDetail(null)}
          onVerifyDocument={handleVerifyDocument}
          onGenerateDoc={(doc) => handleGenerateDoc(currentExit.id, doc)}
          onSendReminder={() => {
            setShowDetail(null);
            setShowReminder(currentExit.id);
          }}
          onScheduleInterview={() => {
            setShowDetail(null);
            setShowSchedule({ id: currentExit.id, type: "interview" });
          }}
          onSendToFinance={() => handleSendToFinance(currentExit.id)}
        />
      )}

      {/* SEND REMINDER MODAL */}
      {showReminder && (
        <ReminderModal
          exitName={exits.find((e) => e.id === showReminder)?.name || ""}
          onClose={() => setShowReminder(null)}
        />
      )}

      {/* COMPLETE EXIT MODAL */}
      {showComplete && completeExit && (
        <CompleteExitModal
          exit={completeExit}
          onClose={() => setShowComplete(null)}
          onConfirm={() => {
            handleConfirmComplete(completeExit.id);
            setShowComplete(null);
          }}
        />
      )}

      {/* EXIT INTERVIEW MODAL */}
      {showSchedule && (() => {
        const emp = exits.find((e) => e.id === showSchedule.id);
        if (!emp) return null;
        if (showSchedule.type === "interview") {
          return (
            <ExitInterviewModal
              employeeName={emp.name}
              interviewDone={emp.interviewDone}
              onClose={() => setShowSchedule(null)}
              onComplete={() => {
                handleCompleteInterview(emp.id);
                setShowSchedule(null);
              }}
            />
          );
        }
        return null;
      })()}
    </div>
  );
}
