import { getNotesById } from "@/app/db/redis";
import { notFound } from "next/navigation";
import { MarkdownParser } from "../../conversation/[id]/markdown-parser";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function NotesPageContent({ params }: PageProps) {
  const { id } = await params;
  const notes = await getNotesById(id);

  if (!notes) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <MarkdownParser content={notes.markdown} />
    </div>
  );
}

const NotesPageFallback = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default function NotesPage({ params }: PageProps) {
  return (
    <Suspense fallback={<NotesPageFallback />}>
      <NotesPageContent params={params} />
    </Suspense>
  );
}
