import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatTicketId } from "@/lib/labels";

export default async function SubmittedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = Number(id);
  if (!Number.isInteger(ticketId)) notFound();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, shortDescription: true },
  });
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Ticket submitted
        </h1>
        <p className="mt-2 text-slate-700">
          Your ticket number is{" "}
          <span className="font-mono font-semibold text-slate-900">
            {formatTicketId(ticket.id)}
          </span>
          .
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Please save this number — you&apos;ll need it to check on your ticket.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-700">Your ticket</h2>
        <p className="mt-1 text-slate-900">{ticket.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/ticket/${ticket.id}`}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            View ticket status
          </Link>
          <Link
            href="/new"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Report another problem
          </Link>
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
