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
      <div className="mb-5 rounded-lg bg-gray-800 p-5 text-white shadow-md">
        <h2 className="mb-3 text-xl font-semibold">Quick Links</h2>
      </div>
      <Links isAdmin={isAdmin} />
    </>
  );
}

const Links = async ({ isAdmin }: { isAdmin: boolean }) => {
  const links = (await prisma.link.findMany()) as LinkEntity[];

  return (
    <div>
      {links.map((link) => (
        <p key={link.id}>
          <Link target="_blank" href={link.url}>
            {link.title}
          </Link>
        </p>
      ))}
    </div>
  );
};

// {isAdmin ? (
//   <td className="border-b border-gray-200 bg-gray-800 px-5 py-2">
//     <form
//       action={async () => {
//         "use server";
//         await prisma.link.delete({
//           where: {
//             id: link.id,
//           },
//         });
//         revalidatePath("/admin");
//       }}
//     >
//       <button
//         type="submit"
//         className="text-blue-400 visited:text-purple-600 hover:text-blue-600"
//       >
//         delete
//       </button>
//     </form>
//   </td>
// ) : null}
