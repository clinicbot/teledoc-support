import { Priority, Status } from "@prisma/client";

export const PRIORITY_LABELS: Record<Priority, string> = {
  SUGGESTION: "Suggestion for improvement",
  NOT_URGENT: "Not urgent",
  VERY_URGENT: "Very urgent",
};

export const PRIORITY_OPTIONS: Priority[] = [
  "SUGGESTION",
  "NOT_URGENT",
  "VERY_URGENT",
];

export const PRIORITY_BADGE: Record<Priority, string> = {
  SUGGESTION: "bg-blue-100 text-blue-800 ring-blue-200",
  NOT_URGENT: "bg-slate-100 text-slate-700 ring-slate-200",
  VERY_URGENT: "bg-red-100 text-red-800 ring-red-200",
};

export const STATUS_LABELS: Record<Status, string> = {
  NEW: "New",
  ACKNOWLEDGED: "Acknowledged",
  INVESTIGATING: "Under investigation",
  PLANNED: "Planned for future",
  COMPLETED: "Completed and corrected",
};

export const STATUS_OPTIONS: Status[] = [
  "NEW",
  "ACKNOWLEDGED",
  "INVESTIGATING",
  "PLANNED",
  "COMPLETED",
];

export const STATUS_BADGE: Record<Status, string> = {
  NEW: "bg-amber-100 text-amber-800 ring-amber-200",
  ACKNOWLEDGED: "bg-sky-100 text-sky-800 ring-sky-200",
  INVESTIGATING: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  PLANNED: "bg-purple-100 text-purple-800 ring-purple-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

export function formatTicketId(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
