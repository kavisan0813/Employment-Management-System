import React from "react";
import { useLocation, Link } from "react-router";
import { useThemeContext } from "@/app/admin/context/ThemeContext";

export function Topbar() {
  const { theme, toggleTheme } = useThemeContext();
  const location = useLocation();

  return (
    <header className="h-header-height fixed top-0 right-0 z-40 bg-surface-bright border-b border-outline-variant flex justify-between items-center w-[calc(100%-280px)] ml-[280px] px-container-padding shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
            placeholder="Search commands, users, or orgs..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden lg:flex items-center gap-6 mr-6">
          <Link 
            className={`font-label-md text-label-md h-header-height flex items-center px-1 border-b-2 ${
              location.pathname === "/platform-admin/dashboard" ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-primary"
            }`} 
            to="/platform-admin/dashboard"
          >
            Dashboard
          </Link>
          <Link 
            className={`font-label-md text-label-md h-header-height flex items-center px-1 border-b-2 ${
              location.pathname === "/platform-admin/reports" ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-primary"
            }`} 
            to="/platform-admin/reports"
          >
            Reports
          </Link>
        </nav>
        {/* Toggle dark/light theme */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-transform active:scale-98 cursor-pointer border-0 bg-transparent"
          aria-label="Toggle dark/light theme"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            {theme === "light" ? "dark_mode" : "light_mode"}
          </span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-transform active:scale-98 relative border-0 bg-transparent cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface-bright"></span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-transform active:scale-98 border-0 bg-transparent cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant">help_outline</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant/50 mx-1"></div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container-highest transition-all group border-0 bg-transparent cursor-pointer">
          <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-primary">Profile</span>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">expand_more</span>
        </button>
      </div>
    </header>
  );
}
export { Topbar as TopNavbar };
