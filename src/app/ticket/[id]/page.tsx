import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  PRIORITY_BADGE,
  PRIORITY_LABELS,
  STATUS_BADGE,
  STATUS_LABELS,
  formatDate,
  formatTicketId,
} from "@/lib/labels";

export default async function TicketViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = Number(id);
  if (!Number.isInteger(ticketId)) notFound();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
          &larr; Home
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-slate-500">
              {formatTicketId(ticket.id)}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {ticket.shortDescription}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_BADGE[ticket.status]}`}
            >
              {STATUS_LABELS[ticket.status]}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${PRIORITY_BADGE[ticket.priority]}`}
            >
              {PRIORITY_LABELS[ticket.priority]}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Reported by
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{ticket.doctorName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Submitted
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatDate(ticket.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Last updated
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatDate(ticket.updatedAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h2 className="text-sm font-semibold text-slate-700">
            Detailed description
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
            {ticket.detailedDescription}
          </p>
        </div>

        {ticket.supportNotes && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-700">
              Note from the support team
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
              {ticket.supportNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
