import { MarkdownParser } from "./markdown-parser";

export const UserMessageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-6">
      <div className="message-user">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            You
          </span>
        </div>
        <div className="prose prose-indigo max-w-none">
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToolCallWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Tool
          </span>
        </div>
        <div className="prose prose-amber max-w-none text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
};

// export const NoParseToMarkdown = async ({
//   block,
//   "data-message-id": messageId,
// }: {
//   block: string;
//   "data-message-id"?: string;
// }) => {
//   return (
//     <>
//       <div
//         data-message-id={messageId}
//         className="animate-fade-in motion-safe:animate-fadeIn max-w-none whitespace-pre-wrap"
//       >
//         {block}
//       </div>
//     </>
//   );
// };

export const ParseToMarkdown = async ({
  block,
  "data-message-id": messageId,
}: {
  block: string;
  "data-message-id"?: string;
}) => {
  return (
    <div
      data-message-id={messageId}
      className="animate-fade-in motion-safe:animate-fadeIn max-w-none"
    >
      <MarkdownParser content={block} />
    </div>
  );
};
