import { watch, onUnmounted, type Ref, type MaybeRef } from 'vue';
import { unref } from 'vue';

export interface UseCanvasResizeOptions {
  enabled?: MaybeRef<boolean>;
  devicePixelRatio?: MaybeRef<number>;
  onResize?: () => void;
  riveLoaded?: MaybeRef<boolean>;
}

/**
 * Smart canvas resizing composable that matches React's approach
 * to prevent unnecessary canvas operations and blinking
 */
export function useCanvasResize(
  canvasRef: Ref<HTMLCanvasElement | null>,
  containerRef: Ref<HTMLElement | null>,
  options: UseCanvasResizeOptions = {}
) {
  let resizeObserver: ResizeObserver | null = null;
  
  // Track dimensions like React does - using plain objects to avoid reactive issues
  let lastContainerWidth = 0;
  let lastContainerHeight = 0;
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;
  let isFirstSizing = true;

  // Throttle function similar to React's implementation
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

    // Early return if not enabled or Rive not loaded (like React)
    if (!enabled || !riveLoaded) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let hasResized = false;

    // Check if container bounds have changed (like React)
    const boundsChanged = 
      containerWidth !== lastContainerWidth || 
      containerHeight !== lastContainerHeight;

    if (boundsChanged) {
      // Calculate new canvas dimensions
      const newCanvasWidth = containerWidth * dpr;
      const newCanvasHeight = containerHeight * dpr;
      
      // Check if canvas size actually needs to change (like React)
      const canvasSizeChanged = 
        newCanvasWidth !== lastCanvasWidth ||
        newCanvasHeight !== lastCanvasHeight;

      if (canvasSizeChanged) {
        // Update canvas dimensions and styles (only when actually needed)
        canvas.width = newCanvasWidth;
        canvas.height = newCanvasHeight;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';

        // Update tracked canvas dimensions
        lastCanvasWidth = newCanvasWidth;
        lastCanvasHeight = newCanvasHeight;

        hasResized = true;
      }

      // Update tracked container dimensions
      lastContainerWidth = containerWidth;
      lastContainerHeight = containerHeight;
    }

    // CRITICAL: Only call resize callback when actually needed (like React)
    // This prevents unnecessary Rive re-renders that cause blinking
    if (options.onResize && (isFirstSizing || hasResized)) {
      options.onResize();
    }

    // Mark first sizing as complete
    if (isFirstSizing) {
      isFirstSizing = false;
    }
  };

  // Throttled resize function (like React - 0ms delay but still throttled)
  const throttledResize = throttle(resizeCanvas, 0);

  const setupResizeObserver = () => {
    if (!containerRef.value || typeof window === 'undefined') return;

    // Clean up existing observer
    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    // Create new observer with throttling (like React)
    resizeObserver = new ResizeObserver(() => {
      throttledResize();
    });

    resizeObserver.observe(containerRef.value);

    // Initial resize
    resizeCanvas();
  };

  // Watch for container/canvas changes and setup observer
  watch(
    [containerRef, canvasRef],
    () => {
      if (containerRef.value && canvasRef.value) {
        setupResizeObserver();
      }
    },
    { immediate: true }
  );

  // Reset dimensions when canvas changes (like React)
  watch(canvasRef, () => {
    lastCanvasWidth = 0;
    lastCanvasHeight = 0;
    lastContainerWidth = 0;
    lastContainerHeight = 0;
    isFirstSizing = true;
  });

  // Cleanup on unmount
  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  return {
    resizeCanvas,
  };
}
