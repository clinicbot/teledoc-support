import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Tele-Derm Support Desk
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Report a problem with the tele-dermatology platform, or track the
          progress of an existing ticket.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Link
          href="/new"
          className="group block rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-teal-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Report a problem
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Doctors: file a new ticket describing the problem you&apos;re seeing.
            You&apos;ll get a ticket number to track progress.
          </p>
        </Link>

        <Link
          href="/support"
          className="group block rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-teal-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Support team dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse all tickets, filter by priority or status, and update
            tickets as you work through them.
          </p>
        </Link>
      </div>

      <p className="mt-12 text-center text-sm text-slate-500">
        Have a ticket number? Visit{" "}
        <span className="font-mono">/ticket/&lt;number&gt;</span> to check its
        status.
      </p>
    </div>
  );
}
