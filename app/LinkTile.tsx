import { XIcon } from "lucide-react";
import { prisma } from "@/app/prisma";
import { revalidatePath } from "next/cache";
import { ClientLink } from "@/app/ClientLink";

export const LinkTile = ({
  url,
  title,
  ogImage,
  id,
  deleteMode,
}: {
  url: string;
  title: string;
  ogImage: string;
  id?: number;
  deleteMode?: boolean;
}) => {
  const jsx = (
    <div
      className="group relative rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div
        className="aspect-[1.91/1] overflow-hidden rounded-t-lg"
        style={{ flex: "1 0 auto" }}
      >
        <img
          alt="URL Screenshot"
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
          src={ogImage || "#"}
          style={{
            aspectRatio: "320/340",
            objectFit: "fill",
          }}
        />
        {deleteMode ? (
          <button className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-gray-50 transition-colors hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200">
            <XIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="p-4" style={{ flex: "0 0 auto" }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {title}
        </h3>
      </div>
    </div>
  );

  if (deleteMode) {
    return (
      <form
        action={async () => {
          "use server";

          await prisma.link.delete({
            where: {
              id: id!,
            },
          });

          revalidatePath("/");
        }}
      >
        {jsx}
      </form>
    );
  }

  return (
    <ClientLink url={decodeURIComponent(url)} id={id}>
      {jsx}
    </ClientLink>
  );
};
