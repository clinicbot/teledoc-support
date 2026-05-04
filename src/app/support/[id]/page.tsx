import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTicket } from "@/lib/actions";
import { AttachmentGallery } from "@/components/AttachmentGallery";
import DeleteTicketButton from "./DeleteTicketButton";
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

export default async function SupportTicketEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = Number(id);
  if (!Number.isInteger(ticketId)) notFound();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      attachments: {
        select: { id: true, filename: true },
        orderBy: { id: "asc" },
      },
    },
  });
  if (!ticket) notFound();

  const updateThis = updateTicket.bind(null, ticket.id);

  const inputClass =
    "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/support"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          &larr; Back to dashboard
        </Link>
        <Link
          href={`/ticket/${ticket.id}`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Doctor view ↗
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

        <AttachmentGallery attachments={ticket.attachments} />
      </div>

      <form
        action={updateThis}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">Edit ticket</h2>
        <p className="mt-1 text-sm text-slate-600">
          Update any field below. Changes are visible to the doctor on their
          ticket page.
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-slate-800"
            >
              Short description
            </label>
            <input
              id="shortDescription"
              name="shortDescription"
              type="text"
              required
              maxLength={200}
              defaultValue={ticket.shortDescription}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="detailedDescription"
              className="block text-sm font-medium text-slate-800"
            >
              Detailed description
            </label>
            <textarea
              id="detailedDescription"
              name="detailedDescription"
              required
              rows={5}
              defaultValue={ticket.detailedDescription}
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-slate-800"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={ticket.priority}
                className={inputClass}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-slate-800"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={ticket.status}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <legend className="px-2 text-sm font-medium text-slate-700">
              Doctor contact
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="doctorName"
                  className="block text-sm font-medium text-slate-800"
                >
                  Name
                </label>
                <input
                  id="doctorName"
                  name="doctorName"
                  type="text"
                  required
                  maxLength={120}
                  defaultValue={ticket.doctorName}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="doctorEmail"
                  className="block text-sm font-medium text-slate-800"
                >
                  Email
                </label>
                <input
                  id="doctorEmail"
                  name="doctorEmail"
                  type="email"
                  maxLength={200}
                  defaultValue={ticket.doctorEmail ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="doctorPhone"
                  className="block text-sm font-medium text-slate-800"
                >
                  Phone
                </label>
                <input
                  id="doctorPhone"
                  name="doctorPhone"
                  type="tel"
                  maxLength={40}
                  defaultValue={ticket.doctorPhone ?? ""}
                  className={inputClass}
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="supportNotes"
              className="block text-sm font-medium text-slate-800"
            >
              Support notes
              <span className="ml-1 font-normal text-slate-500">
                (visible to the doctor)
              </span>
            </label>
            <textarea
              id="supportNotes"
              name="supportNotes"
              defaultValue={ticket.supportNotes ?? ""}
              rows={4}
              placeholder="ETA, workaround, what was fixed, etc."
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <DeleteTicketButton ticketId={ticket.id} />
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
