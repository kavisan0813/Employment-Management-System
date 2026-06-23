import React from "react";
import { Check, Star } from "lucide-react";

export function SubscriptionPlansTable() {
  const plans = [
    {
      name: "Basic",
      price: "$99",
      period: "/month",
      description: "Essential HR features for small teams.",
      features: ["Up to 50 Employees", "Employee Directory", "Attendance Tracking", "Basic Leave Management", "Standard Support"],
      isPopular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Advanced tools for growing organizations.",
      features: ["Up to 250 Employees", "Advanced Leave & Attendance", "Payroll Processing", "Recruitment Module", "Priority Support"],
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Full suite for large enterprises.",
      features: ["Unlimited Employees", "All HR Modules", "Custom Integrations", "Dedicated Account Manager", "24/7 Phone Support"],
      isPopular: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Global Plans</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">Define the feature sets and pricing tiers available to your tenants. Changing these plans will affect future subscriptions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map(plan => (
          <div key={plan.name} className={`relative bg-white rounded-3xl p-8 border ${plan.isPopular ? 'border-indigo-500 shadow-xl' : 'border-gray-200 shadow-sm'}`}>
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-white" /> MOST POPULAR
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <p className="text-xs text-gray-500 mt-2 min-h-[32px]">{plan.description}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
              <span className="text-sm font-medium text-gray-500">{plan.period}</span>
            </div>
            
            <button className={`w-full mt-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${plan.isPopular ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
              Edit Plan Details
            </button>

            <div className="mt-8 space-y-4">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Features Included</div>
              {plan.features.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
