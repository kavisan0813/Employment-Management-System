import React, { useState } from "react";
import { OrganizationService } from "../services/organization.service";
import { Building2, Mail, Phone, MapPin, CheckCircle2, Package, Shield, Settings, ChevronRight, Plus } from "lucide-react";

export function AddOrganizationForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    industry: "Technology",
    registrationNumber: "",
    gstNumber: "",
    website: "",
    ownerEmail: "",
    ownerName: "",
    phone: "",
    address: "",
    country: "United States",
    state: "",
    city: "",
    pincode: "",
    plan: "Starter",
    seatLimit: 50,
    password: "",
    enabledModules: ["Employee Management", "Attendance", "Leave Management"]
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModuleToggle = (mod: string) => {
    setFormData(prev => ({
      ...prev,
      enabledModules: prev.enabledModules.includes(mod)
        ? prev.enabledModules.filter(m => m !== mod)
        : [...prev.enabledModules, mod]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    OrganizationService.createOrganization({
      name: formData.name,
      domain: formData.website.replace(/^https?:\/\//, ''),
      code: formData.code,
      industry: formData.industry,
      registrationNumber: formData.registrationNumber,
      gstNumber: formData.gstNumber,
      website: formData.website,
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      phone: formData.phone,
      address: formData.address,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      pincode: formData.pincode,
      plan: formData.plan as any,
      seatLimit: formData.seatLimit,
      password: formData.password,
      enabledModules: formData.enabledModules
    });
    onSuccess();
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Add New Organization
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Provision a new tenant environment and administrator account.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Progress Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 py-2">
            {[
              { id: 1, name: "Basic Information", icon: Building2 },
              { id: 2, name: "Contact & Address", icon: MapPin },
              { id: 3, name: "Admin Account", icon: Shield },
              { id: 4, name: "Plan & Modules", icon: Package },
            ].map((s) => {
              const active = step === s.id;
              const completed = step > s.id;
              return (
                <div key={s.id} className="relative pl-6 flex items-center">
                  <div className={`absolute -left-[11px] w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    active ? "bg-indigo-600 ring-4 ring-indigo-50" : completed ? "bg-emerald-500" : "bg-gray-200"
                  }`}>
                    {completed ? <CheckCircle2 className="w-3 h-3 text-white" /> : <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className={`text-sm font-medium ${active ? "text-indigo-900 font-bold" : completed ? "text-gray-900" : "text-gray-400"}`}>
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-8">
          {step === 1 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organization Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors" placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organization Code *</label>
                  <input required name="code" value={formData.code} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white uppercase" placeholder="ACM001" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Industry Type *</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white">
                    <option>Technology</option>
                    <option>Manufacturing</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Company Reg Number</label>
                  <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">GST/Tax Number</label>
                  <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact & Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Website Domain</label>
                  <input name="website" value={formData.website} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" placeholder="https://acme.com" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Address</label>
                  <input name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Country</label>
                  <input name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">State/Province</label>
                  <input name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">City</label>
                  <input name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pincode / ZIP</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">First Admin User</h2>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-xs mb-4">
                This user will be granted the <strong>Org Admin</strong> role and will receive an email with login instructions.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Full Name</label>
                  <input name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Admin Email *</label>
                  <input type="email" required name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Initial Password *</label>
                  <input type="password" required name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription & Modules</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subscription Plan</label>
                  <select name="plan" value={formData.plan} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white">
                    <option value="Trial">Trial (14 Days)</option>
                    <option value="Starter">Starter</option>
                    <option value="Growth">Growth</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Employee Limit</label>
                  <select name="seatLimit" value={formData.seatLimit} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:bg-white">
                    <option value="50">50 Employees</option>
                    <option value="100">100 Employees</option>
                    <option value="500">500 Employees</option>
                    <option value="99999">Unlimited</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-xs font-semibold text-gray-700 mb-3">Enable HR Modules</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Employee Management", "Attendance", "Leave Management", "Payroll", "Recruitment", "Performance", "Assets", "Training", "Help Desk"].map(mod => (
                    <label key={mod} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-indigo-600" 
                        checked={formData.enabledModules.includes(mod)}
                        onChange={() => handleModuleToggle(mod)}
                      />
                      <span className="text-sm font-medium text-gray-800">{mod}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm transition-colors cursor-pointer">
                Back
              </button>
            ) : <div />}
            
            {step < 4 ? (
              <button type="button" onClick={() => setStep(s => s + 1)} className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                <Building2 className="w-4 h-4" /> Create Tenant
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
