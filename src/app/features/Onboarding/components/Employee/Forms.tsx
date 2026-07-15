import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { showToast } from "../../../../components/workflow/ToastNotification";

interface FormItem {
  id: string;
  label: string;
  completed: boolean;
}

interface FormsProps {
  onToggle: (id: string, completed: boolean) => void;
}

export function Forms({ onToggle }: FormsProps) {
  const [items, setItems] = useState<FormItem[]>([
    { id: "nda", label: "NDA Agreement", completed: true },
    { id: "policy", label: "Company Policy Handbook", completed: true },
    { id: "decl", label: "Employee Declaration", completed: true },
    { id: "sig", label: "Digital Signature Consent", completed: false },
  ]);

  const handleToggle = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextState = !item.completed;
        onToggle(id, nextState);
        showToast(
          nextState ? "Form Signed" : "Form Reopened",
          "success",
          nextState ? `${item.label} signed successfully.` : `${item.label} marked unsigned.`
        );
        return { ...item, completed: nextState };
      }
      return item;
    });
    setItems(updated);
  };

  return (
    <div className="p-6 bg-card border border-border rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Required Forms & Signature</h4>
        <span className="text-[11px] font-bold text-muted-foreground">
          {items.filter((i) => i.completed).length} / {items.length} Completed
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${item.completed ? "bg-muted/40 border-[#00B87C]/20 hover:border-[#00B87C]/40" : "bg-card border-border hover:bg-muted/30"}`}
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
