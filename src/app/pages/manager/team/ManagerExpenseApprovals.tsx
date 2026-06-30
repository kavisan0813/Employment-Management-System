import { useState } from "react";
import {
  Receipt,
  Download,
  Building,
  Plane,
  Monitor,
  Coffee,
  X,
} from "lucide-react";
import { showToast } from "../../../components/workflow/ToastNotification";

// --- TYPES ---
type ExpenseStatus = "Pending" | "Approved" | "Rejected";

interface ExpenseItem {
  id: string;
  empName: string;
  avatar: string;
  designation: string;
  description: string;
  category: string;
  amount: string;
  receiptStatus: string;
  date: string;
  status: ExpenseStatus;
}

// --- MOCK DATA ---
const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: "e1",
    empName: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?u=Arjun",
    designation: "Sr Developer",
    description: "Client dinner",
    category: "Food",
    amount: "₹2,800",
    receiptStatus: "Attached",
    date: "Apr 5, 2026",
    status: "Pending",
  },
  {
    id: "e2",
    empName: "Sneha Rao",
    avatar: "https://i.pravatar.cc/150?u=Sneha",
    designation: "Frontend Dev",
    description: "Internet reimbursement",
    category: "Comms",
    amount: "₹999",
    receiptStatus: "Attached",
    date: "Apr 4, 2026",
    status: "Pending",
  },
  {
    id: "e3",
    empName: "Dev Patel",
    avatar: "https://i.pravatar.cc/150?u=Dev",
    designation: "Junior Dev",
    description: "Equipment — no receipt",
    category: "Equipment",
    amount: "₹1,400",
    receiptStatus: "Missing",
    date: "Apr 3, 2026",
    status: "Pending",
  },
  {
    id: "e4",
    empName: "Leo Martinez",
    avatar: "https://i.pravatar.cc/150?u=Leo",
    designation: "Backend Dev",
    description: "Travel to client office",
    category: "Travel",
    amount: "₹3,200",
    receiptStatus: "Attached",
    date: "Apr 6, 2026",
    status: "Pending",
  },
];

export function ManagerExpenseApprovals() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [activeTab, setActiveTab] = useState<ExpenseStatus>("Pending");
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");

  const handleApproveClick = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedExpense) return;
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === selectedExpense.id
          ? { ...e, status: "Approved" as ExpenseStatus }
          : e,
      ),
    );
    setApproveModalOpen(false);
    setSelectedExpense(null);
    showToast(
      "Expense Approved",
      "success",
      `${selectedExpense.empName}'s expense has been approved and sent to Finance.`,
    );
  };

  const confirmReject = () => {
    if (!selectedExpense) return;
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === selectedExpense.id
          ? { ...e, status: "Rejected" as ExpenseStatus }
          : e,
      ),
    );
    setRejectModalOpen(false);
    setSelectedExpense(null);
    setRejectReason("");
    showToast(
      "Expense Rejected",
      "error",
      `${selectedExpense.empName}'s expense has been rejected.`,
    );
  };

  const getCategoryIcon = (cat: string) => {
    if (cat === "Food") return <Coffee size={14} />;
    if (cat === "Travel") return <Plane size={14} />;
    if (cat === "Equipment") return <Monitor size={14} />;
    return <Building size={14} />;
  };

  const getCategoryColor = (cat: string) => {
    if (cat === "Food") return "text-amber-600 bg-amber-50 border-amber-100";
    if (cat === "Travel") return "text-teal-600 bg-teal-50 border-teal-100";
    if (cat === "Equipment")
      return "text-purple-600 bg-purple-50 border-purple-100";
    return "text-teal-600 bg-teal-50 border-teal-100";
  };

  const filteredExpenses = expenses.filter((e) => e.status === activeTab);

  const handleExport = () => {
    const headers = [
      "Expense ID",
      "Employee Name",
      "Designation",
      "Description",
      "Category",
      "Amount",
      "Receipt",
      "Date",
      "Status",
    ];
    const rows = filteredExpenses.map((e) =>
      [
        e.id,
        `"${e.empName}"`,
        `"${e.designation}"`,
        `"${e.description}"`,
        e.category,
        `"${e.amount}"`,
        e.receiptStatus,
        `"${e.date}"`,
        e.status,
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab.toLowerCase()}_expenses_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      "Exported!",
      "success",
      `${activeTab} expense claims downloaded as CSV.`,
    );
  };
  const pendingCount = expenses.filter((e) => e.status === "Pending").length;
  const approvedCount = expenses.filter((e) => e.status === "Approved").length;
  const rejectedCount = expenses.filter((e) => e.status === "Rejected").length;

  const TABS: ExpenseStatus[] = ["Pending", "Approved", "Rejected"];
  const tabCounts: Record<ExpenseStatus, number> = {
    Pending: pendingCount,
    Approved: approvedCount,
    Rejected: rejectedCount,
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[#FEF3C7] flex items-center justify-center shrink-0">
            <Receipt size={22} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-[26px] font-bold tracking-tight leading-none text-foreground">
              Expense Approvals
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Team expense claims — Level 1 approval
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2.5 text-sm font-bold rounded-xl border border-border hover:bg-secondary transition-colors active:scale-95 flex items-center gap-2"
        >
          <Download size={16} /> Export
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-amber-300 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Pending My Approval
          </p>
          <p className="text-3xl font-bold text-amber-500 leading-none">
            {pendingCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">need your action</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-emerald-300 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Approved
          </p>
          <p className="text-3xl font-bold text-emerald-600 leading-none">
            {approvedCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">sent to Finance</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-rose-300 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Rejected
          </p>
          <p className="text-3xl font-bold text-rose-500 leading-none">
            {rejectedCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            returned to employee
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-t-lg"
            }`}
          >
            {tab} ({tabCounts[tab]})
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00B87C] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-border">Employee</th>
                <th className="px-6 py-4 border-b border-border">
                  Description
                </th>
                <th className="px-6 py-4 border-b border-border">Category</th>
                <th className="px-6 py-4 border-b border-border">Amount</th>
                <th className="px-6 py-4 border-b border-border">Receipt</th>
                <th className="px-6 py-4 border-b border-border">Date</th>
                <th className="px-6 py-4 border-b border-border">Status</th>
                {activeTab === "Pending" && (
                  <th className="px-6 py-4 border-b border-border text-right">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "Pending" ? 8 : 7}
                    className="px-6 py-12 text-center text-muted-foreground font-medium"
                  >
                    No {activeTab.toLowerCase()} expenses
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#00B87C]/[0.04] transition-colors h-[64px]"
                  >
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.avatar}
                          className="w-9 h-9 rounded-full border border-border"
                        />
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {row.empName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {row.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-2 font-semibold text-foreground max-w-[200px] truncate"
                      title={row.description}
                    >
                      {row.description}
                    </td>
                    <td className="px-6 py-2">
                      <span
                        className={`px-2 py-1 flex items-center gap-1.5 w-max rounded-md text-[11px] font-bold border ${getCategoryColor(row.category)}`}
                      >
                        {getCategoryIcon(row.category)} {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-2 font-bold text-foreground">
                      {row.amount}
                    </td>
                    <td className="px-6 py-2">
                      <span
                        className={`text-xs font-bold ${row.receiptStatus === "Attached" ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {row.receiptStatus}
                      </span>
                    </td>
                    <td className="px-6 py-2 text-xs font-semibold text-muted-foreground">
                      {row.date}
                    </td>
                    <td className="px-6 py-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-1 rounded-md border w-max ${
                          row.status === "Approved"
                            ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                            : row.status === "Rejected"
                              ? "text-red-600 bg-red-50 border-red-100"
                              : "text-amber-600 bg-amber-50 border-amber-100"
                        }`}
                      >
                        {row.status === "Approved"
                          ? "Approved → Finance"
                          : row.status === "Rejected"
                            ? "Rejected"
                            : "Pending L1"}
                      </span>
                    </td>
                    {activeTab === "Pending" && (
                      <td className="px-6 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRejectClick(row)}
                            className="px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-600/20 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveClick(row)}
                            disabled={row.receiptStatus === "Missing"}
                            title={
                              row.receiptStatus === "Missing"
                                ? "Receipt required for approval"
                                : ""
                            }
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-all ${
                              row.receiptStatus === "Missing"
                                ? "bg-secondary text-muted-foreground border border-border cursor-not-allowed opacity-50"
                                : "bg-[#00B87C] text-white hover:bg-[#00a36d] active:scale-95"
                            }`}
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPROVE CONFIRMATION MODAL */}
      {approveModalOpen && selectedExpense && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setApproveModalOpen(false)}
        >
          <div
            className="w-full max-w-[400px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-emerald-50/50">
              <h3 className="text-[15px] font-bold text-foreground">
                Confirm Approval
              </h3>
              <button
                onClick={() => setApproveModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-2">
                You are approving{" "}
                <strong className="text-foreground">
                  {selectedExpense.empName}
                </strong>
                's expense claim of{" "}
                <strong className="text-foreground">
                  {selectedExpense.amount}
                </strong>
                .
              </p>
              <p className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
                This will send the claim to Finance for Level 2 processing.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-end gap-3">
              <button
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Approve & Send to Finance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalOpen && selectedExpense && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setRejectModalOpen(false)}
        >
          <div
            className="w-full max-w-[400px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-red-50/50">
              <h3 className="text-[15px] font-bold text-foreground">
                Reject Expense
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Rejecting{" "}
                <strong className="text-foreground">
                  {selectedExpense.empName}
                </strong>
                's expense of{" "}
                <strong className="text-foreground">
                  {selectedExpense.amount}
                </strong>{" "}
                for "{selectedExpense.description}".
              </p>
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this expense is being rejected..."
                  className="w-full p-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-red-400 min-h-[90px] resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
