import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Upload, X } from "lucide-react";
import { validateFile } from "../utils/fileValidation";
import { showToast } from "../../../components/workflow/ToastNotification";

interface UploadDocumentModalProps { show: boolean; onClose: () => void; handleConfirmUpload: () => void; }

export function UploadDocumentModal({ show, onClose, handleConfirmUpload }: UploadDocumentModalProps) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const choose = (next?: File) => {
    if (!next) return;
    const validation = validateFile(next);
    if (!validation.valid) {
      showToast("Upload blocked", "error", validation.error);
      return;
    }
    setFile(next);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Upload className="text-[#8B5CF6]" />
                <h2 className="text-lg font-black">Upload Document</h2>
              </div>
              <button onClick={onClose}>
                <X />
              </button>
            </div>
            <div
              onClick={() => input.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-8 text-center hover:border-[#8B5CF6]/40"
            >
              <input
                ref={input}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(event) => choose(event.target.files?.[0])}
              />
              <Upload className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-bold">
                {file?.name || "Click to browse for a file"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, JPG, PNG — maximum 2 MB
              </p>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-xl border border-border px-5 py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!file) {
                    showToast(
                      "Select a file",
                      "error",
                      "Choose a valid file before uploading.",
                    );
                    return;
                  }
                  handleConfirmUpload();
                  setFile(null);
                }}
                className="rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-xs font-bold text-white"
              >
                Upload
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
