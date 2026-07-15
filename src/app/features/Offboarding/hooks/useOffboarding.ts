import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { showToast } from "../../../components/workflow/ToastNotification";
import { ExitEmployee, ExitType } from "../types/offboarding.types";
import { EXITS } from "../data/mockExits";
import { getExitDocuments, OFFBOARDING_EXITS_KEY, OFFBOARDING_UPDATED_EVENT, verifyExitDocument } from "../services/offboardingWorkflow";

const withSharedDocuments = (exit: ExitEmployee): ExitEmployee => {
  const employeeDocuments = getExitDocuments(exit.name);
  const generatedDocuments = exit.documents.filter((document) => document.source !== "employee_exit");
  return { ...exit, documents: [...employeeDocuments, ...generatedDocuments] };
};

export function useOffboarding() {
  const { user } = useAuth();
  const [exits, setExits] = useState<ExitEmployee[]>(() => {
    const saved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).map(withSharedDocuments);
      } catch (e) {
        console.error(e);
      }
    }
    return EXITS.map(withSharedDocuments);
  });

  useEffect(() => {
    localStorage.setItem(OFFBOARDING_EXITS_KEY, JSON.stringify(exits));
  }, [exits]);

  useEffect(() => {
    const refresh = () => {
      const saved = localStorage.getItem(OFFBOARDING_EXITS_KEY);
      if (!saved) return;
      try { setExits(JSON.parse(saved).map(withSharedDocuments)); } catch { /* keep last valid state */ }
    };
    window.addEventListener(OFFBOARDING_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(OFFBOARDING_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const activeExits = exits.filter((e) => e.progress < 100);
  const completedExits = exits.filter((e) => e.progress === 100);
  const scheduledExits = exits.filter((e) => e.progress < 30 && e.progress > 0);

  const stats = {
    activeExits: activeExits.length,
    completedThisMonth: completedExits.length,
    pendingFF: exits.filter(
      (e) =>
        e.ffStatus === "Awaiting Finance Clearance" || e.ffStatus === "Pending",
    ).length,
    assetsPending: exits.filter((e) =>
      e.assets.some((a) => a.status === "pending"),
    ).length,
    docsPending: exits.filter((e) =>
      e.documents.some(
        (d) => d.status === "pending" || d.status === "not_generated",
      ),
    ).length,
    interviewsDone: `${exits.filter((e) => e.interviewDone).length}/${exits.length}`,
  };

  const handleExportCSV = () => {
    const content = `Offboarding Report\nName,Designation,Department,LWD,Progress,InterviewDone,F&F Status\n${exits
      .map(
        (e) =>
          `"${e.name}","${e.designation}","${e.department}","${e.lwd}",${e.progress}%,${e.interviewDone},"${e.ffStatus}"`,
      )
      .join("\n")}`;
    const blob = new Blob([content], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Offboarding_Report_${Date.now()}.csv`;
    a.click();
    showToast(
      "Export Completed",
      "success",
      "Offboarding report CSV downloaded.",
    );
  };

  const handleSignOff = (exitId: string, dept: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const clearance = e.clearance.map((c) =>
          c.dept === dept ? { ...c, status: "cleared" as const } : c,
        );

        const clearedCount = clearance.filter(
          (c) => c.status === "cleared",
        ).length;
        const clearanceWeight = (clearedCount / clearance.length) * 50;

        const returnedAssets = e.assets.filter(
          (a) => a.status === "returned",
        ).length;
        const assetsWeight =
          e.assets.length > 0 ? (returnedAssets / e.assets.length) * 25 : 25;

        const uploadedDocs = e.documents.filter(
          (d) => d.status === "uploaded",
        ).length;
        const docsWeight =
          e.documents.length > 0
            ? (uploadedDocs / e.documents.length) * 25
            : 25;

        const progress = Math.round(
          clearanceWeight + assetsWeight + docsWeight,
        );
        return { ...e, clearance, progress };
      }),
    );
    showToast("Clearance Sign-Off", "success", `${dept} clearance signed off.`);
  };

  const handleVerifyDocument = (documentId: string, approved: boolean) => {
    verifyExitDocument(documentId, approved);
    showToast("Document Verification", "success", approved ? "Document verified." : "Document rejected.");
  };

  const handleGenerateDoc = (exitId: string, docName: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const documents = e.documents.map((d) =>
          d.name === docName ? { ...d, status: "uploaded" as const } : d,
        );

        const clearedCount = e.clearance.filter(
          (c) => c.status === "cleared",
        ).length;
        const clearanceWeight = (clearedCount / e.clearance.length) * 50;

        const returnedAssets = e.assets.filter(
          (a) => a.status === "returned",
        ).length;
        const assetsWeight =
          e.assets.length > 0 ? (returnedAssets / e.assets.length) * 25 : 25;

        const uploadedDocs = documents.filter(
          (d) => d.status === "uploaded",
        ).length;
        const docsWeight =
          documents.length > 0 ? (uploadedDocs / documents.length) * 25 : 25;

        const progress = Math.round(
          clearanceWeight + assetsWeight + docsWeight,
        );
        return { ...e, documents, progress };
      }),
    );
    showToast(
      "Document Generated",
      "success",
      `${docName} generated successfully.`,
    );
  };

  const handleSendToFinance = (exitId: string) => {
    const isHR = user?.role === "HR Manager";
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        return {
          ...e,
          ffStatus: isHR
            ? "Awaiting Finance Clearance"
            : "Approved & Processed",
        };
      }),
    );
    showToast(
      "F&F Settlement",
      "success",
      isHR
        ? "F&F initiated and sent to Finance for clearance."
        : "F&F settlement approved and sent to bank.",
    );
  };

  const handleConfirmComplete = (exitId: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const timeline = e.timeline.map((t) => ({
          ...t,
          status: "done" as const,
        }));
        return { ...e, progress: 100, timeline };
      }),
    );
    showToast(
      "Exit Completed",
      "success",
      "Employee exit process marked as completed.",
    );
  };

  const handleCompleteInterview = (exitId: string) => {
    setExits((prev) =>
      prev.map((e) => {
        if (e.id !== exitId) return e;
        const documents = e.documents.map((d) =>
          d.name === "Exit Interview Form"
            ? { ...d, status: "uploaded" as const }
            : d,
        );
        return { ...e, interviewDone: true, documents };
      }),
    );
    showToast(
      "Interview Completed",
      "success",
      "Exit interview recorded successfully.",
    );
  };

  const handleInitiateExit = (
    name: string,
    type: ExitType,
    lwd: string,
    noticeDays: number,
  ) => {
    const formattedLWD = lwd
      ? new Date(lwd).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "May 10, 2026";
    const newExit: ExitEmployee = {
      id: `exit${Date.now()}`,
      name,
      designation: "Software Engineer",
      department: "Engineering",
      type,
      lwd: formattedLWD,
      progress: 10,
      resumptionDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      acceptedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      noticePeriodDays: noticeDays || 30,
      timeline: [
        { label: "Resignation Letter Received", date: "Today", status: "done" },
        { label: "Resignation Accepted", date: "Today", status: "done" },
        { label: "Notice Period Started", date: "Today", status: "active" },
        { label: "Clearances In Progress", date: "Pending", status: "pending" },
        { label: "Exit Complete", date: "Pending", status: "pending" },
      ],
      clearance: [
        {
          dept: "Manager",
          person: "Rahul Sharma",
          status: "cleared",
          icon: "User",
          color: "#00B87C",
          bgColor: "#DCFCE7",
        },
        {
          dept: "IT",
          person: "IT Team",
          status: "pending",
          icon: "Laptop",
          color: "#0EA5E9",
          bgColor: "#E0F2FE",
        },
        {
          dept: "Finance",
          person: "Finance Team",
          status: "pending",
          icon: "Briefcase",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
        },
        {
          dept: "HR",
          person: "HR Team",
          status: "pending",
          icon: "User",
          color: "#8B5CF6",
          bgColor: "#EDE9FE",
        },
        {
          dept: "Admin",
          person: "Admin Team",
          status: "cleared",
          icon: "ShieldCheck",
          color: "#14B8A6",
          bgColor: "#CCFBF1",
        },
      ],
      assets: [
        { name: "Laptop", status: "pending", detail: "Pending return" },
        { name: "Access Card", status: "pending", detail: "Pending" },
      ],
      documents: [
        { name: "Resignation Letter", status: "uploaded" },
        { name: "Relieving Letter", status: "not_generated" },
        { name: "Experience Letter", status: "pending" },
      ],
      salary: 95000,
      gratuity: 0,
      leaveEncashment: 15000,
      reimbursements: 2000,
      deductions: 0,
      netAmount: 112000,
      ffStatus: "Pending",
      interviewDone: false,
    };
    setExits((prev) => [newExit, ...prev]);
  };

  // Helper to add approved employee from resignation directly to exits
  const addApprovedExit = (resignationData: {
    name: string;
    designation: string;
    department: string;
    resignationDate: string;
    lwd: string;
    noticePeriod: string;
  }) => {
    const noticeDays = parseInt(resignationData.noticePeriod) || 30;
    const newExit: ExitEmployee = {
      id: `exit${Date.now()}`,
      name: resignationData.name,
      designation: resignationData.designation,
      department: resignationData.department,
      type: "Resignation",
      lwd: resignationData.lwd,
      progress: 10,
      resumptionDate: resignationData.resignationDate,
      acceptedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      noticePeriodDays: noticeDays,
      timeline: [
        { label: "Resignation Letter Received", date: resignationData.resignationDate, status: "done" },
        { label: "Resignation Accepted", date: "Today", status: "done" },
        { label: "Notice Period Started", date: "Today", status: "active" },
        { label: "Clearances In Progress", date: "Pending", status: "pending" },
        { label: "Exit Complete", date: "Pending", status: "pending" },
      ],
      clearance: [
        {
          dept: "Manager",
          person: "Rahul Sharma",
          status: "cleared",
          icon: "User",
          color: "#00B87C",
          bgColor: "#DCFCE7",
        },
        {
          dept: "IT",
          person: "IT Team",
          status: "pending",
          icon: "Laptop",
          color: "#0EA5E9",
          bgColor: "#E0F2FE",
        },
        {
          dept: "Finance",
          person: "Finance Team",
          status: "pending",
          icon: "Briefcase",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
        },
        {
          dept: "HR",
          person: "HR Team",
          status: "pending",
          icon: "User",
          color: "#8B5CF6",
          bgColor: "#EDE9FE",
        },
        {
          dept: "Admin",
          person: "Admin Team",
          status: "cleared",
          icon: "ShieldCheck",
          color: "#14B8A6",
          bgColor: "#CCFBF1",
        },
      ],
      assets: [
        { name: "Laptop", status: "pending", detail: "Pending return" },
        { name: "Access Card", status: "pending", detail: "Pending" },
      ],
      documents: [
        { name: "Resignation Letter", status: "uploaded" },
        { name: "Relieving Letter", status: "not_generated" },
        { name: "Experience Letter", status: "pending" },
      ],
      salary: 95000,
      gratuity: 0,
      leaveEncashment: 15000,
      reimbursements: 2000,
      deductions: 0,
      netAmount: 112000,
      ffStatus: "Pending",
      interviewDone: false,
    };
    setExits((prev) => [newExit, ...prev]);
  };

  return {
    exits,
    stats,
    activeExits,
    completedExits,
    scheduledExits,
    handleExportCSV,
    handleSignOff,
    handleVerifyDocument,
    handleGenerateDoc,
    handleSendToFinance,
    handleConfirmComplete,
    handleCompleteInterview,
    handleInitiateExit,
    addApprovedExit,
  };
}
