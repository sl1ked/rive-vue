import { watch, onUnmounted, type Ref, type MaybeRef } from 'vue';
import { unref } from 'vue';

export interface UseCanvasResizeOptions {
  enabled?: MaybeRef<boolean>;
  devicePixelRatio?: MaybeRef<number>;
  onResize?: () => void;
  riveLoaded?: MaybeRef<boolean>;
}

/**
 * Smart canvas resizing composable
 * to prevent unnecessary canvas operations and blinking
 */
export function useCanvasResize(
  canvasRef: Ref<HTMLCanvasElement | null>,
  containerRef: Ref<HTMLElement | null>,
  options: UseCanvasResizeOptions = {}
) {
  let resizeObserver: ResizeObserver | null = null;
  
  let lastContainerWidth = 0;
  let lastContainerHeight = 0;
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;
  let isFirstSizing = true;

  const throttle = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const resizeCanvas = () => {
    if (!canvasRef.value || !containerRef.value) return;

    const container = containerRef.value;
    const canvas = canvasRef.value;
    const enabled = unref(options.enabled) ?? true;
    const riveLoaded = unref(options.riveLoaded) ?? true;
    const dpr = unref(options.devicePixelRatio) ?? (window.devicePixelRatio || 1);

    if (!enabled || !riveLoaded) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let hasResized = false;

    const boundsChanged = 
      containerWidth !== lastContainerWidth || 
      containerHeight !== lastContainerHeight;

    if (boundsChanged) {
      const newCanvasWidth = containerWidth * dpr;
      const newCanvasHeight = containerHeight * dpr;
      
      const canvasSizeChanged = 
        newCanvasWidth !== lastCanvasWidth ||
        newCanvasHeight !== lastCanvasHeight;

      if (canvasSizeChanged) {
        canvas.width = newCanvasWidth;
        canvas.height = newCanvasHeight;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';

        lastCanvasWidth = newCanvasWidth;
        lastCanvasHeight = newCanvasHeight;

        hasResized = true;
      }

      lastContainerWidth = containerWidth;
      lastContainerHeight = containerHeight;
    }

    // CRITICAL: Only call resize callback when actually needed
    if (options.onResize && (isFirstSizing || hasResized)) {
      options.onResize();
    }

    if (isFirstSizing) {
      isFirstSizing = false;
    }
  };

  const throttledResize = throttle(resizeCanvas, 0);

  const setupResizeObserver = () => {
    if (!containerRef.value || typeof window === 'undefined') return;

    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    resizeObserver = new ResizeObserver(() => {
      throttledResize();
    });

    resizeObserver.observe(containerRef.value);

    resizeCanvas();
  };

  watch(
    [containerRef, canvasRef],
    () => {
      if (containerRef.value && canvasRef.value) {
        setupResizeObserver();
      }
    },
    { immediate: true }
  );

  watch(canvasRef, () => {
    lastCanvasWidth = 0;
    lastCanvasHeight = 0;
    lastContainerWidth = 0;
    lastContainerHeight = 0;
    isFirstSizing = true;
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  return {
    resizeCanvas,
  };
}
