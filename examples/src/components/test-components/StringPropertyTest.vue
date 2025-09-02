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
        Name:
        <input
          data-testid="name-input"
          type="text"
          :value="name || ''"
          @input="setNameUpdate"
        />
      </label>
      <div data-testid="name-value">{{ name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useRive,
  useViewModel,
  useViewModelInstanceString,
  RiveComponent,
  useViewModelInstance,
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

const { value: name, setValue: setName } = useViewModelInstanceString(
  'name',
  viewModelInstance as any
);

const setNameUpdate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  setName(target.value);
};
</script>
