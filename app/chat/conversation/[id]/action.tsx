"use server";

import {
  createMessage,
  getMessagesByConversation,
  Message,
} from "@/app/db/redis";
import React, { ReactNode, Suspense } from "react";
import { v4 as uuid } from "uuid";
import { AssistantMessageWrapperV2 } from "./assistant-message-wrapper-v2";
import { DeleteAllNodesWithMessageId } from "./delete-all-nodes-with-message-id";
import { createMarkdownBlockGeneratorFromLlmReader } from "./parser";
import { ParseToMarkdown, UserMessageWrapper } from "./render-message";
import { Spinner } from "./spinner";
import { getLlmStream } from "./tools/llm";
import {
  ToolCallGroup,
  ToolCalls,
} from "./tools/tool-call-group/tool-call-group";

const getMessages = async (conversationId: string): Promise<Message[]> => {
  const messages = await getMessagesByConversation(conversationId);
  console.log(JSON.stringify(messages, null, 2));
  return messages;
};

const isToolCallMessage = (message: Message) => {
  return (
    message.role === "assistant" &&
    Array.isArray(message.content) &&
    message.content.length > 0 &&
    message.content[0].type === "tool-call"
  );
};
//////////
/**
 * Client appends a new user message for a specific conversation.
 * Server sends the chat history + the new message to the LLM.
 *
 * This action returns new messages back to client in a streamable fashion:
 * 1. It immediately returns a new user message, reiterating the received message.
 * 2. It then streams the LLM response, appending to the response buffer.
 */
export const getMessageReactNode = async (
  conversationId: string,
  // If messageContent is null, it will generate a new message from the assistant
  // based on the chat history. Otherwise, it will first save the messageContent
  // as a user message to the DB, and then generate a new message from the assistant
  // based on the chat history + the new user message.
  messageContent: string | null
): Promise<ReactNode> => {
  const messages = await getMessages(conversationId);
  const lastMessage = messages.at(-1);

  if (
    messageContent !== null &&
    lastMessage &&
    isToolCallMessage(lastMessage)
  ) {
    return (
      <div className="flex items-start mb-4">
        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex-shrink-0 mr-3 flex items-center justify-center text-sm font-semibold">
          !
        </div>
        <div className="max-w-[85%] bg-red-50 p-3 rounded-lg shadow-sm border-l-4 border-red-300 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-2 text-red-700 font-medium">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                key="warning-path-1"
              />
            </svg>
            Cannot Send Message
          </div>
          <p className="text-gray-700">
            Please complete the pending tool call interactions before sending a
            new message.
          </p>
        </div>
      </div>
    );
  }

  const newUserMessage: Message | null =
    messageContent !== null
      ? await createMessage({
          conversationId,
          aiMessage: {
            role: "user",
            content: messageContent,
          },
        })
      : null;

  const llmStream = await getLlmStream([
    ...messages,
    ...(newUserMessage ? [newUserMessage] : []),
  ]);


  const StreamAssistantMessage = async () => {
    // For a new message to LLM, you need to send all previous messages
    // Perf bottleneck: await getMessages(conversationId)
    const llmReader = llmStream.textStream.getReader();

    // wait until the llmReader outputs a newline
    // we define the parts separated by newlines as "blocks"
    // this is like a transform stream that converts the
    // LLM stream into a stream of blocks
    const generateBlocks = createMarkdownBlockGeneratorFromLlmReader(llmReader);

    const newMessageId = uuid();

    let isFirstChunk = true;

    const StreamableParse = async ({
      accumulator = "",
    }: {
      accumulator?: string;
    }) => {
      const { done, value: block } = await generateBlocks.next();

      // the stream is empty, weird, so we just stop!
      if (isFirstChunk && done) {
        return null;
      }

      if (done) {
        await createMessage({
          conversationId,
          aiMessage: {
            content: accumulator,
            role: "assistant",
          },
        });

        return (
          <>
            <DeleteAllNodesWithMessageId messageId={newMessageId.toString()} />
            <ParseToMarkdown block={accumulator} />
          </>
        );
      }

      const Wrapper = isFirstChunk ? AssistantMessageWrapperV2 : React.Fragment;
      isFirstChunk = false;

      return (
        <Wrapper>
          <ParseToMarkdown
            data-message-id={newMessageId.toString()}
            block={block}
          />
          <Suspense
            fallback={
              <>
                <span id="spinner" />
              </>
            }
          >
            <StreamableParse
              accumulator={
                accumulator.length === 0 ? block : accumulator + "\n\n" + block
              }
            />
          </Suspense>
        </Wrapper>
      );
    };

    return <StreamableParse />;
  };

  // const {
  //   promise: allToolCallResultsSavedPromise,
  //   resolve: allToolCallResultsSaved,
  // } = withResolvers<{
  //   numberOfToolCalls: number;
  // }>();

  const StreamToolCalls = async () => {
    const toolCalls = await llmStream.toolCalls;

    if (toolCalls.length === 0) {
      return null;
    }

    // save tool_calls (the instruction to call the tools) to DB first
    await createMessage({
      conversationId,
      aiMessage: {
        role: "assistant",
        content: toolCalls,
      },
    });

    return (
      <ToolCallGroup conversationId={conversationId} toolCalls={toolCalls} />
    );

    // if (toolCalls.length === 0) {
    //   allToolCallResultsSaved({
    //     numberOfToolCalls: 0,
    //   });
    //   return null;
    // }

    // // save tool_calls (the instruction to call the tools) to DB first
    // await createMessage({
    //   conversationId,
    //   aiMessage: {
    //     role: "assistant",
    //     content: toolCalls,
    //   },
    // });

    // const resultResolvers = toolCalls.map(() => withResolvers<unknown>());

    // // we only un-suspend MessageAfterToolCallResults component after all
    // // tool calls have received their results
    // Promise.all(resultResolvers.map((r) => r.promise)).then((results) => {
    //   // save the output from all tool calls to DB in one go, this is the expected
    //   // schema from the API.
    //   createMessage({
    //     conversationId,
    //     aiMessage: {
    //       role: "tool",
    //       content: toolCalls.map((t, index) => ({
    //         type: "tool-result",
    //         toolCallId: t.toolCallId,
    //         toolName: t.toolName,
    //         args: t.args,
    //         result: results[index],
    //       })),
    //     },
    //   }).then(() => {
    //     allToolCallResultsSaved({
    //       numberOfToolCalls: toolCalls.length,
    //     });
    //   });
    // });

    // return toolCalls.map((toolCall, index) => {
    //   const RenderToolCall = async () => {
    //     const toolCallResultSaved = <T,>(result: T) => {
    //       resultResolvers[index].resolve(result);
    //     };

    //     const { toolName, args } = toolCall;

    //     // TODO: Typically, MessageAfterToolCallResults is suspended until
    //     // this callback resolves the promise. So, if this callback resolves
    //     // the promise after the streaming times out, the chat will be
    //     // in a broken state. Specifically, this would mean that this method
    //     // CANNOT support client components resolving the promise because
    //     // client components may be resolved at an arbitrary time in the future,
    //     // like in a click handler, and the streaming may have already timed out.
    //     const saveToolCallResult = async <RESULT,>(result: RESULT) => {
    //       "use server";
    //       toolCallResultSaved(result);
    //     };

    //     const result = await EXECUTE_TOOLS[
    //       toolName as keyof typeof EXECUTE_TOOLS
    //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     ](args as any, saveToolCallResult);
    //     // TODO: fix type safety
    //     return (
    //       <ToolCallWrapper>
    //         <ToolCallProvider
    //           conversationId={conversationId}
    //           toolCall={toolCall}
    //         >
    //           {result}
    //         </ToolCallProvider>
    //       </ToolCallWrapper>
    //     );
    //   };
    //   return (
    //     <Suspense fallback={<Spinner />} key={toolCall.toolCallId}>
    //       <RenderToolCall />
    //     </Suspense>
    //   );
    // });
  };

  // // If AI returns a function_call instruction, we need to first call the function
  // // with given parameters, and then append the instruction + the result to the chat history.
  // // And then, we recursively get the next message AGAIN from the LLM.
  // const MessageAfterToolCallResults = async () => {
  //   const { numberOfToolCalls } = await allToolCallResultsSavedPromise;
  //   // shouldRefresh is set to true only when the last response is a function_call
  //   // and we need to append the result of the function_call to the chat history
  //   // and then ask LLM to produce one more output from there.
  //   // otherwise, we just do nothing (to avoid infinite loops)
  //   if (numberOfToolCalls > 0) {
  //     return <GetNewResponse />;
  //   }
  //   return null;
  // };

  return (
    <>
      {messageContent !== null ? (
        <UserMessageWrapper>
          {messageContent}
        </UserMessageWrapper>
      ) : null}
      <Suspense fallback={<Spinner />}>
        <StreamAssistantMessage />
      </Suspense>
      <Suspense fallback={null}>
        <StreamToolCalls />
      </Suspense>
      {/* <Suspense fallback={null}>
        <MessageAfterToolCallResults />
      </Suspense> */}
    </>
  );
};

export const getInitialMessagesReactNode = async (
  conversationId: string
): Promise<ReactNode> => {
  const messages = await getMessages(conversationId);
  return (
    <>
      {messages.map((message, index) => {
        if (
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.length > 0
        ) {
          const Wrapper =
            message.role === "user"
              ? UserMessageWrapper
              : AssistantMessageWrapperV2;

          return (
            <Wrapper key={index}>
              <ParseToMarkdown block={message.content} />
            </Wrapper>
          );
        }

        if (
          message.role === "assistant" &&
          Array.isArray(message.content) &&
          message.content.length > 0 &&
          message.content[0].type === "tool-call"
        ) {
          return (
            <ToolCallGroup
              key={index}
              toolCalls={message.content as ToolCalls}
              conversationId={conversationId}
            />
          );
        }
        // after refreshing the tab, we will lose the UI for the tool calls,
        // but the AI should have gotten the result of the tool calls, so we
        // don't need to do anything here. however, it would be ideal to
        // reproduce the UI for the tool calls after refreshing the tab.
        return null;
      })}
    </>
  );
};

/**
 * Creates a promise with externally accessible resolve and reject functions.
 * Useful for coordinating asynchronous operations that need to be resolved
 * from outside the promise's executor function.
 */
// function withResolvers<T>() {
//   let resolve: (value: T | PromiseLike<T>) => void;
//   let reject: (reason?: unknown) => void;

//   const promise = new Promise<T>((res, rej) => {
//     resolve = res;
//     reject = rej;
//   });

//   return {
//     promise,
//     resolve: resolve!,
//     reject: reject!,
//   };
// }
