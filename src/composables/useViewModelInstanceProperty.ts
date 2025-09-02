import { ref, watch, onUnmounted, type MaybeRef } from 'vue';
import { unref } from 'vue';
import { ViewModelInstance, ViewModelInstanceValue } from '@rive-app/canvas';

export interface UseViewModelInstancePropertyOptions<
  P extends ViewModelInstanceValue,
  V,
  R,
  E = undefined
> {
  /** Function to get the property from a ViewModelInstance */
  getProperty: (vm: ViewModelInstance, path: string) => P | null;

  /** Function to get the current value from the property */
  getValue: (prop: P) => V;

  /** Default value to use when property is unavailable */
  defaultValue: V | null;

  /** Function to create the property-specific operations */
  buildPropertyOperations: (
    safePropertyAccess: (callback: (prop: P) => void) => void
  ) => R;

  /** Optional callback for property events (mainly used by triggers) */
  onPropertyEvent?: () => void;

  /** Optional function to extract additional property data (like enum values) */
  getExtendedData?: (prop: P) => E;

  /** Optional function to execute operations when rive is ready */
  executeWhenReady?: (operation: () => void) => void;
}

/**
 * Base composable for all ViewModelInstance property interactions.
 *
 * This composable handles the common tasks needed when working with Rive properties:
 * 1. Safely accessing properties (even during hot-reload)
 * 2. Keeping Vue state in sync with property changes
 * 3. Providing type safety for all operations
 * 4. Queueing operations when Rive instance isn't ready yet
 *
 * @param path - Property path in the ViewModelInstance
 * @param viewModelInstance - The source ViewModelInstance
 * @param options - Configuration for working with the property
 * @returns Object with the value and operations
 */
export function useViewModelInstanceProperty<
  P extends ViewModelInstanceValue,
  V,
  R,
  E = undefined
>(
  path: MaybeRef<string>,
  viewModelInstance: MaybeRef<ViewModelInstance | null | undefined>,
  options: UseViewModelInstancePropertyOptions<P, V, R, E>
): R & { value: V | null } & (E extends undefined
    ? {}
    : { extendedData: E | null }) {
  const property = ref<P | null>(null);
  const value = ref<V | null>(options.defaultValue);
  const extendedData = ref<E | null>(null);

  let currentEventCleanup: (() => void) | null = null;

  const updateProperty = () => {
    const currentInstance = unref(viewModelInstance);
    const currentPath = unref(path);

    // Cleanup old event listener
    if (currentEventCleanup) {
      currentEventCleanup();
      currentEventCleanup = null;
    }

    if (!currentInstance || !currentPath) {
      property.value = null;
      value.value = options.defaultValue;
      extendedData.value = null;
      return;
    }

    const prop = options.getProperty(currentInstance, currentPath);
    if (prop) {
      property.value = prop;
      value.value = options.getValue(prop);

      if (options.getExtendedData) {
        extendedData.value = options.getExtendedData(prop);
      }

      // Set up event listener for property changes
      const handleChange = () => {
        if (prop) {
          value.value = options.getValue(prop);

          if (options.getExtendedData) {
            extendedData.value = options.getExtendedData(prop);
          }

          if (options.onPropertyEvent) {
            options.onPropertyEvent();
          }
        }
      };

      prop.on(handleChange);
      currentEventCleanup = () => prop.off(handleChange);
    } else {
      property.value = null;
      value.value = options.defaultValue;
      extendedData.value = null;
    }
  };

  // Watch for changes in dependencies
  watch(
    [viewModelInstance, () => unref(path)],
    () => {
      updateProperty();
    },
    { immediate: true }
  );

  /**
   * Helper function that safely accesses properties, even during hot-reload.
   *
   * It tries to:
   * 1. Use the existing property reference when possible
   * 2. Fetch a fresh reference when needed
   * 3. Apply the callback to whichever reference works
   * 4. Queue the operation if view model instance isn't ready yet
   */
  const safePropertyAccess = (callback: (prop: P) => void) => {
    const currentInstance = unref(viewModelInstance);
    const currentPath = unref(path);

    if (!currentInstance && options.executeWhenReady) {
      options.executeWhenReady(() => safePropertyAccess(callback));
      return;
    }

    if (property.value && currentInstance) {
      try {
        callback(property.value);

        if (options.getExtendedData) {
          extendedData.value = options.getExtendedData(property.value);
        }
        return;
      } catch {}
    }

    if (currentInstance && currentPath) {
      try {
        const freshProp = options.getProperty(currentInstance, currentPath);
        if (freshProp) {
          property.value = freshProp;
          callback(freshProp);

          if (options.getExtendedData) {
            extendedData.value = options.getExtendedData(freshProp);
          }
        }
      } catch {}
    }
  };

  const operations = options.buildPropertyOperations(safePropertyAccess);

  onUnmounted(() => {
    if (currentEventCleanup) {
      currentEventCleanup();
    }
  });

  const result = {
    value,
    ...operations,
  } as R & { value: V | null } & (E extends undefined
      ? {}
      : { extendedData: E | null });

  if (options.getExtendedData) {
    (result as any).extendedData = extendedData;
  }

  return result;
}
