import { getTranslatedStory, storeTranslatedStory } from "@/app/db/redis";
import { getStoryContentEffective } from "../[id]/getStoryContentEffective";
import {
  translatePageToChinese,
  translateTextToChinese,
} from "../translateToChinese";

export const getAndCacheTranslatedStory = async (storyId: number) => {
  let story = await getTranslatedStory(storyId);

  if (!story || !story.translatedContent) {
    try {
      // If no cached version exists, fetch and translate
      const storyRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
      );

      if (!storyRes.ok) {
        throw new Error("Failed to fetch story");
      }

      const originalStory = await storyRes.json();
      // Get and translate the content with timeout
      const translationPromise = Promise.all([
        translateTextToChinese(originalStory.title),
        translatePageToChinese(
          await getStoryContentEffective(originalStory.url)
        ),
      ]);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Translation timed out after 50 seconds")),
          50000
        );
      });

      const [translatedTitle, translatedContent] = (await Promise.race([
        translationPromise,
        timeoutPromise,
      ])) as [string, string];

      // Store the translation in Redis
      story = await storeTranslatedStory(
        storyId,
        originalStory.title,
        translatedTitle,
        translatedContent,
        originalStory.url
      );
    } catch (error) {
      // TODO: we should store a seninel value representing an error and should be filgered out from the article list.
      story = await storeTranslatedStory(storyId, "-", "-", "-", "-");
      console.error("Error fetching and translating story", error);
    }
  }

  return story;
};
