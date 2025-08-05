import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../../app/chat/conversation/[id]/spinner';

const meta = {
  title: 'Chat/Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};