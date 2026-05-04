type AttachmentSummary = {
  id: number;
  filename: string;
};

export function AttachmentGallery({
  attachments,
}: {
  attachments: AttachmentSummary[];
}) {
  if (attachments.length === 0) return null;
  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <h2 className="text-sm font-semibold text-slate-700">
        Screenshots ({attachments.length})
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {attachments.map((a) => (
          <a
            key={a.id}
            href={`/api/attachments/${a.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-teal-400 hover:shadow-md"
            title={a.filename}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/attachments/${a.id}`}
              alt={a.filename}
              className="h-32 w-full object-cover"
            />
            <div className="truncate px-2 py-1 text-[11px] text-slate-600 group-hover:text-slate-900">
              {a.filename}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
