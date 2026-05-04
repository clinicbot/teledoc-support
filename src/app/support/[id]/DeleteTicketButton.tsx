"use client";

import { useState, useTransition } from "react";
import { deleteTicket } from "@/lib/actions";

export default function DeleteTicketButton({ ticketId }: { ticketId: number }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:border-red-300 hover:bg-red-50"
      >
        Delete ticket
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
      <span className="text-sm text-red-800">
        Delete this ticket permanently?
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await deleteTicket(ticketId);
          })
        }
        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirming(false)}
        className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
      >
        Cancel
      </button>
    </div>
  );
}
