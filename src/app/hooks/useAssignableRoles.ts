import useSWR from "swr";
import { useAuth } from "../context/AuthContext";

export interface AssignableRole {
  id: string;
  value: string;
  label: string;
  alwaysOn?: boolean;
  permissions: string[];
}

export function useAssignableRoles() {
  const { user } = useAuth();

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch assignable roles");
    }
    return res.json();
  };

  // Use current user's email as identifier (backend expects query param)
  const userId = user?.email || "anonymous";
  const { data, error, isLoading } = useSWR<AssignableRole[]>(
    `/api/roles/assignable?userId=${encodeURIComponent(userId)}`,
    fetcher
  );

  return {
    data,
    isLoading,
    error: error as Error | undefined,
  };
}
