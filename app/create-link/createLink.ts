"use server";

import { prisma } from "@/app/prisma";
import { revalidatePath } from "next/cache";

export async function createLink(formData: FormData) {
  const rawFormData = {
    url: formData.get("url"),
    title: formData.get("title"),
    description: formData.get("description"),
  } as const;

  if (!rawFormData.url) {
    throw new Error("url is null");
  }

  const url = rawFormData.url as string;
  const title = rawFormData.title as string | null;
  const description = rawFormData.description as string | null;

  await prisma.link.create({
    data: {
      url,
      title,
      description,
    },
  });
  // TODO: reset form / redirect to links page
  revalidatePath("/create-link");
}
