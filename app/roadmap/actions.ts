"use server";

import { prisma } from "@/app/prisma";
import { revalidatePath } from "next/cache";

export const createRoadmap = async (formData: FormData) => {
  const raw = formData.get("roadmap-item");
  if (typeof raw !== "string") {
    throw new Error("Expected roadmap item to be a string");
  }
  await prisma.roadmap.create({
    data: {
      task: raw,
    },
  });
  revalidatePath("/roadmap");
};
