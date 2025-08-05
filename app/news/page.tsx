import { Suspense } from "react";
import Link from "next/link";

import { listAllTranslatedStories } from "@/app/db/redis";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { cacheLife } from "next/dist/server/use-cache/cache-life";


export default async function NewsPage() {
  "use cache: remote";
  cacheTag("news-home");
  cacheLife("max");

  const translatedStories = (await listAllTranslatedStories()).filter(
    (story) => story.translatedTitle !== "-"
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight mb-6 text-gray-900">
        Hacker News Top Stories
      </h1>
      <Suspense fallback={<div>Loading stories...</div>}>
        <ul className="space-y-2">
          {translatedStories.map((story, index) => (
            <li key={story.id} className="block p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center">
                <span className="text-gray-500 w-8">{index + 1}.</span>
                <Link
                  href={`/news/${story.id}`}
                  className="flex-1 hover:text-blue-600"
                >
                  {story.translatedTitle}
                </Link>
              </div>
              {story.url && (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 ml-8 hover:underline"
                >
                  {new URL(story.url).hostname}
                </a>
              )}
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
