"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Priority, Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/labels";

const MAX_ATTACHMENTS = 4;
const MAX_ATTACHMENT_SIZE = 1_000_000;
const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
]);

function trimOrEmpty(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function trimOrNull(v: FormDataEntryValue | null): string | null {
  const s = trimOrEmpty(v);
  return s.length === 0 ? null : s;
}

function toArrayBuffer(buf: ArrayBufferLike): ArrayBuffer {
  if (buf instanceof ArrayBuffer) return buf;
  const copy = new ArrayBuffer(buf.byteLength);
  new Uint8Array(copy).set(new Uint8Array(buf));
  return copy;
}

async function readAttachments(formData: FormData) {
  const raw = formData.getAll("attachments");
  const files = raw.filter(
    (f): f is File => f instanceof File && f.size > 0
  );
  if (files.length > MAX_ATTACHMENTS) {
    throw new Error(`You can attach at most ${MAX_ATTACHMENTS} images.`);
  }
  const attachments = [];
  for (const file of files) {
    if (file.size > MAX_ATTACHMENT_SIZE) {
      throw new Error(
        `"${file.name}" is too large (max 1 MB per image).`
      );
    }
    if (!ALLOWED_MIME.has(file.type)) {
      throw new Error(
        `"${file.name}" is not a supported image type. Use PNG, JPEG, GIF, WEBP, or HEIC.`
      );
    }
    const data = new Uint8Array(toArrayBuffer(await file.arrayBuffer()));
    attachments.push({
      filename: file.name.slice(0, 200),
      mimeType: file.type,
      size: file.size,
      data,
    });
  }
  return attachments;
}

export async function createTicket(formData: FormData) {
  const shortDescription = trimOrEmpty(formData.get("shortDescription"));
  const detailedDescription = trimOrEmpty(formData.get("detailedDescription"));
  const doctorName = trimOrEmpty(formData.get("doctorName"));
  const doctorEmail = trimOrNull(formData.get("doctorEmail"));
  const doctorPhone = trimOrNull(formData.get("doctorPhone"));
  const priorityRaw = trimOrEmpty(formData.get("priority"));

  if (!shortDescription || !detailedDescription || !doctorName) {
    throw new Error("Missing required fields.");
  }
  if (!PRIORITY_OPTIONS.includes(priorityRaw as Priority)) {
    throw new Error("Invalid priority.");
  }

  const attachments = await readAttachments(formData);

  const ticket = await prisma.ticket.create({
    data: {
      shortDescription,
      detailedDescription,
      doctorName,
      doctorEmail,
      doctorPhone,
      priority: priorityRaw as Priority,
      ...(attachments.length > 0
        ? { attachments: { create: attachments } }
        : {}),
    },
  });

  revalidatePath("/support");
  redirect(`/submitted/${ticket.id}`);
}

export async function updateTicket(id: number, formData: FormData) {
  const statusRaw = trimOrEmpty(formData.get("status"));
  const supportNotes = trimOrNull(formData.get("supportNotes"));

  if (!STATUS_OPTIONS.includes(statusRaw as Status)) {
    throw new Error("Invalid status.");
  }

  await prisma.ticket.update({
    where: { id },
    data: {
      status: statusRaw as Status,
      supportNotes,
    },
  });

  revalidatePath("/support");
  revalidatePath(`/support/${id}`);
  revalidatePath(`/ticket/${id}`);
}
