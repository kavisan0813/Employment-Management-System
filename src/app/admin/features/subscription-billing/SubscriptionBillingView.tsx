/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react";
import { BillingDashboard } from "./pages/BillingDashboard";
import { PlansPage } from "./pages/PlansPage";
import { SubscriptionsPage } from "./pages/SubscriptionsPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { RenewalTrackingPage } from "./pages/RenewalTrackingPage";

type BillingTab =
  | "overview"
  | "plans"
  | "subscriptions"
  | "invoices"
  | "payments"
  | "renewals";

const TABS: { id: BillingTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "plans", label: "Plans", icon: Package },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "renewals", label: "Renewals", icon: Calendar },
];

export default function SubscriptionBillingView() {
  const [activeTab, setActiveTab] = useState<BillingTab>("overview");

  const renderPage = () => {
    switch (activeTab) {
      case "overview":
        return <BillingDashboard onNavigateTab={setActiveTab} />;
      case "plans":
        return <PlansPage />;
      case "subscriptions":
        return <SubscriptionsPage />;
      case "invoices":
        return <InvoicesPage />;
      case "payments":
        return <PaymentsPage />;
      case "renewals":
        return <RenewalTrackingPage />;
      default:
        return <BillingDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab navigation */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-0.5 p-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active page content */}
      {renderPage()}
    </div>
  );
}
