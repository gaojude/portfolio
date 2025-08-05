"use server";

import { getTranslatedStory, storeTranslatedStory } from "@/app/db/redis";
import {
  translateTextToChinese,
  translatePageToChinese,
} from "../translateToChinese";
import { getTopStories } from "./getTopStories";
import { getStoryContentEffective } from "../[id]/getStoryContentEffective";

export async function translateTopStories() {
  const stories = await getTopStories();

  return Promise.all(
    stories.map(async (story) => {

      // Try to get cached translation first
      let translatedStory = await getTranslatedStory(story.id);

      if (!translatedStory || !translatedStory.translatedTitle) {
        // If no cached version exists, translate and store
        try {
          const [translatedTitle, translatedContent] = await Promise.all([
            translateTextToChinese(story.title),
            translatePageToChinese(await getStoryContentEffective(story.url)),
          ]);

          translatedStory = await storeTranslatedStory(
            story.id,
            story.title,
            translatedTitle,
            translatedContent,
            story.url
          );
        } catch (error) {
          console.error(`Error translating story ${story.id}:`, error);
          translatedStory = await storeTranslatedStory(
            story.id,
            story.title,
            "N/A",
            "N/A",
            story.url
          );
        }
      } else {
      }

      return {
        ...story,
        translatedTitle: translatedStory.translatedTitle,
        translatedContent: translatedStory.translatedContent,
      };
    })
  );
}
