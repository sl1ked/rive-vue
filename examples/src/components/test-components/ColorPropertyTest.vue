<template>
  <div>
    <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
    <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
    <div v-else>
      <label>
        Favorite Color:
        <div 
          data-testid="color-value" 
          :style="{ 
            backgroundColor: colorNumberToHexString(colorNum), 
            width: '20px', 
            height: '20px', 
            display: 'inline-block', 
            marginLeft: '10px' 
          }"
        ></div>
        <div data-testid="number-value">
          Number value: {{ typeof colorNum === 'number' ? colorNum : 'N/A' }}
        </div>
        <div data-testid="hex-value">
          Hex value: {{ colorNumberToHexString(colorNum) }}
        </div>
      </label>
      <button
        data-testid="set-color-red"
        type="button"
        @click="setRgb(255, 0, 0)"
      >
        Red
      </button>
      <button
        data-testid="set-color-blue"
        type="button"
        @click="setRgb(0, 0, 255)"
      >
        Blue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRive, useViewModelInstanceColor, RiveComponent, useViewModelInstance, useViewModel } from '../../../../src';

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

const { value: colorNum, setValue: setColor, setRgb } = useViewModelInstanceColor('favColor', viewModelInstance as any);

const colorNumberToHexString = (colorNum: number | null) => {
  debugger;
  if (colorNum === null) return 'N/A';
  const unsignedInt = colorNum >>> 0;
  const r = (unsignedInt >> 16) & 0xff;
  const g = (unsignedInt >> 8) & 0xff;
  const b = unsignedInt & 0xff;
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
</script> 