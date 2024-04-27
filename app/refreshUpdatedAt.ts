"use server";

import { prisma } from "@/app/prisma";

export const refreshUpdatedAt = async (id: number) => {
  await prisma.link.update({
    where: {
      id: id!,
    },
    data: {
      updatedAt: new Date(),
    },
  });
};
