import type { Meta, StoryObj } from '@storybook/vue3';
import { h } from 'vue';

import StringPropertyTest from './test-components/StringPropertyTest.vue';
import NumberPropertyTest from './test-components/NumberPropertyTest.vue';
import BooleanPropertyTest from './test-components/BooleanPropertyTest.vue';
import ColorPropertyTest from './test-components/ColorPropertyTest.vue';
import EnumPropertyTest from './test-components/EnumPropertyTest.vue';
import NestedViewModelTest from './test-components/NestedViewModelTest.vue';
import TriggerPropertyTest from './test-components/TriggerPropertyTest.vue';
import PersonForm from './test-components/PersonForm.vue';
import PersonInstances from './test-components/PersonInstances.vue';
import ImagePropertyTest from './test-components/ImagePropertyTest.vue';
import TodoListTest from './test-components/TodoListTest.vue';

const meta: Meta = {
    title: 'Tests/DataBinding Vue',
    parameters: {
        layout: 'centered',
    },
};

export default meta;

export const StringPropertyStory: StoryObj = {
    name: 'String Property',
    render: () => h(StringPropertyTest, { src: 'person_databinding_test.riv' }),
};

export const NumberPropertyStory: StoryObj = {
    name: 'Number Property',
    render: () => h(NumberPropertyTest, { src: 'person_databinding_test.riv' }),
};

export const BooleanPropertyStory: StoryObj = {
    name: 'Boolean Property',
    render: () => h(BooleanPropertyTest, { src: 'person_databinding_test.riv' }),
};

export const ColorPropertyStory: StoryObj = {
    name: 'Color Property',
    render: () => h(ColorPropertyTest, { src: 'person_databinding_test.riv' }),
};

export const EnumPropertyStory: StoryObj = {
    name: 'Enum Property',
    render: () => h(EnumPropertyTest, { src: 'person_databinding_test.riv' }),
};

export const NestedViewModelStory: StoryObj = {
    name: 'Nested ViewModel Property',
    render: () => h(NestedViewModelTest, { src: 'person_databinding_test.riv' }),
};

export const TriggerPropertyStory: StoryObj = {
    name: 'Trigger Property',
    render: () => h(TriggerPropertyTest, { src: 'person_databinding_test.riv' }),
};

export const PersonInstancesStory: StoryObj = {
    name: 'Person Instances',
    render: () => h(PersonInstances, { src: 'person_databinding_test.riv' }),
};

export const PersonFormStory: StoryObj = {
    name: 'Complete Person Form',
    render: () => h(PersonForm, { src: 'person_databinding_test.riv' }),
};

export const ImagePropertyStory: StoryObj = {
    name: 'Image Property',
    render: () => h(ImagePropertyTest, { src: 'image_db_test.riv' }),
};

export const TodoListStory: StoryObj = {
    name: 'Todo List Property',
    render: () => h(TodoListTest, { src: 'db_list_test.riv' }),
};
