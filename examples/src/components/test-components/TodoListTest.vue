<template>
  <div>
    <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
    <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
    <div v-else>
      <div data-testid="list-length">Items: {{ todoLength }}</div>
      <div style="margin-bottom: 10px; display: flex; gap: 8px; flex-wrap: wrap">
        <button data-testid="add-item-button" @click="handleAddItem">
          Add Item (End)
        </button>
        <button 
          data-testid="add-item-at-button" 
          @click="handleAddItemAt"
          :disabled="(todoLength ?? 0) === 0"
        >
          Add Item at Index 1
        </button>
        <button 
          data-testid="remove-instance-button" 
          @click="handleRemoveFirstInstance"
          :disabled="(todoLength ?? 0) === 0"
        >
          Remove First (by Instance)
        </button>
        <button 
          data-testid="remove-index-button" 
          @click="handleRemoveFirstByIndex"
          :disabled="(todoLength ?? 0) === 0"
        >
          Remove First (by Index)
        </button>
        <button 
          data-testid="swap-button" 
          @click="handleSwapItems"
          :disabled="(todoLength ?? 0) < 2"
        >
          Swap First Two
        </button>
      </div>
      <div data-testid="todo-items">
        <TodoItemComponent
          v-for="(item, index) in computedAllInstances"
          :key="item?.name ?? index"
          :index="index"
          :todo-item="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRive, useViewModelInstanceList, RiveComponent, useViewModelInstance, useViewModel } from '../../../../src';
import TodoItemComponent from './TodoItemComponent.vue';
import { computed } from 'vue';

interface Props {
  src: string;
}

const props = defineProps<Props>();

const riveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: "Artboard",
  autoBind: false,
  stateMachines: "State Machine 1",
});

const viewModel = useViewModel(riveController.rive);    
const viewModelInstance = useViewModelInstance(
  viewModel as any,
  riveController
);
// For now, use simplified approach
const {
  length: todoLength,
  addInstance: todoAddInstance,
  addInstanceAt: todoAddInstanceAt,
  removeInstance: todoRemoveInstance,
  removeInstanceAt: todoRemoveInstanceAt,
  getInstanceAt: todoGetInstanceAt,

  swap: todoSwap
} = useViewModelInstanceList('items', viewModelInstance as any);

const handleAddItem = () => {
  debugger;
  const todoItemViewModel = riveController.rive.value?.viewModelByName?.('TodoItem');
  if (todoItemViewModel) {
    const newTodoItem = todoItemViewModel.instance?.();
    if (newTodoItem) {
      todoAddInstance(newTodoItem);
    }
  }
};

const handleAddItemAt = () => {
  const todoItemViewModel = riveController.rive.value?.viewModelByName?.('TodoItem');
  if (todoItemViewModel && (todoLength.value ?? 0) > 0) {
    const newTodoItem = todoItemViewModel.instance?.();
    if (newTodoItem) {
      todoAddInstanceAt(newTodoItem, 1);
    }
  }
};

const handleRemoveFirstInstance = () => {
  const firstInstance = todoGetInstanceAt(0);
  if (firstInstance) {
    todoRemoveInstance(firstInstance);
  }
};

const handleRemoveFirstByIndex = () => {
  if ((todoLength.value ?? 0) > 0) {
    todoRemoveInstanceAt(0);
  }
};

const handleSwapItems = () => {
  if ((todoLength.value ?? 0) >= 2) {
    todoSwap(0, 1);
  }
};

const computedAllInstances = computed(() => {
  return Array.from({ length: todoLength.value ?? 0 }, (_, index) => todoGetInstanceAt(index));
});
</script> 