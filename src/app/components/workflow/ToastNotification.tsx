import { toast } from "sonner"; // Assuming sonner is used based on common patterns in these projects

export type ToastType = "success" | "error" | "info" | "warning";

export const showToast = (
  title: string,
  type: ToastType = "info",
  description?: string,
) => {
  const options = {
    description,
    duration: 4000,
  };

  switch (type) {
    case "success":
      toast.success(title, options);
      break;
    case "error":
      toast.error(title, options);
      break;
    case "warning":
      toast.warning(title, options);
      break;
    default:
      toast.info(title, options);
      break;
  }
};

// If sonner is not installed, we can fall back to a simple alert or a custom implementation
// but given the environment, sonner is very likely.
