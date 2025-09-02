import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue';
import type { Dimensions } from '../types';

function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  let lastExecTime = 0;
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay);
    }
  };
}

class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const MyResizeObserver = globalThis.ResizeObserver || FakeResizeObserver;
const hasResizeObserver = globalThis.ResizeObserver !== undefined;

const useResizeObserver = hasResizeObserver;
const useWindowListener = !useResizeObserver;

/**
 * Composable to listen for a ref element's resize events being triggered. When resized,
 * it sets state to an object of {width: number, height: number} indicating the contentRect
 * size of the element at the new resize.
 *
 * @param containerRef - Ref element to listen for resize events on
 * @param shouldResizeCanvasToContainer - Whether to listen for resize events
 * @returns - Size ref with width and height attributes
 */
export function useContainerSize(
  containerRef: Ref<HTMLElement | null>,
  shouldResizeCanvasToContainer = true
) {
  const size = ref<Dimensions>({
    width: 0,
    height: 0,
  });

  let observer: ResizeObserver | null = null;

  const handleResizeObserver = throttle((entries: ResizeObserverEntry[]) => {
    const entry = entries[entries.length - 1];
    size.value = {
      width: entry.contentRect.width,
      height: entry.contentRect.height,
    };
  }, 16);

  const handleWindowResize = throttle(() => {
    size.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, 16);

  const setupObserver = () => {
    if (!shouldResizeCanvasToContainer) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    if (useResizeObserver && containerRef.value) {
      observer = new MyResizeObserver(handleResizeObserver);
      observer.observe(containerRef.value);
    } else if (useWindowListener) {
      // Fallback for browsers without ResizeObserver (IE)
      handleWindowResize();
      window.addEventListener('resize', handleWindowResize);
    }
  };

  const cleanupObserver = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (useWindowListener) {
      window.removeEventListener('resize', handleWindowResize);
    }
  };

  // Watch for container ref changes
  watch(
    containerRef,
    (newContainer, oldContainer) => {
      if (oldContainer && observer) {
        observer.unobserve(oldContainer);
      }

      if (newContainer && shouldResizeCanvasToContainer) {
        setupObserver();
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    if (shouldResizeCanvasToContainer) {
      setupObserver();
    }
  });

  onUnmounted(() => {
    cleanupObserver();
  });

  return size;
}
