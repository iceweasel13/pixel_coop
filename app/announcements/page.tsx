import React from "react";

type Announcement = {
  id: string;
  date: string; // ISO string
  text: string;
};

const announcements: Announcement[] = [
  {
    id: "a5",
    date: "2025-09-09T10:30:00Z",
    text:
      "Maintenance completed. Minor performance improvements and bug fixes have been applied.",
  },
  {
    id: "a4",
    date: "2025-09-08T18:00:00Z",
    text:
      "Balance update applied to $EGG reward rates. Details will be shared in a blog post.",
  },
  {
    id: "a3",
    date: "2025-09-07T14:15:00Z",
    text:
      "New referral campaign is live! Invite friends to earn extra rewards.",
  },
  {
    id: "a2",
    date: "2025-09-06T09:00:00Z",
    text: "Minor UI tweaks and accessibility improvements have been released.",
  },
];

function formatDate(input: string) {
  const d = new Date(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

export default function AnnouncementsPage() {
  const sorted = [...announcements].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
  return (
    <div className="mt-20 px-4 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center">Announcement</h1>
        <p className="mt-3 text-center text-muted-foreground">
          Follow announcements for the latest updates.
        </p>

        <div className="mt-6 space-y-4">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-4"
            >
              <div className="text-xs text-muted-foreground">
                {formatDate(item.date)}
              </div>
              <div className="mt-2 whitespace-pre-line">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
