import { load } from "cheerio";

export const fetchMetadataForUrl = async (
  url: string,
): Promise<{
  title: string;
  ogImage: string;
}> => {
  let postData;

  postData = await fetch(url);

  if (!postData.ok) {
    throw new Error(`Failed to fetch metadata for ${url}`);
  }

  const html = await postData.text();
  const $ = load(html);
  const title = $("title").text().trim();
  let ogImage = null;
  $('meta[property="og:image"]').each(function () {
    ogImage = $(this).attr("content");
    return false; // Exit the loop after finding the first OG image
  });

  if (!title) {
    throw new Error(`No title found for ${url}`);
  }

  if (!ogImage) {
    throw new Error(`No OG image found for ${url}`);
  }

  return { title, ogImage };
};
