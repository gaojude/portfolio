import type { Meta, StoryObj } from '@storybook/react';

// Mock components for Storybook
const NewChatMock = () => {
  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-3">
          AI Conversations
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Start meaningful conversations and explore ideas with AI assistance
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message and press Enter to start chatting..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
            <button
              type="submit"
              className="flex-shrink-0 p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Start chat"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConversationsListMock = ({ hasConversations = false }: { hasConversations?: boolean }) => {
  if (!hasConversations) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Start your first conversation and explore the possibilities of AI assistance
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Recent Conversations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: '1', preview: 'How do I implement a search feature in React?' },
          { id: '2', preview: 'Can you help me debug this TypeScript error?' },
          { id: '3', preview: 'What are the best practices for API design?' },
        ].map((conversation) => (
          <div key={conversation.id} className="group relative card-modern p-5">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed mb-1">
                  {conversation.preview}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {conversation.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PersonalContextMock = ({ hasContext = false }: { hasContext?: boolean }) => {
  if (!hasContext) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Personal Context
        </h2>

        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No personal context yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Share information about yourself to help AI provide more personalized responses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Personal Context
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          'I am a frontend developer working with React and TypeScript',
          'I prefer functional programming patterns',
          'I work remotely and collaborate with distributed teams',
        ].map((info, index) => (
          <div key={index} className="group relative card-modern p-5">
            <p className="text-sm text-gray-700 leading-relaxed pr-8">
              {info}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatPageLayout = ({ 
  hasConversations = false, 
  hasPersonalContext = false 
}: { 
  hasConversations?: boolean; 
  hasPersonalContext?: boolean; 
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <NewChatMock />
        <ConversationsListMock hasConversations={hasConversations} />
        <PersonalContextMock hasContext={hasPersonalContext} />
      </div>
    </div>
  );
};

const meta = {
  title: 'Chat/Pages/ChatPageLayout',
  component: ChatPageLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    hasConversations: {
      control: 'boolean',
      description: 'Whether to show existing conversations',
    },
    hasPersonalContext: {
      control: 'boolean',
      description: 'Whether to show personal context information',
    },
  },
} satisfies Meta<typeof ChatPageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyState: Story = {
  args: {
    hasConversations: false,
    hasPersonalContext: false,
  },
};

export const WithConversations: Story = {
  args: {
    hasConversations: true,
    hasPersonalContext: false,
  },
};

export const WithPersonalContext: Story = {
  args: {
    hasConversations: false,
    hasPersonalContext: true,
  },
};

export const FullState: Story = {
  args: {
    hasConversations: true,
    hasPersonalContext: true,
  },
};