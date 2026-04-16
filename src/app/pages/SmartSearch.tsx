import React, { useState, useEffect } from "react";
import { 
  Search, 
  Mic, 
  Sparkles, 
  User, 
  Calendar, 
  CreditCard, 
  FileText, 
  ArrowRight,
  Loader2,
  X,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

// Mock data for results
const MOCK_RESULTS = {
  employees: [
    { id: "1", name: "Sarah Connor", role: "Sr. Software Engineer", status: "Active", attendance: "98%", leave: "No pending", avatar: "SC" },
    { id: "2", name: "John Doe", role: "Product Manager", status: "On Leave", attendance: "92%", leave: "Sick Leave (3 days)", avatar: "JD" },
  ],
  attendance: [
    { id: "a1", title: "Highest Attendance March", info: "Sarah Connor (100%)", type: "Metric" },
    { id: "a2", title: "Team Attendance Average", info: "94.5%", type: "Metric" },
  ],
  payroll: [
    { id: "p1", title: "Payroll Summary March", info: "Total: ₹45,20,000", type: "Report" },
  ],
  leaves: [
    { id: "l1", name: "Marcus Wright", type: "Annual Leave", status: "Pending Approval", days: "5 days", date: "Apr 20 - Apr 25" },
  ]
};

const SUGGESTED_QUERIES = [
  "Employees on leave today",
  "Top performers this month",
  "Payroll summary",
  "Attendance report",
  "Engineers on leave this week",
  "Highest attendance in March"
];

const SmartSearch = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_RESULTS | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      // Filter logic or just show all mock data for demo
      setResults(MOCK_RESULTS);
    }, 1500);
  };

  const handleSuggestClick = (suggestion: string) => {
    setQuery(suggestion);
    // Auto trigger search
    setIsSearching(true);
    setHasSearched(false);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      setResults(MOCK_RESULTS);
    }, 1500);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-emerald-100 text-emerald-900 font-semibold px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] dark:bg-[#021410] p-6 md:p-10 transition-colors duration-500">
      {/* Header / Search Bar Section */}
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-[#022C22] dark:text-[#ECFDF5] flex items-center justify-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            Smart AI Search
          </h1>
          <p className="text-[#064E3B]/70 dark:text-[#A7F3D0]/70 text-lg">
            Intelligent workforce insights at your fingertips
          </p>
        </motion.div>

        {/* Search Input Container */}
        <div className="relative group">
          <motion.form 
            onSubmit={handleSearch}
            className="relative z-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[#10B981]">
              <Search size={24} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your workforce..."
              className="w-full h-16 pl-14 pr-32 rounded-2xl bg-white dark:bg-[#06211C] border-none shadow-xl shadow-emerald-900/5 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-lg text-[#022C22] dark:text-[#ECFDF5] outline-none placeholder:text-emerald-900/30 dark:placeholder:text-emerald-100/20"
            />
            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="rounded-xl text-[#10B981] hover:bg-emerald-50"
              >
                <Mic size={22} />
              </Button>
              <Button 
                type="submit"
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold transition-transform active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                Search
              </Button>
            </div>
          </motion.form>
          {/* Glassmorphism background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        {/* Suggested Queries */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {SUGGESTED_QUERIES.map((q, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestClick(q)}
              className="px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/20 text-[#064E3B] dark:text-[#A7F3D0] text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-sm"
            >
              {q}
            </motion.button>
          ))}
        </motion.div>

        {/* Results Section */}
        <div className="pt-4 pb-20">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-20 space-y-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 animate-pulse" size={24} />
                </div>
                <div className="text-center">
                  <p className="text-[#064E3B] dark:text-[#A7F3D0] font-medium text-lg">AI is thinking...</p>
                  <p className="text-sm text-[#064E3B]/60 dark:text-[#A7F3D0]/60">Analyzing workforce data and reports</p>
                </div>
              </motion.div>
            ) : hasSearched ? (
              results ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                  {/* Categorized Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Employees Category */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-[#022C22] dark:text-[#ECFDF5] font-bold text-xl px-2">
                        <User size={20} className="text-[#10B981]" />
                        Employees
                        <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {results.employees.length} matched
                        </Badge>
                      </h3>
                      {results.employees.map((emp) => (
                        <Card key={emp.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-[#06211C] group">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                              {emp.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#022C22] dark:text-[#ECFDF5] truncate">
                                {highlightText(emp.name, query)}
                              </h4>
                              <p className="text-sm text-[#064E3B]/60 dark:text-[#A7F3D0]/60">{emp.role}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <Badge variant={emp.status === "Active" ? "default" : "outline"} className={emp.status === "Active" ? "bg-emerald-500" : "border-amber-500 text-amber-500"}>
                                {emp.status}
                              </Badge>
                              <p className="text-[10px] mt-1 text-[#064E3B]/50 font-medium">Att: {emp.attendance}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                              <Button size="icon" variant="ghost" className="rounded-full text-emerald-500">
                                <ChevronRight size={20} />
                              </Button>
                            </div>
                          </CardContent>
                          <div className="px-4 py-2 bg-emerald-50/50 dark:bg-emerald-900/10 flex gap-2 border-t border-emerald-50 dark:border-emerald-900/20">
                            <Button size="sm" variant="ghost" className="h-7 text-[11px] text-[#10B981] hover:bg-emerald-100">View Profile</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-[11px] text-[#10B981] hover:bg-emerald-100">Edit</Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Attendance Category */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 text-[#022C22] dark:text-[#ECFDF5] font-bold text-xl px-2">
                        <Calendar size={20} className="text-[#10B981]" />
                        Attendance
                      </h3>
                      {results.attendance.map((att) => (
                        <Card key={att.id} className="border-none shadow-md bg-white dark:bg-[#06211C]">
                          <CardContent className="p-4 flex gap-4">
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                              <TrendingUp size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">{att.type}</p>
                              <h4 className="font-semibold text-[#022C22] dark:text-[#ECFDF5]">{att.title}</h4>
                              <p className="text-sm text-[#064E3B]/70 dark:text-[#A7F3D0]/70 font-medium mt-1">{att.info}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Payroll Placeholder */}
                      <h3 className="flex items-center gap-2 text-[#022C22] dark:text-[#ECFDF5] font-bold text-xl px-2 pt-4">
                        <CreditCard size={20} className="text-[#10B981]" />
                        Payroll
                      </h3>
                      {results.payroll.map((pay) => (
                        <Card key={pay.id} className="border-none shadow-md bg-white dark:bg-[#06211C]">
                          <CardContent className="p-4 flex gap-4">
                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                              <FileText size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{pay.type}</p>
                              <h4 className="font-semibold text-[#022C22] dark:text-[#ECFDF5]">{pay.title}</h4>
                              <p className="text-sm text-[#064E3B]/70 dark:text-[#A7F3D0]/70 font-medium mt-1">{pay.info}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="text-blue-500">
                              <ArrowRight size={18} />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Leaves Category - Full Width bottom */}
                    <div className="md:col-span-2 space-y-4 pt-4">
                      <h3 className="flex items-center gap-2 text-[#022C22] dark:text-[#ECFDF5] font-bold text-xl px-2">
                        <Clock size={20} className="text-[#10B981]" />
                        Pending Approvals (Leaves)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.leaves.map((leave) => (
                          <Card key={leave.id} className="border-l-4 border-l-amber-500 border-none shadow-md bg-white dark:bg-[#06211C]">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-[#022C22] dark:text-[#ECFDF5]">{leave.name}</h4>
                                <p className="text-xs text-[#064E3B]/60 dark:text-[#A7F3D0]/60">{leave.type} • {leave.days}</p>
                                <p className="text-[11px] mt-1 text-emerald-600 dark:text-emerald-400 font-semibold">{leave.date}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-4 rounded-lg">Approve</Button>
                                <Button size="sm" variant="outline" className="h-8 rounded-lg">Decline</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-[#06211C] rounded-full flex items-center justify-center mb-4">
                    <X size={32} className="text-emerald-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#022C22] dark:text-[#ECFDF5]">No results found</h3>
                  <p className="text-[#064E3B]/60 dark:text-[#A7F3D0]/60 max-w-xs mx-auto mt-2">
                    We couldn't find anything matching your query. Try rephrasing or search for something else.
                  </p>
                </motion.div>
              )
            ) : (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-6"
              >
                <div className="w-32 h-32 relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-emerald-500/20 rounded-full"
                  />
                  <div className="absolute inset-4 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 rounded-full flex items-center justify-center">
                    <Sparkles size={48} className="text-[#10B981]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#022C22] dark:text-[#ECFDF5]">Ready to help?</h3>
                  <p className="text-[#064E3B]/60 dark:text-[#A7F3D0]/60 max-w-md">
                    Ask questions in natural language like "Show me designers in Delhi" or "Average performance score last month".
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;
