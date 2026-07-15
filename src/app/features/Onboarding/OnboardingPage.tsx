import { AnimatePresence, motion } from "motion/react";
import { usePermissionKey } from "../../shared/permission-engine/usePermission";
import { P } from "../../shared/permission-engine/permissions";
import { useOnboarding } from "./hooks/useOnboarding";

/* Dashboard Components */
import { Header } from "./components/Dashboard/Header";
import { InfoBar } from "./components/Dashboard/InfoBar";
import { StatsCards } from "./components/Dashboard/StatsCards";
import { OnboardingTabs } from "./components/Dashboard/OnboardingTabs";
import { EmployeeList } from "./components/Dashboard/EmployeeList";
import { Templates } from "./components/Dashboard/Templates";

/* Workspace Components */
import { EmployeeSummary } from "./components/Workspace/EmployeeSummary";
import { CompanyProcess } from "./components/Workspace/CompanyProcess";
import { CandidateProcess } from "./components/Workspace/CandidateProcess";
import { Documents } from "./components/Workspace/Documents";
import { ActionToolbar } from "./components/Workspace/ActionToolbar";

/* Employee View */
import { EmployeePortal } from "./components/Employee/EmployeePortal";

/* Modals */
import { InitiateOnboardingModal } from "./modals/InitiateOnboardingModal";
import { UploadDocumentModal } from "./modals/UploadDocumentModal";
import { TemplateEditorModal } from "./modals/TemplateEditorModal";
import {
  EscalationModal,
  PhaseConfirmModal,
  ReminderModal,
  InlineTaskForm,
} from "./modals/ConfirmationModals";

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in duration-500">
      <div
        className="w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 shadow-xl"
        style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)" }}
      >
        <span style={{ fontSize: "32px" }}>🔒</span>
      </div>
      <h2 className="text-[22px] font-black text-foreground mb-2">Access Denied</h2>
      <p className="text-[14px] text-muted-foreground max-w-sm leading-relaxed">
        You do not have permission to view the onboarding module. Please contact support if you believe this is an error.
      </p>
    </div>
  );
}

export function Onboarding() {
  const canManage = usePermissionKey(P.ONBOARDING_MANAGE);
  const canSelf = usePermissionKey(P.ONBOARDING_SELF);
  const hook = useOnboarding();

  if (canManage) {
    return (
      <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-6 animate-in fade-in duration-500">
        {/* PAGE HEADER */}
        <Header
          onOpenTemplates={() => hook.setShowTemplatesPanel(true)}
          onNewOnboarding={() => {
            hook.setShowInitiateModal(true);
            hook.setInitiateStep(1);
            hook.setSelectedTemplate(null);
          }}
        />

        {/* MAIN CONTENT */}
        <AnimatePresence mode="wait">
          {hook.activeTab === "templates" ? (
            <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Templates
                showTemplateMenu={hook.showTemplateMenu}
                setShowTemplateMenu={hook.setShowTemplateMenu}
                setEditingTemplate={hook.setEditingTemplate}
                setShowTemplateEditor={hook.setShowTemplateEditor}
                handleDuplicateTemplate={hook.handleDuplicateTemplate}
                handleDeleteTemplate={hook.handleDeleteTemplate}
              />
            </motion.div>
          ) : hook.selectedId && hook.selected ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[calc(100vh-160px)]"
            >
              <EmployeeSummary selected={hook.selected} onClose={() => hook.setSelectedId(null)} />

              {/* Sub-tab selection bar */}
              <div className="flex border-b border-border bg-muted/10 px-6 overflow-x-auto scrollbar-hide shrink-0">
                {([
                  { key: "company", label: "Company Process Checklist" },
                  { key: "candidate", label: "Candidate Process" },
                  { key: "documents", label: "Documents" }
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => hook.setWorkspaceTab(tab.key)}
                    className={`px-4 py-3.5 text-[12px] font-black uppercase tracking-wider border-b-2 transition-all relative whitespace-nowrap ${
                      hook.workspaceTab === tab.key
                        ? "border-[#00B87C] text-[#00B87C]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Tab Content Container */}
              <div className="flex-1 overflow-y-auto bg-background/50">
                {hook.workspaceTab === "company" && (
                  <CompanyProcess
                    phases={hook.phases}
                    handleMarkDone={hook.handleMarkDone}
                    handleSendReminder={hook.handleSendReminder}
                    handleEscalate={hook.handleEscalate}
                  />
                )}
                {hook.workspaceTab === "candidate" && (
                  <CandidateProcess
                    employeeId={hook.selected.id}
                    employeeName={hook.selected.name}
                    employeeProgress={hook.selected.progress}
                  />
                )}
                {hook.workspaceTab === "documents" && (
                  <Documents
                    documents={hook.documents}
                    uploadedDocs={hook.uploadedDocs}
                    handleViewDoc={hook.handleViewDoc}
                    handleRequestDoc={hook.handleRequestDoc}
                    handleUploadClick={hook.handleUploadClick}
                    handleUploadDoc={hook.handleUploadDoc}
                  />
                )}
              </div>

              <ActionToolbar
                inlineTaskOpen={hook.inlineTaskOpen}
                setInlineTaskOpen={hook.setInlineTaskOpen}
                setShowReminderModal={hook.setShowReminderModal}
                handleDownloadReport={hook.handleDownloadReport}
                handleMarkPhaseComplete={hook.handleMarkPhaseComplete}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* INFO BAR */}
              <InfoBar
                activeCount={hook.activeCount}
                overdueTasks={hook.overdueTasks}
                joiningThisWeek={hook.joiningThisWeek}
              />

              {/* KPI CARDS */}
              <StatsCards
                activeCount={hook.activeCount}
                completedCount={hook.completedCount}
                overdueTasks={hook.overdueTasks}
                pendingDocs={hook.pendingDocs}
              />

              {/* TABS */}
              <OnboardingTabs
                activeTab={hook.activeTab}
                setActiveTab={hook.setActiveTab}
                activeCount={hook.activeCount}
                preJoiningCount={hook.preJoiningCount}
                completedCount={hook.completedCount}
              />

              {/* Employee List Table */}
              <EmployeeList
                filteredList={hook.filteredList}
                selectedId={hook.selectedId}
                setSelectedId={hook.setSelectedId}
                searchQuery={hook.searchQuery}
                setSearchQuery={hook.setSearchQuery}
                filterPill={hook.filterPill}
                setFilterPill={hook.setFilterPill}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── MODALS ─── */}
        <InitiateOnboardingModal
          show={hook.showInitiateModal}
          onClose={() => hook.setShowInitiateModal(false)}
          initiateStep={hook.initiateStep}
          setInitiateStep={hook.setInitiateStep}
          selectedTemplate={hook.selectedTemplate}
          setSelectedTemplate={hook.setSelectedTemplate}
          formEmployee={hook.formEmployee}
          setFormEmployee={hook.setFormEmployee}
          formJoinDate={hook.formJoinDate}
          setFormJoinDate={hook.setFormJoinDate}
          formDept={hook.formDept}
          setFormDept={hook.setFormDept}
          formDesig={hook.formDesig}
          setFormDesig={hook.setFormDesig}
          formManager={hook.formManager}
          setFormManager={hook.setFormManager}
          formEmpType={hook.formEmpType}
          setFormEmpType={hook.setFormEmpType}
          handleLaunchOnboarding={hook.handleLaunchOnboarding}
        />

        <UploadDocumentModal
          show={hook.showUploadModal}
          onClose={() => hook.setShowUploadModal(false)}
          handleConfirmUpload={hook.handleConfirmUpload}
        />

        <TemplateEditorModal
          showTemplatesPanel={hook.showTemplatesPanel}
          setShowTemplatesPanel={hook.setShowTemplatesPanel}
          showTemplateEditor={hook.showTemplateEditor}
          setShowTemplateEditor={hook.setShowTemplateEditor}
          editingTemplate={hook.editingTemplate}
          setEditingTemplate={hook.setEditingTemplate}
        />

        <EscalationModal
          show={hook.showEscalateModal}
          onClose={() => hook.setShowEscalateModal(false)}
          confirmEscalate={hook.confirmEscalate}
        />

        <PhaseConfirmModal
          show={hook.showPhaseConfirm}
          onClose={() => hook.setShowPhaseConfirm(false)}
          confirmPhaseComplete={hook.confirmPhaseComplete}
        />

        <ReminderModal
          show={hook.showReminderModal}
          onClose={() => hook.setShowReminderModal(false)}
          selected={hook.selected}
          phases={hook.phases}
        />

        <InlineTaskForm
          show={hook.inlineTaskOpen}
          onClose={() => hook.setInlineTaskOpen(false)}
          inlineTaskText={hook.inlineTaskText}
          setInlineTaskText={hook.setInlineTaskText}
          inlineTaskOwner={hook.inlineTaskOwner}
          setInlineTaskOwner={hook.setInlineTaskOwner}
          inlineTaskDueDate={hook.inlineTaskDueDate}
          setInlineTaskDueDate={hook.setInlineTaskDueDate}
          handleAddInlineTask={hook.handleAddInlineTask}
        />

        {/* Click-away overlay for template menu */}
        {hook.showTemplateMenu && (
          <div className="fixed inset-0 z-10" onClick={() => hook.setShowTemplateMenu(null)} />
        )}
      </div>
    );
  }

  if (canSelf) {
    return <EmployeePortal />;
  }

  return <AccessDenied />;
}

