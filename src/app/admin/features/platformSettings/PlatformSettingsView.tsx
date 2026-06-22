/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { pushAuditLog } from "../../mockData";
import {
  Settings,
  Users,
  Palette,
  Mail,
  Megaphone,
  ShieldAlert,
  Cpu,
  Database,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Clipboard,
  ArrowUpRight,
  Copy,
} from "lucide-react";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export default function PlatformSettingsView() {
  const [activeSubTab, setActiveSubTab] = useState<
    "team" | "brand" | "email" | "banners" | "ip" | "ai" | "backup"
  >("team");

  // TEAM MEMBERS INVITATIONS
  const [operatorEmail, setOperatorEmail] = useState("");
  const [operatorRole, setOperatorRole] = useState("Platform Auditor");
  const [operators, setOperators] = useState([
    { email: CURRENT_ADMIN_EMAIL, role: "Super Admin", state: "Active" },
    {
      email: "sarah.compliance@ems.com",
      role: "Platform Auditor",
      state: "Active",
    },
    {
      email: "david.secops@ems.com",
      role: "Infrastructure Manager",
      state: "Pending",
    },
  ]);

  // BRANDING CONFIGS
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [customDomain, setCustomDomain] = useState("portal.ems-client.com");
  const [dnsVerified, setDnsVerified] = useState(false);

  // TRANS EMAIL TEMPLATES WYSIWYG
  const [selectedEmailTpt, setSelectedEmailTpt] = useState("welcome_mail");
  const [emailSubject, setEmailSubject] = useState(
    "Welcome to EMS Integrated Suite",
  );
  const [emailBody, setEmailBody] = useState(
    `Hi {{user_name}},\n\nYour secure space dashboard is active at EMS integrated portal. Get started today by validating your SSO details.\n\nBest wishes,\nTeam EMS`,
  );

  // PUBLIC SYSTEM BANNER ANNOUNCEMENTS
  const [annBannerText, setAnnBannerText] = useState(
    "Scheduled maintenance downtime on Node-04: Sunday 02:00 UTC - 04:00 UTC.",
  );
  const [annBannerActive, setAnnBannerActive] = useState(true);

  // IP CIDR WHITELISTS
  const [cidrIpRule, setCidrIpRule] = useState("");
  const [cidrRules, setCidrRules] = useState([
    { ip: "192.168.1.1/24", label: "Corporate HQ Router (Secure SSL)" },
    { ip: "50.14.90.108/32", label: "Audit Agent Gateway Node" },
  ]);

  // SYSTEM COST MODEL TRACES
  const [aiConfidence, setAiConfidence] = useState(0.85);
  const [aiMaxTokens, setAiMaxTokens] = useState(2048);

  // BACKUP ARCHIVE LOGS
  const [backupLogs, setBackupLogs] = useState([
    {
      id: "bak-2026-06",
      time: "2026-06-19 12:00:00",
      size: "3.2 GB",
      node: "Node-02",
    },
    {
      id: "bak-2026-05",
      time: "2026-05-19 12:00:00",
      size: "3.1 GB",
      node: "Node-02",
    },
  ]);

  // Invite handler
  const handleInviteOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorEmail) return;

    if (operators.find((o) => o.email === operatorEmail)) {
      alert("Billing operator already invited.");
      return;
    }

    setOperators([
      ...operators,
      { email: operatorEmail, role: operatorRole, state: "Pending" },
    ]);
    pushAuditLog(
      "operator.invited",
      "Security",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { invitee: operatorEmail, assigned_role: operatorRole },
    );

    setOperatorEmail("");
    alert(`Secure credential invite dispatched to ${operatorEmail}`);
  };

  // Verify Custom Domain DNS TXT record
  const verifyCustomDnsRecord = () => {
    pushAuditLog(
      "dns.verification",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { domain: customDomain },
    );
    alert(
      "Querying global Cloudflare endpoints for custom DNS records...\nDNS Entry Verified: TXT record status matches successfully!",
    );
    setDnsVerified(true);
  };

  // Add IP CIDR limit rule
  const handleAddIpRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cidrIpRule) return;

    setCidrRules([
      ...cidrRules,
      { ip: cidrIpRule, label: "Manual Operator Override" },
    ]);
    pushAuditLog(
      "security.ip_rule_added",
      "Security",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { ip_rule: cidrIpRule },
    );

    setCidrIpRule("");
    alert("IP range firewall whitelist rules modified.");
  };

  const removeIpRange = (ip: string) => {
    setCidrRules(cidrRules.filter((r) => r.ip !== ip));
    pushAuditLog(
      "security.ip_rule_removed",
      "Security",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { ip_rule: ip },
    );
  };

  const triggerManualBackupSnapshot = () => {
    const newId = `bak-manual-${Date.now().toString().slice(6)}`;
    const newLog = {
      id: newId,
      time: new Date().toISOString().replace("T", " ").slice(0, 19),
      size: "3.4 GB",
      node: "Node-01",
    };

    setBackupLogs([newLog, ...backupLogs]);
    pushAuditLog(
      "platform.backup_created",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { snapshot_id: newId },
    );
    alert(
      `Encrypted cloud storage snapshot archive '${newId}' successfully initialized for Node-01.`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-950 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            Operator Settings Dashboard
          </h1>
          <p className="text-xs text-gray-400">
            Reconfigure custom white-labelling templates, authorize operator
            roles, manage IP boundaries, or deploy snapshot archives.
          </p>
        </div>
      </div>

      {/* Sub Tabs menu bar */}
      <div className="flex flex-wrap border-b border-gray-200 text-xs font-semibold text-gray-500 gap-y-1">
        <button
          onClick={() => setActiveSubTab("team")}
          className={`px-4 py-2.5 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "team"
              ? "border-primary-600 text-primary-600 bg-indigo-50/10"
              : "border-transparent hover:text-gray-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Operators Invitation
        </button>
        <button
          onClick={() => setActiveSubTab("brand")}
          className={`px-4 py-2.5 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "brand"
              ? "border-primary-600 text-primary-600 bg-indigo-50/10"
              : "border-transparent hover:text-gray-900"
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> Portal Branding Templates
        </button>
        <button
          onClick={() => setActiveSubTab("email")}
          className={`px-4 py-2.5 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "email"
              ? "border-primary-600 text-primary-600 bg-indigo-50/10"
              : "border-transparent hover:text-gray-900"
          }`}
        >
          <Mail className="w-3.5 h-3.5" /> Visual Email Sandbox
        </button>
        <button
          onClick={() => setActiveSubTab("banners")}
          className={`px-4 py-2.5 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "banners"
              ? "border-primary-600 text-primary-600 bg-indigo-50/10"
              : "border-transparent hover:text-gray-900"
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" /> Announcement Banners
        </button>
        <button
          onClick={() => setActiveSubTab("ip")}
          className={`px-4 py-2.5 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "ip"
              ? "border-primary-600 text-primary-600 bg-indigo-50/10"
              : "border-transparent hover:text-gray-900"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Firewalls & IPs Limits
        </button>
        <button
          onClick={() => setActiveSubTab("ai")}
          className={`px-4 py-2.5 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "ai"
              ? "border-primary-600 text-primary-600 bg-indigo-50/10"
              : "border-transparent hover:text-gray-900"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Gemini AI Thresholds
        </button>
        <button
          onClick={() => setActiveSubTab("backup")}
          className={`px-4 py-2.5 border-b-2 font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "backup"
              ? "border-primary-600 text-primary-600 bg-indigo-50/10"
              : "border-transparent hover:text-gray-900"
          }`}
        >
          <Database className="w-3.5 h-3.5" /> Snapshots Archive
        </button>
      </div>

      {/* RENDER ACTIVE SCREEN CONTROLS */}

      {/* 1. OPERATOR TEAM SELECTION */}
      {activeSubTab === "team" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-950">
              Invite Security Console Operators
            </h3>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              Operators get access details for managing organizational portal
              layers on super consoles.
            </p>

            <form
              onSubmit={handleInviteOperator}
              className="space-y-4 text-xs font-semibold"
            >
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@EMS-Operator.com"
                  value={operatorEmail}
                  onChange={(e) => setOperatorEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2.5 text-xs focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Operator Clearance Designation *
                </label>
                <select
                  value={operatorRole}
                  onChange={(e) => setOperatorRole(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2.5 text-xs"
                >
                  <option value="Platform Auditor">
                    Compliance Platform Auditor
                  </option>
                  <option value="Infrastructure Manager">
                    Infrastructure Operations lead
                  </option>
                  <option value="Billing Operator">
                    Billing Settlement Lead
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Dispatch Registration Invite
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-950">
              Active Operators List
            </h3>
            <div className="border border-gray-150 rounded-xl divide-y divide-gray-100 overflow-hidden font-medium text-xs">
              {operators.map((item) => (
                <div
                  key={item.email}
                  className="p-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-bold text-gray-900">{item.email}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {item.role}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.state === "Active"
                        ? "bg-teal-50 text-teal-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PORTAL BRANDING SPECIFICS */}
      {activeSubTab === "brand" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-950">
              General Custom Branding Hexes
            </h3>
            <p className="text-gray-400 text-[11px]">
              Select client colors that override template defaults in user
              landing portals.
            </p>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">
                  Primary Color Palette Source
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-12 h-10 rounded border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1 bg-gray-50 border p-2.5 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Primary domain validation DNS (TXT)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="flex-1 bg-gray-50 border p-2 text-xs"
                  />
                  <button
                    onClick={verifyCustomDnsRecord}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs leading-none font-bold cursor-pointer"
                  >
                    Ping Dns TXT
                  </button>
                </div>
                {dnsVerified ? (
                  <p className="text-[11px] text-teal-650 font-bold flex items-center gap-1 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Domain Verified
                    &middot; DNS mapping resolved correctly.
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-600 pt-1">
                    Add domain key TXT validation record to verify ownership.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-center items-center text-center space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-indigo-550 font-bold">
              Portal Live Mock Render
            </span>
            <div className="border border-gray-200 rounded-lg p-5 w-4/5 shadow-2xs space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: brandColor }}
                />
                <span className="font-bold text-xs">{customDomain}</span>
              </div>
              <div
                className="p-3 bg-gray-50 rounded"
                style={{ borderLeft: `3px solid ${brandColor}` }}
              >
                <p className="text-[10px] text-gray-400">
                  Welcome portal interface successfully validated.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EMAIL TRANSACTIONAL EDITOR PREVIEW */}
      {activeSubTab === "email" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 text-xs font-semibold">
            <h3 className="text-sm font-bold text-gray-950">
              Edit Transactional Mail templates
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">
                Mail Event Type
              </label>
              <select
                value={selectedEmailTpt}
                onChange={(e) => {
                  setSelectedEmailTpt(e.target.value);
                  if (e.target.value === "welcome_mail") {
                    setEmailSubject("Welcome to EMS Integrated Suite");
                    setEmailBody(
                      `Hi {{user_name}},\n\nYour secure space dashboard is active at EMS integrated portal. Get started today by validating your SSO details.\n\nBest wishes,\nTeam EMS`,
                    );
                  } else {
                    setEmailSubject("Billing failed: Action required");
                    setEmailBody(
                      `Dear {{org_name}},\n\nOur payment processor was unable to capture recurring charges on card •••• {{card_last4}}. Please update billing inputs immediately to prevent platform freeze states.\n\nBest compliance wishes,\nBilling Team`,
                    );
                  }
                }}
                className="w-full bg-gray-50 border p-2.5 rounded-lg text-xs"
              >
                <option value="welcome_mail">
                  New tenant onboarding welcome
                </option>
                <option value="failed_billing">
                  Failed invoice card reminder
                </option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">
                Mail Subject header
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-gray-50 border p-2 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">
                Mail Body Rich Text Preview
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full bg-gray-50 border p-2.5 font-mono text-xs text-gray-800"
                rows={5}
              />
            </div>

            <button
              onClick={() =>
                alert(
                  "Committed revised transactional mail templates. Dispatched mock test mail trace to super admin inbox.",
                )
              }
              className="w-full py-2 bg-indigo-600 text-white rounded font-bold cursor-pointer"
            >
              Commit Email Changes
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between text-xs space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-gray-400">
              Mock Email Dispatch Previewer
            </span>
            <div className="border border-gray-200 rounded-lg overflow-hidden flex-1 flex flex-col text-xs bg-gray-50/50">
              <div className="p-3 bg-white border-b border-gray-150 space-y-1 text-[11px] text-gray-500 font-semibold">
                <p>
                  From:{" "}
                  <strong className="text-gray-800 font-bold">
                    EMS Platform Delivery &lt;noreply@ems.com&gt;
                  </strong>
                </p>
                <p>
                  Subject:{" "}
                  <strong className="text-gray-800 font-bold">
                    {emailSubject}
                  </strong>
                </p>
              </div>
              <div className="p-4 flex-1 bg-white text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                {emailBody
                  .replace("{{user_name}}", "Pradeep")
                  .replace("{{org_name}}", "Acme Corp")
                  .replace("{{card_last4}}", "4242")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PUBLIC SYSTEM ANNOUNCEMENTS BANNERS */}
      {activeSubTab === "banners" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-950">
            System Announcement Banners
          </h3>
          <p className="text-gray-500 text-[11px] leading-relaxed">
            Publish flash message banners globally across all client company
            portals to warn system alerts in real-time.
          </p>

          <div className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">
                Urgent System banner Banner Text
              </label>
              <textarea
                value={annBannerText}
                onChange={(e) => setAnnBannerText(e.target.value)}
                className="w-full bg-gray-50 border p-2.5 rounded-lg"
                rows={2}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={annBannerActive}
                onChange={(e) => setAnnBannerActive(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-[11px] text-gray-700">
                Display this announcement banner on client organization pages
              </span>
            </div>

            {annBannerActive && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-805 text-xs font-bold flex items-center justify-between gap-4 select-none">
                <span>📢 Action: {annBannerText}</span>
                <button
                  onClick={() => setAnnBannerActive(false)}
                  className="font-extrabold hover:text-indigo-900 cursor-pointer"
                >
                  [Dismiss]
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. PORTAL IP RANGE SECURITY */}
      {activeSubTab === "ip" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 text-xs font-semibold">
            <h3 className="text-sm font-bold text-gray-905">
              Whitelist IP Addresses / CIDR Networks
            </h3>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              Limit general admin panel access strictly to authorized company
              gateway networks to enforce perimeter security blockages.
            </p>

            <form onSubmit={handleAddIpRule} className="space-y-3">
              <input
                type="text"
                required
                placeholder="e.g. 192.168.1.1/24"
                value={cidrIpRule}
                onChange={(e) => setCidrIpRule(e.target.value)}
                className="w-full bg-gray-50 border p-2 text-xs font-mono"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-755 text-white rounded font-bold cursor-pointer"
              >
                Add IP Network Exclusion
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4 text-xs font-semibold">
            <h3 className="text-sm font-bold text-gray-950">
              Active White list IP segments
            </h3>
            <div className="border border-gray-150 rounded-xl divide-y divide-gray-100 overflow-hidden font-medium text-xs">
              {cidrRules.map((rule) => (
                <div
                  key={rule.ip}
                  className="p-3 flex items-center justify-between bg-white hover:bg-gray-50"
                >
                  <div>
                    <code className="font-mono text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded font-bold">
                      {rule.ip}
                    </code>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {rule.label}
                    </p>
                  </div>
                  <button
                    onClick={() => removeIpRange(rule.ip)}
                    className="p-1 hover:bg-rose-50 rounded text-rose-600 font-bold cursor-pointer shrink-0"
                    title="Remove Rule"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. GEMINI AI THRESHOLDS CONFIG */}
      {activeSubTab === "ai" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-gray-950">
            AI Audit Assist Parameters Selection
          </h3>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Fine-tune the Gemini analytics system that reviews compliance logs
            to highlight anomalous security trails.
          </p>

          <div className="space-y-5 text-xs font-semibold">
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">
                  AI Assessor Temperature Threshold confidence
                </span>
                <span className="font-mono text-indigo-700">
                  {aiConfidence * 100}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={aiConfidence}
                onChange={(e) => setAiConfidence(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-gray-450 italic leading-relaxed">
                Higher levels increase generative risk but capture complex
                multi-step cyber breach patterns.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">
                  Model tokens limits
                </label>
                <select
                  value={aiMaxTokens}
                  onChange={(e) => setAiMaxTokens(Number(e.target.value))}
                  className="w-full bg-gray-50 border p-2 text-xs"
                >
                  <option value={1024}>1,024 Token limits</option>
                  <option value={2048}>2,048 Token limits</option>
                  <option value={4096}>4,096 Token limits</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block pb-1">
                  Active AI model selection
                </label>
                <input
                  type="text"
                  disabled
                  value="Gemini 2.5 Flash (SOC2 Compliant)"
                  className="w-full bg-gray-150 border p-2 text-xs text-gray-600 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  "Gemini configuration schema updated immediately across backend microservices.",
                )
              }
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold cursor-pointer"
            >
              Apply AI properties
            </button>
          </div>
        </div>
      )}

      {/* 7. SYSTEM SNAPSHOT BACKUPS */}
      {activeSubTab === "backup" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-950">
                Disaster Recovery Snapshots ledger
              </h3>
              <p className="text-gray-550 text-[11px] leading-relaxed">
                Manage immutable relational snapshot archives stored inside
                secure AWS S3 buckets.
              </p>
            </div>
            <button
              onClick={triggerManualBackupSnapshot}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Run instant partition
              Backup
            </button>
          </div>

          <div className="border border-gray-150 rounded-xl overflow-hidden shadow-3xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-150 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3">Snapshot UUID Reference</th>
                  <th className="px-4 py-3">Archive Signature Time</th>
                  <th className="px-4 py-3">Block partition size</th>
                  <th className="px-4 py-3">Server Cluster Origin</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {backupLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-900 font-bold">
                      {log.id}
                    </td>
                    <td className="px-4 py-3 text-gray-550">{log.time}</td>
                    <td className="px-4 py-3 text-gray-750 font-mono text-[11px]">
                      {log.size}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">
                      {log.node}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `RESTORE WARNING:\nAre you sure you want to restore cluster data back to snap '${log.id}'?\nThis will revert all database state, freeze active billing operations, and require cluster restarts.`,
                            )
                          ) {
                            alert(
                              "Initiating secure transaction point restoration... Success. Platform Node clusters booted successfully.",
                            );
                          }
                        }}
                        className="px-2.5 py-1 border border-indigo-200 hover:bg-indigo-50 text-indigo-705 font-bold rounded cursor-pointer"
                      >
                        Restore State
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
