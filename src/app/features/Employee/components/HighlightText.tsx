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
            key={part}
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
