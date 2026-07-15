import { AnimatePresence, motion } from "motion/react";
import { useOnboarding } from "./hooks/useOnboarding";

/* Dashboard */
import { Header } from "./components/Dashboard/Header";
import { InfoBar } from "./components/Dashboard/InfoBar";
import { StatsCards } from "./components/Dashboard/StatsCards";
import { OnboardingTabs } from "./components/Dashboard/OnboardingTabs";
import { EmployeeList } from "./components/Dashboard/EmployeeList";
import { Templates } from "./components/Dashboard/Templates";

/* Workspace */
import { EmployeeSummary } from "./components/Workspace/EmployeeSummary";
import { CompanyProcess } from "./components/Workspace/CompanyProcess";
import { Documents } from "./components/Workspace/Documents";
import { ActionToolbar } from "./components/Workspace/ActionToolbar";

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

export function Onboarding() {
  const hook = useOnboarding();

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

      {/* MAIN CONTENT */}
      <AnimatePresence mode="wait">
        {hook.activeTab === "templates" ? (
          <Templates
            showTemplateMenu={hook.showTemplateMenu}
            setShowTemplateMenu={hook.setShowTemplateMenu}
            setEditingTemplate={hook.setEditingTemplate}
            setShowTemplateEditor={hook.setShowTemplateEditor}
            handleDuplicateTemplate={hook.handleDuplicateTemplate}
            handleDeleteTemplate={hook.handleDeleteTemplate}
          />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row gap-6"
          >
            {/* LEFT COLUMN — Employee List */}
            <EmployeeList
              filteredList={hook.filteredList}
              selectedId={hook.selectedId}
              setSelectedId={hook.setSelectedId}
              searchQuery={hook.searchQuery}
              setSearchQuery={hook.setSearchQuery}
              filterPill={hook.filterPill}
              setFilterPill={hook.setFilterPill}
            />

            {/* RIGHT COLUMN — Journey Detail */}
            <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-y-auto h-[calc(100vh-340px)]">
              <EmployeeSummary selected={hook.selected} />
              <CompanyProcess
                phases={hook.phases}
                handleMarkDone={hook.handleMarkDone}
                handleSendReminder={hook.handleSendReminder}
                handleEscalate={hook.handleEscalate}
              />
              <Documents
                documents={hook.documents}
                uploadedDocs={hook.uploadedDocs}
                handleViewDoc={hook.handleViewDoc}
                handleRequestDoc={hook.handleRequestDoc}
                handleUploadClick={hook.handleUploadClick}
                handleUploadDoc={hook.handleUploadDoc}
              />
              <ActionToolbar
                inlineTaskOpen={hook.inlineTaskOpen}
                setInlineTaskOpen={hook.setInlineTaskOpen}
                setShowReminderModal={hook.setShowReminderModal}
                handleDownloadReport={hook.handleDownloadReport}
                handleMarkPhaseComplete={hook.handleMarkPhaseComplete}
              />
            </div>
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
