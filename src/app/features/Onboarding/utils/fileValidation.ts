/* ─── File Validation Utilities ─── */
// Placeholder for future file validation logic (max size, allowed types, etc.)

export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.` };
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: "Only PDF, JPG, and PNG files are allowed." };
  }
  return { valid: true };
}
