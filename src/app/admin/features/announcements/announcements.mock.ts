import announcementsData from "../../sample-data/announcements.json";

export interface Announcement {
  id: string;
  title: string;
  audience: string;
  status: string;
  state: string;
  date: string;
}

export const ANNOUNCEMENTS: Announcement[] = announcementsData.map((item) => ({
  id: item.id,
  title: item.title,
  audience: item.audience,
  status: item.status,
  state: item.state,
  date: item.date,
}));

