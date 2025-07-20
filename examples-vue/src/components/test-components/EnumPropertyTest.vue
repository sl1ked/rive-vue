<template>
  <div>
    <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
    <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
    <div v-else>
      <label>
        Country:
        <select
          data-testid="country-select"
          :value="country || ''"
          @change="setCountry(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <div data-testid="country-value">{{ country }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRive, useViewModelInstanceEnum, RiveComponent, useViewModelInstance, useViewModel  } from '../../../../src-vue';

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
const { value: country, setValue: setCountry, values: countries } = useViewModelInstanceEnum('country', viewModelInstance as any);
</script> 