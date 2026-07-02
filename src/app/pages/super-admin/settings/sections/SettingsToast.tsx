import React from "react";
import { useSettingsContext } from "../SettingsContext";
import { CheckCircle } from "lucide-react";

export function SettingsToast() {
  const { toast } = useSettingsContext();

  if (!toast) return null;
  return (
    <div
      className="fixed bottom-6 right-6 px-4 py-3 rounded-xl text-white shadow-2xl z-[2000] flex items-center gap-2 font-medium text-sm"
      style={{
        backgroundColor: toast.type === "success" ? "#00B87C" : "#EF4444",
      }}
    >
      <CheckCircle size={16} />
      {toast.message}
    </div>
  );
}
