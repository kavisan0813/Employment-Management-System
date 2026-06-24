/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Package, Plus, Check, X, Power } from "lucide-react";
import { usePlans } from "../hooks/usePlans";
import { PlanForm } from "../components/PlanForm";
import { PLAN_COLORS } from "../types/plan.types";

export function PlansPage() {
  const {
    filteredPlans,
    selectedPlan,
    isFormOpen,
    setIsFormOpen,
    isEditing,
    openCreate,
    openEdit,
    handleSave,
    handleToggleStatus,
  } = usePlans();

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium">
      
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Plan Master
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage available subscription plans, tier structures, and included features.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 font-semibold" />
          New Plan
        </button>
      </div>

      {/* Plan cards grid */}
      <div className="p-6 flex-1 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 font-semibold">
        {filteredPlans.map((plan) => {
          const tierColor = PLAN_COLORS[plan.tier];
          return (
            <div
              key={plan.id}
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer ${
                plan.status === "Inactive" ? "opacity-60" : ""
              }`}
              onClick={() => openEdit(plan)}
            >
              {/* Color accent bar */}
              <div className="h-1.5" style={{ backgroundColor: tierColor }} />

              <div className="p-5">
                {/* Title + status */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                    <span
                      className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 border"
                      style={{
                        backgroundColor: `${tierColor}15`,
                        color: tierColor,
                        borderColor: `${tierColor}30`,
                      }}
                    >
                      {plan.tier}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(plan.id);
                    }}
                    className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                      plan.status === "Active"
                        ? "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                        : "text-gray-400 bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    title={plan.status === "Active" ? "Deactivate" : "Activate"}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ${plan.monthlyPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">/month</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                  {plan.description}
                </p>

                {/* Features */}
                <div className="space-y-1.5 mb-4">
                  {plan.features.slice(0, 6).map((feat) => (
                    <div key={feat.name} className="flex items-center gap-2 text-[11px]">
                      {feat.included ? (
                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3 h-3 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={feat.included ? "text-gray-700" : "text-gray-400"}>
                        {feat.name}
                        {feat.limit && (
                          <span className="text-gray-400 ml-1">({feat.limit})</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                  <span>{plan.subscriberCount} subscribers</span>
                  <span>Max {plan.maxUsers === 99999 ? "∞" : plan.maxUsers} users</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* Form modal */}
      {isFormOpen && (
        <PlanForm
          plan={selectedPlan}
          isEditing={isEditing}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}

export default PlansPage;
