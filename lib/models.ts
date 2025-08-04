import { google } from "@ai-sdk/google";
import { LanguageModelV1 } from "ai";

export const DEFAULT_MODEL = google("gemini-2.0-flash") as LanguageModelV1;
