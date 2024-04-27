import { prisma } from "@/app/prisma";
import { LinkTile } from "@/app/LinkTile";

const Page = async ({
  searchParams: { delete: deleteMode },
}: {
  searchParams: { delete: boolean };
}) => {
  const data = await prisma.link.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      deleted: false,
    },
  });

  return (
    <section className="container mx-auto max-w-screen-sm px-4 py-12 md:px-6 lg:py-16">
      <div className="grid  grid-cols-1 gap-6">
        {data.map(({ url, ogImageUrl, title, id }) => (
          <LinkTile
            key={url}
            url={url}
            ogImage={ogImageUrl ?? ""}
            title={title!}
            id={id}
            deleteMode={deleteMode}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
