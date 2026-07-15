import { useState, useEffect } from "react";
import { Clock, Plus, MessageSquare, User } from "lucide-react";
import { showToast } from "../../../../components/workflow/ToastNotification";

interface ActivityItem {
  id: string;
  event: string;
  actor: string;
  date: string;
  time: string;
  type: "system" | "hr" | "it" | "finance" | "candidate";
}

interface Note {
  id: string;
  author: string;
  text: string;
  date: string;
  time: string;
}

const DEFAULT_ACTIVITIES: Record<string, ActivityItem[]> = {
  nh1: [
    { id: "a1", event: "IT setup & system credentials completed", actor: "IT Team", date: "Apr 8, 2026", time: "10:30 AM", type: "it" },
    { id: "a2", event: "Offer letter signed electronically", actor: "Priya Sharma", date: "Apr 5, 2026", time: "04:15 PM", type: "candidate" },
    { id: "a3", event: "Background check verified & documents collected", actor: "HR Operations", date: "Apr 3, 2026", time: "11:00 AM", type: "hr" },
    { id: "a4", event: "Onboarding initiated & default template assigned", actor: "Suresh Iyer", date: "Apr 2, 2026", time: "09:00 AM", type: "system" },
  ],
};

const DEFAULT_NOTES: Record<string, Note[]> = {
  nh1: [
    { id: "n1", author: "Suresh Iyer (Manager)", text: "Priya seems highly motivated. IT credentials have been setup. Ready for day 1 onboarding session.", date: "Apr 8, 2026", time: "11:15 AM" },
    { id: "n2", author: "HR Operations", text: "Background verification completed without issues. Experience letters from previous employer verified.", date: "Apr 3, 2026", time: "11:05 AM" },
  ],
};

interface ActivityLogProps {
  employeeId: string;
  employeeName: string;
}

export function ActivityLog({ employeeId, employeeName }: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(() => DEFAULT_ACTIVITIES[employeeId] || []);
  const [notes, setNotes] = useState<Note[]>(() => DEFAULT_NOTES[employeeId] || []);
  const [noteText, setNoteText] = useState("");

  // Sync state when switching employees
  useEffect(() => {
    setActivities(DEFAULT_ACTIVITIES[employeeId] || [
      { id: "a-init", event: `Onboarding queue entry for ${employeeName}`, actor: "System", date: "Today", time: "Just now", type: "system" }
    ]);
    setNotes(DEFAULT_NOTES[employeeId] || []);
  }, [employeeId, employeeName]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) {
      showToast("Error", "error", "Note description cannot be empty.");
      return;
    }

    const newNote: Note = {
      id: `n-${Date.now()}`,
      author: "HR Manager",
      text: noteText,
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setNotes((prev) => [newNote, ...prev]);
    setNoteText("");
    showToast("Note Added", "success", "Your comment has been added to internal records.");

    // Optionally append note event to activity list
    const newActivity: ActivityItem = {
      id: `a-note-${Date.now()}`,
      event: `Added internal note: "${noteText.substring(0, 40)}..."`,
      actor: "HR Manager",
      date: "Today",
      time: newNote.time,
      type: "hr",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  return (
    <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Timeline Section */}
      <div className="space-y-4">
        <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest pb-2 border-b border-border">
          Activity History Timeline
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-card bg-background flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-foreground">{act.event}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    act.type === "hr" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                    act.type === "it" ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" :
                    act.type === "candidate" ? "bg-[#00B87C]/10 text-[#00B87C]" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {act.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1"><User size={10} /> {act.actor}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {act.date} at {act.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Notes Section */}
      <div className="space-y-4">
        <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest pb-2 border-b border-border">
          Internal HR & Manager Notes
        </h4>

        {/* Note input form */}
        <form onSubmit={handleAddNote} className="space-y-2.5">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Type a new internal note or comment..."
            className="w-full px-4 py-3 rounded-2xl border border-border bg-background text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#00B87C]/20 transition-all resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#00B87C] hover:bg-[#00B87C]/95 text-white text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Note
            </button>
          </div>
        </form>

        {/* Notes list */}
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-[11px] font-bold text-muted-foreground text-center py-6">
              No internal notes recorded. Use the form above to add one.
            </p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-4 bg-muted/20 border border-border rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-foreground flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-[#00B87C]" /> {note.author}
                  </span>
                  <span className="text-[9px] font-semibold text-muted-foreground">
                    {note.date} at {note.time}
                  </span>
                </div>
                <p className="text-[12px] text-foreground font-medium leading-relaxed">
                  {note.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
