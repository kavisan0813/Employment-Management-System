import { Trash2 } from "lucide-react";
import { Department } from "../types/department.types";

interface DeleteDepartmentModalProps {
  dept: Department;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function DeleteDepartmentModal({
  dept,
  onClose,
  onDelete,
}: DeleteDepartmentModalProps) {
  const handleDelete = () => {
    onDelete(dept.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card shadow-xl border border-border p-6 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4 mx-auto">
          <Trash2 size={24} className="text-rose-500" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2 text-center">
          Delete Department
        </h3>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Are you sure you want to delete <strong>{dept.name}</strong>? This action cannot be undone and will affect associated structures.
        </p>
        <div className="flex gap-3">
          <button
            className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-rose-500 hover:bg-rose-600 shadow-sm transition-all"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
