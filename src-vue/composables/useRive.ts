import {
  ref,
  computed,
  watch,
  onUnmounted,
  markRaw,
  type MaybeRef,
} from 'vue';
import { Rive, EventType } from '@rive-app/canvas';
import type { UseRiveParameters, UseRiveOptions } from '../types';
import { getOptions } from '../utils';
import { unref } from 'vue';

/**
 * useRive composable that returns a reactive Rive instance for programmatic control.
 * No DOM management - use with RiveComponent to render.
 * 
 * Usage:
 * const rive = useRive({
 *   src: 'animation.riv',
 *   autoplay: true,
 * });
 * 
 * // Then use: <RiveComponent :rive="rive" />
 */
export function useRive(
  riveParams?: MaybeRef<UseRiveParameters | null>,
  opts?: MaybeRef<Partial<UseRiveOptions>>
) {
  const rive = ref<Rive | null>(null);
  const isLoaded = ref(false);
  const pendingOperations = ref<Array<() => void>>([]);
  
  const options = computed(() => getOptions(unref(opts)));
  const params = computed(() => unref(riveParams));

  // Execute a function when rive is ready, or queue it if not ready
  const executeWhenReady = (operation: () => void) => {
    if (rive.value && isLoaded.value) {
      operation();
    } else {
      pendingOperations.value.push(operation);
    }
  };

  // Execute all pending operations
  const executePendingOperations = () => {
    const operations = [...pendingOperations.value];
    pendingOperations.value = [];
    operations.forEach(operation => {
      try {
        operation();
      } catch (error) {
        console.warn('Error executing pending operation:', error);
      }
    });
  };

  // Watch for animation changes
  watch(
    [rive, () => params.value?.animations],
    ([riveInstance, animations]) => {
      if (riveInstance && animations && isLoaded.value) {
        if (riveInstance.isPlaying) {
          riveInstance.stop(riveInstance.animationNames);
          riveInstance.play(animations);
        } else if (riveInstance.isPaused) {
          riveInstance.stop(riveInstance.animationNames);
          riveInstance.pause(animations);
        }
      }
    }
  );

  // Create Rive instance (without canvas - will be provided by RiveComponent)
  const createRiveInstance = (canvas: HTMLCanvasElement) => {
    const currentParams = params.value;
    if (!currentParams) return null;

    try {
      const { useOffscreenRenderer } = options.value;
      const { onRiveReady, ...restRiveParams } = currentParams;

      // Manually construct config to avoid any reactive proxy issues
      const riveConfig: any = {
        useOffscreenRenderer,
        canvas: canvas,
      };

      // Manually add known Rive parameters to avoid proxy issues
      if (restRiveParams.src) riveConfig.src = restRiveParams.src;
      if (restRiveParams.buffer) riveConfig.buffer = restRiveParams.buffer;
      if (restRiveParams.artboard) riveConfig.artboard = restRiveParams.artboard;
      if (restRiveParams.animations) riveConfig.animations = restRiveParams.animations;
      if (restRiveParams.stateMachines) riveConfig.stateMachines = restRiveParams.stateMachines;
      if (restRiveParams.layout) riveConfig.layout = restRiveParams.layout;
      if (restRiveParams.autoplay !== undefined) riveConfig.autoplay = restRiveParams.autoplay;
      if (restRiveParams.shouldDisableRiveListeners !== undefined) riveConfig.shouldDisableRiveListeners = restRiveParams.shouldDisableRiveListeners;
      if (restRiveParams.automaticallyHandleEvents !== undefined) riveConfig.automaticallyHandleEvents = restRiveParams.automaticallyHandleEvents;

      const riveInstance = new Rive(riveConfig);

      riveInstance.on(EventType.Load, () => {
        isLoaded.value = true;
        // Use markRaw to prevent Vue from making the Rive instance reactive
        rive.value = markRaw(riveInstance);
        
        if (onRiveReady) {
          onRiveReady(riveInstance);
        }
        
        // Execute any pending operations that were queued before the instance was ready
        executePendingOperations();
      });

      riveInstance.on(EventType.LoadError, (error) => {
        console.error('Rive load error:', error);
      });

      return riveInstance;
    } catch (error) {
      console.error('Error creating Rive instance:', error);
      return null;
    }
  };

  // Cleanup on unmount
  onUnmounted(() => {
    if (rive.value) {
      rive.value.cleanup();
      rive.value = null;
    }
    isLoaded.value = false;
    pendingOperations.value = [];
  });

  return {
    rive: computed(() => rive.value as Rive | null),
    isLoaded: computed(() => isLoaded.value),
    createRiveInstance,
    executeWhenReady,
    options,
  };
}
