import React from "react";
import { CreateLinkForm } from "@/app/admin/CreateLinkForm";
import NotAuthorized from "@/app/admin/NotAuthorized";

export default async function Page({
  searchParams: { admin },
}: {
  searchParams: {
    admin: string;
  };
}) {
  if (!admin) {
    return <NotAuthorized />;
  }
  return <CreateLinkForm />;
}
