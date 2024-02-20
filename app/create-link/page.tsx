import React from "react";
import { prisma } from "@/app/prisma";
import { Link } from "@/prisma/generated/client";
import { CreateLinkForm } from "@/app/create-link/CreateLinkForm";

export default async function Page() {
  const links = (await prisma.link.findMany()) as Link[];

  return (
    <div>
      <CreateLinkForm />
      {links.map((link) => (
        <p key={link.id}>
          {link.title} | {link.url}
        </p>
      ))}
    </div>
  );
}
