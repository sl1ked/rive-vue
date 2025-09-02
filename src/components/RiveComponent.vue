<script setup lang="ts">
import { computed, useAttrs, ref, watch, nextTick, onMounted } from 'vue';
import type { Rive } from '@rive-app/canvas';
import { Fit } from '@rive-app/canvas';
import { useCanvasResize } from '../composables/useCanvasResize';
import useDevicePixelRatio from '../composables/useDevicePixelRatio';
import '../styles/index.css';

import type { ComputedRef } from 'vue';

export interface RiveComponentProps {
  riveController: {
    rive: ComputedRef<Rive | null>;
    isLoaded: ComputedRef<boolean>;
    createRiveInstance: (canvas: HTMLCanvasElement) => Rive | null;
    options: ComputedRef<any>;
  } | null;
  shouldResizeCanvasToContainer?: boolean;
}

const props = withDefaults(defineProps<RiveComponentProps>(), {
  shouldResizeCanvasToContainer: true,
});

const attrs = useAttrs();

// Create refs for template
const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const devicePixelRatio = useDevicePixelRatio();

// Container styling
const containerClass = computed(() => attrs.class as string);

const containerStyle = computed(() => {
  if (attrs.class) {
    return attrs.style as any;
  }

  return {
    width: '100%',
    height: '100%',
    ...(typeof attrs.style === 'object' ? attrs.style : {}),
  };
});

// Canvas styling
const canvasStyle = computed(() => ({
  verticalAlign: 'top',
  width: '0px',
  height: '0px',
}));

// Callback for when canvas has been resized
const onCanvasHasResized = () => {
  if (props.riveController?.rive.value && canvasRef.value) {
    const rive = props.riveController.rive.value;
    if (rive.layout && rive.layout.fit === Fit.Layout) {
      const resizeFactor =
        devicePixelRatio.value * rive.layout.layoutScaleFactor;
      rive.devicePixelRatioUsed = devicePixelRatio.value;
      rive.artboardWidth = canvasRef.value.width / resizeFactor;
      rive.artboardHeight = canvasRef.value.height / resizeFactor;
    }

    rive.startRendering();
    rive.resizeToCanvas();
  }
};

useCanvasResize(canvasRef, containerRef, {
  enabled: computed(() => props.shouldResizeCanvasToContainer),
  devicePixelRatio: devicePixelRatio,
  riveLoaded: computed(() => props.riveController?.isLoaded.value ?? false),
  onResize: onCanvasHasResized,
});

onMounted(() => {
  if (
    canvasRef.value &&
    containerRef.value &&
    props.riveController &&
    typeof props.riveController.createRiveInstance === 'function'
  ) {
    const container = containerRef.value;
    const dpr = devicePixelRatio.value;
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (container && width > 0 && height > 0) {
      canvasRef.value.width = width * dpr;
      canvasRef.value.height = height * dpr;
      canvasRef.value.style.width = width + 'px';
      canvasRef.value.style.height = height + 'px';
    }
    props.riveController.createRiveInstance(canvasRef.value);
  }
});
</script>

<template>
  <div ref="containerRef" :class="containerClass" :style="containerStyle">
    <canvas ref="canvasRef" :style="canvasStyle" v-bind="$attrs">
      <slot />
    </canvas>
  </div>
</template>
