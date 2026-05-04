"use client";

import { useEffect, useRef, useState } from "react";

const MAX_FILES = 4;
const MAX_SIZE = 1_000_000;

type Preview = {
  url: string;
  name: string;
  sizeKb: number;
};

export default function AttachmentPicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pasteHint, setPasteHint] = useState<string | null>(null);

  function refreshFromInput(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) {
      setPreviews((old) => {
        old.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });
      return;
    }
    if (files.length > MAX_FILES) {
      setError(`You can attach at most ${MAX_FILES} images.`);
    }
    const next: Preview[] = [];
    for (const file of Array.from(files).slice(0, MAX_FILES)) {
      if (file.size > MAX_SIZE) {
        setError(
          (prev) =>
            prev ?? `"${file.name}" is too large (max 1 MB per image).`
        );
      }
      next.push({
        url: URL.createObjectURL(file),
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
      });
    }
    setPreviews((old) => {
      old.forEach((p) => URL.revokeObjectURL(p.url));
      return next;
    });
  }

  function addFiles(newFiles: File[]) {
    const input = inputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        dt.items.add(input.files[i]);
      }
    }
    for (const f of newFiles) dt.items.add(f);
    input.files = dt.files;
    refreshFromInput(input.files);
  }

  function clearAll() {
    if (inputRef.current) inputRef.current.value = "";
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setError(null);
  }

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (!e.clipboardData) return;
      const imageItems = Array.from(e.clipboardData.items).filter(
        (i) => i.kind === "file" && i.type.startsWith("image/")
      );
      if (imageItems.length === 0) return;
      e.preventDefault();
      const files: File[] = [];
      for (const item of imageItems) {
        const blob = item.getAsFile();
        if (!blob) continue;
        const ext = (blob.type.split("/")[1] || "png").toLowerCase();
        const name =
          blob.name && blob.name.length > 0
            ? blob.name
            : `pasted-${Date.now()}-${files.length + 1}.${ext}`;
        files.push(new File([blob], name, { type: blob.type }));
      }
      if (files.length === 0) return;
      addFiles(files);
      setPasteHint(
        files.length === 1
          ? "Pasted 1 image."
          : `Pasted ${files.length} images.`
      );
      window.setTimeout(() => setPasteHint(null), 2500);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-800">
        Screenshots <span className="text-slate-400 font-normal">(optional)</span>
      </label>
      <p className="mt-1 text-xs text-slate-500">
        Up to {MAX_FILES} images, max 1 MB each. PNG, JPEG, GIF, WEBP, or HEIC.
      </p>

      <label
        htmlFor="attachments"
        className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-teal-400 hover:bg-teal-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.6}
          stroke="currentColor"
          className="h-8 w-8 text-slate-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <span className="mt-2 text-sm text-slate-700">
          <span className="font-medium text-teal-700">Click to choose</span>,
          drag images here, or paste with{" "}
          <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-700">
            Ctrl+V
          </kbd>
        </span>
        <span className="mt-1 text-[11px] text-slate-500">
          Tip: after using Snipping Tool, just press Ctrl+V on this page.
        </span>
        <input
          ref={inputRef}
          id="attachments"
          name="attachments"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/gif,image/webp,image/heic,image/heif"
          className="sr-only"
          onChange={(e) => refreshFromInput(e.target.files)}
        />
      </label>

      {pasteHint && (
        <p className="mt-2 text-sm text-teal-700">{pasteHint}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-700">{error}</p>
      )}

      {previews.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              {previews.length} image{previews.length === 1 ? "" : "s"}{" "}
              selected
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Clear
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {previews.map((p, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.name}
                  className="h-24 w-full object-cover"
                />
                <div className="px-2 py-1 text-[11px] text-slate-600">
                  <div className="truncate" title={p.name}>
                    {p.name}
                  </div>
                  <div className="text-slate-400">{p.sizeKb} KB</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
