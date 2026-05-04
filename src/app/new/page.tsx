import Link from "next/link";
import { createTicket } from "@/lib/actions";
import { PRIORITY_LABELS, PRIORITY_OPTIONS } from "@/lib/labels";
import AttachmentPicker from "./AttachmentPicker";

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          &larr; Back
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Report a problem
      </h1>
      <p className="mt-2 text-slate-600">
        Tell us what&apos;s going wrong and we&apos;ll get back to you. All
        fields with * are required.
      </p>

      <form action={createTicket} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="shortDescription"
            className="block text-sm font-medium text-slate-800"
          >
            Short description *
          </label>
          <input
            id="shortDescription"
            name="shortDescription"
            type="text"
            required
            maxLength={200}
            placeholder="e.g. Photo upload fails on Chrome"
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="detailedDescription"
            className="block text-sm font-medium text-slate-800"
          >
            Detailed description *
          </label>
          <textarea
            id="detailedDescription"
            name="detailedDescription"
            required
            rows={6}
            placeholder="What were you doing when the problem occurred? What did you expect to happen, and what actually happened? Include any error messages."
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800">
            Priority *
          </label>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {PRIORITY_OPTIONS.map((p, i) => (
              <label
                key={p}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-teal-400 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50"
              >
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  defaultChecked={i === 1}
                  required
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-800">
                  {PRIORITY_LABELS[p]}
                </span>
              </label>
            ))}
          </div>
        </div>

        <AttachmentPicker />

        <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <legend className="px-2 text-sm font-medium text-slate-700">
            Your contact info
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="doctorName"
                className="block text-sm font-medium text-slate-800"
              >
                Your name *
              </label>
              <input
                id="doctorName"
                name="doctorName"
                type="text"
                required
                maxLength={120}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
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
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
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
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
              />
            </div>
          </div>
        </fieldset>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Submit ticket
          </button>
        </div>
      </form>
    </div>
  );
}
