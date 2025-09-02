import type { Meta, StoryObj } from '@storybook/vue3';

import Events from './Events.vue';

const meta = {
  title: 'Rive Vue/Events',
  component: Events,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Events>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}; 