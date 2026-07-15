import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface InfoItem {
  id: string;
  label: string;
  completed: boolean;
}

interface PersonalInformationProps {
  onToggle: (id: string, completed: boolean) => void;
}

export function PersonalInformation({ onToggle }: PersonalInformationProps) {
  const [items, setItems] = useState<InfoItem[]>([
    { id: "addr", label: "Address Details", completed: true },
    { id: "emg", label: "Emergency Contact", completed: true },
    { id: "bank", label: "Bank Account Details", completed: false },
    { id: "nominee", label: "Nominee Information", completed: false },
  ]);

  const handleToggle = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextState = !item.completed;
        onToggle(id, nextState);
        return { ...item, completed: nextState };
      }
      return item;
    });
    setItems(updated);
  };

  return (
    <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Personal Information Fields</h4>
        <span className="text-[11px] font-bold text-muted-foreground">
          {items.filter((i) => i.completed).length} / {items.length} Completed
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${item.completed ? "bg-muted/40 border-[#00B87C]/20 hover:border-[#00B87C]/40" : "bg-card border-border hover:bg-muted/30"}`}
          >
            <span className={`text-[13px] font-bold ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {item.label}
            </span>
            <span className="shrink-0">
              {item.completed ? (
                <CheckCircle2 size={18} className="text-[#00B87C]" />
              ) : (
                <Circle size={18} className="text-muted-foreground/40" />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
