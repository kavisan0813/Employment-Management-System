/* ─── Canonical Onboarding File Validation Utilities ─── */

export const DEFAULT_MAX_FILE_SIZE_MB = 10;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ALLOWED_FILE_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  code?: "EMPTY_FILE" | "OVERSIZED" | "UNSUPPORTED_TYPE" | "DUPLICATE" | "INVALID_FILE";
  formattedSize?: string;
  fileType?: string;
}

/**
 * Get the active onboarding document upload size limit in MB.
 * Reads from configured settings in local storage or falls back to DEFAULT_MAX_FILE_SIZE_MB (10 MB).
 */
export function getOnboardingMaxFileSizeMb(orgId?: string): number {
  try {
    const key = orgId
      ? `viyan_onboarding_config:${orgId}:v1`
      : "viyan_onboarding_config:v1";
    const savedConfig =
      localStorage.getItem(key) ||
      localStorage.getItem("viyan_onboarding_config:v1");
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      const parsedSize = Number(parsed.maxFileSizeMb);
      if (!isNaN(parsedSize) && parsedSize >= 1 && parsedSize <= 100) {
        return parsedSize;
      }
    }
  } catch (e) {
    console.error("Failed to read onboarding upload configuration", e);
  }
  return DEFAULT_MAX_FILE_SIZE_MB;
}

/**
 * Helper to set the active onboarding max file size limit in MB.
 */
export function setOnboardingMaxFileSizeMb(
  sizeMb: number,
  orgId?: string,
): void {
  try {
    const key = orgId
      ? `viyan_onboarding_config:${orgId}:v1`
      : "viyan_onboarding_config:v1";
    const savedConfig = JSON.parse(
      localStorage.getItem(key) ||
        localStorage.getItem("viyan_onboarding_config:v1") ||
        "{}",
    );
    savedConfig.maxFileSizeMb = sizeMb;
    localStorage.setItem(key, JSON.stringify(savedConfig));
    localStorage.setItem(
      "viyan_onboarding_config:v1",
      JSON.stringify(savedConfig),
    );
    window.dispatchEvent(new Event("viyan:onboarding-config-updated"));
  } catch (e) {
    console.error("Failed to save onboarding upload configuration", e);
  }
}

/**
 * Format bytes into human-readable string (e.g., "2.45 MB", "850 KB").
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Complete pre-upload file validation.
 */
export function validateFile(
  file: File | null | undefined,
  existingFileNames: string[] = [],
  orgId?: string,
): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      code: "INVALID_FILE",
      error: "Please select a file to upload.",
    };
  }

  const formattedSize = formatBytes(file.size);
  const maxMb = getOnboardingMaxFileSizeMb(orgId);
  const maxBytes = maxMb * 1024 * 1024;

  // 1. Check for empty/zero-byte files
  if (file.size === 0) {
    return {
      valid: false,
      code: "EMPTY_FILE",
      formattedSize,
      error: "The selected file is empty (0 bytes). Please select a valid, non-empty document.",
    };
  }

  // 2. Check max file size limit
  if (file.size > maxBytes) {
    return {
      valid: false,
      code: "OVERSIZED",
      formattedSize,
      error: `File size (${formattedSize}) exceeds the maximum configured limit of ${maxMb} MB.`,
    };
  }

  // 3. Check file extension & MIME type
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  const isValidMime = ALLOWED_FILE_TYPES.includes(file.type.toLowerCase());
  const isValidExt = ALLOWED_FILE_EXTENSIONS.includes(extension);

  if (!isValidMime && !isValidExt) {
    return {
      valid: false,
      code: "UNSUPPORTED_TYPE",
      formattedSize,
      error: `Unsupported file format "${extension || file.type}". Allowed formats: PDF, JPG, PNG, DOC, DOCX.`,
    };
  }

  // 4. Check for duplicate upload if filename matches existing
  const isDuplicate = existingFileNames.some(
    (name) => name.toLowerCase() === file.name.toLowerCase(),
  );
  if (isDuplicate) {
    return {
      valid: false,
      code: "DUPLICATE",
      formattedSize,
      error: `A file named "${file.name}" has already been uploaded for this onboarding.`,
    };
  }

  return {
    valid: true,
    formattedSize,
    fileType: extension.toUpperCase().replace(".", ""),
  };
}
