import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { useThemeContext } from "../../features/context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { ShieldCheck, User, Settings, LogOut } from "lucide-react";

export function Topbar() {
  const { theme, toggleTheme } = useThemeContext();
  const location = useLocation();
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-header-height fixed top-0 right-0 z-40 bg-surface-bright border-b border-outline-variant flex justify-between items-center w-[calc(100%-280px)] ml-[280px] px-container-padding shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
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
              location.pathname === "/platform-admin/dashboard"
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-primary"
            }`}
            to="/platform-admin/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={`font-label-md text-label-md h-header-height flex items-center px-1 border-b-2 ${
              location.pathname === "/platform-admin/reports"
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-primary"
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
        <Link
          to="/platform-admin/notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-transform active:scale-98 relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            notifications
          </span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface-bright"></span>
        </Link>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-transform active:scale-98 border-0 bg-transparent cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant">
            help_outline
          </span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant/50 mx-1"></div>
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container-highest transition-all group border-0 bg-transparent cursor-pointer"
          >
            <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-primary">
              Profile
            </span>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
              expand_more
            </span>
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-bright border border-outline-variant rounded-2xl shadow-xl z-50 overflow-hidden text-left">
              {/* Enhanced Profile Header */}
              <div className="p-6 border-b border-outline-variant bg-surface-container-low">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary border border-primary/20 shrink-0">
                    {user?.initials || "SR"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-xl text-on-surface truncate">
                        {user?.name || "System Administrator"}
                      </h3>
                    </div>
                    <p className="text-on-surface-variant text-sm truncate" title={user?.email}>
                      {user?.email || "platform@nexushr.com"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Platform System Admin
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-on-surface-variant text-xs">Department</p>
                    <p className="font-medium text-on-surface">Platform Engineering</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-xs">Member Since</p>
                    <p className="font-medium text-on-surface">March 2024</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2 text-xs text-on-surface-variant">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Secure SSL Active • SOC 2 Compliant</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2">
                <Link
                  to="/platform-admin/profile"
                  className="w-full text-left px-4 py-3 text-sm text-on-surface hover:bg-surface-container-highest rounded-xl transition-colors flex items-center gap-3 border-0 bg-transparent cursor-pointer"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <div>
                    <div className="font-medium">View Full Profile</div>
                    <div className="text-xs text-on-surface-variant">Manage personal details &amp; preferences</div>
                  </div>
                </Link>

                <Link
                  to="/platform-admin/settings"
                  className="w-full text-left px-4 py-3 text-sm text-on-surface hover:bg-surface-container-highest rounded-xl transition-colors flex items-center gap-3 border-0 bg-transparent cursor-pointer"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Account Settings</div>
                    <div className="text-xs text-on-surface-variant">Security, notifications &amp; integrations</div>
                  </div>
                </Link>

                <div className="h-px bg-outline-variant my-1 mx-2"></div>

                <button 
                  className="w-full text-left px-4 py-3 text-sm text-error hover:bg-error/5 rounded-xl transition-colors flex items-center gap-3 border-0 bg-transparent cursor-pointer"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
export { Topbar as TopNavbar };