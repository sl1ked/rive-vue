<template>
  <div>
    <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
    <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
    <div v-else>
      <button data-testid="submit-button" type="button" @click="handleSubmit">Submit</button>
      <button data-testid="reset-button" type="button" @click="handleReset">Reset</button>
      <div data-testid="callback-triggered">
        Last callback triggered: {{ callbackTriggered || 'none' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRive, useViewModelInstanceTrigger, RiveComponent, useViewModelInstance, useViewModel } from '@/';

interface Props {
  src: string;
}

const props = defineProps<Props>();

const callbackTriggered = ref('');

const riveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: "Artboard",
  autoBind: true,
  stateMachines: "State Machine 1",
});

const viewModel = useViewModel(riveController.rive);
const viewModelInstance = useViewModelInstance(
  viewModel as any,
  riveController
);
const { trigger: onSubmitTrigger } = useViewModelInstanceTrigger('onFormSubmit', viewModelInstance as any, {
  onTrigger: () => { callbackTriggered.value = 'submit-callback'; }
});

const { trigger: onResetTrigger } = useViewModelInstanceTrigger('onFormReset', viewModelInstance as any, {
  onTrigger: () => { callbackTriggered.value = 'reset-callback'; }
});

const handleSubmit = () => onSubmitTrigger();
const handleReset = () => onResetTrigger();
</script> 