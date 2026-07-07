import type { LucideIcon } from "lucide-react";
import { PageHeader } from "../common/PageHeader";

/**
 * Placeholder for routes that exist in navigation but don't have a built
 * screen yet. Swap each one out for a real feature page as it's built —
 * this keeps the sidebar fully navigable from day one without 404s.
 */
interface ComingSoonPageProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export function ComingSoonPage({
  title,
  subtitle,
  icon: Icon,
}: ComingSoonPageProps) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={
          subtitle ?? `Manage ${title.toLowerCase()} configuration and settings`
        }
      />
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center opacity-60">
        {Icon && <Icon size={36} className="text-primary" />}
        <span className="text-[13px] text-muted-foreground">
          {title} is coming soon — this screen will be built next.
        </span>
      </div>
    </div>
  );
}
