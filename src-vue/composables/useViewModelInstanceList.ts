import { ref, unref, type MaybeRef } from 'vue';
import { ViewModelInstance, ViewModelInstanceList } from '@rive-app/canvas';
import type { UseViewModelInstanceListResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Composable for interacting with list properties of a ViewModelInstance.
 *
 * @param path - Path to the list property (e.g. "items" or "nested/todoList")
 * @param viewModelInstance - The ViewModelInstance containing the list property
 * @param options - Optional configuration including executeWhenReady function
 * @returns An object with list operations and length
 */
export function useViewModelInstanceList(
  path: MaybeRef<string>,
  viewModelInstance?: MaybeRef<ViewModelInstance | null>,
  options?: { executeWhenReady?: (operation: () => void) => void }
): UseViewModelInstanceListResult {
  // We track revision to trigger re-renders on list manipulation
  const revision = ref(0);

  const result = useViewModelInstanceProperty<ViewModelInstanceList, number, Omit<UseViewModelInstanceListResult, 'length'>>(
    path,
    viewModelInstance,
    {
      getProperty: (vm, p) => vm.list(p),
      getValue: (prop) => prop.length,
      defaultValue: null,
      executeWhenReady: options?.executeWhenReady,
      onPropertyEvent: () => {
        // This fires when the list changes in Rive
        revision.value += 1;
      },
      buildPropertyOperations: (safePropertyAccess) => ({
        addInstance: (instance: ViewModelInstance) => {
          safePropertyAccess(prop => prop.addInstance(instance));
        },
        addInstanceAt: (instance: ViewModelInstance, index: number): boolean => {
          let result = false;
          safePropertyAccess(prop => {
            result = prop.addInstanceAt(instance, index);
          });
          return result;
        },
        removeInstance: (instance: ViewModelInstance) => {
          safePropertyAccess(prop => prop.removeInstance(instance));
        },
        removeInstanceAt: (index: number) => {
          safePropertyAccess(prop => prop.removeInstanceAt(index));
        },
        getInstanceAt: (index: number): ViewModelInstance | null => {
          const currentInstance = unref(viewModelInstance);
          const currentPath = unref(path);
          
          if (!currentInstance || !currentPath) {
            return null;
          }
          
          try {
            const prop = currentInstance.list(currentPath);
            return prop ? prop.instanceAt(index) : null;
          } catch (e) {
            return null;
          }
        },
        swap: (a: number, b: number) => {
          safePropertyAccess(prop => prop.swap(a, b));
        }
      })
    }
  );

  return {
    length: result.value,
    addInstance: result.addInstance,
    addInstanceAt: result.addInstanceAt,
    removeInstance: result.removeInstance,
    removeInstanceAt: result.removeInstanceAt,
    getInstanceAt: result.getInstanceAt,
    swap: result.swap
  };
} 