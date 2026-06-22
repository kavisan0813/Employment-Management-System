/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, X } from "lucide-react";
import { REGIONS } from "../../types/organization.types";

interface OrganizationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formName: string;
  setFormName: (val: string) => void;
  formDomain: string;
  setFormDomain: (val: string) => void;
  formPlan: "Starter" | "Growth" | "Enterprise";
  setFormPlan: (val: "Starter" | "Growth" | "Enterprise") => void;
  formRegion: string;
  setFormRegion: (val: string) => void;
  formOwnerEmail: string;
  setFormOwnerEmail: (val: string) => void;
  formSeatLimit: number;
  setFormSeatLimit: (val: number) => void;
  formIndustry: string;
  setFormIndustry: (val: string) => void;
  formPassword?: string;
  setFormPassword?: (val: string) => void;
  isEditMode?: boolean;
}

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
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden"
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
    <div className="px-5 py-4 bg-[#F4F1EC] border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-900">
        <Icon className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full bg-white focus:outline-none"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

const inputClass = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors duration-150";

export function OrganizationWizard({
  isOpen,
  onClose,
  onSubmit,
  formName,
  setFormName,
  formDomain,
  setFormDomain,
  formPlan,
  setFormPlan,
  formRegion,
  setFormRegion,
  formOwnerEmail,
  setFormOwnerEmail,
  formSeatLimit,
  setFormSeatLimit,
  formIndustry,
  setFormIndustry,
  formPassword = "",
  setFormPassword,
  isEditMode = false,
}: OrganizationWizardProps) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        icon={Building2}
        title={isEditMode ? "Edit organization" : "New organization"}
        onClose={onClose}
      />
      <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs">
        <Field label="Organization name" required>
          <input
            type="text"
            required
            placeholder="Acme Corp"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Domain" required>
            <input
              type="text"
              required
              placeholder="acme.com"
              value={formDomain}
              onChange={(e) => setFormDomain(e.target.value)}
              className={`${inputClass} font-mono`}
            />
          </Field>
          <Field label="Industry">
            <input
              type="text"
              placeholder="Technology"
              value={formIndustry}
              onChange={(e) => setFormIndustry(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Plan">
            <select
              value={formPlan}
              onChange={(e) =>
                setFormPlan(e.target.value as "Starter" | "Growth" | "Enterprise")
              }
              className={inputClass}
            >
              <option value="Starter">Starter — $99/mo</option>
              <option value="Growth">Growth — $1,200/mo</option>
              <option value="Enterprise">Enterprise — $3,500/mo</option>
            </select>
          </Field>
          <Field label="Seat limit">
            <input
              type="number"
              min={5}
              value={formSeatLimit}
              onChange={(e) => setFormSeatLimit(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Owner email" required>
          <input
            type="email"
            required
            placeholder="owner@acme.com"
            value={formOwnerEmail}
            onChange={(e) => setFormOwnerEmail(e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </Field>
        {!isEditMode && setFormPassword && (
          <Field label="Password" required>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
        )}
        <Field label="Region">
          <select
            value={formRegion}
            onChange={(e) => setFormRegion(e.target.value)}
            className={inputClass}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-500 rounded-full font-medium hover:bg-gray-50 transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium shadow-sm transition-colors focus:outline-none"
          >
            {isEditMode ? "Save changes" : "Create tenant"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default OrganizationWizard;
