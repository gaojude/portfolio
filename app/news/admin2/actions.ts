"use server";

import { revalidateTag } from "next/cache";
import { getTopStories } from "../lib/getTopStories";
import { getAndCacheTranslatedStory } from "../lib/getAndCacheTranslatedStory";
import { getTranslatedStoryIds } from "@/app/db/redis";
import { cleanAllTranslations } from "@/app/db/redis";

export const revalidateAndGetTopStories = async () => {
  revalidateTag("top-stories", "admin");
  revalidateTag("news-home", "admin");
  const topStories = await getTopStories();
  return topStories;
};

export const translateSingleStory = async (storyId: number) => {
  revalidateTag("top-stories", "admin");
  revalidateTag("news-home", "admin");
  await getAndCacheTranslatedStory(storyId);
};

export const getExistingStoryIds = async (): Promise<number[]> => {
  const storyIds = await getTranslatedStoryIds();
  return storyIds;
};

export async function cleanAllTranslationsAction() {
  revalidateTag("top-stories", "admin");
  revalidateTag("news-home", "admin");
  await cleanAllTranslations();
}
