<template>
  <div>
    <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
    <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
    <div v-else>
      <label>
        Favorite Drink Type:
        <select
          data-testid="drink-type-select"
          :value="drinkType || ''"
          @change="setDrinkType(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="dt in drinkTypes" :key="dt" :value="dt">{{ dt }}</option>
        </select>
      </label>
      <div data-testid="drink-type-value">{{ drinkType }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRive, useViewModelInstanceEnum, RiveComponent, useViewModelInstance, useViewModel  } from '../../../../src';

interface Props {
  src: string;
}

const props = defineProps<Props>();

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
const { value: drinkType, setValue: setDrinkType, values: drinkTypes } = useViewModelInstanceEnum('favDrink/type', viewModelInstance as any);
</script> 