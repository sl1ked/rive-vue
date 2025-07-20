import { type MaybeRef } from 'vue';
import { ViewModelInstance, ViewModelInstanceNumber } from '@rive-app/canvas';
import type { UseViewModelInstanceNumberResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Composable for interacting with number properties of a ViewModelInstance.
 *
 * @param path - Path to the property (e.g. "count" or "nested/value")
 * @param viewModelInstance - The ViewModelInstance containing the number property
 * @param options - Optional configuration including executeWhenReady function
 * @returns An object with the number value and a setter function
 */
export function useViewModelInstanceNumber(
  path: MaybeRef<string>,
  viewModelInstance?: MaybeRef<ViewModelInstance | null>,
  options?: { executeWhenReady?: (operation: () => void) => void }
): UseViewModelInstanceNumberResult {
  const result = useViewModelInstanceProperty<ViewModelInstanceNumber, number, Omit<UseViewModelInstanceNumberResult, 'value'>>(
    path,
    viewModelInstance,
    {
      getProperty: (vm, p) => vm.number(p),
      getValue: (prop) => prop.value,
      defaultValue: null,
      executeWhenReady: options?.executeWhenReady,
      buildPropertyOperations: (safePropertyAccess) => ({
        setValue: (newValue: number) => {
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