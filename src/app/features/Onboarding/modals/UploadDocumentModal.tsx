import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  File,
  Image as ImageIcon,
} from "lucide-react";
import {
  validateFile,
  getOnboardingMaxFileSizeMb,
  formatBytes,
  ALLOWED_FILE_EXTENSIONS,
  type FileValidationResult,
} from "../utils/fileValidation";
import { showToast } from "../../../components/workflow/ToastNotification";
import { usePermissions } from "../../../shared/permission-engine/PermissionContext";
import { P } from "../../../shared/permission-engine/permissions";
import { useAuth } from "../../../context/AuthContext";

export interface UploadedFilePayload {
  file: File;
  fileName: string;
  formattedSize: string;
  fileType: string;
}

interface UploadDocumentModalProps {
  show: boolean;
  onClose: () => void;
  handleConfirmUpload: (payload?: UploadedFilePayload) => void;
  documentTitle?: string;
  existingDocNames?: string[];
}

export function UploadDocumentModal({
  show,
  onClose,
  handleConfirmUpload,
  documentTitle,
  existingDocNames = [],
}: UploadDocumentModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<FileValidationResult | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { user } = useAuth();
  const { hasPermissionKey } = usePermissions();

  // Active max file size in MB for current tenant
  const [maxMb, setMaxMb] = useState(() =>
    getOnboardingMaxFileSizeMb(user?.organizationId),
  );

  // Sync max file size config
  useEffect(() => {
    const updateMax = () =>
      setMaxMb(getOnboardingMaxFileSizeMb(user?.organizationId));
    updateMax();
    window.addEventListener("viyan:onboarding-config-updated", updateMax);
    return () =>
      window.removeEventListener("viyan:onboarding-config-updated", updateMax);
  }, [show, user?.organizationId]);

  // Reset modal internal state when opened/closed
  const [prevShow, setPrevShow] = useState(show);
  if (show !== prevShow) {
    setPrevShow(show);
    if (!show) {
      setSelectedFile(null);
      setValidation(null);
      setIsDragging(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  const processFileSelection = (file?: File) => {
    if (!file) return;

    const result = validateFile(file, existingDocNames, user?.organizationId);
    setSelectedFile(file);
    setValidation(result);

    if (!result.valid) {
      showToast("Upload Validation Failed", "error", result.error);
    } else {
      showToast(
        "File Validated",
        "info",
        `Selected "${file.name}" (${result.formattedSize}). Ready for upload.`,
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileSelection(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    if (!isUploading || !selectedFile || !validation) return;

    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? 100 : prev + 25));
    }, 100);

    const timer1 = setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
    }, 500);

    const timer2 = setTimeout(() => {
      handleConfirmUpload({
        file: selectedFile,
        fileName: selectedFile.name,
        formattedSize: validation.formattedSize || formatBytes(selectedFile.size),
        fileType: validation.fileType || "DOC",
      });
      showToast(
        "Document Uploaded Successfully",
        "success",
        `Uploaded "${selectedFile.name}" (${validation.formattedSize}). Stored in onboarding repository.`,
      );
      onClose();
    }, 700);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isUploading, selectedFile, validation, handleConfirmUpload, onClose]);

  const handleStartUpload = () => {
    if (!selectedFile || !validation || !validation.valid) {
      showToast(
        "Invalid Selection",
        "error",
        "Please select a valid document before uploading.",
      );
      return;
    }

    // Handler-level authorization check
    const canUpload =
      hasPermissionKey(P.ONBOARDING_MANAGE) ||
      hasPermissionKey(P.ONBOARDING_FULL) ||
      hasPermissionKey(P.ONBOARDING_SELF) ||
      hasPermissionKey(P.ONBOARDING_COMPLETE_TASKS);

    if (!canUpload) {
      showToast(
        "Permission Denied",
        "error",
        "You do not have permission to upload onboarding documents.",
      );
      return;
    }

    setIsUploading(true);
  };

  const getFileIcon = (file?: File) => {
    if (!file) return <FileText className="w-8 h-8 text-[#8B5CF6]" />;
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-8 h-8 text-[#00B87C]" />;
    }
    if (file.type.includes("pdf")) {
      return <FileText className="w-8 h-8 text-rose-500" />;
    }
    return <File className="w-8 h-8 text-blue-500" />;
  };

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <m.div
            className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5"
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20">
                  <Upload className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h2 className="text-base font-black text-foreground">
                    {documentTitle ? `Upload ${documentTitle}` : "Upload Document"}
                  </h2>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Supported: PDF, JPG, PNG, DOC, DOCX — Max limit: {maxMb} MB
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isUploading}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DRAG AND DROP / SELECTION ZONE */}
            {!selectedFile ? (
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-[#8B5CF6] bg-[#8B5CF6]/10 scale-[1.01]"
                    : "border-border hover:border-[#8B5CF6]/50 hover:bg-muted/30"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={ALLOWED_FILE_EXTENSIONS.join(",")}
                  className="hidden"
                  onChange={(e) => processFileSelection(e.target.files?.[0])}
                />
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-foreground">
                  Drag and drop file here or <span className="text-[#8B5CF6] underline">browse files</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground font-medium">
                  PDF, JPG, PNG, DOC, DOCX — Maximum {maxMb} MB
                </p>
              </div>
            ) : (
              /* FILE SELECTED / VALIDATED CARD */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-border bg-muted/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-card border border-border shrink-0">
                      {getFileIcon(selectedFile)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {validation?.formattedSize || formatBytes(selectedFile.size)}
                        </span>
                        {validation?.valid && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00B87C] bg-[#00B87C]/10 border border-[#00B87C]/20 px-2 py-0.5 rounded-full uppercase">
                            <CheckCircle2 size={10} /> Valid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isUploading && (
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setValidation(null);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* ERROR INLINE ALERT BOX */}
                {validation && !validation.valid && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider">
                        Upload Validation Blocked ({validation.code})
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed font-medium">
                        {validation.error}
                      </p>
                      <button
                        onClick={() => inputRef.current?.click()}
                        className="mt-2 text-xs font-bold underline hover:opacity-80 cursor-pointer"
                      >
                        Choose another file
                      </button>
                    </div>
                  </div>
                )}

                {/* UPLOADING PROGRESS BAR */}
                {isUploading && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Uploading file...</span>
                      <span className="text-[#8B5CF6]">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8B5CF6] transition-all duration-150 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODAL FOOTER */}
            <div className="pt-3 border-t border-border flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartUpload}
                disabled={!selectedFile || !validation?.valid || isUploading}
                className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold hover:opacity-95 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Confirm Upload
                  </>
                )}
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
