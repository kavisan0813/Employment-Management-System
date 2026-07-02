import React, { useState } from "react";
import { Label } from "../components/Label";
import { Breadcrumb } from "../components/Breadcrumb";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../context/AuthContext";
import { showToast } from "../../../../components/workflow/ToastNotification";
import { ToggleRow } from "../components/ToggleRow";
import {
  User,
  Lock,
  Download,
  Search,
  Calendar,
  FileText,
  Receipt,
  Target,
} from "lucide-react";

export function HelpFAQSection({ navigate }: { navigate: (p: string) => void }) {
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);
  const [feedback, setFeedback] = useState("");

  const faqs = [
    {
      q: "How do I apply for leave?",
      a: "Go to My Leaves → click 'Apply Leave' button to submit a new request.",
      link: "/leave",
      linkLabel: "Apply Now →",
    },
    {
      q: "How do I download my payslip?",
      a: "Go to My Payslips → click the Download button against any payslip entry.",
      link: "/payslips",
      linkLabel: "Go to Payslips →",
    },
    {
      q: "How do I update my bank account details?",
      a: "Please contact HR or the Finance team to update your bank details.",
    },
    {
      q: "Why is my attendance showing incorrect?",
      a: "You can submit a regularization request from the Attendance page.",
      link: "/attendance",
      linkLabel: "Go to Attendance →",
    },
    {
      q: "How do I check my leave balance?",
      a: "Your leave balance is displayed on the My Leaves page and the dashboard.",
    },
    {
      q: "How do I submit an expense claim?",
      a: "Go to My Expenses → click 'New Claim' to submit an expense.",
    },
    {
      q: "How do I change my password?",
      a: "Go to Settings → Account & Security to update your password.",
    },
    {
      q: "How do I view my performance review?",
      a: "Go to My Performance → Reviews section to view your reviews.",
    },
    {
      q: "What is my Employee ID?",
      a: "Your Employee ID is EMP-0142, visible on your profile.",
    },
    {
      q: "How do I enroll for health insurance?",
      a: "Contact HR during the open enrollment period or within 30 days of joining.",
    },
  ];

  const filtered = faqs.filter((f) =>
    f.q.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Breadcrumb active="Help & FAQ" />
      <h2 className="text-[22px] font-black text-foreground mb-5">
        Help & Frequently Asked Questions
      </h2>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-1.5 flex items-center mb-6">
        <Search size={18} className="text-muted-foreground ml-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help articles..."
          className="w-full h-12 bg-transparent px-3 text-[14px] font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: Calendar,
            label: "Attendance & Leave",
            count: "12 articles",
            bg: "var(--secondary)",
            color: "var(--primary)",
          },
          {
            icon: FileText,
            label: "Payroll & Salary",
            count: "8 articles",
            bg: "#EDE9FE",
            color: "#8B5CF6",
          },
          {
            icon: User,
            label: "Documents & Profile",
            count: "6 articles",
            bg: "var(--secondary)",
            color: "var(--primary)",
          },
          {
            icon: Receipt,
            label: "Expenses",
            count: "5 articles",
            bg: "#FEF3C7",
            color: "#F59E0B",
          },
          {
            icon: Target,
            label: "Goals & Performance",
            count: "7 articles",
            bg: "var(--secondary)",
            color: "var(--primary)",
          },
          {
            icon: Lock,
            label: "Account & Security",
            count: "9 articles",
            bg: "#FEE2E2",
            color: "#EF4444",
          },
        ].map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border shadow-sm p-5 cursor-pointer hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.bg }}
                >
                  <Icon size={18} style={{ color: cat.color }} />
                </div>
                <p className="text-[14px] font-black text-foreground">
                  {cat.label}
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border"
                style={{
                  backgroundColor: cat.bg,
                  color: cat.color,
                  borderColor: `${cat.color}20`,
                }}
              >
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>

      <Label>FREQUENTLY ASKED QUESTIONS</Label>
      <div className="bg-card rounded-2xl border border-border shadow-sm mb-6 overflow-hidden">
        {filtered.map((faq, i) => {
          const expanded = expandedFaq === i;
          return (
            <div key={i} className="border-b border-border/50 last:border-b-0">
              <button
                onClick={() => setExpandedFaq(expanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="text-[14px] font-black text-foreground flex-1 pr-4">
                  {faq.q}
                </span>
                <span className="text-muted-foreground text-[14px] shrink-0">
                  {expanded ? "▾" : "▸"}
                </span>
              </button>
              {expanded && (
                <div className="px-6 pb-5">
                  <p className="text-[14px] font-bold text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                  {faq.link && faq.linkLabel && (
                    <button
                      onClick={() => navigate(faq.link!)}
                      className="mt-3 text-[13px] font-black text-primary hover:underline flex items-center gap-1"
                    >
                      {faq.linkLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center">
        <p className="text-[14px] font-bold text-muted-foreground mb-4">
          Was this page helpful?
        </p>
        {helpful === null ? (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setHelpful("yes")}
              className="px-6 py-2.5 rounded-xl border border-border text-[13px] font-black text-foreground hover:bg-secondary transition-all"
            >
              👍 Yes
            </button>
            <button
              onClick={() => setHelpful("no")}
              className="px-6 py-2.5 rounded-xl border border-border text-[13px] font-black text-foreground hover:bg-secondary transition-all"
            >
              👎 No
            </button>
          </div>
        ) : helpful === "yes" ? (
          <p className="text-[16px] font-black text-primary">
            Thank you for your feedback! 🙏
          </p>
        ) : (
          <div className="max-w-md mx-auto">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us how we can improve"
              rows={2}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-[14px] font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[80px] resize-none mb-3"
            />
            <button
              onClick={() => {
                showToast("Feedback Submitted", "success", "Thank you!");
                setHelpful(null);
                setFeedback("");
              }}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-[13px] font-black shadow-lg shadow-[#00B87C]/20 hover:opacity-90 transition-all"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION: CONTACT HR / SUPPORT
   ═══════════════════════════════════════════ */
