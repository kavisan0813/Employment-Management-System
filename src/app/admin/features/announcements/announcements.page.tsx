import React from "react";
import { PageHeader } from "@/app/admin/components/common/page-header";
import { FilterBar } from "@/app/admin/components/common/filter-bar";
import { DataTable } from "@/app/admin/components/common/data-table";
import { StatusBadge } from "@/app/admin/components/common/status-badge";
import { ANNOUNCEMENTS } from "@/app/admin/features/announcements/announcements.mock";

export default function AnnouncementsPage() {
  const rows = ANNOUNCEMENTS.map((a) => [
    a.title,
    a.audience,
    <StatusBadge key="status" status={a.status} />,
    a.date,
    a.state,
  ]);

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Broadcast messages to tenants and users"
      />
      <FilterBar
        placeholder="Search announcements…"
        filters={["Audience", "State"]}
        addLabel="New Announcement"
      />
      <DataTable
        columns={["Title", "Audience", "Status", "Date", "State"]}
        rows={rows}
        onRowAction={() => {}}
      />
    </div>
  );
}
