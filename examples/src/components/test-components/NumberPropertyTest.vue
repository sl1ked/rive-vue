<template>
  <div>
    <RiveComponent
      :rive-controller="riveController"
      style="width: 400px; height: 400px"
    />
    <div v-if="!riveController.rive.value" data-testid="loading-text">
      Loading…
    </div>
    <div v-else>
      <label>
        Age:
        <input
          data-testid="age-input"
          type="number"
          :value="age ?? 0"
          @input="setAge(Number(($event.target as HTMLInputElement).value))"
        />
      </label>
      <div data-testid="age-value">{{ age }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useRive,
  useViewModelInstanceNumber,
  RiveComponent,
  useViewModelInstance,
  useViewModel,
} from '../../../../src';

interface Props {
  src: string;
}

const props = defineProps<Props>();

const riveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: 'Artboard',
  autoBind: true,
  stateMachines: 'State Machine 1',
});

const viewModel = useViewModel(riveController.rive);

const viewModelInstance = useViewModelInstance(
  viewModel as any,
  riveController
);
const { value: age, setValue: setAge } = useViewModelInstanceNumber(
  'age',
  viewModelInstance as any,
  {
    executeWhenReady: riveController.executeWhenReady,
  }
);
</script>
