import React from "react";

function Toggle({
  on,
  onChange,
  disabled,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!on)}
      className={`w-11 h-6 rounded-full transition-all relative border-2 shrink-0 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${on ? "bg-primary/10 border-primary" : "bg-secondary/50 border-border"}`}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all ${on ? "right-1 bg-primary" : "left-1 bg-muted-foreground/40"}`}
      />
    </button>
  );
}


export function ToggleRow({
  label,
  desc,
  on,
  onChange,
  disabled,
}: {
  label: string;
  desc?: string;
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 group">
      <div className="flex-1 min-w-0 pr-4">
        <p
          className={`text-[14px] font-black ${disabled ? "text-muted-foreground/60" : "text-foreground"} group-hover:text-primary transition-colors`}
        >
          {label}
        </p>
        {desc && (
          <p className="text-[12px] font-bold text-muted-foreground mt-0.5">
            {desc}
          </p>
        )}
      </div>
      <Toggle on={on} onChange={onChange} disabled={disabled} />
    </div>
  );
}