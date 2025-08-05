import Redis from "ioredis";
import { v4 as uuid } from "uuid";
import { CoreMessage } from "ai";
import { auth } from "@clerk/nextjs/server";
import { ToolCalls } from "@/app/chat/conversation/[id]/tools/tool-call-group/tool-call-group";

type AiMessage = CoreMessage;

const URL = process.env.AI_MESSAGES_REDIS_REDIS_URL;

if (!URL) {
  throw new Error("AI_MESSAGES_REDIS_REDIS_URL is not set");
}

const redis = new Redis(URL);

// Types
export interface Conversation {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message extends Omit<AiMessage, "createdAt"> {
  id: string;
  conversationId: string;
  createdAt: number;
}

// Redis Schema
// ------------
// conversation:{id} -> JSON string of Conversation object
//   - Stores individual conversation data
//
// conversation:{conversationId}:messages -> List of Message IDs
//   - Stores message IDs in chronological order
//
// user:{userId}:conversations -> Sorted Set of Conversation IDs
//   - Maps user to their conversations
//   - Score: timestamp (for chronological ordering)
//   - Value: conversationId
//
// message:{id} -> JSON string of Message object
//   - Stores individual message data

// Conversation helpers
export async function createConversation({
  userId,
}: {
  userId: string;
}): Promise<Conversation> {
  const conversationId = uuid();
  const now = Date.now();
  const conversation: Conversation = {
    id: conversationId,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  await redis.set(
    `conversation:${conversationId}`,
    JSON.stringify(conversation)
  );

  await redis.zadd(`user:${userId}:conversations`, now, conversationId);

  return conversation;
}

export async function getConversationsByUser(
  userId: string
): Promise<Conversation[]> {
  // Get all conversation IDs for this user in reverse chronological order (newest first)
  // We use a sorted set (zset) with timestamp as score to maintain conversation order
  // In Redis, 0 is the start index and -1 means "until the end of the list"
  const ids = await redis.zrevrange(`user:${userId}:conversations`, 0, -1);
  if (!ids.length) return [];

  const conversations = await Promise.all(
    ids.map((id) => redis.get(`conversation:${id}`))
  );

  return conversations.filter(Boolean).map((str) => JSON.parse(str!));
}

export async function getConversationById(
  id: string
): Promise<Conversation | null> {
  const conversation = await redis.get(`conversation:${id}`);
  return conversation ? JSON.parse(conversation) : null;
}

export async function deleteConversation(
  conversationId: string,
  userId: string
): Promise<void> {
  await redis.del(`conversation:${conversationId}`);
  await redis.zrem(`user:${userId}:conversations`, conversationId);
  await deleteMessagesByConversation(conversationId);
  await deleteToolCallGroupsByConversation(conversationId);
}

export async function createMessage({
  conversationId,
  aiMessage,
}: {
  conversationId: string;
  aiMessage: Omit<AiMessage, "createdAt" | "id">;
}): Promise<Message> {
  const messageId = uuid();
  const now = Date.now();

  const message: Message = {
    ...aiMessage,
    id: messageId,
    conversationId,
    createdAt: now,
  } as const;

  await redis.set(`message:${messageId}`, JSON.stringify(message));
  await redis.rpush(`conversation:${conversationId}:messages`, messageId);

  // Update conversation's updatedAt and its position in the sorted set
  const conversation = await getConversationById(conversationId);
  if (conversation) {
    conversation.updatedAt = now;
    await redis.set(
      `conversation:${conversationId}`,
      JSON.stringify(conversation)
    );
    // Update the score in the sorted set to reflect new updatedAt
    await redis.zadd(
      `user:${conversation.userId}:conversations`,
      now,
      conversationId
    );
  }

  return message;
}

export async function getMessagesByConversation(
  conversationId: string
): Promise<Message[]> {
  const messageIds = await redis.lrange(
    `conversation:${conversationId}:messages`,
    0,
    -1
  );
  if (!messageIds.length) return [];

  const messages = await Promise.all(
    messageIds.map((id) => redis.get(`message:${id}`))
  );

  return messages.filter(Boolean).map((str) => JSON.parse(str!));
  // .sort(
  //   (a, b) =>
  //     new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  // ); // TODO: this sort is probably not needed, because we add messages in order
}

export async function getFirstMessageOfConversation(
  conversationId: string
): Promise<Message | null> {
  const messageIds = await redis.lrange(
    `conversation:${conversationId}:messages`,
    0,
    0
  );

  if (!messageIds.length) return null;

  const messageStr = await redis.get(`message:${messageIds[0]}`);
  if (!messageStr) return null;

  return JSON.parse(messageStr);
}

export async function deleteMessagesByConversation(
  conversationId: string
): Promise<void> {
  const messageIds = await redis.lrange(
    `conversation:${conversationId}:messages`,
    0,
    -1
  );
  if (messageIds.length) {
    const keys = messageIds.map((id) => `message:${id}`);
    await redis.del(...keys);
  }
  await redis.del(`conversation:${conversationId}:messages`);
}

// REMINDERS
// A user can have multiple reminders
// Each reminder now has just a content field, but keep it flexible

export interface Reminder {
  id: string;
  content: string;
  createdAt: number;
}

const getUserId = async (): Promise<string> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
};

/**
 * Adds a reminder for a user
 * @param content The content of the reminder
 * @returns The created reminder object
 */
export async function addReminder(content: string): Promise<Reminder> {
  const userId = await getUserId();
  const id = uuid();
  const reminder: Reminder = {
    id,
    content,
    createdAt: Date.now(),
  };

  // Store the reminder
  await redis.set(`reminder:${id}`, JSON.stringify(reminder));

  // Add the reminder ID to the user's list of reminders
  await redis.lpush(`user:${userId}:reminders`, id);

  return reminder;
}

/**
 * Lists all reminders for a user
 * @returns Array of reminder objects
 */
export async function listAllReminders(): Promise<Reminder[]> {
  const userId = await getUserId();

  // Get all reminder IDs for the user
  const reminderIds = await redis.lrange(`user:${userId}:reminders`, 0, -1);
  if (!reminderIds.length) return [];

  // Fetch all reminders
  const reminders = await Promise.all(
    reminderIds.map((id) => redis.get(`reminder:${id}`))
  );

  // Parse and return the reminders
  return reminders
    .filter(Boolean)
    .map((str) => JSON.parse(str!))
    .sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
}

/**
 * Deletes a specific reminder
 * @param userId The ID of the user
 * @param reminderId The ID of the reminder to delete
 * @returns Boolean indicating whether the deletion was successful
 */
export async function deleteReminder(reminderId: string): Promise<boolean> {
  const userId = await getUserId();

  // Remove the reminder from the user's list
  const removed = await redis.lrem(`user:${userId}:reminders`, 1, reminderId);

  // If the reminder wasn't in the user's list, return false
  if (removed === 0) {
    return false;
  }

  // Delete the reminder object
  await redis.del(`reminder:${reminderId}`);

  return true;
}

/**
 * Updates a specific reminder's content
 * @param userId The ID of the user
 * @param reminderId The ID of the reminder to update
 * @param content The new content for the reminder
 * @returns Boolean indicating whether the update was successful
 */
export async function updateReminder(
  reminderId: string,
  content: string
): Promise<boolean> {
  // TODO: add authentication check, you should not be able to edit other people's reminder content!

  // Get the existing reminder
  const reminderStr = await redis.get(`reminder:${reminderId}`);
  if (!reminderStr) {
    return false;
  }

  // Parse the reminder
  const reminder = JSON.parse(reminderStr) as Reminder;

  // Update the reminder
  reminder.content = content;
  reminder.createdAt = Date.now();

  // Save the updated reminder
  await redis.set(`reminder:${reminderId}`, JSON.stringify(reminder));

  return true;
}



export async function deleteAllConversations(userId: string): Promise<void> {
  // Get all conversation IDs for this user
  const conversationIds = await redis.zrange(
    `user:${userId}:conversations`,
    0,
    -1
  );

  // Delete each conversation and its messages
  await Promise.all(
    conversationIds.map(async (conversationId) => {
      await deleteConversation(conversationId, userId);
    })
  );
}

/**
 * Tool Call Group Types and Database Methods
 * ----------------------------------------
 * A ToolCallGroup represents a set of related tool calls and their results.
 * Each group is identified by the toolCallId of its first tool call.
 *
 * Redis Schema:
 * - toolCallGroup:{toolCallId} -> JSON string of ToolCallGroup object
 *   - Stores the complete tool call group data including calls and results
 * - conversation:{conversationId}:toolCallGroups -> Set of ToolCallGroup IDs
 *   - Maps conversations to their tool call groups for efficient cleanup
 */

export interface ToolCallGroup {
  userId: string; // Owner of the tool call group
  conversationId: string; // Associated conversation
  toolCalls: ToolCalls; // Original tool calls from the LLM
  toolCallResults: Array<{
    type: "tool-result";
    toolCallId: string; // Matches the corresponding tool call
    toolName: string; // Name of the tool that was called
    args: unknown; // Arguments passed to the tool
    result: unknown; // Result of the tool call (null if not completed)
    $completed: boolean; // Whether the tool call has been completed
  }>;
}

/**
 * Creates a new tool call group for a set of tool calls.
 * Initializes all tool call results as incomplete.
 *
 * @param userId - The ID of the user who owns the tool call group
 * @param conversationId - The ID of the conversation this group belongs to
 * @param toolCalls - The array of tool calls from the LLM
 * @returns The created tool call group
 */
export async function createToolCallGroup({
  conversationId,
  toolCalls,
}: {
  conversationId: string;
  toolCalls: ToolCalls;
}): Promise<ToolCallGroup> {
  const userId = await getUserId();
  // Use the first tool call's ID as the group ID
  const toolCallGroupId = toolCalls[0].toolCallId;
  const toolCallGroup: ToolCallGroup = {
    userId,
    conversationId,
    toolCalls,
    toolCallResults: toolCalls.map(
      (toolCall: { toolCallId: string; toolName: string; args: unknown }) => ({
        type: "tool-result",
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCall.args,
        result: null,
        $completed: false,
      })
    ),
  };

  // Use Redis transaction to ensure atomic updates
  const multi = redis.multi();
  multi.set(`toolCallGroup:${toolCallGroupId}`, JSON.stringify(toolCallGroup));
  multi.sadd(`conversation:${conversationId}:toolCallGroups`, toolCallGroupId);
  await multi.exec();

  return toolCallGroup;
}

/**
 * Retrieves a tool call group by its ID.
 * Performs user authorization check to ensure the requesting user owns the group.
 *
 * @param toolCallGroupId - The ID of the tool call group (first tool call's ID)
 * @returns The tool call group if found and authorized, null otherwise
 * @throws Error if unauthorized access is attempted
 */
export async function getToolCallGroup(
  toolCallGroupId: string
): Promise<ToolCallGroup | null> {
  const toolCallGroupStr = await redis.get(`toolCallGroup:${toolCallGroupId}`);
  if (!toolCallGroupStr) return null;

  const toolCallGroup = JSON.parse(toolCallGroupStr) as ToolCallGroup;

  const userId = await getUserId();
  if (toolCallGroup.userId !== userId) {
    throw new Error("Unauthorized access to tool call group");
  }

  return toolCallGroup;
}

/**
 * Retrieves an existing tool call group or creates a new one if it doesn't exist.
 * This is useful when you want to ensure a tool call group exists before performing operations.
 *
 * @param conversationId - The ID of the conversation this group belongs to
 * @param toolCalls - The array of tool calls from the LLM
 * @returns The existing or newly created tool call group
 */
export async function getOrCreateToolCallGroup({
  conversationId,
  toolCalls,
}: {
  conversationId: string;
  toolCalls: ToolCalls;
}): Promise<ToolCallGroup> {
  const toolCallGroupId = toolCalls[0].toolCallId;
  const existingGroup = await getToolCallGroup(toolCallGroupId);

  if (existingGroup) {
    return existingGroup;
  }

  return createToolCallGroup({
    conversationId,
    toolCalls,
  });
}

/**
 * Completes a specific tool call within a tool call group.
 * Updates the result and marks the tool call as completed.
 * Performs validation to ensure:
 * - The tool call group exists
 * - The user is authorized
 * - The tool call exists in the group
 * - The tool call hasn't already been completed
 *
 * @param toolCallGroupId - The ID of the tool call group
 * @param toolCallId - The ID of the specific tool call to complete
 * @param result - The result of the tool call
 * @returns The updated tool call group
 * @throws Error if any validation fails
 */

export interface CompleteToolCallPayload {
  toolCallGroupId: string;
  toolCallId: string;
  result: unknown;
}

export async function completeToolCall({
  toolCallGroupId,
  toolCallId,
  result,
}: CompleteToolCallPayload): Promise<ToolCallGroup> {
  const toolCallGroup = await getToolCallGroup(toolCallGroupId);
  if (!toolCallGroup) {
    throw new Error("Tool call group not found");
  }

  const toolCallResultIndex = toolCallGroup.toolCallResults.findIndex(
    (r) => r.toolCallId === toolCallId
  );
  if (toolCallResultIndex === -1) {
    throw new Error("Tool call not found in group");
  }

  if (toolCallGroup.toolCallResults[toolCallResultIndex].$completed) {
    throw new Error("Tool call already completed");
  }

  toolCallGroup.toolCallResults[toolCallResultIndex] = {
    ...toolCallGroup.toolCallResults[toolCallResultIndex],
    result,
    $completed: true,
  };

  await redis.set(
    `toolCallGroup:${toolCallGroupId}`,
    JSON.stringify(toolCallGroup)
  );

  return toolCallGroup;
}

/**
 * Deletes all tool call groups associated with a conversation.
 * Used when cleaning up a conversation to prevent orphaned tool call groups.
 *
 * @param conversationId - The ID of the conversation to clean up
 */
export async function deleteToolCallGroupsByConversation(
  conversationId: string
): Promise<void> {
  const toolCallGroupIds = await redis.smembers(
    `conversation:${conversationId}:toolCallGroups`
  );
  if (toolCallGroupIds.length) {
    const multi = redis.multi();
    toolCallGroupIds.forEach((id) => {
      multi.del(`toolCallGroup:${id}`);
    });
    multi.del(`conversation:${conversationId}:toolCallGroups`);
    await multi.exec();
  }
}

export interface Notes {
  id: string;
  markdown: string;
  createdAt: number;
}

/**
 * Creates a new notes entry
 * @param markdown The markdown content of the notes
 * @returns The created notes object
 */
export async function createNotes(markdown: string): Promise<Notes> {
  const id = uuid();
  const notes: Notes = {
    id,
    markdown,
    createdAt: Date.now(),
  };

  // Store the notes
  await redis.set(`notes:${id}`, JSON.stringify(notes));
  // Add to the list of all notes
  await redis.zadd("notes:all", notes.createdAt, id);

  return notes;
}

/**
 * Retrieves notes by ID
 * @param id The ID of the notes to retrieve
 * @returns The notes object if found, null otherwise
 */
export async function getNotesById(id: string): Promise<Notes | null> {
  const notes = await redis.get(`notes:${id}`);
  return notes ? JSON.parse(notes) : null;
}

/**
 * Lists all notes in reverse chronological order
 * @returns Array of notes objects
 */
export async function listAllNotes(): Promise<Notes[]> {
  // Get all note IDs in reverse chronological order (newest first)
  const ids = await redis.zrevrange("notes:all", 0, -1);
  if (!ids.length) return [];

  const notes = await Promise.all(ids.map((id) => redis.get(`notes:${id}`)));

  return notes.filter(Boolean).map((str) => JSON.parse(str!));
}

interface TranslatedStory {
  id: number;
  title: string;
  translatedTitle: string;
  translatedContent: string;
  url: string;
  createdAt: number;
}

/**
 * Stores a translated story in Redis
 * @param storyId The original story ID
 * @param title The original story title
 * @param translatedTitle The translated title
 * @param translatedContent The translated content
 * @param url The original story URL
 * @returns The stored translated story object
 */
export async function storeTranslatedStory(
  storyId: number,
  title: string,
  translatedTitle: string,
  translatedContent: string,
  url: string
): Promise<TranslatedStory> {
  const story: TranslatedStory = {
    id: storyId,
    title,
    translatedTitle,
    translatedContent,
    url,
    createdAt: Date.now(),
  };

  // Store the translated story
  await redis.set(`story:translated:${storyId}`, JSON.stringify(story));
  // Add to the list of all translated stories
  await redis.zadd("stories:translated:all", story.createdAt, storyId);

  return story;
}

/**
 * Retrieves a translated story by ID
 * @param storyId The ID of the story to retrieve
 * @returns The translated story object if found, null otherwise
 */
export async function getTranslatedStory(
  storyId: number
): Promise<TranslatedStory | null> {
  const story = await redis.get(`story:translated:${storyId}`);
  return story ? JSON.parse(story) : null;
}

/**
 * Gets all translated story IDs in reverse chronological order
 * @returns Array of story IDs
 */
export async function getTranslatedStoryIds(): Promise<number[]> {
  // Get all story IDs from the sorted set in reverse chronological order
  const ids = await redis.zrevrange("stories:translated:all", 0, -1);
  return ids.map((id) => parseInt(id, 10));
}

/**
 * Lists all translated stories in reverse chronological order
 * @returns Array of translated story objects
 */
export async function listAllTranslatedStories(): Promise<TranslatedStory[]> {
  // Get all story IDs in reverse chronological order (newest first)
  const ids = await redis.zrevrange("stories:translated:all", 0, -1);
  if (!ids.length) return [];

  const stories = await Promise.all(
    ids.map((id) => redis.get(`story:translated:${id}`))
  );

  return stories.filter(Boolean).map((str) => JSON.parse(str!));
}

/**
 * Removes all translated stories and their associated indices from Redis
 * @returns Promise that resolves when cleanup is complete
 */
export async function cleanAllTranslations(): Promise<void> {
  // Get all story IDs from the sorted set
  const ids = await redis.zrange("stories:translated:all", 0, -1);

  // Delete individual story records in batches to avoid command length limits
  const BATCH_SIZE = 100;
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const deleteKeys = batch.map((id) => `story:translated:${id}`);
    if (deleteKeys.length) {
      await redis.del(...deleteKeys);
    }
  }

  // Delete the sorted set containing all story IDs
  await redis.del("stories:translated:all");

  // Verify cleanup
  const remainingIds = await redis.zrange("stories:translated:all", 0, -1);
  const remainingKeys = await redis.keys("story:translated:*");

  if (remainingIds.length > 0 || remainingKeys.length > 0) {
    console.error("Failed to clean all translations");
    console.error(
      `Remaining IDs: ${remainingIds.length}, Remaining keys: ${remainingKeys.length}`
    );
    throw new Error("Failed to clean all translations");
  }

  console.log("Successfully cleaned all translations");
}
