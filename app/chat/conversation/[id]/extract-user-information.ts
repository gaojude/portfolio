// Given a message, ask GPT to extract user information from it.
// For example, if the message is "I'm in Toronto. How's the weather today?",
// the extracted information should be something like "The user lives in Toronto".

import { generateObject } from "ai";
import { DEFAULT_MODEL } from "@/lib/models";
import { z } from "zod";
import { addUserInformation } from "@/app/db/redis";

// Define the schema for the structured output
const UserInformationSchema = z.object({
  found: z.boolean(),
  information: z.string().optional(),
});

type UserInformation = z.infer<typeof UserInformationSchema>;

export async function extractUserInformation(
  message: string
): Promise<UserInformation> {
  const { object } = await generateObject({
    model: DEFAULT_MODEL,
    schema: UserInformationSchema,
    messages: [
      {
        role: "system",
        content: `
        You are a helpful assistant that extracts user information from a message.
        Your task is to identify personal details the user reveals about themselves.
        Extract only factual information that could be useful for personalization.
        
        Examples:
        - If user says: "I'm in Toronto. How's the weather today?" → found: true, information: "The user lives in Toronto"
        - If user says: "What's the weather like?" → found: false
        
        Return structured data with 'found' boolean and 'information' string if found.
        If no personal information is found, set found to false.
        `,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  // If information was found, store it in the database
  if (object.found && object.information) {
    await addUserInformation(object.information);
  }

  return object;
}
