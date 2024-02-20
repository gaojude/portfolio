"use server";

import { prisma } from "@/app/prisma";
import { revalidatePath } from "next/cache";

export async function createLink(formData) {
  const rawFormData = {
    url: formData.get("url"),
    title: formData.get("title"),
    description: formData.get("description"),
  };
  await prisma.link.create({
    data: rawFormData,
  });
  // TODO: reset form / redirect to links page
  revalidatePath("/create-link");
}
