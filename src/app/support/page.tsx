import Link from "next/link";
import { Priority, Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  PRIORITY_BADGE,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  STATUS_BADGE,
  STATUS_LABELS,
  STATUS_OPTIONS,
  formatDate,
  formatTicketId,
} from "@/lib/labels";

type SearchParams = Promise<{
  status?: string;
  priority?: string;
  q?: string;
}>;

export default async function SupportDashboard({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && STATUS_OPTIONS.includes(params.status as Status)
      ? (params.status as Status)
      : null;
  const priorityFilter =
    params.priority &&
    PRIORITY_OPTIONS.includes(params.priority as Priority)
      ? (params.priority as Priority)
      : null;
  const q = (params.q || "").trim();

  const tickets = await prisma.ticket.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(priorityFilter ? { priority: priorityFilter } : {}),
      ...(q
        ? {
            OR: [
              { shortDescription: { contains: q, mode: "insensitive" } },
              { detailedDescription: { contains: q, mode: "insensitive" } },
              { doctorName: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" },
    ],
  });

  const counts = await prisma.ticket.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countByStatus = Object.fromEntries(
    counts.map((c) => [c.status, c._count._all])
  ) as Record<Status, number>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Support dashboard
          </h1>
          <p className="mt-1 text-slate-600">
            All tickets reported by doctors. Click a row to view or update.
          </p>
        </div>
        <Link
          href="/new"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          + New ticket
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={
              statusFilter === s
                ? buildHref({ ...params, status: undefined })
                : buildHref({ ...params, status: s })
            }
            className={`rounded-xl border p-3 text-center text-sm transition ${
              statusFilter === s
                ? "border-teal-500 bg-teal-50 text-teal-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">
              {STATUS_LABELS[s]}
            </div>
            <div className="mt-1 text-xl font-semibold text-slate-900">
              {countByStatus[s] ?? 0}
            </div>
          </Link>
        ))}
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-3" action="/support">
        {statusFilter && (
          <input type="hidden" name="status" value={statusFilter} />
        )}
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search tickets…"
          className="flex-1 min-w-[200px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
        />
        <select
          name="priority"
          defaultValue={priorityFilter ?? ""}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
        >
          <option value="">All priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Apply
        </button>
        {(statusFilter || priorityFilter || q) && (
          <Link
            href="/support"
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No tickets match your filters.
                </td>
              </tr>
            )}
            {tickets.map((t) => (
              <tr
                key={t.id}
                className="cursor-pointer transition hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-mono text-slate-500">
                  <Link
                    href={`/support/${t.id}`}
                    className="block w-full"
                  >
                    {formatTicketId(t.id)}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link
                    href={`/support/${t.id}`}
                    className="block w-full"
                  >
                    {t.shortDescription}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <Link
                    href={`/support/${t.id}`}
                    className="block w-full"
                  >
                    {t.doctorName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/support/${t.id}`}
                    className="block w-full"
                  >
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${PRIORITY_BADGE[t.priority]}`}
                    >
                      {PRIORITY_LABELS[t.priority]}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/support/${t.id}`}
                    className="block w-full"
                  >
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE[t.status]}`}
                    >
                      {STATUS_LABELS[t.status]}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  <Link
                    href={`/support/${t.id}`}
                    className="block w-full"
                  >
                    {formatDate(t.createdAt)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function buildHref(params: {
  status?: string;
  priority?: string;
  q?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.priority) sp.set("priority", params.priority);
  if (params.q) sp.set("q", params.q);
  const qs = sp.toString();
  return qs ? `/support?${qs}` : "/support";
}
