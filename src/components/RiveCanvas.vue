<script setup lang="ts">
import { computed, useAttrs, ref, onMounted, ComputedRef } from 'vue';
import type { Layout, Rive } from '@rive-app/canvas';
import { useRive } from '../composables/useRive';
import type {
  UseRiveParameters,
  UseRiveOptions,
} from '../types';
import { useCanvasResize } from '../composables/useCanvasResize';
import useDevicePixelRatio from '../composables/useDevicePixelRatio';
import { Fit } from '@rive-app/canvas';
import '../styles/index.css';

export interface RiveCanvasProps {
  src?: string;
  artboard?: string;
  animations?: string | string[];
  stateMachines?: string | string[];
  layout?: Layout;
  useOffscreenRenderer?: boolean;
  shouldDisableRiveListeners?: boolean;
  shouldResizeCanvasToContainer?: boolean;
  automaticallyHandleEvents?: boolean;
  autoplay?: boolean;
  riveController?: {
    rive: ComputedRef<Rive | null>;
    isLoaded: ComputedRef<boolean>;
    createRiveInstance: (canvas: HTMLCanvasElement) => Rive | null;
    options: ComputedRef<any>;
  } | null;
}

const props = withDefaults(defineProps<RiveCanvasProps>(), {
  useOffscreenRenderer: true,
  shouldDisableRiveListeners: false,
  shouldResizeCanvasToContainer: true,
  automaticallyHandleEvents: false,
  autoplay: true,
  riveController: null,
});

const attrs = useAttrs();

const riveParams = computed<UseRiveParameters>(() => {
  if (props.riveController) {
    return {};
  }
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

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const devicePixelRatio = useDevicePixelRatio();

const riveController = props.riveController
  ? props.riveController
  : useRive(riveParams, riveOptions);

const onCanvasHasResized = () => {
  if (riveController.rive.value && canvasRef.value) {
    const rive = riveController.rive.value;
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
  riveLoaded: riveController.isLoaded,
  onResize: onCanvasHasResized,
});

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

onMounted(() => {
  if (
    canvasRef.value &&
    containerRef.value &&
    typeof riveController.createRiveInstance === 'function'
  ) {
    const canvas = canvasRef.value;
    if (canvas && containerRef.value) {
      const container = containerRef.value;
      const dpr = devicePixelRatio.value;
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width > 0 && height > 0) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
      }

      try {
        riveController.createRiveInstance(canvas);
      } catch (error) {
        console.error('Error creating rive instance with canvas:', error);
      }
    }
  }
});

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
