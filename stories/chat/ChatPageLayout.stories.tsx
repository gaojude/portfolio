import type { Meta, StoryObj } from '@storybook/react';
import { Suspense } from 'react';
import {
  NewChatTestable,
  ListConversationsTestable,
  PersonalContextTestable,
  type MockConversation
} from '../../app/components/chat-page-testable';
import {
  ConversationsLoadingSkeleton,
  PersonalContextLoadingSkeleton
} from '../../app/components/chat-loading-skeletons';

// Main layout component using imported testable components with mocked data
const ChatPageLayout = ({ 
  hasConversations = false, 
  hasPersonalContext = false 
}: { 
  hasConversations?: boolean; 
  hasPersonalContext?: boolean; 
}) => {
  const mockUserId = "user_mock123";
  
  // Mock data based on story parameters
  const mockConversations: MockConversation[] = hasConversations ? [
    { id: 'conv-12345678', preview: 'How do I implement a search feature in React?' },
    { id: 'conv-87654321', preview: 'Can you help me debug this TypeScript error?' },
    { id: 'conv-11223344', preview: 'What are the best practices for API design?' },
  ] : [];

  const mockUserInfo = hasPersonalContext ? [
    'I am a frontend developer working with React and TypeScript',
    'I prefer functional programming patterns',
    'I work remotely and collaborate with distributed teams',
  ] : [];
  
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <NewChatTestable userId={mockUserId} />
        
        <Suspense fallback={<ConversationsLoadingSkeleton />}>
          <ListConversationsTestable conversations={mockConversations} />
        </Suspense>

        <Suspense fallback={<PersonalContextLoadingSkeleton />}>
          <PersonalContextTestable userInfo={mockUserInfo} />
        </Suspense>
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