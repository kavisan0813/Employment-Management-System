const originalFetch = window.fetch;

window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  if (url.includes("/api/roles/assignable")) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Get the current logged-in user from session storage
    const savedUser = sessionStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const userRole = user?.role || "Employee";

    let roles: any[] = [];
    if (userRole === "Super Admin" || userRole === "Platform Admin") {
      roles = [
        { value: "Employee", label: "Employee", alwaysOn: true },
        { value: "HR Manager", label: "HR Manager" },
        { value: "Finance", label: "Finance Manager" },
        { value: "Manager", label: "Team Manager" },
        { value: "Super Admin", label: "Admin (Super Admin)" },
      ];
    } else if (userRole === "HR Manager") {
      roles = [
        { value: "Employee", label: "Employee", alwaysOn: true },
        { value: "Finance", label: "Finance Manager" },
        { value: "Manager", label: "Team Manager" },
      ];
    } else if (userRole === "Finance") {
      roles = [
        { value: "Employee", label: "Employee", alwaysOn: true },
        { value: "Manager", label: "Team Manager" },
      ];
    } else if (userRole === "Manager") {
      roles = [
        { value: "Employee", label: "Employee", alwaysOn: true },
      ];
    } else {
      // Regular employees or other roles have no roles they're allowed to assign
      roles = [];
    }

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

    // Get current user's role from session storage to authorize
    const savedUser = sessionStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const userRole = user?.role || "Employee";

    let allowedRoles: string[] = [];
    if (userRole === "Super Admin" || userRole === "Platform Admin") {
      allowedRoles = ["Employee", "HR Manager", "Finance", "Manager", "Super Admin"];
    } else if (userRole === "HR Manager") {
      allowedRoles = ["Employee", "Finance", "Manager"];
    } else if (userRole === "Finance") {
      allowedRoles = ["Employee", "Manager"];
    } else if (userRole === "Manager") {
      allowedRoles = ["Employee"];
    }

    const hasUnauthorizedRole = roleAssignments.some(
      (a: any) => !allowedRoles.includes(a.role),
    );

    if (hasUnauthorizedRole) {
      return new Response(
        JSON.stringify({
          message: "You're no longer permitted to assign one of the selected roles. Refresh and try again.",
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
