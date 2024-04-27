import Link from "next/link";
import { XIcon } from "lucide-react";
import { prisma } from "@/app/prisma";
import { revalidatePath } from "next/cache";

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
    <div className="group relative rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
        <img
          alt="URL Screenshot"
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
          height="240"
          src={ogImage || "/placeholder.png"} // TODO: add placeholder image
          style={{
            aspectRatio: "320/240",
            objectFit: "cover",
          }}
          width="320"
        />
        {deleteMode ? (
          <button className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-gray-50 transition-colors hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200">
            <XIcon className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="p-4">
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

  return <Link href={url}>{jsx}</Link>;
};
