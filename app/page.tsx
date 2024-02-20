import { prisma } from "@/app/prisma";
import { Link as LinkEntity } from "@/prisma/generated/client";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React from "react";

export default function Page({
  searchParams: { admin },
}: {
  searchParams: { admin: string | undefined };
}) {
  const isAdmin = !!admin;

  return (
    <>
      <div className="bg-gray-800 p-5 rounded-lg shadow-md text-white mb-5">
        <h2 className="text-xl font-semibold mb-3">
          Welcome to My Curated Resources Collection
        </h2>
        <p>
          This collection features a handpicked selection of resources that have
          significantly contributed to my knowledge and expertise in advanced
          frontend technology. While these are not my own creations, I believe
          in sharing this valuable repository for the benefit of professionals
          seeking to enhance their skills. Dive into this compilation to
          discover insights and tools that can elevate your frontend development
          work.
        </p>
      </div>
      <Links isAdmin={isAdmin} />
    </>
  );
}

const Links = async ({ isAdmin }: { isAdmin: boolean }) => {
  const links = (await prisma.link.findMany()) as LinkEntity[];

  return (
    <div className="min-h-screen">
      <table className="min-w-full  leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              URL
            </th>
            {isAdmin ? (
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-800 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Action
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="hover:bg-gray-700">
              <td className="px-5 py-2 border-b border-gray-200 bg-gray-800 text-sm">
                <p className="text-white whitespace-no-wrap">{link.title}</p>
              </td>
              <td className="px-5 py-2 border-b border-gray-200 bg-gray-800 text-sm">
                <Link
                  href={link.url}
                  className="text-blue-400 hover:text-blue-600 visited:text-purple-600"
                  target="_blank"
                >
                  {link.url}
                </Link>
              </td>

              {isAdmin ? (
                <td className="px-5 py-2 border-b border-gray-200 bg-gray-800 text-sm">
                  <form
                    action={async () => {
                      "use server";
                      await prisma.link.delete({
                        where: {
                          id: link.id,
                        },
                      });
                      revalidatePath("/admin");
                    }}
                  >
                    <button
                      type="submit"
                      className="text-blue-400 hover:text-blue-600 visited:text-purple-600"
                    >
                      delete
                    </button>
                  </form>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
