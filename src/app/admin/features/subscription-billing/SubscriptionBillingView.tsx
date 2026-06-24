/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<BillingTab>("overview");

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab as BillingTab);
    }
  }, [location.state]);

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
    <div className="space-y-6 max-w-7xl mx-auto px-1.5 py-4">

        {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-gray-200 gap-4 font-semibold">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600 font-semibold" />
            Subscription Billing
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage pricing tiers, features, and plan configurations.
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="w-full overflow-hidden">
  <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar scroll-smooth">
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
