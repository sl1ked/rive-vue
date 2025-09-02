import { type MaybeRef } from 'vue';
import { ViewModelInstance, ViewModelInstanceEnum } from '@rive-app/canvas';
import type { UseViewModelInstanceEnumResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Composable for interacting with enum properties of a ViewModelInstance.
 *
 * @param path - Path to the property (e.g. "state" or "nested/mode")
 * @param viewModelInstance - The ViewModelInstance containing the enum property
 * @param options - Optional configuration including executeWhenReady function
 * @returns An object with the enum value, valid values, and a setter function
 */
export function useViewModelInstanceEnum(
  path: MaybeRef<string>,
  viewModelInstance?: MaybeRef<ViewModelInstance | null>,
  options?: { executeWhenReady?: (operation: () => void) => void }
): UseViewModelInstanceEnumResult {
  const result = useViewModelInstanceProperty<ViewModelInstanceEnum, string, Omit<UseViewModelInstanceEnumResult, 'value' | 'values'>, string[]>(
    path,
    viewModelInstance,
    {
      getProperty: (vm, p) => vm.enum(p),
      getValue: (prop) => prop.value,
      defaultValue: null,
      executeWhenReady: options?.executeWhenReady,
      getExtendedData: (prop) => prop.values,
      buildPropertyOperations: (safePropertyAccess) => ({
        setValue: (newValue: string) => {
          safePropertyAccess(prop => { prop.value = newValue; });
        }
      })
    }
  );

  return {
    value: result.value,
    values: result.extendedData || [],
    setValue: result.setValue
  };
} 