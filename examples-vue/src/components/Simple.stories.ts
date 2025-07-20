import type { Meta, StoryObj } from '@storybook/vue3';

import Simple from './Simple.vue';

const meta = {
  title: 'Rive Vue/Simple',
  component: Simple,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Simple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}; 