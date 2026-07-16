import { ROLE_TEMPLATES } from "../shared/permission-engine/roles";

const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  if (url.includes("/api/roles/assignable")) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // The permission engine is the role catalogue.  Keeping this mapping
    // data-driven means newly configured roles and permissions require no
    // employee-form changes.
    const roles = Object.values(ROLE_TEMPLATES)
      .filter((role) => role.isSystemRole)
      .sort((a, b) => a.hierarchyLevel - b.hierarchyLevel)
      .map((role) => ({
        id: role.id,
        value: role.name,
        label: role.name,
        permissions: [...role.permissions],
      }));

    return new Response(JSON.stringify(roles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (url.includes("/api/users") && init?.method === "POST") {
    // Simulate server processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const body = JSON.parse(init.body as string);
    const roleAssignments = body.roleAssignments || [];

    const configuredRoleNames = new Set(
      Object.values(ROLE_TEMPLATES).map((role) => role.name),
    );
    const hasUnauthorizedRole = roleAssignments.some(
      (a: { role: string }) => !configuredRoleNames.has(a.role),
    );

    if (hasUnauthorizedRole) {
      return new Response(
        JSON.stringify({
          message:
            "You're no longer permitted to assign one of the selected roles. Refresh and try again.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  return originalFetch(input, init);
};
