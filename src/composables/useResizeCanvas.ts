import { ref, computed, watch, type Ref, type MaybeRef } from 'vue';
import type { Bounds } from '@rive-app/canvas';
import type { Dimensions, UseRiveOptions } from '../types';
import useDevicePixelRatio from './useDevicePixelRatio';
import { useContainerSize } from './useContainerSize';
import { getOptions } from '../utils';
import { unref } from 'vue';

export interface UseResizeCanvasProps {
  /**
   * Whether or not Rive is loaded and renderer is associated with the canvas
   */
  riveLoaded: MaybeRef<boolean>;
  /**
   * Ref to the canvas element
   */
  canvasElem: Ref<HTMLCanvasElement | null>;
  /**
   * Ref to the container element of the canvas
   */
  containerRef: Ref<HTMLElement | null>;
  /**
   * (Optional) Callback to be invoked after the canvas has been resized due to a resize
   * of its parent container. This is where you would want to reset the layout
   * dimensions for the Rive renderer to dictate the new min/max bounds of the
   * canvas.
   */
  onCanvasHasResized?: () => void;
  /**
   * (Optional) Options passed to the useRive hook, including the shouldResizeCanvasToContainer option
   * which prevents the canvas element from resizing to its parent container
   */
  options?: MaybeRef<Partial<UseRiveOptions>>;
  /**
   * (Optional) AABB bounds of the artboard. If provided, the canvas will be sized to the artboard
   * height if the fitCanvasToArtboardHeight option is true.
   */
  artboardBounds?: MaybeRef<Bounds | undefined>;
}

/**
 * Helper composable to listen for changes in the <canvas> parent container size and size the <canvas>
 * to match. If a resize event has occurred, a supplied callback (onCanvasHasResized)
 * will be invoked to allow for any re-calculation needed (i.e. Rive layout on the canvas).
 *
 * This composable is useful if you are not intending to use the `useRive` composable yourself, but still
 * want to use the auto-sizing logic on the canvas/container.
 */
export function useResizeCanvas({
  riveLoaded,
  canvasElem,
  containerRef,
  options = {},
  onCanvasHasResized,
  artboardBounds,
}: UseResizeCanvasProps) {
  const lastContainerDimensions = ref<Dimensions>({
    height: 0,
    width: 0,
  });

  const lastCanvasSize = ref<Dimensions>({
    height: 0,
    width: 0,
  });

  const isFirstSizing = ref(true);

  const currentOptions = computed(() => getOptions(unref(options)));

  const containerSize = useContainerSize(
    containerRef,
    unref(currentOptions).shouldResizeCanvasToContainer
  );

  const currentDevicePixelRatio = useDevicePixelRatio(unref(currentOptions).customDevicePixelRatio);

  const getContainerDimensions = computed(() => {
    return () => {
      const width = containerRef.value?.clientWidth ?? 0;
      const height = containerRef.value?.clientHeight ?? 0;
      const bounds = unref(artboardBounds);
      
      if (unref(currentOptions).fitCanvasToArtboardHeight && bounds) {
        const { maxY, maxX } = bounds;
        return { width, height: width * (maxY / maxX) };
      }
      return { width, height };
    };
  });

  watch(
    [
      canvasElem,
      containerRef,
      containerSize,
      currentDevicePixelRatio,
      riveLoaded,
      artboardBounds,
    ],
    () => {
      const isRiveLoaded = unref(riveLoaded);
      
      if (
        !unref(currentOptions).shouldResizeCanvasToContainer ||
        !containerRef.value ||
        !isRiveLoaded
      ) {
        return;
      }

      const { width, height } = getContainerDimensions.value();
      let hasResized = false;
      
      if (canvasElem.value) {
        const boundsChanged =
          width !== lastContainerDimensions.value.width || 
          height !== lastContainerDimensions.value.height;

        if (unref(currentOptions).fitCanvasToArtboardHeight && boundsChanged) {
          containerRef.value.style.height = height + 'px';
          hasResized = true;
        }

        if (unref(currentOptions).useDevicePixelRatio) {
          const canvasSizeChanged =
            width * currentDevicePixelRatio.value !== lastCanvasSize.value.width ||
            height * currentDevicePixelRatio.value !== lastCanvasSize.value.height;

          if (boundsChanged || canvasSizeChanged) {
            const newCanvasWidthProp = currentDevicePixelRatio.value * width;
            const newCanvasHeightProp = currentDevicePixelRatio.value * height;
            
            canvasElem.value.width = newCanvasWidthProp;
            canvasElem.value.height = newCanvasHeightProp;
            canvasElem.value.style.width = width + 'px';
            canvasElem.value.style.height = height + 'px';
            
            lastCanvasSize.value = {
              width: newCanvasWidthProp,
              height: newCanvasHeightProp,
            };
            hasResized = true;
          }
        } else if (boundsChanged) {
          canvasElem.value.width = width;
          canvasElem.value.height = height;
          lastCanvasSize.value = { width, height };
          hasResized = true;
        }

        lastContainerDimensions.value = { width, height };
      }

      if (onCanvasHasResized && (isFirstSizing.value || hasResized)) {
        onCanvasHasResized();
      }
      
      if (isFirstSizing.value) {
        isFirstSizing.value = false;
      }
    },
    { immediate: true }
  );

  watch(canvasElem, () => {
    lastCanvasSize.value = {
      width: 0,
      height: 0,
    };
  });
} 