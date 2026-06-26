import { Outlet } from "react-router";
import { Sidebar } from "../../components/layout/sidebar";
import NavBar from "./navBar";

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans tracking-tight antialiased">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <NavBar />

        <main className="flex-1 overflow-x-hidden">
          <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
