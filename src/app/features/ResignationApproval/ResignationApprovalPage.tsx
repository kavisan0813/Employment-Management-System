import { useState, useEffect } from "react";
import { ResignationRequest } from "./types/resignation.types";
import { INITIAL_RESIGNATION_REQUESTS } from "./data/mockResignationRequests";
import { RequestTable } from "./RequestTable";
import { RequestDetails } from "./RequestDetails";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../components/workflow/ToastNotification";
import { ClipboardCheck, CheckSquare, Search, Filter } from "lucide-react";
import { EXITS } from "../Offboarding/data/mockExits";
import { ExitEmployee } from "../Offboarding/types/offboarding.types";

export function ResignationApprovalPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ResignationRequest[]>(() => {
    const saved = localStorage.getItem("viyan_resignation_requests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_RESIGNATION_REQUESTS;
  });

  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("viyan_resignation_requests", JSON.stringify(requests));
  }, [requests]);

  const selectedRequest = requests.find((r) => r.id === selectedReqId) || null;

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    // Search filter
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.designation.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    if (!matchesSearch) return false;
    if (activeFilter === "all") return true;
    if (activeFilter === "pending")
      return req.status === "pending_manager" || req.status === "pending_hr";
    return req.status === activeFilter;
  });

  const handleApprove = (id: string, role: string, payload?: any) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const dateStr = new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        if (role === "Manager") {
          return {
            ...req,
            status: "pending_hr",
            timeline: [
              ...req.timeline,
              {
                id: `ev-${Date.now()}`,
                action: "Manager Approved",
                performedBy: user?.name || "Manager",
                role: user?.role || "Engineering Manager",
                date: dateStr,
                comments: payload?.comments || "Approved and forwarded to HR.",
              },
            ],
          };
        } else if (role === "HR") {
          // HR Approval triggers offboarding creation!
          const updatedReq = {
            ...req,
            status: "approved" as const,
            lwd: payload?.lwd || req.lwd,
            noticePeriod: payload?.noticePeriod || req.noticePeriod,
            timeline: [
              ...req.timeline,
              {
                id: `ev-${Date.now()}`,
                action: "HR Approved",
                performedBy: user?.name || "HR Manager",
                role: user?.role || "HR Manager",
                date: dateStr,
                comments: payload?.comments || "Request Approved. Exit Process Kickstarted.",
              },
              {
                id: `ev-sys-${Date.now()}`,
                action: "Exit Process Kickoff",
                performedBy: "System",
                role: "System",
                date: dateStr,
                comments: `Exit record successfully generated with category: ${payload?.exitCategory || "Voluntary"}.`,
              },
            ],
          };

          // Trigger creation in offboarding list
          createOffboardingRecord(updatedReq, payload?.exitCategory || "Resignation");

          return updatedReq;
        }
        return req;
      })
    );
    showToast(
      "Request Approved",
      "success",
      role === "Manager" ? "Resignation approved and sent to HR." : "Resignation fully approved. Offboarding initiated."
    );
  };

  const createOffboardingRecord = (req: ResignationRequest, exitCategory: string) => {
    // Load exits
    const savedExits = localStorage.getItem("viyan_offboarding_exits");
    let exitsList: ExitEmployee[] = [];
    if (savedExits) {
      try {
        exitsList = JSON.parse(savedExits);
      } catch (e) {
        console.error(e);
      }
    }
    if (exitsList.length === 0) {
      exitsList = EXITS;
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newExit: ExitEmployee = {
      id: `exit-${Date.now()}`,
      name: req.employeeName,
      designation: req.designation,
      department: req.department,
      type: (exitCategory === "Voluntary" ? "Resignation" : exitCategory) as any,
      lwd: req.lwd,
      progress: 10,
      resumptionDate: req.resignationDate,
      acceptedDate: todayStr,
      noticePeriodDays: parseInt(req.noticePeriod) || 30,
      timeline: [
        { label: "Resignation Letter Received", date: req.resignationDate, status: "done" },
        { label: "Resignation Accepted", date: todayStr, status: "done" },
        { label: "Notice Period Started", date: todayStr, status: "active" },
        { label: "Clearances In Progress", date: "Pending", status: "pending" },
        { label: "Exit Complete", date: "Pending", status: "pending" },
      ],
      clearance: [
        {
          dept: "Manager",
          person: req.manager,
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

    localStorage.setItem("viyan_offboarding_exits", JSON.stringify([newExit, ...exitsList]));
  };

  const handleReject = (id: string, role: string, comments: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const dateStr = new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        return {
          ...req,
          status: "rejected" as const,
          timeline: [
            ...req.timeline,
            {
              id: `ev-${Date.now()}`,
              action: `${role} Rejected`,
              performedBy: user?.name || "Reviewer",
              role: user?.role || "Reviewer",
              date: dateStr,
              comments: comments,
            },
          ],
        };
      })
    );
    showToast("Request Rejected", "error", "Resignation request has been rejected.");
  };

  const handleRequestDiscussion = (id: string, role: string, comments: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const dateStr = new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        return {
          ...req,
          timeline: [
            ...req.timeline,
            {
              id: `ev-${Date.now()}`,
              action: "Discussion Initiated",
              performedBy: user?.name || "Reviewer",
              role: user?.role || "Reviewer",
              date: dateStr,
              comments: comments,
            },
          ],
        };
      })
    );
    showToast("Discussion Requested", "success", "Timeline updated with discussion request.");
  };

  const handleSendBack = (id: string, comments: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const dateStr = new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        return {
          ...req,
          status: "pending_manager" as const,
          timeline: [
            ...req.timeline,
            {
              id: `ev-${Date.now()}`,
              action: "Sent Back to Manager",
              performedBy: user?.name || "HR Manager",
              role: user?.role || "HR Manager",
              date: dateStr,
              comments: comments,
            },
          ],
        };
      })
    );
    showToast("Sent Back", "success", "Request sent back to manager for review.");
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[10px] bg-[#EDE9FE] dark:bg-purple-500/10 flex items-center justify-center shadow-inner border border-purple-100 dark:border-purple-500/20">
            <ClipboardCheck size={22} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-foreground tracking-tight">
              Resignation Approvals
            </h1>
            <p className="text-[13px] font-semibold text-muted-foreground">
              Review and approve employee resignation requests
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters & Table on left, Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Controls: Search and Filters */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-[13px] font-bold outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
              {(["all", "pending", "approved", "rejected"] as const).map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/10"
                        : "border border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <RequestTable
            requests={filteredRequests}
            selectedId={selectedReqId}
            onSelect={(req) => setSelectedReqId(req.id)}
          />
        </div>

        {/* Right Detail Pane */}
        <div>
          {selectedRequest ? (
            <RequestDetails
              request={selectedRequest}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestDiscussion={handleRequestDiscussion}
              onSendBack={handleSendBack}
            />
          ) : (
            <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
              <CheckSquare size={36} className="text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-[14px] font-black text-foreground">Select a Request</h3>
              <p className="text-[12px] text-muted-foreground mt-1 max-w-[200px]">
                Click on a row in the table to view the resignation details and take action.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
