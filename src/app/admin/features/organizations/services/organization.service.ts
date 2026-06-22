/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, pushAuditLog } from "../../../mockData";
import { Organization, Subscription, PlatformUser, EntityStatus } from "../../../types";
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

  createOrganization(params: {
    name: string;
    domain: string;
    plan: "Starter" | "Growth" | "Enterprise";
    region: string;
    ownerEmail: string;
    seatLimit: number;
    industry: string;
    password?: string;
  }): Organization {
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: params.name,
      domain: params.domain,
      status: "Pending",
      plan: params.plan,
      userCount: 1,
      seatLimit: Number(params.seatLimit),
      mrr: PLAN_PRICING[params.plan],
      industry: params.industry,
      region: params.region,
      ownerEmail: params.ownerEmail,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    db.organizations.save([newOrg, ...db.organizations.get()]);

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      organization: newOrg.name,
      organizationId: newOrg.id,
      plan: newOrg.plan,
      status: "Pending",
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
        name: "Owner Account",
        email: params.ownerEmail,
        status: "Pending",
        role: "Org Admin",
        organization: params.name,
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

  updateOrganization(
    orgId: string,
    params: {
      name: string;
      domain: string;
      plan: "Starter" | "Growth" | "Enterprise";
      region: string;
      ownerEmail: string;
      seatLimit: number;
      industry: string;
    }
  ) {
    const updated = db.organizations.get().map((o) =>
      o.id === orgId
        ? {
            ...o,
            name: params.name,
            domain: params.domain,
            plan: params.plan,
            region: params.region,
            ownerEmail: params.ownerEmail,
            seatLimit: Number(params.seatLimit),
            industry: params.industry,
            mrr: PLAN_PRICING[params.plan],
          }
        : o
    );

    db.organizations.save(updated);
    pushAuditLog(
      "org.edit",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      params.name,
      "Active",
      { id: orgId, plan: params.plan, seats: String(params.seatLimit) }
    );
  },

  toggleSuspend(org: Organization) {
    const nextStatus = (org.status === "Suspended" ? "Active" : "Suspended") as EntityStatus;
    const updated = db.organizations.get().map((o) =>
      o.id === org.id ? { ...o, status: nextStatus } : o
    );

    db.organizations.save(updated);
    pushAuditLog(
      `org.${nextStatus.toLowerCase()}`,
      "Security",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      org.name,
      "Active",
      { previous_status: org.status, result: nextStatus }
    );
    return nextStatus;
  },

  deleteOrganization(orgId: string, orgName: string) {
    db.organizations.save(
      db.organizations.get().filter((o) => o.id !== orgId)
    );
    pushAuditLog(
      "org.delete",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { orgName: orgName, previous_id: orgId }
    );
  },

  bulkSuspend(orgIds: string[]) {
    const updated = db.organizations.get().map((o) =>
      orgIds.includes(o.id) ? { ...o, status: "Suspended" as const } : o
    );
    db.organizations.save(updated);
    pushAuditLog(
      "org.bulk_suspend",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { count: String(orgIds.length), orgIds: orgIds.join(", ") }
    );
  },
};
