import type { Meta, StoryObj } from '@storybook/vue3';

import DataBinding from './DataBinding.vue';

const meta = {
  title: 'Rive Vue/DataBinding',
  component: DataBinding,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof DataBinding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}; 