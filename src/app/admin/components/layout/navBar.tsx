import { Bell, Search, ChevronDown, Moon, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { OrganizationService } from "../../features/organizations/services/organization.service";
import { useAuth } from "../../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    const handleSearchOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleSearchOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleSearchOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="h-18 border-b bg-white px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search organizations, domains..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {(() => {
              const allOrgs = OrganizationService.getOrganizations();
              const results = allOrgs.filter(
                (o) =>
                  o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  o.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (o.code && o.code.toLowerCase().includes(searchQuery.toLowerCase()))
              );
              if (results.length === 0) {
                return (
                  <div className="p-4 text-center text-xs text-gray-500 font-semibold">
                    No matching organizations found
                  </div>
                );
              }
              return results.map((org) => (
                <div
                  key={org.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    navigate("/platform-admin/organizations");
                  }}
                  className="p-3 hover:bg-indigo-50/50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-none transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{org.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{org.domain}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {org.status}
                  </span>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notification */}
        <Link
          to="/platform-admin/notifications"
          className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-900 block"
        >
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </Link>

        {/* Theme Toggle */}
        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100">
          <Moon size={18} />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-3 border-l cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase">
              {user?.initials || "PK"}
            </div>

            <div className="hidden md:block">
              <h4 className="text-sm font-semibold">
                {user?.email || "Platform Admin"}
              </h4>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>

            <ChevronDown size={16} className="text-gray-500" />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-left">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 border border-indigo-200 uppercase shrink-0">
                    {user?.initials || "PK"}
                  </div>
                  <div className="overflow-hidden">
                    <span
                      className="block text-[11px] font-bold text-gray-900 truncate"
                      title={user?.email || "platform@viyanhr.com"}
                    >
                      {user?.email || "platform@viyanhr.com"}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block uppercase tracking-wide">
                      Platform System Admin
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-150 text-[10px] text-gray-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure SSL Active &bull; Compliance</span>
                </div>
              </div>
              <div className="p-1">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                  My Profile
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                  Account Settings
                </button>
                <div className="h-[1px] bg-gray-100 my-1"></div>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
