import { Suspense } from "react";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  experimental_generateImage as generateImage,
  generateObject,
} from "ai";
import { DEFAULT_MODEL } from "@/lib/models";

import { z } from "zod";

import { cacheLife } from "next/dist/server/use-cache/cache-life";
import Link from "next/link";
import { ErrorBoundary } from "./error-boundary";
import { Pronounce } from "./pronounce";
import { QueryHistory, SaveQuery } from "./persistence";
import { SearchBar } from "./search-bar";
import { DICT_HOME } from "./consts";
import { ClearForm, CtxProvider } from "./Ctx";
import { FollowUp } from "./follow-up";

type ISearchParams = Promise<{
  query: string | undefined;
}>;

export default function Search({
  searchParams,
}: {
  searchParams: ISearchParams;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-24 bg-gradient-to-b from-amber-50 to-white">
      <div className="w-full max-w-2xl px-2 sm:px-0">
        <h1 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-6 sm:mb-8 text-center">
          <Link href={DICT_HOME}>𝒻𝒶𝓈𝓉 Dictionary</Link>
        </h1>
        <CtxProvider>
          <SearchBar />
          <ClearForm />
        </CtxProvider>

        <Suspense>
          <QueryHistory />
        </Suspense>

        <Suspense fallback={ELIPSIS}>
          <SearchHeader searchParams={searchParams} />

          <ErrorBoundary
            fallback={<div>Something went wrong. Please try again.</div>}
          >
            <Suspense>
              <SearchContent searchParams={searchParams} />
            </Suspense>
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
}

// ************* Meta Data *************
export const metadata = {
  title: "𝒻𝒶𝓈𝓉 Dictionary",
  description: "Simple AI dictionary",
};

// ************* Shared *************
const ELIPSIS = <p className="text-gray-600">...</p>;

// Safari buffers the first 1KB of content, so we need to add invisible characters to force it to flush the initial buffering
const SafariInitialBufferFix = () => {
  return <>{"\u200b".repeat(1024)}</>;
};

const SearchHeader = async ({
  searchParams,
}: {
  searchParams: ISearchParams;
}) => {
  const { query } = await searchParams;
  if (!query) {
    return null;
  }
  return (
    <div className="flex items-center justify-between mb-4">
      <title>
        {query
          ? `${query.split(" ").slice(0, 2).join(" ")}${
              query.split(" ").length > 2 ? "..." : ""
            } - 𝒻𝒶𝓈𝓉 Dictionary`
          : "𝒻𝒶𝓈𝓉 Dictionary"}
      </title>
      <SaveQuery query={query} />
      <h2 className="text-2xl font-serif text-gray-800 line-clamp-1">
        {query}
      </h2>
      <Pronounce input={query} />
    </div>
  );
};

// ************* Search Content *************
const SearchContent = async ({
  searchParams,
}: {
  searchParams: ISearchParams;
}) => {
  const { query } = await searchParams;
  if (!query) {
    return null;
  }
  return (
    <Suspense key={query}>
      <div className="rounded-lg border border-gray-200 p-4 sm:p-6 bg-white shadow-md">
        <RenderSearch query={query} />
      </div>
    </Suspense>
  );
};

const RenderSearch = async ({ query }: { query: string }) => {
  "use cache: remote";
  cacheLife("max");

  const reader = await (
    await streamText({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: `Task: Translate input to Chinese and provide definitions for marked terms.
Format Rules:

Single Words:

Line 1: Chinese translation

Line 2: English definition (with Chinese translations for complex terms in brackets)

Sentences:

Line 1: Original sentence

Line 2: Chinese translation

Subsequent lines: For starred terms, list:
[English Term] ([Chinese]): [Definition]. [Hard word translations in brackets if needed]

Examples:

Input: dictionary
Output:
字典
A reference book listing words with meanings, pronunciations (发音), and usage.

Input: The further our cause* advances
Output:
The further our cause advances
我们的事业越向前推进
cause (事业): A goal or movement people support or work toward.

Input: not least in the European Union
Output:
not least in the European Union
在欧盟中尤其重要
not least (尤其重要): At least as significant as other factors.
          `,
        },
        {
          role: "user",
          content: query,
        },
      ],
    }).textStream
  ).getReader();

  return (
    <Suspense
      fallback={
        <>
          <SafariInitialBufferFix />
          {ELIPSIS}
        </>
      }
    >
      <RenderStream reader={reader} query={query} />
    </Suspense>
  );
};

const RenderStream = async ({
  reader,
  query,
}: {
  reader: ReadableStreamDefaultReader<string>;
  query: string;
}) => {
  const { done, value } = await reader.read();

  if (done) {
    return <FollowUp query={query} />;
  }

  return (
    <>
      <span className="text-gray-700 text-base sm:text-lg whitespace-pre-wrap font-serif leading-relaxed">
        {value}
      </span>
      <Suspense fallback={ELIPSIS}>
        <RenderStream reader={reader} query={query} />
      </Suspense>
    </>
  );
};

const MaybeGenerateImage = async ({ query }: { query: string }) => {
  "use cache: remote";
  cacheLife("max");

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      shouldGenerate: z.boolean(),
      optimizedPrompt: z.string().optional(),
    }),
    prompt: `Analyze "${query}". Should it be visualized? If yes, provide a concrete art prompt (MUST optimize the size of the input tokens to the image generationmodel). If no, just return false. Focus on visual elements, avoid abstract concepts. You can assume that the image model is bad at abstraction thinking.`,
  });

  if (!object.shouldGenerate || !object.optimizedPrompt) {
    return (
      <div>
        <p className="mt-4 inline-block bg-gray-50 text-gray-500">
          No image generated. This query is not suitable for an image.
        </p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-[100%] aspect-square bg-gray-100 flex flex-col gap-4 items-center justify-center mt-4">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-gray-600" />
          <p className="text-gray-500 text-sm text-center px-4">
            {object.optimizedPrompt}
          </p>
        </div>
      }
    >
      <GenerateImage optimizedPrompt={object.optimizedPrompt} />
    </Suspense>
  );
};

const GenerateImage = async ({
  optimizedPrompt,
}: {
  optimizedPrompt: string;
}) => {
  const { image } = await generateImage({
    model: openai.image("dall-e-2"),
    prompt: optimizedPrompt,
    size: "512x512",
  });

  return (
    <img
      src={`data:image/png;base64,${image.base64}`}
      alt={optimizedPrompt}
      className="mt-4 w-full h-[100%] aspect-square"
    />
  );
};

const RenderImage = async ({ query }: { query: string }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="w-full h-[100%] aspect-square bg-gray-100 flex items-center justify-center mt-4">
          <div className="text-red-500">Failed to generate image.</div>
        </div>
      }
    >
      <Suspense>
        <MaybeGenerateImage query={query} />
      </Suspense>
    </ErrorBoundary>
  );
};
