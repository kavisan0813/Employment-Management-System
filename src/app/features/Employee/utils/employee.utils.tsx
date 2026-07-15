import React from 'react';

export interface HighlightTextProps {
  text: string;
  search: string;
}

export function HighlightText({ text, search }: HighlightTextProps) {
  if (!search || !search.trim()) return <>{text}</>;
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedSearch})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200/60 dark:bg-yellow-500/30 text-yellow-950 dark:text-yellow-100 rounded-sm px-0.5"
            style={{
              backgroundColor: "rgba(253, 224, 71, 0.4)",
              color: "inherit",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}


export const departments = ['All Departments', 'Engineering', 'Marketing', 'Design', 'Finance', 'HR', 'Product', 'Sales', 'Operations'];

export const statusConfig: Record<string, { color: string; bg: string; dot?: string }> = {
  Active: { color: "#10B981", bg: "#10B98115", dot: "#10B981" },
  Inactive: { color: "#EF4444", bg: "#EF444415", dot: "#EF4444" },
  "On Leave": { color: "#F59E0B", bg: "#F59E0B15", dot: "#F59E0B" },
};

export const deptColors: Record<string, string> = {
  Engineering: "#3B82F6",
  Marketing: "#EC4899",
  Design: "#8B5CF6",
  Finance: "#10B981",
  HR: "#F59E0B",
  Product: "#6366F1",
  Sales: "#EF4444",
  Operations: "#14B8A6",
};
