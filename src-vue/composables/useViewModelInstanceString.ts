import { type MaybeRef } from 'vue';
import { ViewModelInstance, ViewModelInstanceString } from '@rive-app/canvas';
import type { UseViewModelInstanceStringResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Composable for interacting with string properties of a ViewModelInstance.
 *
 * @param path - Path to the property (e.g. "text" or "nested/text")
 * @param viewModelInstance - The ViewModelInstance containing the string property
 * @param options - Optional configuration including executeWhenReady function
 * @returns An object with the string value and a setter function
 */
export function useViewModelInstanceString(
  path: MaybeRef<string>,
  viewModelInstance?: MaybeRef<ViewModelInstance | null>,
  options?: { executeWhenReady?: (operation: () => void) => void }
): UseViewModelInstanceStringResult {
  const result = useViewModelInstanceProperty<ViewModelInstanceString, string, Omit<UseViewModelInstanceStringResult, 'value'>>(
    path,
    viewModelInstance,
    {
      getProperty: (vm, p) => vm.string(p),
      getValue: (prop) => prop.value,
      defaultValue: null,
      executeWhenReady: options?.executeWhenReady,
      buildPropertyOperations: (safePropertyAccess) => ({
        setValue: (newValue: string) => {
          safePropertyAccess(prop => { prop.value = newValue; });
        }
      })
    }
  );

  return {
    value: result.value,
    setValue: result.setValue
  };
} 