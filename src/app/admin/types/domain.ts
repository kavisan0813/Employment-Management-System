/**
 * Shared domain types for the EMS Platform Admin panel.
 * Keep these in sync with the API/DB layer once a backend is wired up.
 */

/**
 * @typedef {"Active" | "Inactive" | "Pending" | "Trial" | "Suspended"} EntityStatus
 */

/**
 * @typedef {"Starter" | "Growth" | "Enterprise"} PlanTier
 */

/**
 * @typedef {Object} Organization
 * @property {string} id
 * @property {string} name
 * @property {string} domain
 * @property {EntityStatus} status
 * @property {PlanTier} plan
 * @property {number} userCount
 * @property {number} mrr
 * @property {string} joinedAt
 */

/**
 * @typedef {Object} PlatformUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {EntityStatus} status
 * @property {string} role
 * @property {string} organization
 * @property {string} joinedAt
 */

/**
 * @typedef {Object} Subscription
 * @property {string} id
 * @property {string} organization
 * @property {PlanTier} plan
 * @property {EntityStatus} status
 * @property {string} amount
 * @property {string} startDate
 * @property {string | null} renewalDate
 */

/**
 * @typedef {"Low" | "Medium" | "High" | "Critical"} TicketPriority
 */

/**
 * @typedef {Object} SupportTicket
 * @property {string} id
 * @property {string} subject
 * @property {string} organization
 * @property {EntityStatus} status
 * @property {TicketPriority} priority
 * @property {string} createdAt
 */

/**
 * @typedef {"Draft" | "Scheduled" | "Published"} AnnouncementState
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id
 * @property {string} title
 * @property {string} audience
 * @property {EntityStatus} status
 * @property {AnnouncementState} state
 * @property {string} date
 */

/**
 * @typedef {Object} AuditLogEntry
 * @property {string} id
 * @property {string} event
 * @property {string} actor
 * @property {string} ipAddress
 * @property {EntityStatus} result
 * @property {string} timestamp
 */

/**
 * @typedef {Object} StatTrend
 * @property {string} label
 * @property {string} value
 * @property {string} trend
 * @property {boolean} trendUp
 */

/**
 * @typedef {Object} NavItem
 * @property {string} id
 * @property {string} label
 * @property {NavIconName} iconName
 * @property {string} path
 */

/**
 * @typedef {Object} NavGroup
 * @property {string} group
 * @property {NavItem[]} items
 */

/**
 * @typedef {"dashboard" | "organizations" | "users" | "subscriptions" | "features" | "roles" | "integrations" | "api" | "reports" | "auditLogs" | "support" | "announcements" | "email" | "notifications" | "backup" | "branding" | "security" | "ai" | "settings"} NavIconName
 */
