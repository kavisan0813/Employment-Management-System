import React from "react";
import { ThemeProvider } from "../features/context/ThemeContext";
import { AppShell } from "../components/layout/app-shell";
import { ErrorBoundary } from "../components/common/error-boundary";

export function AdminLayout() {
  return (
    <ThemeProvider>
      <div className="admin-theme min-h-screen w-full bg-background text-foreground">
        <ErrorBoundary>
          <AppShell />
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
}

export default AdminLayout;
