/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { db, pushAuditLog } from "../../mockData";
import { Subscription, Organization } from "../../types";
import {
  CreditCard,
  Search,
  Plus,
  ChevronDown,
  ShieldAlert,
  BadgePercent,
  RotateCw,
  ArchiveX,
  X,
  Receipt,
  ArrowUpRight,
  Download,
} from "lucide-react";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export default function SubscriptionsView() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [cycleFilter, setCycleFilter] = useState("ALL");

  // Selection Drawers & Modals
  const [invoiceSub, setInvoiceSub] = useState<Subscription | null>(null);
  const [isNewSubOpen, setIsNewSubOpen] = useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Form handling target references
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  // New Subscription Form Inputs
  const [formOrgId, setFormOrgId] = useState("");
  const [formPlan, setFormPlan] = useState<"Starter" | "Growth" | "Enterprise">(
    "Starter",
  );
  const [formCycle, setFormCycle] = useState<"Monthly" | "Annual">("Monthly");
  const [formStartDate, setFormStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  // Change Plan Inputs
  const [changePlanValue, setChangePlanValue] = useState<
    "Starter" | "Growth" | "Enterprise"
  >("Starter");
  const [changePlanEffective, setChangePlanEffective] = useState<
    "immediate" | "renewal"
  >("immediate");

  // Coupon Discount Inputs
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [discountAmount, setDiscountAmount] = useState(15);
  const [discountDuration, setDiscountDuration] = useState("3");

  // Cancellation Inputs
  const [cancelReason, setCancelReason] = useState("Switching provider");
  const [cancelFeedback, setCancelFeedback] = useState("");

  const refreshData = () => {
    setSubs(db.subscriptions.get());
    setOrgs(db.organizations.get().filter((o) => o.status !== "Inactive"));
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Compute operational stats metrics summaries
  const activeSubs = subs.filter(
    (s) => s.status === "Active" || s.status === "Trial",
  );
  const totalMRR = activeSubs.reduce((acc, curr) => {
    const monthlyRate =
      curr.billingCycle === "Annual" ? curr.amount / 12 : curr.amount;
    return acc + monthlyRate;
  }, 0);
  const churned30Days = 2;
  const conversionRate = 84.4;

  const filteredSubs = subs.filter((sub) => {
    const matchesSearch =
      sub.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
    const matchesPlan = planFilter === "ALL" || sub.plan === planFilter;
    const matchesCycle =
      cycleFilter === "ALL" || sub.billingCycle === cycleFilter;
    return matchesSearch && matchesStatus && matchesPlan && matchesCycle;
  });

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    planFilter !== "ALL" ||
    cycleFilter !== "ALL" ||
    !!searchQuery;

  // ---- Form Submission Logic Operators ----
  const openNewSubModal = () => {
    if (orgs.length > 0) setFormOrgId(orgs[0].id);
    setFormPlan("Starter");
    setFormCycle("Monthly");
    setFormStartDate(new Date().toISOString().slice(0, 10));
    setIsNewSubOpen(true);
  };

  const handleNewSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrg = orgs.find((o) => o.id === formOrgId);
    if (!targetOrg) return;

    const duplicate = subs.find(
      (s) => s.organizationId === targetOrg.id && s.status === "Active",
    );
    if (duplicate) {
      alert(
        `Tenant '${targetOrg.name}' already has an active billing subscription setup configuration.`,
      );
      return;
    }

    const calculatedAmount =
      formPlan === "Enterprise" ? 3500 : formPlan === "Growth" ? 1200 : 99;
    const finalAmount =
      formCycle === "Annual" ? calculatedAmount * 12 * 0.9 : calculatedAmount;

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      organization: targetOrg.name,
      organizationId: targetOrg.id,
      plan: formPlan,
      status: "Active",
      billingCycle: formCycle,
      amount: finalAmount,
      currency: "USD",
      startDate: formStartDate,
      renewalDate: new Date(
        new Date(formStartDate).setMonth(
          new Date(formStartDate).getMonth() +
            (formCycle === "Annual" ? 12 : 1),
        ),
      )
        .toISOString()
        .slice(0, 10),
      paymentMethodLast4: "5582",
      failedPaymentCount: 0,
    };

    db.subscriptions.save([newSub, ...db.subscriptions.get()]);

    const currentOrgs = db.organizations.get();
    db.organizations.save(
      currentOrgs.map((o) => {
        if (o.id === targetOrg.id) {
          return {
            ...o,
            status: "Active" as const,
            plan: formPlan,
            mrr: calculatedAmount,
          };
        }
        return o;
      }),
    );

    pushAuditLog(
      "subscription.create",
      "Billing",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      targetOrg.name,
      "Active",
      { plan: formPlan, cycle: formCycle, amount: `$${finalAmount}` },
    );
    setIsNewSubOpen(false);
    refreshData();
  };

  const handlePlanChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const calculatedAmount =
      changePlanValue === "Enterprise"
        ? 3500
        : changePlanValue === "Growth"
          ? 1200
          : 99;
    const finalAmount =
      selectedSub.billingCycle === "Annual"
        ? calculatedAmount * 12 * 0.9
        : calculatedAmount;

    db.subscriptions.save(
      db.subscriptions.get().map((s) => {
        if (s.id === selectedSub.id)
          return { ...s, plan: changePlanValue, amount: finalAmount };
        return s;
      }),
    );

    db.organizations.save(
      db.organizations.get().map((o) => {
        if (o.id === selectedSub.organizationId)
          return { ...o, plan: changePlanValue, mrr: calculatedAmount };
        return o;
      }),
    );

    pushAuditLog(
      "subscription.plan_changed",
      "Billing",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      selectedSub.organization,
      "Active",
      {
        previous_plan: selectedSub.plan,
        new_plan: changePlanValue,
        effective: changePlanEffective,
      },
    );
    setIsChangePlanOpen(false);
    refreshData();
  };

  const handleDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const reductionLabel =
      discountType === "percentage"
        ? `${discountAmount}%`
        : `$${discountAmount}`;
    db.subscriptions.save(
      db.subscriptions.get().map((s) => {
        if (s.id === selectedSub.id) {
          const factor =
            discountType === "percentage" ? 1 - discountAmount / 100 : 1;
          const subAmount =
            discountType === "fixed"
              ? Math.max(0, s.amount - discountAmount)
              : s.amount * factor;
          return { ...s, amount: Math.round(subAmount) };
        }
        return s;
      }),
    );

    pushAuditLog(
      "subscription.discount_applied",
      "Billing",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      selectedSub.organization,
      "Active",
      { amount: reductionLabel, duration: `${discountDuration} months` },
    );
    setIsDiscountOpen(false);
    refreshData();
  };

  const retryFailedPayment = (sub: Subscription, e: React.MouseEvent) => {
    e.stopPropagation();
    db.subscriptions.save(
      db.subscriptions.get().map((s) => {
        if (s.id === sub.id)
          return { ...s, failedPaymentCount: 0, status: "Active" as const };
        return s;
      }),
    );

    db.organizations.save(
      db.organizations.get().map((o) => {
        if (o.id === sub.organizationId)
          return { ...o, status: "Active" as const };
        return o;
      }),
    );

    pushAuditLog(
      "subscription.payment_retry",
      "Billing",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      sub.organization,
      "Active",
      {
        attempt: "manual_retry",
        previous_failures: String(sub.failedPaymentCount),
      },
    );
    refreshData();
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    db.subscriptions.save(
      db.subscriptions.get().map((s) => {
        if (s.id === selectedSub.id)
          return { ...s, status: "Inactive" as const, renewalDate: null };
        return s;
      }),
    );

    db.organizations.save(
      db.organizations.get().map((o) => {
        if (o.id === selectedSub.organizationId)
          return { ...o, status: "Inactive" as const, mrr: 0 };
        return o;
      }),
    );

    pushAuditLog(
      "subscription.cancelled",
      "Billing",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      selectedSub.organization,
      "Active",
      { reason: cancelReason, feedback: cancelFeedback },
    );
    setIsCancelOpen(false);
    refreshData();
  };

  const planBadgeClass = (plan: Subscription["plan"]) =>
    plan === "Enterprise"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : plan === "Growth"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-teal-50 text-teal-700 border-teal-200";

  return (
    <div className="space-y-5 relative">
      {/* Module Title Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Subscriptions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Billing plan and lifecycle management for every organization's
            subscription.
          </p>
        </div>
        <button
          onClick={openNewSubModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Subscription
        </button>
      </div>

      {/* Metrics Financial Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-gray-200 shadow-sm rounded-xl p-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Total MRR
          </span>
          <p className="text-xl font-bold text-gray-950 mt-1 flex items-baseline gap-1.5">
            ${Math.round(totalMRR).toLocaleString()}
            <span className="text-[10px] text-teal-600 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.2%
            </span>
          </p>
        </div>
        <div className="lg:border-l border-gray-150 lg:pl-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Active Subs
          </span>
          <p className="text-xl font-bold text-gray-950 mt-1">
            {activeSubs.length}
          </p>
        </div>
        <div className="border-l border-gray-150 pl-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Churned (30d)
          </span>
          <p className="text-xl font-bold text-rose-600 mt-1">
            {churned30Days}
          </p>
        </div>
        <div className="border-l border-gray-150 pl-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Trial Conversion
          </span>
          <p className="text-xl font-bold text-gray-950 mt-1">
            {conversionRate}%
          </p>
        </div>
      </div>

      {/* Filtering Control Row Container */}
      <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by contract ID or organization name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                ["ALL", "All statuses"],
                ["Active", "Active"],
                ["Trial", "Trial"],
                ["Pending", "Pending"],
                ["Suspended", "Suspended"],
                ["Inactive", "Inactive (cancelled)"],
              ]}
            />
            <FilterSelect
              label="Plan"
              value={planFilter}
              onChange={setPlanFilter}
              options={[
                ["ALL", "All plans"],
                ["Starter", "Starter"],
                ["Growth", "Growth"],
                ["Enterprise", "Enterprise"],
              ]}
            />
            <FilterSelect
              label="Cycle"
              value={cycleFilter}
              onChange={setCycleFilter}
              options={[
                ["ALL", "All cycles"],
                ["Monthly", "Monthly"],
                ["Annual", "Annual"],
              ]}
            />

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setStatusFilter("ALL");
                  setPlanFilter("ALL");
                  setCycleFilter("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Core Data Table Frame Layout */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Cycle</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Renewal Date</th>
                <th className="px-4 py-3">Failures</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center w-72">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No matching system subscriptions entries located.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-gray-500">
                      {sub.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {sub.organization}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded border text-[11px] font-semibold ${planBadgeClass(sub.plan)}`}
                      >
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {sub.billingCycle}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ${sub.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {sub.renewalDate || "Indefinite"}
                    </td>
                    <td className="px-4 py-3">
                      {sub.failedPaymentCount > 0 ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />{" "}
                          {sub.failedPaymentCount} Failed
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md border text-[11px] font-medium ${
                          sub.status === "Active"
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : sub.status === "Trial"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : sub.status === "Pending"
                                ? "bg-gray-100 text-gray-700 border-gray-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    {/* Aligned Static Width Action Grid Column Block (No Hover States) */}
                    <td
                      className="px-4 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1.5 bg-gray-50/80 p-1 rounded-lg border border-gray-100 max-w-[270px] mx-auto shadow-2xs">
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setChangePlanValue(sub.plan);
                            setIsChangePlanOpen(true);
                          }}
                          className="w-14 py-1 text-center bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 rounded-md font-semibold cursor-pointer transition-all text-[11px]"
                        >
                          Change
                        </button>

                        {sub.failedPaymentCount > 0 ? (
                          <button
                            onClick={(e) => retryFailedPayment(sub, e)}
                            className="w-14 py-1 text-center bg-rose-600 text-white rounded-md font-semibold flex items-center justify-center gap-0.5 cursor-pointer hover:bg-rose-700 text-[11px]"
                          >
                            <RotateCw className="w-2.5 h-3 animate-spin duration-1000" />{" "}
                            Retry
                          </button>
                        ) : (
                          <button
                            onClick={() => setInvoiceSub(sub)}
                            className="w-14 py-1 text-center bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 rounded-md font-semibold flex items-center justify-center cursor-pointer transition-all text-[11px]"
                          >
                            Receipts
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setIsCancelOpen(true);
                          }}
                          className="w-14 py-1 text-center bg-white border border-gray-200 text-rose-600 hover:text-rose-700 hover:border-rose-200 rounded-md font-bold cursor-pointer transition-all text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICES LIST RETRIEVAL DRAWER */}
      {invoiceSub && (
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Receipt className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm">
                Invoices Ledger &bull; {invoiceSub.organization}
              </h3>
            </div>
            <button
              onClick={() => setInvoiceSub(null)}
              className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md bg-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono text-xs">
            <p className="text-gray-400 font-sans text-[11px] leading-relaxed mb-2">
              Past programmatic charges compiled for active database
              subscription logs tracker metadata index matching keys.
            </p>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-gray-950">
                    #EMS-2026-0{7 - i}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Issued 2026-0{7 - i}-10 &bull;{" "}
                    <span className="text-teal-600 font-bold">PAID</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="font-sans font-bold text-gray-900">
                    ${invoiceSub.amount.toLocaleString()}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 text-[10px] font-sans font-semibold cursor-pointer">
                    <Download className="w-3 h-3" /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW BILLING CONTRACT MODAL */}
      {isNewSubOpen && (
        <Modal onClose={() => setIsNewSubOpen(false)}>
          <ModalHeader
            icon={CreditCard}
            title="New subscription"
            onClose={() => setIsNewSubOpen(false)}
          />
          <form onSubmit={handleNewSubSubmit} className="p-5 space-y-4 text-xs">
            <Field label="Target organization account" required>
              <select
                required
                value={formOrgId}
                onChange={(e) => setFormOrgId(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select active target enterprise tenant...
                </option>
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} [{org.region}]
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Contract plan">
                <select
                  value={formPlan}
                  onChange={(e) => setFormPlan(e.target.value as any)}
                  className={inputClass}
                >
                  <option value="Starter">Starter ($99/mo)</option>
                  <option value="Growth">Growth ($1,200/mo)</option>
                  <option value="Enterprise">Enterprise ($3,500/mo)</option>
                </select>
              </Field>
              <Field label="Billing interval cycle">
                <select
                  value={formCycle}
                  onChange={(e) => setFormCycle(e.target.value as any)}
                  className={inputClass}
                >
                  <option value="Monthly">Monthly Cycle</option>
                  <option value="Annual">Annual Tier (-10%)</option>
                </select>
              </Field>
            </div>
            <Field label="Signature Activation Start Date" required>
              <input
                type="date"
                required
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsNewSubOpen(false)}
                className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm cursor-pointer"
              >
                Create subscription
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* PLAN TIERS MODIFIER MODAL */}
      {isChangePlanOpen && selectedSub && (
        <Modal onClose={() => setIsChangePlanOpen(false)}>
          <ModalHeader
            icon={CreditCard}
            title={`Change plan \u2022 ${selectedSub.organization}`}
            onClose={() => setIsChangePlanOpen(false)}
          />
          <form
            onSubmit={handlePlanChangeSubmit}
            className="p-5 space-y-4 text-xs"
          >
            <Field label="Target scaling plan tier">
              <select
                value={changePlanValue}
                onChange={(e) => setChangePlanValue(e.target.value as any)}
                className={inputClass}
              >
                <option value="Starter">Starter Tier ($99/mo)</option>
                <option value="Growth">Growth Tier ($1,200/mo)</option>
                <option value="Enterprise">Enterprise Tier ($3,500/mo)</option>
              </select>
            </Field>
            <Field label="Effective execution matrix">
              <select
                value={changePlanEffective}
                onChange={(e) => setChangePlanEffective(e.target.value as any)}
                className={inputClass}
              >
                <option value="immediate">
                  Apply Immediately (Pro-rated Invoice calculation)
                </option>
                <option value="renewal">
                  Deferred strategy (Apply on Next Contract Renewal)
                </option>
              </select>
            </Field>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsChangePlanOpen(false)}
                className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* COUPON INJECTION MODAL */}
      {isDiscountOpen && selectedSub && (
        <Modal onClose={() => setIsDiscountOpen(false)}>
          <ModalHeader
            icon={BadgePercent}
            title={`Apply coupon \u2022 ${selectedSub.organization}`}
            onClose={() => setIsDiscountOpen(false)}
          />
          <form
            onSubmit={handleDiscountSubmit}
            className="p-5 space-y-4 text-xs"
          >
            <div className="flex items-center gap-5 p-1 bg-gray-50 border border-gray-200 rounded-lg justify-around py-2.5">
              <label className="inline-flex items-center gap-1.5 font-semibold text-gray-800 cursor-pointer">
                <input
                  type="radio"
                  checked={discountType === "percentage"}
                  onChange={() => setDiscountType("percentage")}
                  className="accent-indigo-600"
                />{" "}
                Percentage Off
              </label>
              <label className="inline-flex items-center gap-1.5 font-semibold text-gray-800 cursor-pointer">
                <input
                  type="radio"
                  checked={discountType === "fixed"}
                  onChange={() => setDiscountType("fixed")}
                  className="accent-indigo-600"
                />{" "}
                Fixed Dollar Credit
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Reduction value" required>
                <input
                  type="number"
                  min={1}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Lifespan duration bounds">
                <select
                  value={discountDuration}
                  onChange={(e) => setDiscountDuration(e.target.value)}
                  className={inputClass}
                >
                  <option value="1">1 Month cycle</option>
                  <option value="3">3 Months cycle</option>
                  <option value="6">6 Months cycle</option>
                  <option value="12">1 Year limits</option>
                  <option value="99">Permanent (Forever)</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDiscountOpen(false)}
                className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm cursor-pointer"
              >
                Apply coupon
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* LINE CANCELLATION COMPLIANCE DIALOG */}
      {isCancelOpen && selectedSub && (
        <Modal onClose={() => setIsCancelOpen(false)} maxWidth="max-w-sm">
          <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-rose-800 font-semibold">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
              <ArchiveX className="w-4 h-4 text-rose-600" /> Cancel subscription
            </div>
            <button
              onClick={() => setIsCancelOpen(false)}
              className="text-rose-400 hover:text-rose-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleCancelSubmit} className="p-5 space-y-4 text-xs">
            <p className="text-gray-600 leading-relaxed">
              Shutting down active billing for{" "}
              <strong className="text-gray-900">
                {selectedSub.organization}
              </strong>{" "}
              pools. System records will immediately default to read-only
              constraints handlers.
            </p>
            <Field label="Primary diagnosis exit reason">
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className={inputClass}
              >
                <option value="Too expensive">
                  SaaS cost is too steep (Budget constraints)
                </option>
                <option value="Missing features">
                  Missing required software ecosystem configurations
                </option>
                <option value="Switching provider">
                  Migrating to corporate industry competitors
                </option>
                <option value="Internal closure">
                  Tenant workspace decommissioned
                </option>
                <option value="Other">
                  Direct customer service requested ticket matrix
                </option>
              </select>
            </Field>
            <Field label="Auxiliary exit notes / feedback">
              <textarea
                placeholder="Provide detailed compliance audit log context trackers..."
                value={cancelFeedback}
                onChange={(e) => setCancelFeedback(e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </Field>
            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsCancelOpen(false)}
                className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Cancel subscription
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ---- Pure Presentation Functional Layout Helpers ----

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-990 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({
  children,
  onClose,
  maxWidth = "max-w-md",
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl w-full ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  icon: Icon,
  title,
  onClose,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Icon className="w-4 h-4 text-indigo-600" />
        {title}
      </h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
      <span className="text-[10px] uppercase font-semibold text-gray-400">
        {label}
      </span>
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-gray-800 text-xs py-0.5 pr-5 focus:outline-none font-medium appearance-none cursor-pointer z-10"
        >
          {options.map(([val, lbl]) => (
            <option key={val} value={val}>
              {lbl}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 pointer-events-none z-0" />
      </div>
    </div>
  );
}
