import { AnimatePresence, motion } from "motion/react";
import { Upload, X } from "lucide-react";

interface UploadDocumentModalProps {
  show: boolean;
  onClose: () => void;
  handleConfirmUpload: () => void;
}

export function UploadDocumentModal({ show, onClose, handleConfirmUpload }: UploadDocumentModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-[32px] w-full max-w-md p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                  <Upload size={20} className="text-[#8B5CF6]" />
                </div>
                <h2 className="text-lg font-black text-foreground">Upload Document</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted transition-all flex items-center justify-center">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-[#8B5CF6]/40 transition-all cursor-pointer">
              <Upload size={32} className="mx-auto text-muted-foreground/60 mb-3" />
              <p className="text-[13px] font-bold text-foreground">Drop files here or click to browse</p>
              <p className="text-[11px] text-muted-foreground mt-1">PDF, JPG, PNG — Max 10MB</p>
            </div>
            <div className="mt-4">
              <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Document Type</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-bold outline-none">
                <option>Experience Letter</option>
                <option>Bank Account Details</option>
                <option>Passport Photo</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 mt-5">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-[11px] font-semibold uppercase tracking-wider hover:bg-muted transition-all">Cancel</button>
              <button onClick={handleConfirmUpload} className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-md">Upload</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
