import { ref, watch, onMounted, onUnmounted } from 'vue';

/**
 * Listen for devicePixelRatio changes and set the new value accordingly. This could
 * happen for reasons such as:
 * - User moves window from retina screen display to a separate monitor
 * - User controls zoom settings on the browser
 *
 * @param customDevicePixelRatio - Number to force a dpr to abide by, rather than using the window's
 * @returns dpr: Ref<number> - Device pixel ratio; ratio of physical px to resolution in CSS pixels for current device
 */
export default function useDevicePixelRatio(customDevicePixelRatio?: number) {
  const getDevicePixelRatio = () => {
    return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  };

  const dpr = customDevicePixelRatio || getDevicePixelRatio();
  const currentDpr = ref(dpr);

  let mediaMatcher: MediaQueryList | null = null;

  const updateDpr = () => {
    const newDpr = customDevicePixelRatio || getDevicePixelRatio();
    currentDpr.value = newDpr;
  };

  const setupListener = () => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    if (mediaMatcher) {
      removeListener();
    }

    mediaMatcher = window.matchMedia(`screen and (resolution: ${currentDpr.value}dppx)`);
    
    if (mediaMatcher.addEventListener) {
      mediaMatcher.addEventListener('change', updateDpr);
    } else {
      // Fallback for older browsers
      mediaMatcher.addListener(updateDpr);
    }
  };

  const removeListener = () => {
    if (mediaMatcher) {
      if (mediaMatcher.removeEventListener) {
        mediaMatcher.removeEventListener('change', updateDpr);
      } else {
        // Fallback for older browsers
        mediaMatcher.removeListener(updateDpr);
      }
      mediaMatcher = null;
    }
  };

  // Watch for DPR changes and update the listener
  watch(currentDpr, setupListener);

  onMounted(() => {
    setupListener();
  });

  onUnmounted(() => {
    removeListener();
  });

  return currentDpr;
}
