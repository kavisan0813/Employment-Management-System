import {
  Bell,
  Search,
  Plus,
  ChevronDown,
  Moon,
} from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <header className="h-18 border-b bg-white px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="w-full h-13 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notification */}
        <Link to="/platform-admin/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-900 block">
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
        <div className="flex items-center gap-3 pl-3 border-l">
          <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            PK
          </div>

          <div className="hidden md:block">
            <h4 className="text-sm font-semibold">
              Platform Admin
            </h4>
            <p className="text-xs text-gray-500">
              Super Admin
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-gray-500"
          />
        </div>
      </div>
    </header>
  );
}