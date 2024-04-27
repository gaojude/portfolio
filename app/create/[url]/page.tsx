import { Button } from "@/components/ui/button";
import React from "react";
import { fetchMetadataForUrl } from "@/app/_utils/fetchMetadataForUrl";
import { prisma } from "@/app/prisma";
import { redirect } from "next/navigation";
import { LinkTile } from "@/app/LinkTile";

const Page = async ({
  params: { url: rawUrl },
}: {
  params: { url: string };
}) => {
  const url = decodeURIComponent(rawUrl);
  const { ogImage, title } = await fetchMetadataForUrl(decodeURIComponent(url));

  return (
    <div className="border-t pt-4">
      <LinkTile url={url} title={title} ogImage={ogImage} />

      <div className="flex justify-end space-x-2 pt-4">
        <form
          action={async () => {
            "use server";

            await prisma.link.create({
              data: {
                url: rawUrl,
                title: title,
                ogImageUrl: ogImage,
              },
            });

            redirect("/");
          }}
        >
          <Button className="dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
