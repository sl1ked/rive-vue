import type { Meta, StoryObj } from '@storybook/vue3';

import Http from './Http.vue';

const meta = {
  title: 'Rive Vue/Http',
  component: Http,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof Http>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}; 