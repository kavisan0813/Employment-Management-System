/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { db } from "../../mockData";
import { Organization, AuditLogEntry, Subscription, SupportTicket } from "../../types";
import {
  Building2, Users, DollarSign, LifeBuoy, ArrowUpRight, ArrowDownRight,
  Activity, Calendar, IndianRupee, Ticket, UserCheck, AlertTriangle,
  Clock, Plus, CreditCard, UserPlus, BarChart4, ClipboardList, ShieldCheck
} from "lucide-react";
import "../../../styles/DashboardView.css";

interface DashboardViewProps {
  onNavigate?: (view: string, targetId?: string) => void;
}

export default function DashboardView({ onNavigate = () => {} }: DashboardViewProps) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedRange, setSelectedRange] = useState("30d");

  const navigate = useNavigate();

  useEffect(() => {
    setOrgs(db.organizations.get());
    setLogs(db.auditLogs.get().slice(0, 5));
    setSubscriptions(db.subscriptions.get());
    setTickets(db.tickets.get());
  }, []);

  const handleNavigate = (view: string, targetId?: string) => {
    if (onNavigate) {
      onNavigate(view, targetId);
    }
    
    const pathMap: Record<string, string> = {
      'dashboard': '/platform-admin/dashboard',
      'organizations': '/platform-admin/organizations',
      'org-create': '/platform-admin/organizations',
      'org-suspended': '/platform-admin/organizations',
      'employees': '/platform-admin/organizations',
      'users': '/platform-admin/users',
      'subscriptions': '/platform-admin/subscriptions',
      'revenue': '/platform-admin/subscriptions',
      'tickets': '/platform-admin/support-tickets',
      'audit': '/platform-admin/audit-logs',
      'reports': '/platform-admin/reports',
      'plans': '/platform-admin/roles',
      'settings': '/platform-admin/settings'
    };
    
    const targetPath = pathMap[view.toLowerCase()] || pathMap[view] || `/platform-admin/${view.toLowerCase()}`;
    navigate(targetPath);
  };

  // Compute platform stats
  const totalOrgs = orgs.length;
  const activeOrgs = orgs.filter(o => o.status === "Active").length;
  const trialOrgs = orgs.filter(o => o.status === "Trial").length;
  const suspendedOrgs = orgs.filter(o => o.status === "Suspended").length;
  const inactiveOrgs = orgs.filter(o => o.status === "Inactive").length;

  const totalUsers = orgs.reduce((acc, curr) => acc + curr.userCount, 0);
  const activeUsers = orgs.filter(o => o.status === "Active" || o.status === "Trial").reduce((acc, curr) => acc + curr.userCount, 0);

  const totalMRR = orgs.reduce((acc, curr) => acc + curr.mrr, 0);

  // New orgs in last 30 days
  const newOrgsThisMonth = orgs.filter(o => {
    if (!o.joinedAt) return false;
    const joined = new Date(o.joinedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joined >= thirtyDaysAgo;
  }).length || 2; // fallback to 2 if none in database matches

  // Expiring in 30 days
  const expiringSoonSubs = subscriptions.filter(s => 
    s.status === "Active" && 
    s.renewalDate && 
    (new Date(s.renewalDate).getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000
  ).length;

  // Let's build plan distribution data
  const planDistribution = orgs.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.plan] = (acc[curr.plan] || 0) + 1;
    return acc;
  }, {});

  const plans = Object.keys(planDistribution).map(key => ({
    name: key,
    value: planDistribution[key],
    color: key === "Enterprise" ? "#6366F1" : key === "Growth" ? "#3B82F6" : "#10B981"
  }));

  const totalPlanItems = plans.reduce((a, b) => a + b.value, 0);

  // Formatted rupee calculations (standard rupees conversion representation)
  const formatRupeesLakhs = (valInUSD: number) => {
    const valInINR = valInUSD * 83; // 1 USD = 83 INR approximate
    const lakhs = valInINR / 100000;
    return `₹${lakhs.toFixed(2)}L`;
  };

  const formattedMRR = formatRupeesLakhs(totalMRR);
  const formattedAnnual = formatRupeesLakhs(totalMRR * 12);
  const formattedPending = formatRupeesLakhs(subscriptions.filter(s => s.status === "Suspended").reduce((acc, s) => acc + s.amount, 0));
  const formattedRenewal = formatRupeesLakhs(subscriptions.filter(s => s.status === "Active").reduce((acc, s) => acc + s.amount, 0));

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center font-semibold sm:justify-between pb-4 border-b border-gray-200/80 gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500 font-semibold">Live heartbeat metrics of your multi-tenant environment.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50 text-xs font-medium">
            <button
              onClick={() => setSelectedRange("7d")}
              className={`px-3 py-1.5 font-semibold rounded-md transition-all ${selectedRange === "7d" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setSelectedRange("30d")}
              className={`px-3 py-1.5 rounded-md transition-all ${selectedRange === "30d" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedRange("90d")}
              className={`px-3 py-1.5 rounded-md transition-all ${selectedRange === "90d" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              90 Days
            </button>
          </div>
          <button
            onClick={() => {
              const csv = "Metric,Value\nTotal Tenants," + totalOrgs + "\nActive Users," + totalUsers + "\nMonthly Recurring Revenue,$" + totalMRR;
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `ems-platform-summary-${selectedRange}.csv`;
              a.click();
            }}
            className="inline-flex items-center font-semibold gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Export Snapshot
          </button>
        </div>
      </div>

      {/* KPI Grid 1 */}
      <div className="kpi-grid font-semibold">
        <div className="kpi-card ">
          <div className="kpi-icon ki-amber">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="kpi-val">{totalOrgs}</div>
          <div className="kpi-lbl">Total organizations</div>
          <div className="kpi-chg chg-up">+{newOrgsThisMonth} this month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon ki-green">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="kpi-val">{totalUsers.toLocaleString()}</div>
          <div className="kpi-lbl">Total employees</div>
          <div className="kpi-chg chg-up">+1,450 this month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon ki-amber">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
          <div className="kpi-val">{formattedMRR}</div>
          <div className="kpi-lbl">Monthly revenue</div>
          <div className="kpi-chg chg-up">+13% vs last month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon ki-red">
            <Ticket className="w-3.5 h-3.5" />
          </div>
          <div className="kpi-val">{tickets.filter(t => t.status === "Active" || t.status === "Pending").length}</div>
          <div className="kpi-lbl">Open tickets</div>
          <div className="kpi-chg chg-dn">
            {tickets.filter(t => t.priority === "Critical" && (t.status === "Active" || t.status === "Pending")).length} critical
          </div>
        </div>
      </div>

      {/* KPI Grid 2 */}
      <div className="kpi-grid font-semibold">
        <div className="kpi-card">
          <div className="kpi-icon ki-green">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="kpi-val">{activeOrgs}</div>
          <div className="kpi-lbl">Active organizations</div>
          <div className="kpi-chg chg-up">
            {totalOrgs ? ((activeOrgs / totalOrgs) * 100).toFixed(1) : 0}% of total
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon ki-blue">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="kpi-val">{activeUsers.toLocaleString()}</div>
          <div className="kpi-lbl">Active users (MAU)</div>
          <div className="kpi-chg chg-up">
            {totalUsers ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0}% engagement
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon ki-red">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="kpi-val">{suspendedOrgs}</div>
          <div className="kpi-lbl">Suspended orgs</div>
          <div className="kpi-chg chg-dn">
            {totalOrgs ? ((suspendedOrgs / totalOrgs) * 100).toFixed(1) : 0}% of total
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon ki-amber">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="kpi-val">{expiringSoonSubs}</div>
          <div className="kpi-lbl">Expiring soon</div>
          <div className="kpi-chg chg-dn">Within 30 days</div>
        </div>
      </div>

      {/* Two Col Layout: Stats */}
      <div className="two-col">
        <div className="panel font-semibold">
          <div className="ptitle">
            Organization statistics 
            <button className="pmore" onClick={() => handleNavigate("organizations")}>View all →</button>
          </div>
          <div className="stat-row">
            <span className="sk">New this month</span>
            <span className="sv">{newOrgsThisMonth}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Trial organizations</span>
            <span className="bdg bg-blue">{trialOrgs}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Paid organizations</span>
            <span className="bdg bg-green">{activeOrgs - trialOrgs}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Suspended</span>
            <span className="bdg bg-red">{suspendedOrgs}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Inactive</span>
            <span className="bdg bg-gray">{inactiveOrgs}</span>
          </div>
        </div>

        <div className="panel font-semibold">
          <div className="ptitle font-semibold">
            Employee statistics 
            <button className="pmore" onClick={() => handleNavigate("organizations")}>View all →</button>
          </div>
          <div className="stat-row">
            <span className="sk">Active employees</span>
            <span className="bdg bg-green">{activeUsers.toLocaleString()}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Inactive</span>
            <span className="bdg bg-gray">{(totalUsers - activeUsers).toLocaleString()}</span>
          </div>
          <div className="stat-row">
            <span className="sk">New joiners this month</span>
            <span className="bdg bg-amber">+340</span>
          </div>
          <div className="stat-row">
            <span className="sk">Resigned this month</span>
            <span className="bdg bg-red">−82</span>
          </div>
          <div className="stat-row">
            <span className="sk">DAU / WAU / MAU</span>
            <span className="sv">
              {Math.round(activeUsers * 0.25).toLocaleString()} / {Math.round(activeUsers * 0.6).toLocaleString()} / {activeUsers.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Three Col Layout: Financials & Quick Actions */}
      <div className="three-col font-semibold">
        <div className="panel">
          <div className="ptitle">
            Revenue overview 
            <button className="pmore" onClick={() => handleNavigate("subscriptions")}>Details →</button>
          </div>
          <div className="stat-row">
            <span className="sk">Monthly revenue</span>
            <span className="sv">{formattedMRR}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Annual revenue</span>
            <span className="sv">{formattedAnnual}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Pending payments</span>
            <span className="bdg bg-red">{formattedPending}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Renewal revenue</span>
            <span className="sv">{formattedRenewal}</span>
          </div>
        </div>

        <div className="panel">
          <div className="ptitle">
            Subscription health 
            <button className="pmore" onClick={() => handleNavigate("subscriptions")}>Manage →</button>
          </div>
          <div className="stat-row">
            <span className="sk">Active subscriptions</span>
            <span className="bdg bg-green">
              {subscriptions.filter(s => s.status === "Active").length}
            </span>
          </div>
          <div className="stat-row">
            <span className="sk">Expiring in 7 days</span>
            <span className="bdg bg-red">
              {subscriptions.filter(s => s.status === "Active" && s.renewalDate && (new Date(s.renewalDate).getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000).length}
            </span>
          </div>
          <div className="stat-row">
            <span className="sk">Expiring in 30 days</span>
            <span className="bdg bg-amber">{expiringSoonSubs}</span>
          </div>
          <div className="stat-row">
            <span className="sk">Renewed this month</span>
            <span className="sv">41</span>
          </div>
          <div className="stat-row">
            <span className="sk">Cancelled</span>
            <span className="bdg bg-gray">
              {subscriptions.filter(s => s.status === "Inactive").length}
            </span>
          </div>
        </div>

        <div className="panel font-semibold">
          <div className="ptitle">Quick actions</div>
          <div className="qgrid">
            <button className="qbtn" onClick={() => handleNavigate("org-create")}>
              <Building2 className="w-5.5 h-5.5" />
              <span>Create org</span>
            </button>
            <button className="qbtn" onClick={() => handleNavigate("subscriptions")}>
              <CreditCard className="w-5.5 h-5.5" />
              <span>New sub</span>
            </button>
            <button className="qbtn" onClick={() => handleNavigate("users")}>
              <UserPlus className="w-5.5 h-5.5" />
              <span>Add admin</span>
            </button>
            <button className="qbtn" onClick={() => handleNavigate("reports")}>
              <BarChart4 className="w-5.5 h-5.5" />
              <span>Reports</span>
            </button>
            <button className="qbtn" onClick={() => handleNavigate("plans")}>
              <ClipboardList className="w-5.5 h-5.5" />
              <span>Plans</span>
            </button>
            <button className="qbtn" onClick={() => handleNavigate("audit")}>
              <ShieldCheck className="w-5.5 h-5.5" />
              <span>Audit log</span>
            </button>
          </div>
        </div>
      </div>

   

      {/* Two Col Layout: Recent Activity & Top Orgs */}
      <div className="two-col font-semibold">
        <div className="panel font-semibold">
          <div className="ptitle">
            Recent activity 
            <button className="pmore" onClick={() => handleNavigate("audit")}>Full log →</button>
          </div>
          {logs.map(log => {
            let dotColor = "#378ADD"; // blue for billing
            if (log.eventCategory === "Security") dotColor = "#E24B4A"; // red
            else if (log.eventCategory === "Auth") dotColor = "#EF9F27"; // orange
            else if (log.eventCategory === "Admin Action" || log.eventCategory === "Data") dotColor = "#3B6D11"; // green

            const timeStr = new Date(log.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
            
            return (
              <div className="act-item" key={log.id}>
                <div className="adot" style={{ background: dotColor }}></div>
                <div>
                  <div className="atext">{log.event}</div>
                  <div className="atime">{timeStr} &middot; {log.eventCategory.toLowerCase()}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel font-semibold">
          <div className="ptitle font-semibold">
            Top organizations 
            <button className="pmore" onClick={() => handleNavigate("organizations")}>View all →</button>
          </div>
          {orgs.slice(0, 4).map((org, index) => (
            <div className="torg" key={org.id} onClick={() => handleNavigate("organizations", org.id)} style={{ cursor: "pointer" }}>
              <div className="trank">{index + 1}</div>
              <div className="tavt">{org.name.charAt(0)}</div>
              <div className="tname">{org.name}</div>
              <div className="temp">{org.userCount} emp</div>
              <span className={`bdg ${org.plan === "Enterprise" ? "bg-amber" : org.plan === "Growth" ? "bg-blue" : "bg-green"}`} style={{ fontSize: "9px" }}>
                {org.plan}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
