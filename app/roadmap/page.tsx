import React from "react";
import { CreateRoadmapItemForm } from "@/app/roadmap/CreateRoadmapItemForm";
import { prisma } from "@/app/prisma";
import { styles } from "@/app/roadmap/styles";
import { revalidatePath } from "next/cache";

const Page = ({
  searchParams: { admin },
}: {
  searchParams: {
    admin: string;
  };
}) => {
  return (
    <div>
      <CreateRoadmapItemForm />
      {admin ? <RoadmapItems /> : null}
    </div>
  );
};

const RoadmapItems = async () => {
  const items = await prisma.roadmap.findMany();
  return (
    <div className="container mx-auto mt-10">
      {items.map((item) => (
        <form
          key={item.id}
          className="mb-8"
          action={async () => {
            "use server";
            await prisma.roadmap.delete({
              where: {
                id: item.id,
              },
            });
            revalidatePath("/roadmap");
          }}
        >
          <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
            <h2 className={`${styles.secondaryColor} text-lg`}>{item.task}</h2>
            <button
              type="submit"
              className={`cursor-pointer rounded px-4 py-2 ${styles.primaryColor} ${styles.hoverState} flex items-center justify-center text-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-check-lg"
                viewBox="0 0 16 16"
              >
                <path d="M13.485 1.55a.7.7 0 0 1 .994.025l.07.079a.7.7 0 0 1-.025.993l-7.992 8.4a.7.7 0 0 1-.888.064l-.08-.064-4.502-4.72a.7.7 0 0 1 .025-.993l.079-.07a.7.7 0 0 1 .993.025l3.612 3.788 7.114-7.487z" />
              </svg>
            </button>
          </div>
        </form>
      ))}
    </div>
  );
};

export default Page;
