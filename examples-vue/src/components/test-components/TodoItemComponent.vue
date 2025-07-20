<template>
  <div 
    :data-testid="`todo-item-${index}`" 
    style="display: flex; align-items: center; gap: 10px; padding: 8px; border: 1px solid #ccc; margin-bottom: 4px"
  >
    <div v-if="!todoItem">Item not found</div>
    <template v-else>
      <input
        :data-testid="`todo-checkbox-${index}`"
        type="checkbox"
        :checked="isDone ?? false"
        @change="setIsDone(($event.target as HTMLInputElement).checked)"
      />
      <input
        :data-testid="`todo-text-${index}`"
        type="text"
        :value="text || ''"
        @input="setText(($event.target as HTMLInputElement).value)"
        style="flex: 1"
      />
      <div :data-testid="`todo-text-value-${index}`" style="font-size: 12px; color: #666">
        Text: {{ text }}
      </div>
      <div :data-testid="`todo-done-value-${index}`" style="font-size: 12px; color: #666">
        Done: {{ isDone ? 'true' : 'false' }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ViewModelInstance } from '@rive-app/canvas';
import { useViewModelInstanceString, useViewModelInstanceBoolean } from '../../../../src-vue';

interface Props {
  index: number;
  todoItem: ViewModelInstance | null;
}

const props = defineProps<Props>();

const { value: text, setValue: setText } = useViewModelInstanceString('text', props.todoItem);
const { value: isDone, setValue: setIsDone } = useViewModelInstanceBoolean('isDone', props.todoItem);
</script> 