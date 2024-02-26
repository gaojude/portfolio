import { prisma } from "@/app/prisma";
import { Link as LinkEntity } from "@/prisma/generated/client";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page({
  searchParams: { u, d, t },
}: {
  searchParams: {
    u: string | undefined;
    d: string | undefined;
    t: string | undefined;
  };
}) {
  if (u && t) {
    await prisma.link.create({
      data: {
        url: u,
        title: t,
      },
    });

    redirect("/");
  }
  if (u) {
    return (
      <form
        action={async (formData: FormData) => {
          "use server";

          const isValid = (value: unknown): value is string => {
            return typeof value == "string";
          };

          const rawUrl = formData.get("url");
          const rawTitle = formData.get("title");

          if (!isValid(rawUrl) || !isValid(rawTitle)) {
            throw new Error("Invalid Input");
          }

          await prisma.link.create({
            data: {
              url: rawUrl,
              title: rawTitle,
            },
          });

          redirect("/");
        }}
        className="m-auto flex max-w-2xl flex-col gap-16 px-4 py-8"
      >
        <div>
          <label htmlFor="url" className="mb-2 block text-sm font-bold">
            URL
          </label>
          <input
            className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none" // Improved styles for input
            type="url"
            name="url"
            defaultValue={u}
          />
        </div>
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-bold">
            Title
          </label>
          <input
            className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none" // Improved styles for input
            type="text"
            name="title"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="focus:shadow-outline w-full rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700 focus:outline-none"
        >
          Add
        </button>
      </form>
    );
  }

  const links = (await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })) as LinkEntity[];

  return (
    <div className="m-auto max-w-2xl p-4">
      <ul>
        {links.map((link) => (
          <li
            key={link.id}
            className="transform transition duration-150 ease-in-out hover:scale-110"
          >
            {d ? (
              <form
                action={async () => {
                  "use server";
                  await prisma.link.delete({
                    where: {
                      id: link.id,
                    },
                  });
                  revalidatePath("/");
                }}
              >
                <button
                  className="block rounded p-2 hover:bg-gray-700"
                  type="submit"
                >
                  DELETE - {link.title}
                </button>
              </form>
            ) : (
              <Link
                target="_blank"
                href={link.url}
                className="block rounded p-2 hover:bg-gray-700"
              >
                {link.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
