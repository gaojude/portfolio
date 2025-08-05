import { JSDOM } from "jsdom";

// crawl effective string content from url
export async function getStoryContentEffective(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache", // Consider if always needed
        Pragma: "no-cache", // Consider if always needed
      },
      method: "GET",
    });


    if (!response.ok) {
      console.error(
        `Failed to fetch story content from ${url}. Status: ${response.status} ${response.statusText}`
      );
      throw new Error(
        `Failed to fetch story content. Status: ${response.status}`
      );
    }

    const htmlText = await response.text();
    const dom = new JSDOM(htmlText);
    const document = dom.window.document;

    // List of tags to remove, derived from your original regex list.
    // This aims to remove non-content elements and elements you explicitly wanted to strip.
    const tagsToRemove: string[] = [
      "script",
      "style",
      "noscript",
      "iframe",
      "svg",
      "nav",
      "header",
      "footer",
      "aside",
      "form",
      "button",
      "input",
      "select",
      "textarea",
      "label",
      "fieldset",
      "legend",
      "optgroup",
      "option",
      "datalist",
      "output",
      "progress",
      "meter",
      "details",
      "summary",
      "dialog",
      "menu",
      "menuitem",
      "command",
      "keygen",
      "source",
      "track",
      "video",
      "audio",
      "canvas",
      "map",
      "area",
      "object",
      "param",
      "embed",
      "link",
      "meta",
      "base",
      "basefont",
      "bgsound",
      "blink",
      "marquee",
      "nextid",
      "spacer",
      "wbr",
      "img",
      "hr",
      "br",
      // Note: Removing 'br' can make text less readable if newlines are important.
      // textContent on its own often converts <br> to newlines.
      // Removing 'img' means alt text is also gone.
      // This list matches the intent of your original extensive removal.
    ];

    tagsToRemove.forEach((tagName) => {
      const elements = document.querySelectorAll(tagName);
      elements.forEach((el) => el.remove());
    });

    // Extract text content from the body.
    // For more targeted extraction, you might try to identify a main content element
    // (e.g., document.querySelector('article') or document.querySelector('.main-content'))
    // and get its textContent. For now, document.body is a general approach.
    let storyText = document.body.textContent || "";

    // Clean up whitespace:
    // 1. Consolidate multiple newlines (and any whitespace between them) into single newlines.
    storyText = storyText.replace(/(\r\n|\r|\n)(\s*(\r\n|\r|\n))+/g, "$1");
    // 2. Replace multiple horizontal spaces/tabs with a single space.
    storyText = storyText.replace(/[ \t]+/g, " ");
    // 3. Trim leading/trailing whitespace from the whole string.
    storyText = storyText.trim();
    // 4. Trim each line and remove lines that became empty.
    storyText = storyText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");



    return storyText;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `Error in getStoryContentEffective for URL ${url}:`,
      errorMessage
    );
    return `Unable to fetch or process story content from ${url}. Error: ${errorMessage}`;
  }
}
