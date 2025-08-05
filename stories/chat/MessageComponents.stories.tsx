import type { Meta, StoryObj } from '@storybook/react';
import { UserMessageWrapper, ToolCallWrapper } from '../../app/chat/conversation/[id]/render-message';

// Mock component for demonstration
const MessageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
    {children}
  </div>
);

const UserMessageMeta = {
  title: 'Chat/Components/UserMessage',
  component: UserMessageWrapper,
  decorators: [
    (Story) => (
      <MessageContainer>
        <Story />
      </MessageContainer>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserMessageWrapper>;

export default UserMessageMeta;
type UserMessageStory = StoryObj<typeof UserMessageMeta>;

export const ShortMessage: UserMessageStory = {
  args: {
    children: 'Hello, can you help me with my React project?',
  },
};

export const LongMessage: UserMessageStory = {
  args: {
    children: `I'm working on a complex React application and I'm running into some performance issues. 
    
The application has multiple routes, and I'm using React Router for navigation. Each route has its own set of components, and some of these components are quite heavy with data fetching and complex state management.

I've noticed that the initial page load is quite slow, and when users navigate between different routes, there's a noticeable lag. I've already implemented code splitting using React.lazy() and Suspense, but it doesn't seem to be helping much.

Could you provide some specific strategies for optimizing the performance of my React application?`,
  },
};

export const CodeMessage: UserMessageStory = {
  args: {
    children: `Here's the component I'm having trouble with:

\`\`\`jsx
const MyComponent = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
\`\`\`

The performance is really slow when the data array gets large.`,
  },
};

// Tool Call Wrapper Stories
const ToolCallMeta = {
  title: 'Chat/Components/ToolCall',
  component: ToolCallWrapper,
  decorators: [
    (Story) => (
      <MessageContainer>
        <Story />
      </MessageContainer>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToolCallWrapper>;

export const ToolCallDefault: StoryObj<typeof ToolCallMeta> = {
  args: {
    children: 'Executing web search for "React performance optimization"...',
  },
};

export const ToolCallWithResults: StoryObj<typeof ToolCallMeta> = {
  args: {
    children: `Search completed! Found 5 relevant articles about React performance optimization:

1. React Performance Best Practices - React Official Docs
2. Optimizing React Apps: A Complete Guide - Medium
3. React Performance Profiling with DevTools - CSS-Tricks
4. Memory Leaks in React Applications - LogRocket
5. React.memo and useMemo: When to Use Them - Kent C. Dodds`,
  },
};