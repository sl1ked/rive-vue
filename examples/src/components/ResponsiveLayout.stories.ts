import type { Meta, StoryObj } from '@storybook/vue3';

import ResponsiveLayout from './ResponsiveLayout.vue';

const meta = {
  title: 'Rive Vue/ResponsiveLayout',
  component: ResponsiveLayout,
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ResponsiveLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}; 