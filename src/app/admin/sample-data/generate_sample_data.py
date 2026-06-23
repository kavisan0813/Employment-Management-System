"""
Generates deterministic JSON sample data for every module in MODULE_SPEC.md.
Shares a common pool of organization names, user names, and IDs across files
so cross-references (organizationId, organization name) stay consistent,
the way real seed data for a multi-tenant platform would.

Run: python3 generate_sample_data.py
Output: one JSON file per module in this directory.
"""

import json
import random
from datetime import datetime, timedelta

random.seed(42)  # deterministic across runs

OUT_DIR = "."

# ---------------------------------------------------------------------------
# Shared reference pools
# ---------------------------------------------------------------------------

ORG_NAMES = [
    "Acme Corp", "Bright Labs", "Nexus Solutions", "Orbit Systems", "Vertex Dynamics",
    "Skyline Ventures", "Northwind Traders", "Quantum Forge", "Cedar & Co", "Meridian Group",
    "Pulse Robotics", "Harborlight Inc", "Granite Peak Partners", "Lumen Works", "Tidewater Logistics",
    "Frostbyte Software", "Amberfield Group", "Solace Health", "BlueGrove Analytics", "IronGate Security",
    "Wavelength Media", "Crestmark Holdings", "Driftwood Studios", "Echo Valley Tech", "Foxglove Retail",
    "Cobalt Manufacturing", "Sterling Bridge", "Pinecrest Education", "Marble Run Foods", "Aspen Ridge Capital",
    "Velvet Sky Travel", "Hearthstone Realty", "Cinderwood Energy", "Brightline Insurance", "Coral Reef Hospitality",
    "Stonebridge Legal", "Maplewood Construction", "Riverstone Pharma", "Goldfinch Marketing", "Anchor Point Logistics",
    "Lighthouse Consulting", "Timberline Outdoor", "Sapphire Cloud", "Redwood Analytics", "Ember Creative",
    "Northstar Biotech", "Cascade Freight", "Ironwood Manufacturing", "Silverline Telecom", "Driftway Hospitality",
]

PLANS = ["Starter", "Growth", "Enterprise"]
REGIONS = ["US-East", "US-West", "EU-West", "EU-Central", "APAC-South", "APAC-East"]
INDUSTRIES = ["Technology", "Healthcare", "Retail", "Manufacturing", "Finance", "Education", "Logistics", "Media", "Hospitality", "Energy"]

FIRST_NAMES = [
    "Sarah", "James", "Priya", "Tom", "Elena", "Marcus", "Aisha", "David", "Lina", "Carlos",
    "Naomi", "Felix", "Grace", "Omar", "Ines", "Lucas", "Mei", "Noah", "Zara", "Ethan",
    "Sofia", "Liam", "Tariq", "Hana", "Victor", "Ana", "Yusuf", "Clara", "Diego", "Maya",
]
LAST_NAMES = [
    "Chen", "Okafor", "Nair", "Walsh", "Petrova", "Lindqvist", "Khan", "Schmidt", "Tran", "Rivera",
    "Adeyemi", "Bauer", "Kowalski", "Haddad", "Moreau", "Sato", "Lindgren", "Bishop", "Farrell", "Castillo",
]

STATUSES = ["Active", "Inactive", "Pending", "Trial", "Suspended"]

def rand_name():
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

def rand_email(name, domain):
    return f"{name.lower().replace(' ', '.')}@{domain}"

def domain_for(org_name):
    slug = org_name.lower().replace(" & ", "").replace(" ", "").replace(".", "")
    return f"{slug}.com"

def rand_date(days_back_max=365, days_back_min=0):
    lo, hi = sorted([days_back_min, days_back_max])
    offset = random.randint(lo, hi)
    d = datetime(2024, 6, 19) - timedelta(days=offset)
    return d.strftime("%b %d, %Y")

def rand_datetime(days_back_max=30):
    d = datetime(2024, 6, 19, 14, 30) - timedelta(
        days=random.randint(0, days_back_max), minutes=random.randint(0, 1440)
    )
    return d.strftime("%b %d, %H:%M")

def save(filename, data):
    path = f"{OUT_DIR}/{filename}"
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"wrote {path} ({len(data)} records)")

# ---------------------------------------------------------------------------
# 1. Organizations (also used as the base reference list for other files)
# ---------------------------------------------------------------------------

organizations = []
for i, name in enumerate(ORG_NAMES):
    org_id = f"org_{i+1}"
    plan = random.choice(PLANS)
    status = random.choices(STATUSES, weights=[55, 8, 12, 18, 7])[0]
    seat_limit = {"Starter": 50, "Growth": 250, "Enterprise": 2000}[plan]
    user_count = random.randint(5, seat_limit)
    mrr = {"Starter": 0, "Growth": random.choice([800, 1200, 1500]), "Enterprise": random.choice([3500, 4800, 6200])}[plan]
    joined = rand_date(700, 30)
    org = {
        "id": org_id,
        "name": name,
        "domain": domain_for(name),
        "status": status,
        "plan": plan,
        "userCount": user_count,
        "seatLimit": seat_limit,
        "mrr": mrr,
        "industry": random.choice(INDUSTRIES),
        "region": random.choice(REGIONS),
        "ownerEmail": rand_email(rand_name(), domain_for(name)),
        "joinedAt": joined,
        "lastActiveAt": rand_datetime(14),
        "trialEndsAt": rand_date(30, -14) if status == "Trial" else None,
    }
    organizations.append(org)

save("organizations.json", organizations)

# ---------------------------------------------------------------------------
# 2. Global Users (platform users across orgs)
# ---------------------------------------------------------------------------

ROLES = ["Org Admin", "HR Manager", "Manager", "Employee"]
users = []
for i in range(60):
    org = random.choice(organizations)
    name = rand_name()
    email = rand_email(name, org["domain"])
    users.append({
        "id": f"usr_{i+1}",
        "name": name,
        "email": email,
        "status": random.choices(STATUSES[:4], weights=[70, 10, 12, 8])[0],
        "role": random.choices(ROLES, weights=[10, 15, 25, 50])[0],
        "organization": org["name"],
        "organizationId": org["id"],
        "lastLoginAt": rand_datetime(21),
        "mfaEnabled": random.random() > 0.35,
        "joinedAt": rand_date(600, 10),
    })

save("global-users.json", users)

# ---------------------------------------------------------------------------
# 3. Subscriptions
# ---------------------------------------------------------------------------

subscriptions = []
for i, org in enumerate(organizations):
    plan = org["plan"]
    amount = org["mrr"]
    status = org["status"] if org["status"] in ["Active", "Trial", "Pending", "Suspended"] else "Inactive"
    failed = random.choice([0, 0, 0, 1, 2]) if status != "Active" else 0
    subscriptions.append({
        "id": f"sub_{i+1}",
        "organization": org["name"],
        "organizationId": org["id"],
        "plan": plan,
        "status": status,
        "billingCycle": random.choice(["Monthly", "Annual"]),
        "amount": amount,
        "currency": "USD",
        "startDate": org["joinedAt"],
        "renewalDate": rand_date(-60, -1) if status == "Active" else None,
        "paymentMethodLast4": f"{random.randint(1000,9999)}"[-4:] if amount > 0 else None,
        "failedPaymentCount": failed,
    })

save("subscriptions.json", subscriptions)

# ---------------------------------------------------------------------------
# 4. Feature Flags
# ---------------------------------------------------------------------------

FEATURE_NAMES = [
    ("ai_scheduling", "AI Scheduling Assistant"), ("bulk_import_v2", "Bulk Import v2"),
    ("dark_mode", "Dark Mode"), ("payroll_sync", "Payroll Sync"), ("mobile_clock_in", "Mobile Clock-In"),
    ("custom_reports", "Custom Report Builder"), ("slack_notify", "Slack Notifications"),
    ("biometric_attendance", "Biometric Attendance"), ("multi_currency", "Multi-Currency Payroll"),
    ("org_chart_v2", "Org Chart v2"), ("self_service_portal", "Self-Service Portal"),
    ("shift_swap", "Shift Swap Requests"), ("e_signature", "E-Signature Documents"),
    ("performance_reviews_v2", "Performance Reviews v2"), ("api_webhooks_v2", "Webhooks v2"),
    ("expense_tracking", "Expense Tracking"), ("geo_fencing", "Geo-Fencing"),
    ("candidate_portal", "Candidate Portal"), ("benefits_marketplace", "Benefits Marketplace"),
    ("ai_resume_parse", "AI Resume Parsing"), ("custom_branding", "Custom Branding"),
    ("sso_saml", "SSO via SAML"), ("audit_export", "Audit Log Export"), ("two_factor_sms", "2FA via SMS"),
    ("leave_calendar_sync", "Leave Calendar Sync"), ("payslip_portal", "Payslip Portal"),
    ("survey_builder", "Engagement Survey Builder"), ("org_benchmark", "Org Benchmarking"),
    ("ai_job_description", "AI Job Description Writer"), ("time_tracking_v2", "Time Tracking v2"),
    ("custom_fields", "Custom Employee Fields"), ("approval_chains", "Multi-Level Approval Chains"),
    ("data_export_api", "Bulk Data Export API"), ("holiday_calendar", "Regional Holiday Calendar"),
    ("asset_tracking", "Asset Tracking"), ("training_lms", "Training LMS Integration"),
    ("referral_program", "Employee Referral Program"), ("exit_interview", "Exit Interview Workflow"),
    ("org_announcements_v2", "Announcements v2"), ("compliance_alerts", "Compliance Alerts"),
    ("payroll_simulation", "Payroll Simulation Mode"), ("custom_roles_v2", "Custom Roles v2"),
    ("calendar_sync_google", "Google Calendar Sync"), ("calendar_sync_outlook", "Outlook Calendar Sync"),
    ("ai_attrition_alerts", "AI Attrition Alerts"), ("document_vault", "Secure Document Vault"),
    ("benefits_enrollment", "Open Enrollment Workflow"), ("shift_planner_ai", "AI Shift Planner"),
    ("recognition_wall", "Peer Recognition Wall"), ("anonymous_feedback", "Anonymous Feedback Channel"),
    ("contractor_management", "Contractor Management"), ("offboarding_checklist", "Offboarding Checklist v2"),
]
categories = ["Core", "Beta", "Experimental", "Deprecated"]
feature_flags = []
for i, (key, name) in enumerate(FEATURE_NAMES):
    cat = random.choices(categories, weights=[45, 30, 18, 7])[0]
    status = "Inactive" if cat == "Deprecated" else "Active"
    sample_orgs = random.sample(organizations, k=random.randint(0, 5))
    feature_flags.append({
        "id": f"flag_{i+1}",
        "key": key,
        "name": name,
        "description": f"Controls availability of {name.lower()} across tenant organizations.",
        "category": cat,
        "status": status,
        "defaultState": random.random() > 0.4,
        "rolloutPct": random.choice([0, 10, 25, 50, 75, 100]),
        "enabledPlans": random.sample(PLANS, k=random.randint(1, 3)),
        "enabledOrgIds": [o["id"] for o in sample_orgs],
        "createdAt": rand_date(500, 60),
        "updatedAt": rand_date(50, 0),
    })

save("feature-flags.json", feature_flags)

# ---------------------------------------------------------------------------
# 5. Role Templates
# ---------------------------------------------------------------------------

MODULES_FOR_PERMS = ["Employees", "Attendance", "Leave", "Payroll", "Recruitment", "Performance", "Reports", "Settings"]
ACTIONS_POOL = ["view", "create", "edit", "delete", "approve"]
ROLE_TEMPLATE_NAMES = [
    "Super Admin", "Org Admin", "HR Manager", "Payroll Admin", "Recruiter", "Hiring Manager",
    "Team Lead", "Finance Reviewer", "Read Only Auditor", "IT Admin", "Department Head",
    "Onboarding Specialist", "Compliance Officer", "Benefits Admin", "Support Agent (Platform)",
    "Billing Admin (Platform)", "Regional HR Director", "Site Manager", "Contractor Manager",
    "Training Coordinator", "Performance Reviewer", "Exit Process Owner", "Survey Admin",
    "Workforce Planner", "Custom: Acme HR Lite", "Custom: Nexus Finance View", "Custom: Orbit Read Only",
]
role_templates = []
for i, name in enumerate(ROLE_TEMPLATE_NAMES):
    is_system = i < 14
    scope = "Platform" if "Platform" in name or name in ["Super Admin"] else "Organization"
    perms = []
    for mod in MODULES_FOR_PERMS:
        if random.random() > 0.3:
            perms.append({"module": mod, "actions": random.sample(ACTIONS_POOL, k=random.randint(1, 4))})
    role_templates.append({
        "id": f"role_{i+1}",
        "name": name,
        "description": f"Permission template for {name.lower()} responsibilities.",
        "scope": scope,
        "status": "Active" if random.random() > 0.1 else "Inactive",
        "permissions": perms,
        "assignedOrgCount": 0 if not is_system and random.random() > 0.7 else random.randint(0, 40),
        "isSystemDefault": is_system,
        "updatedAt": rand_date(300, 0),
    })

save("role-templates.json", role_templates)

# ---------------------------------------------------------------------------
# 6. Integrations
# ---------------------------------------------------------------------------

INTEGRATIONS_CATALOG = [
    ("Okta", "SSO", "SAML"), ("Azure AD", "SSO", "SAML"), ("Google Workspace", "SSO", "OAuth2"),
    ("Slack", "Communication", "OAuth2"), ("Microsoft Teams", "Communication", "OAuth2"),
    ("ADP", "Payroll", "API Key"), ("Gusto", "Payroll", "OAuth2"), ("QuickBooks", "Payroll", "OAuth2"),
    ("Google Calendar", "Calendar", "OAuth2"), ("Outlook Calendar", "Calendar", "OAuth2"),
    ("Dropbox", "Storage", "OAuth2"), ("Google Drive", "Storage", "OAuth2"), ("Box", "Storage", "OAuth2"),
    ("Looker", "Analytics", "API Key"), ("Tableau", "Analytics", "API Key"), ("Mixpanel", "Analytics", "API Key"),
    ("Zoom", "Communication", "OAuth2"), ("DocuSign", "Storage", "OAuth2"), ("Greenhouse", "Payroll", "API Key"),
    ("Workday", "Payroll", "SAML"), ("BambooHR Sync", "Storage", "API Key"), ("Zapier", "Communication", "API Key"),
    ("Twilio", "Communication", "API Key"), ("SendGrid", "Communication", "API Key"),
    ("Salesforce", "Analytics", "OAuth2"), ("HubSpot", "Analytics", "OAuth2"), ("PagerDuty", "Communication", "API Key"),
    ("OneLogin", "SSO", "SAML"), ("Auth0", "SSO", "OAuth2"), ("Stripe", "Payroll", "API Key"),
    ("Xero", "Payroll", "OAuth2"), ("Trello", "Communication", "OAuth2"), ("Asana", "Communication", "OAuth2"),
    ("Notion", "Storage", "OAuth2"), ("Calendly", "Calendar", "OAuth2"), ("Jira", "Communication", "OAuth2"),
    ("GitHub", "Communication", "OAuth2"), ("LinkedIn Recruiter", "Payroll", "OAuth2"), ("Indeed", "Payroll", "API Key"),
    ("Lattice", "Analytics", "API Key"), ("Culture Amp", "Analytics", "API Key"), ("15Five", "Analytics", "API Key"),
    ("Deel", "Payroll", "API Key"), ("Remote", "Payroll", "API Key"), ("Justworks", "Payroll", "API Key"),
    ("Rippling", "Payroll", "OAuth2"), ("Namely", "Payroll", "API Key"), ("Paychex", "Payroll", "API Key"),
    ("Microsoft OneDrive", "Storage", "OAuth2"), ("Egnyte", "Storage", "API Key"), ("Smartsheet", "Analytics", "OAuth2"),
]
health_choices = ["Healthy", "Healthy", "Healthy", "Degraded", "Down"]
integrations = []
for i, (name, category, auth) in enumerate(INTEGRATIONS_CATALOG):
    status = random.choices(["Active", "Inactive", "Pending"], weights=[65, 20, 15])[0]
    integrations.append({
        "id": f"int_{i+1}",
        "name": name,
        "provider": name,
        "category": category,
        "status": status,
        "connectedOrgCount": random.randint(0, 38) if status == "Active" else 0,
        "authType": auth,
        "lastSyncAt": rand_datetime(7) if status == "Active" else None,
        "healthStatus": random.choice(health_choices) if status == "Active" else "Down",
    })

save("integrations.json", integrations)

# ---------------------------------------------------------------------------
# 7. API Keys + Webhooks
# ---------------------------------------------------------------------------

SCOPE_POOL = ["read:employees", "write:employees", "read:attendance", "write:attendance",
              "read:payroll", "write:payroll", "read:leave", "write:leave", "read:reports"]
api_keys = []
for i in range(55):
    org = random.choice(organizations)
    status = random.choices(["Active", "Inactive", "Suspended"], weights=[75, 18, 7])[0]
    api_keys.append({
        "id": f"key_{i+1}",
        "label": f"{random.choice(['Production', 'Staging', 'Zapier integration', 'Internal script', 'Mobile app'])} key",
        "organization": org["name"],
        "organizationId": org["id"],
        "keyPrefix": f"sk_live_{random.randint(10000000, 99999999)}",
        "scopes": random.sample(SCOPE_POOL, k=random.randint(1, 4)),
        "status": status,
        "rateLimitPerMin": {"Starter": 60, "Growth": 300, "Enterprise": 1000}[org["plan"]],
        "requestsToday": random.randint(0, 8000),
        "lastUsedAt": rand_datetime(10) if status == "Active" else None,
        "createdAt": rand_date(400, 5),
        "expiresAt": rand_date(-365, -30) if random.random() > 0.4 else None,
    })

save("api-keys.json", api_keys)

EVENT_POOL = ["org.created", "org.plan_upgraded", "subscription.cancelled", "subscription.payment_failed",
              "user.invited", "ticket.created", "ticket.escalated", "announcement.published"]
webhooks = []
for i in range(50):
    org = random.choice(organizations)
    last_status = random.choices(["Success", "Failed", "Pending"], weights=[78, 14, 8])[0]
    webhooks.append({
        "id": f"wh_{i+1}",
        "organization": org["name"],
        "url": f"https://{org['domain']}/webhooks/ems",
        "events": random.sample(EVENT_POOL, k=random.randint(1, 4)),
        "status": random.choices(["Active", "Inactive"], weights=[80, 20])[0],
        "lastDeliveryStatus": last_status,
        "lastDeliveredAt": rand_datetime(5) if last_status != "Pending" else None,
    })

save("webhooks.json", webhooks)

# ---------------------------------------------------------------------------
# 8. Reports — metrics + trend series (smaller, fixed-size, not "records" per se)
# ---------------------------------------------------------------------------

report_metrics = [
    {"label": "Total Organizations", "value": str(len(organizations)), "pct": 100},
    {"label": "Active Users (30d)", "value": f"{random.randint(38000, 49000):,}", "pct": 88},
    {"label": "API Calls (24h)", "value": f"{round(random.uniform(6.0, 9.5), 1)}M", "pct": 67},
    {"label": "Storage Used", "value": f"{round(random.uniform(1.5, 3.2), 1)} TB", "pct": 42},
]

def trend_series(title, base, amplitude, days=90):
    points = []
    for d in range(days):
        date = (datetime(2024, 6, 19) - timedelta(days=days - d)).strftime("%Y-%m-%d")
        import math
        y = round(base + amplitude * math.sin(d / 7) + (amplitude / 3) * math.sin(d / 2.5))
        points.append({"x": date, "y": max(0, y)})
    return {"title": title, "points": points}

reports = {
    "metrics": report_metrics,
    "trends": [
        trend_series("User Growth (90 days)", 4200, 600),
        trend_series("Revenue by Plan", 88000, 9000),
        trend_series("Feature Adoption", 61, 14),
        trend_series("API Usage", 7200000, 900000),
        trend_series("Support Volume", 34, 12),
        trend_series("Tenant Health Trend", 72, 8),
    ],
}

save("reports.json", [reports])  # wrapped in list for consistent "wrote N records" logging

# ---------------------------------------------------------------------------
# 9. Audit Logs
# ---------------------------------------------------------------------------

EVENT_CATALOG = [
    ("user.login", "Auth"), ("user.logout", "Auth"), ("user.password_reset", "Auth"),
    ("user.mfa_enabled", "Security"), ("user.mfa_disabled", "Security"),
    ("org.created", "Admin Action"), ("org.plan_upgraded", "Billing"), ("org.plan_downgraded", "Billing"),
    ("org.suspended", "Admin Action"), ("org.reactivated", "Admin Action"),
    ("subscription.payment_failed", "Billing"), ("subscription.cancelled", "Billing"),
    ("api_key.created", "Security"), ("api_key.revoked", "Security"),
    ("feature_flag.toggled", "Admin Action"), ("role_template.updated", "Admin Action"),
    ("data.exported", "Data"), ("data.deletion_requested", "Data"),
    ("impersonation.started", "Security"), ("impersonation.ended", "Security"),
    ("backup.created", "Data"), ("backup.restored", "Data"),
    ("security_policy.updated", "Security"), ("announcement.published", "Admin Action"),
]
audit_logs = []
for i in range(120):
    event, cat = random.choice(EVENT_CATALOG)
    org = random.choice(organizations) if random.random() > 0.15 else None
    actor_type = random.choices(["platform_admin", "org_admin", "user", "system"], weights=[20, 30, 35, 15])[0]
    actor = "System" if actor_type == "system" else rand_email(rand_name(), org["domain"] if org else "ems.io")
    audit_logs.append({
        "id": f"#{88300 + i}",
        "event": event,
        "eventCategory": cat,
        "actor": actor,
        "actorType": actor_type,
        "organization": org["name"] if org else None,
        "ipAddress": f"{random.randint(10,223)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}",
        "userAgent": random.choice(["Chrome 125 / macOS", "Safari 17 / iOS", "Firefox 126 / Windows", "Edge 125 / Windows", "API Client"]),
        "result": random.choices(["Active", "Pending", "Inactive"], weights=[80, 8, 12])[0],
        "metadata": {"requestId": f"req_{random.randint(100000,999999)}"},
        "timestamp": rand_datetime(30),
    })
audit_logs.sort(key=lambda x: x["id"], reverse=True)

save("audit-logs.json", audit_logs)

# ---------------------------------------------------------------------------
# 10. Support Tickets
# ---------------------------------------------------------------------------

TICKET_SUBJECTS = [
    "Cannot export payroll report", "SSO integration not working", "Bulk import fails on large files",
    "Shift schedule not saving", "Leave balance showing incorrect value", "Mobile app crashes on clock-in",
    "Invoice PDF missing line items", "Cannot reset employee password", "Webhook not firing for new hires",
    "Custom field not appearing in report", "Slack notifications duplicated", "Org chart not rendering for new dept",
    "API rate limit hit unexpectedly", "Announcement banner not dismissible", "Trial extension request",
    "Billing address update needed", "Two-factor auth locked me out", "Performance review template broken",
    "Cannot add custom holiday", "Survey responses not exporting",
]
support_tickets = []
for i in range(58):
    org = random.choice(organizations)
    priority = random.choices(["Low", "Medium", "High", "Critical"], weights=[30, 35, 25, 10])[0]
    status = random.choices(["Active", "Pending", "Inactive"], weights=[30, 20, 50])[0]
    created = rand_datetime(45)
    support_tickets.append({
        "id": f"#T-{2000 + i}",
        "subject": random.choice(TICKET_SUBJECTS),
        "description": "Customer reported the issue via the in-app support widget. Steps to reproduce attached in thread.",
        "organization": org["name"],
        "organizationId": org["id"],
        "submittedBy": rand_email(rand_name(), org["domain"]),
        "status": status,
        "priority": priority,
        "assignedTo": rand_name() if status != "Pending" or random.random() > 0.5 else None,
        "createdAt": created,
        "updatedAt": rand_datetime(10),
        "firstResponseAt": rand_datetime(40) if status != "Pending" else None,
        "resolvedAt": rand_datetime(5) if status == "Inactive" else None,
        "tags": random.sample(["billing", "bug", "integration", "feature-request", "urgent", "data"], k=random.randint(1, 3)),
    })

save("support-tickets.json", support_tickets)

# ---------------------------------------------------------------------------
# 11. Announcements
# ---------------------------------------------------------------------------

ANNOUNCEMENT_TITLES = [
    "Platform Maintenance Window", "New Feature: AI Scheduling", "Security Patch Deployed",
    "Pricing Update Notice", "Upcoming API Deprecation", "Holiday Support Hours",
    "New Integration: Slack v2", "Data Center Migration Notice", "Year-End Payroll Reminder",
    "GDPR Policy Update", "Mobile App v3 Release", "Scheduled Downtime This Weekend",
    "Welcome to the New Dashboard", "Enterprise Plan Now Includes SSO", "Beta Program: AI Attrition Alerts",
]
announcements = []
for i in range(52):
    state = random.choices(["Draft", "Scheduled", "Published"], weights=[20, 15, 65])[0]
    status = {"Draft": "Inactive", "Scheduled": "Pending", "Published": "Active"}[state]
    audience = random.choice(["All tenants", "Specific plan", "Specific organizations"])
    announcements.append({
        "id": f"ann_{i+1}",
        "title": random.choice(ANNOUNCEMENT_TITLES),
        "body": "Full announcement body text describing the change, impact, and any action required from tenant admins.",
        "audience": audience,
        "audiencePlan": random.choice(PLANS) if audience == "Specific plan" else None,
        "audienceOrgIds": random.sample([o["id"] for o in organizations], k=random.randint(1, 5)) if audience == "Specific organizations" else None,
        "status": status,
        "state": state,
        "publishAt": rand_date(-10, -1) if state == "Scheduled" else (rand_date(60, 0) if state == "Published" else None),
        "expiresAt": rand_date(-30, -10) if state == "Published" else None,
        "displayStyle": random.choice(["Banner", "Modal", "Notification Center Only"]),
        "createdBy": rand_name(),
        "viewCount": random.randint(0, 5000) if state == "Published" else 0,
        "date": rand_date(90, 0),
    })

save("announcements.json", announcements)

# ---------------------------------------------------------------------------
# 12. Email Templates
# ---------------------------------------------------------------------------

EMAIL_TEMPLATE_DEFS = [
    ("user_invite", "User Invitation", "Onboarding"), ("password_reset", "Password Reset", "Security"),
    ("trial_ending_3days", "Trial Ending Soon", "Billing"), ("invoice_receipt", "Invoice Receipt", "Billing"),
    ("payment_failed", "Payment Failed Notice", "Billing"), ("welcome_org", "Welcome New Organization", "Onboarding"),
    ("ticket_created", "Support Ticket Created", "Engagement"), ("ticket_resolved", "Support Ticket Resolved", "Engagement"),
    ("mfa_enrollment", "MFA Enrollment Reminder", "Security"), ("weekly_digest", "Weekly Activity Digest", "Engagement"),
    ("account_suspended", "Account Suspended Notice", "System"), ("account_reactivated", "Account Reactivated", "System"),
    ("plan_upgraded", "Plan Upgrade Confirmation", "Billing"), ("plan_downgraded", "Plan Downgrade Confirmation", "Billing"),
    ("data_export_ready", "Data Export Ready", "System"), ("backup_completed", "Backup Completed", "System"),
    ("new_device_login", "New Device Login Alert", "Security"), ("api_key_created", "API Key Created", "Security"),
    ("announcement_email", "Announcement Notification", "Engagement"), ("survey_invite", "Engagement Survey Invite", "Engagement"),
]
email_templates = []
for i, (key, name, cat) in enumerate(EMAIL_TEMPLATE_DEFS):
    email_templates.append({
        "id": f"tmpl_{i+1}",
        "key": key,
        "name": name,
        "category": cat,
        "subject": f"{name} — {{{{org_name}}}}",
        "bodyHtml": f"<p>Hi {{{{user_name}}}}, this is the {name.lower()} email.</p>",
        "status": "Active" if random.random() > 0.05 else "Inactive",
        "variables": ["{{user_name}}", "{{org_name}}"] + random.sample(
            ["{{invite_link}}", "{{invoice_amount}}", "{{reset_link}}", "{{ticket_id}}", "{{plan_name}}"], k=2
        ),
        "lastEditedBy": rand_name(),
        "updatedAt": rand_date(180, 0),
        "sentLast30Days": random.randint(0, 12000),
    })

save("email-templates.json", email_templates)

# ---------------------------------------------------------------------------
# 13. Notification Rules
# ---------------------------------------------------------------------------

NOTIFICATION_RULE_DEFS = [
    ("Payment Failed Alert", "subscription.payment_failed", "Billing"),
    ("Ticket Escalated", "ticket.escalated", "Support"),
    ("New Org Signed Up", "org.created", "System"),
    ("Suspicious Login Detected", "security.failed_login_spike", "Security"),
    ("API Rate Limit Exceeded", "api.rate_limit_exceeded", "System"),
    ("Trial Ending Soon", "subscription.trial_ending", "Billing"),
    ("MFA Disabled", "user.mfa_disabled", "Security"),
    ("Backup Failed", "backup.failed", "System"),
    ("New Admin Invited", "admin.invited", "System"),
    ("Webhook Delivery Failed", "webhook.delivery_failed", "System"),
    ("Org Plan Downgraded", "org.plan_downgraded", "Billing"),
    ("Data Deletion Request Submitted", "data.deletion_requested", "Security"),
    ("Critical Ticket Created", "ticket.created_critical", "Support"),
    ("New Feature Flag Enabled", "feature_flag.toggled", "System"),
    ("Impersonation Session Started", "impersonation.started", "Security"),
    ("Storage Quota 90% Reached", "org.quota_warning", "System"),
    ("Org Reactivated", "org.reactivated", "System"),
    ("Announcement Published", "announcement.published", "System"),
]
channels_pool = ["In-App", "Email", "SMS", "Slack"]
notification_rules = []
for i, (name, trigger, cat) in enumerate(NOTIFICATION_RULE_DEFS):
    notification_rules.append({
        "id": f"notif_{i+1}",
        "name": name,
        "triggerEvent": trigger,
        "category": cat,
        "channels": random.sample(channels_pool, k=random.randint(1, 3)),
        "recipientType": random.choice(["Platform Admins", "Org Admins", "Affected User"]),
        "status": "Active" if random.random() > 0.1 else "Inactive",
        "throttle": random.choice(["Immediate", "Digest - Hourly", "Digest - Daily"]),
        "updatedAt": rand_date(200, 0),
    })

save("notification-rules.json", notification_rules)

# ---------------------------------------------------------------------------
# 14. Backup Snapshots
# ---------------------------------------------------------------------------

backups = []
for i in range(55):
    status = random.choices(["Active", "Pending", "Inactive"], weights=[88, 4, 8])[0]
    created = rand_datetime(60)
    backups.append({
        "id": f"bkp_{i+1}",
        "type": random.choices(["Automatic", "Manual"], weights=[85, 15])[0],
        "status": status,
        "sizeGb": round(random.uniform(12.0, 95.0), 1),
        "createdAt": created,
        "retentionExpiresAt": rand_date(-30, -1),
        "triggeredBy": "System (scheduled)" if random.random() > 0.15 else rand_name(),
    })

save("backup-snapshots.json", backups)

# ---------------------------------------------------------------------------
# 15. Branding overrides
# ---------------------------------------------------------------------------

branding_overrides = []
enterprise_orgs = [o for o in organizations if o["plan"] == "Enterprise"]
for i, org in enumerate(enterprise_orgs):
    branding_overrides.append({
        "id": f"brand_{i+1}",
        "scope": "Organization Override",
        "organizationId": org["id"],
        "organization": org["name"],
        "logoUrl": f"https://assets.ems.io/logos/{org['id']}.png",
        "faviconUrl": f"https://assets.ems.io/favicons/{org['id']}.ico",
        "primaryColor": random.choice(["#534AB7", "#1D9E75", "#378ADD", "#BA7517", "#D85A30"]),
        "accentColor": random.choice(["#EEEDFE", "#E1F5EE", "#E6F1FB", "#FAEEDA", "#FAECE7"]),
        "customDomain": f"hr.{org['domain']}" if random.random() > 0.4 else None,
        "domainVerified": random.random() > 0.3,
        "emailFromName": f"{org['name']} HR Team",
        "updatedAt": rand_date(200, 0),
    })

save("branding-overrides.json", branding_overrides)

# ---------------------------------------------------------------------------
# 16. Security Events
# ---------------------------------------------------------------------------

security_events = []
for i in range(54):
    org = random.choice(organizations) if random.random() > 0.2 else None
    security_events.append({
        "id": f"sec_{i+1}",
        "type": random.choice(["Failed Login Spike", "New Device Login", "Impossible Travel", "MFA Disabled"]),
        "organization": org["name"] if org else None,
        "actor": rand_email(rand_name(), org["domain"] if org else "ems.io"),
        "severity": random.choices(["Low", "Medium", "High", "Critical"], weights=[35, 35, 22, 8])[0],
        "status": random.choices(["Active", "Pending", "Inactive"], weights=[15, 20, 65])[0],
        "detectedAt": rand_datetime(30),
    })

save("security-events.json", security_events)

# ---------------------------------------------------------------------------
# 17. Admin Team Members (Settings)
# ---------------------------------------------------------------------------

ADMIN_ROLES = ["Super Admin", "Support Lead", "Billing Admin", "Read Only"]
admin_team = []
for i in range(15):
    name = rand_name()
    admin_team.append({
        "id": f"adm_{i+1}",
        "name": name,
        "email": rand_email(name, "ems.io"),
        "role": random.choices(ADMIN_ROLES, weights=[15, 25, 20, 40])[0],
        "status": random.choices(["Active", "Inactive", "Pending"], weights=[80, 5, 15])[0],
        "lastLoginAt": rand_datetime(20),
        "invitedAt": rand_date(400, 5),
    })

save("admin-team.json", admin_team)

print("\nAll sample data files generated.")
