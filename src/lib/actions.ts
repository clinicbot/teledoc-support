"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Priority, Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/labels";

function trimOrEmpty(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function trimOrNull(v: FormDataEntryValue | null): string | null {
  const s = trimOrEmpty(v);
  return s.length === 0 ? null : s;
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

  const ticket = await prisma.ticket.create({
    data: {
      shortDescription,
      detailedDescription,
      doctorName,
      doctorEmail,
      doctorPhone,
      priority: priorityRaw as Priority,
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
