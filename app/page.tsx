import { prisma } from "@/app/prisma";
import { LinkTile } from "@/app/LinkTile";

const Page = async ({
  searchParams: { delete: deleteMode },
}: {
  searchParams: { delete: boolean };
}) => {
  const data = await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
