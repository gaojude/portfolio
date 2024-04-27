"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { refreshUpdatedAt } from "@/app/refreshUpdatedAt";

export const ClientLink = ({
  url,
  id,
  children,
}: {
  url: string;
  id: number | undefined;
  children: ReactNode;
}) => {
  return (
    <div {...(id ? { onClick: () => refreshUpdatedAt(id) } : {})}>
      <Link href={url}>{children}</Link>
    </div>
  );
};
