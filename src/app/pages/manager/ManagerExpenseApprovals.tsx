import React, { useState } from "react";
import {
  Receipt,
  Download,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  FileWarning,
  Info,
  Building,
  Plane,
  Monitor,
  Coffee,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_PENDING_EXPENSES = [
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
    status: "Pending L1",
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
    status: "Pending L1",
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
    status: "Pending L1",
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
    status: "Pending L1",
  },
];

export function ManagerExpenseApprovals() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Sent to Finance" | "Rejected">("Pending");
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<typeof MOCK_PENDING_EXPENSES[0] | null>(null);

  const handleApproveClick = (expense: typeof MOCK_PENDING_EXPENSES[0]) => {
    setSelectedExpense(expense);
    setApproveModalOpen(true);
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
    if (cat === "Equipment") return "text-purple-600 bg-purple-50 border-purple-100";
    return "text-teal-600 bg-teal-50 border-teal-100";
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
            <Receipt size={24} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-[26px] font-extrabold tracking-tight leading-none text-foreground">
              Expense Approvals
            </h2>
            <p className="text-[13px] font-semibold mt-1 text-muted-foreground">
              Team expense claims — Level 1 approval
            </p>
          </div>
        </div>
        <button className="px-4 py-2.5 text-sm font-bold rounded-xl border border-border hover:bg-secondary transition-colors active:scale-95 flex items-center gap-2">
          <Download size={16} /> Export
        </button>
      </div>

      {/* INFO BADGE */}
      <div className="flex items-start gap-3 p-4 mb-6 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Important Policy Reminder</h4>
          <p className="text-xs font-medium text-amber-700 mt-0.5">
            Your approvals go to Finance for final processing. Approve only valid business expenses with receipts.
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Pending My Approval</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-extrabold text-amber-500 leading-none">4</p>
            <p className="text-sm font-bold text-amber-600/70 mb-0.5">need your action</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Approved This Month</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-extrabold text-emerald-600 leading-none">₹12,400</p>
            <p className="text-sm font-bold text-emerald-600/70 mb-0.5">sent to Finance</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm group">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Sent to Finance</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-extrabold text-teal-600 leading-none">6</p>
            <p className="text-sm font-bold text-teal-600/70 mb-0.5">awaiting Finance L2</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto no-scrollbar">
        {(["Pending", "Approved", "Sent to Finance", "Rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-t-lg"
            }`}
          >
            {tab} {tab === "Pending" && "(4)"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00B87C] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: PENDING EXPENSES */}
      {activeTab === "Pending" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-muted-foreground text-xs font-black uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-border">Employee</th>
                  <th className="px-6 py-4 border-b border-border">Description</th>
                  <th className="px-6 py-4 border-b border-border">Category</th>
                  <th className="px-6 py-4 border-b border-border">Amount</th>
                  <th className="px-6 py-4 border-b border-border">Receipt</th>
                  <th className="px-6 py-4 border-b border-border">Date</th>
                  <th className="px-6 py-4 border-b border-border">Status</th>
                  <th className="px-6 py-4 border-b border-border text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_PENDING_EXPENSES.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/30 transition-colors h-[64px]">
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} className="w-9 h-9 rounded-full border border-border" />
                        <div>
                          <p className="text-sm font-bold text-foreground">{row.empName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2 font-semibold text-foreground max-w-[200px] truncate" title={row.description}>
                      {row.description}
                    </td>
                    <td className="px-6 py-2">
                      <span className={`px-2 py-1 flex items-center gap-1.5 w-max rounded-md text-[11px] font-bold border ${getCategoryColor(row.category)}`}>
                        {getCategoryIcon(row.category)}
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-2 font-extrabold text-foreground">{row.amount}</td>
                    <td className="px-6 py-2">
                      {row.receiptStatus === "Attached" ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 size={14} /> Attached
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                          <FileWarning size={14} /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-2 text-xs font-semibold text-muted-foreground">{row.date}</td>
                    <td className="px-6 py-2">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 w-max">
                        Pending L1
                      </span>
                    </td>
                    <td className="px-6 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-600/20 hover:bg-rose-50 rounded-lg transition-colors">
                          Reject
                        </button>
                        <button 
                          onClick={() => handleApproveClick(row)}
                          disabled={row.receiptStatus === "Missing"}
                          title={row.receiptStatus === "Missing" ? "Receipt required for approval" : ""}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPROVE MODAL */}
      {approveModalOpen && selectedExpense && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[420px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30 rounded-t-2xl">
              <h3 className="text-lg font-extrabold text-foreground">
                Approve Expense Claim
              </h3>
              <button 
                onClick={() => setApproveModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-800 text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              
              {/* Employee Card */}
              <div className="flex items-center gap-3">
                <img src={selectedExpense.avatar} className="w-12 h-12 rounded-full border border-border shadow-sm" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">{selectedExpense.empName}</h4>
                  <p className="text-xs text-muted-foreground font-medium">{selectedExpense.designation}</p>
                </div>
              </div>

              {/* Expense Summary */}
              <div className="bg-secondary/50 rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className={`px-2 py-1 flex items-center gap-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getCategoryColor(selectedExpense.category)}`}>
                    {getCategoryIcon(selectedExpense.category)}
                    {selectedExpense.category}
                  </span>
                  <span className="text-xl font-black text-foreground">{selectedExpense.amount}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1">Description</p>
                  <p className="text-sm font-semibold text-foreground">{selectedExpense.description}</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center">
                    <FileText size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">receipt.pdf</p>
                    <p className="text-[10px] text-muted-foreground">Attached by {selectedExpense.empName}</p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">Manager Note (Optional)</label>
                <textarea 
                  placeholder="Add a note for Finance..."
                  className="w-full p-3 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary min-h-[80px] resize-none"
                ></textarea>
              </div>

              {/* Info Badge */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                  Approving sends this to Finance for final processing (Level 2).
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-secondary/30 rounded-b-2xl flex items-center justify-end gap-3">
              <button 
                onClick={() => setApproveModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-muted-foreground border border-border bg-background rounded-xl hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setApproveModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#00B87C] rounded-xl hover:bg-[#00a36d] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Approve & Send to Finance
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
