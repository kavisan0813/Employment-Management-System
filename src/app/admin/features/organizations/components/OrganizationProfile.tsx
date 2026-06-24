import React, { useState, useEffect } from "react";
import { Organization } from "../../../types";
import { Globe, Phone, Mail, MapPin, Users, Database, ShieldCheck, Zap, Edit2, Save, X } from "lucide-react";

export function OrganizationProfile({ org, hook }: { org: Organization, hook?: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>({});

  useEffect(() => {
    setFormData({
      website: org.website,
      registrationNumber: org.registrationNumber,
      gstNumber: org.gstNumber,
      phone: org.phone,
      address: org.address,
      city: org.city,
      state: org.state,
      country: org.country,
      pincode: org.pincode,
    });
  }, [org]);

  const handleSave = () => {
    if (hook?.actions?.updateOrg) {
      hook.actions.updateOrg(org.id, formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      website: org.website,
      registrationNumber: org.registrationNumber,
      gstNumber: org.gstNumber,
      phone: org.phone,
      address: org.address,
      city: org.city,
      state: org.state,
      country: org.country,
      pincode: org.pincode,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {org.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              {org.name}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                org.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {org.status}
              </span>
            </h1>
            <p className="text-sm text-gray-500 font-medium">{org.industry} • Code: {org.code || "N/A"}</p>
          </div>
        </div>
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* General Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">General Information</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-semibold">Website</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    className="w-full mt-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{org.website || org.domain}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-semibold">Registration No.</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber || ""}
                    onChange={handleChange}
                    className="w-full mt-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{org.registrationNumber || "Not Provided"}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-semibold">GST / Tax ID</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber || ""}
                    onChange={handleChange}
                    className="w-full mt-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{org.gstNumber || "Not Provided"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Contact Information</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-semibold">Admin Email</p>
                <p className="text-indigo-600 font-medium mt-1">{org.ownerEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-semibold">Phone</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full mt-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{org.phone || "Not Provided"}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-xs font-semibold">Address</p>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <input type="text" name="address" placeholder="Address" value={formData.address || ""} onChange={handleChange} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" name="city" placeholder="City" value={formData.city || ""} onChange={handleChange} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500" />
                      <input type="text" name="state" placeholder="State" value={formData.state || ""} onChange={handleChange} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" name="country" placeholder="Country" value={formData.country || ""} onChange={handleChange} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500" />
                      <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode || ""} onChange={handleChange} className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium leading-relaxed mt-1">
                    {org.address ? `${org.address}, ${org.city}, ${org.state}, ${org.country} ${org.pincode}` : "No address on file."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs xl:col-span-1 md:col-span-2">
          <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
              <Users className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-2xl font-bold text-indigo-900">{org.userCount}</p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Active Employees</p>
            </div>
            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
              <Zap className="w-5 h-5 text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{org.plan}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Current Plan</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
