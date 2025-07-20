<script setup lang="ts">
import { computed, useAttrs, ref, watch, nextTick } from 'vue';
import type { Layout } from '@rive-app/canvas';
import { useRive } from '../composables/useRive';
import type { UseRiveParameters, UseRiveOptions } from '../types';
import { useCanvasResize } from '../composables/useCanvasResize';
import useDevicePixelRatio from '../composables/useDevicePixelRatio';
import { Fit } from '@rive-app/canvas';
import '../styles/index.css';

export interface RiveCanvasProps {
  src: string;
  artboard?: string;
  animations?: string | string[];
  stateMachines?: string | string[];
  layout?: Layout;
  useOffscreenRenderer?: boolean;
  shouldDisableRiveListeners?: boolean;
  shouldResizeCanvasToContainer?: boolean;
  automaticallyHandleEvents?: boolean;
  autoplay?: boolean;
}

const props = withDefaults(defineProps<RiveCanvasProps>(), {
  useOffscreenRenderer: true,
  shouldDisableRiveListeners: false,
  shouldResizeCanvasToContainer: true,
  automaticallyHandleEvents: false,
  autoplay: true,
});

const attrs = useAttrs();

// Prepare parameters for useRive composable
const riveParams = computed<UseRiveParameters>(() => {
  const params: UseRiveParameters = {
    src: props.src,
    autoplay: props.autoplay,
    shouldDisableRiveListeners: props.shouldDisableRiveListeners,
    automaticallyHandleEvents: props.automaticallyHandleEvents,
  };

  if (props.artboard) params.artboard = props.artboard;
  if (props.animations) params.animations = props.animations;
  if (props.stateMachines) params.stateMachines = props.stateMachines;
  if (props.layout) params.layout = props.layout;

  return params;
});

const riveOptions = computed<UseRiveOptions>(() => ({
  useOffscreenRenderer: props.useOffscreenRenderer,
  shouldResizeCanvasToContainer: props.shouldResizeCanvasToContainer,
  useDevicePixelRatio: true,
  customDevicePixelRatio: 0,
  fitCanvasToArtboardHeight: false,
}));

// Create refs for template
const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const devicePixelRatio = useDevicePixelRatio();

// Use the new Rive composable API
const riveController = useRive(riveParams, riveOptions);

// Callback for when canvas has been resized
const onCanvasHasResized = () => {
  if (riveController.rive.value && canvasRef.value) {
    const rive = riveController.rive.value;
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
  riveLoaded: riveController.isLoaded,
  onResize: onCanvasHasResized,
});

// Watch for canvas ready and create Rive instance
watch(
  canvasRef,
  async (canvas) => {
    if (canvas && containerRef.value) {
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
        riveController.createRiveInstance(canvas);
      } catch (error) {
        console.error('Error creating rive instance with canvas:', error);
      }
    }
  },
  { immediate: true }
);

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
</script>

<template>
  <div ref="containerRef" :class="containerClass" :style="containerStyle">
    <canvas ref="canvasRef" :style="canvasStyle" v-bind="$attrs">
      <slot />
    </canvas>
  </div>
</template>
