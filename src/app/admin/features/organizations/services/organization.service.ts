import { db, pushAuditLog } from "../../../mockData";
import { Organization, Subscription, PlatformUser } from "../../../types";
import { PLAN_PRICING } from "../types/organization.types";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export const OrganizationService = {
  getOrganizations(): Organization[] {
    return db.organizations.get();
  },

  getUsers(): PlatformUser[] {
    return db.users.get();
  },

  getSubscriptions(): Subscription[] {
    return db.subscriptions.get();
  },

  getAuditLogs(): any[] {
    return db.auditLogs.get();
  },

  createOrganization(params: Partial<Organization> & { ownerName?: string; password?: string }): Organization {
    const plan = params.plan || "Starter";
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: params.name || "Unknown Org",
      domain: params.domain || "",
      code: params.code,
      status: "Active",
      plan: plan,
      userCount: 1,
      seatLimit: Number(params.seatLimit || 50),
      mrr: PLAN_PRICING[plan] || 0,
      industry: params.industry || "Technology",
      region: params.region || "North America",
      ownerEmail: params.ownerEmail || "",
      phone: params.phone,
      website: params.website,
      registrationNumber: params.registrationNumber,
      gstNumber: params.gstNumber,
      address: params.address,
      country: params.country,
      state: params.state,
      city: params.city,
      pincode: params.pincode,
      storageUsedGB: 0,
      storageAllocatedGB: plan === "Enterprise" ? 500 : 50,
      enabledModules: params.enabledModules || [],
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    db.organizations.save([newOrg, ...db.organizations.get()]);

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      organization: newOrg.name,
      organizationId: newOrg.id,
      plan: newOrg.plan as any,
      status: "Active",
      billingCycle: "Monthly",
      amount: newOrg.mrr,
      currency: "USD",
      startDate: new Date().toISOString().slice(0, 10),
      renewalDate: null,
      paymentMethodLast4: null,
      failedPaymentCount: 0,
    };
    db.subscriptions.save([newSub, ...db.subscriptions.get()]);

    if (params.password) {
      const newUser: PlatformUser = {
        id: `user-${Date.now()}`,
        name: params.ownerName || "Owner Account",
        email: params.ownerEmail || "",
        status: "Active",
        role: "Org Admin",
        organization: params.name || "",
        organizationId: newOrg.id,
        lastLoginAt: new Date().toISOString(),
        mfaEnabled: false,
        joinedAt: new Date().toISOString(),
        password: params.password,
      };
      db.users.save([newUser, ...db.users.get()]);
    }

    pushAuditLog(
      "org.create",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      newOrg.name,
      "Active",
      { domain: newOrg.domain, owner: newOrg.ownerEmail, plan: newOrg.plan },
    );

    return newOrg;
  },

  updateOrganizationStatus(orgId: string, status: Organization["status"]) {
    const orgs = db.organizations.get();
    const updated = orgs.map((o) => (o.id === orgId ? { ...o, status } : o));
    db.organizations.save(updated);
    
    pushAuditLog(
      "org.status_change",
      "Security",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      updated.find((o) => o.id === orgId)?.name || "Unknown",
      "Active",
      { new_status: status },
    );
  },

  updateSubscriptionPlan(orgId: string, plan: Organization["plan"]) {
    const orgs = db.organizations.get();
    const updatedOrgs = orgs.map((o) => (o.id === orgId ? { ...o, plan, mrr: PLAN_PRICING[plan] || o.mrr } : o));
    db.organizations.save(updatedOrgs);

    const subs = db.subscriptions.get();
    const updatedSubs = subs.map((s) => (s.organizationId === orgId ? { ...s, plan: plan as any, amount: PLAN_PRICING[plan] || s.amount } : s));
    db.subscriptions.save(updatedSubs);

    pushAuditLog(
      "org.plan_upgrade",
      "Billing",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      updatedOrgs.find((o) => o.id === orgId)?.name || "Unknown",
      "Active",
      { new_plan: plan },
    );
  }
};
