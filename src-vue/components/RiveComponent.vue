<script setup lang="ts">
import { computed, useAttrs, ref, watch, nextTick } from 'vue';
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
      const resizeFactor = devicePixelRatio.value * rive.layout.layoutScaleFactor;
      rive.devicePixelRatioUsed = devicePixelRatio.value;
      rive.artboardWidth = canvasRef.value.width / resizeFactor;
      rive.artboardHeight = canvasRef.value.height / resizeFactor;
    }

    rive.startRendering();
    rive.resizeToCanvas();
  }
};

// Use canvas resize composable
useCanvasResize(canvasRef, containerRef, {
  enabled: computed(() => props.shouldResizeCanvasToContainer),
  devicePixelRatio: devicePixelRatio,
  riveLoaded: computed(() => props.riveController?.isLoaded.value ?? false),
  onResize: onCanvasHasResized,
});

// Watch for canvas ready and create Rive instance
watch(
  canvasRef,
  async (canvas) => {
    if (canvas && containerRef.value && props.riveController && typeof props.riveController.createRiveInstance === 'function') {
      // Wait for next tick to ensure canvas is mounted
      await nextTick();
      
      // CRITICAL: Size the canvas properly BEFORE creating Rive instance
      // This prevents the low-resolution issue
      const container = containerRef.value;
      const dpr = devicePixelRatio.value;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      if (width > 0 && height > 0) {
        // Set proper canvas dimensions with device pixel ratio
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
      }
      
      // Now create the Rive instance with properly sized canvas
      try {
        props.riveController.createRiveInstance(canvas);
      } catch (error) {
        console.error('Error creating rive instance with canvas:', error);
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <div ref="containerRef" :class="containerClass" :style="containerStyle">
    <canvas ref="canvasRef" :style="canvasStyle" v-bind="$attrs">
      <slot />
    </canvas>
  </div>
</template> 