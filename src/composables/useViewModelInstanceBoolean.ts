import { type MaybeRef } from 'vue';
import { ViewModelInstanceBoolean, ViewModelInstance } from '@rive-app/canvas';
import type { UseViewModelInstanceBooleanResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Composable for interacting with boolean ViewModel instance properties.
 *
 * @param path - The path to the boolean property
 * @param viewModelInstance - The ViewModelInstance containing the boolean property to operate on
 * @returns An object with the boolean value and a setter function
 */
export function useViewModelInstanceBoolean(
  path: MaybeRef<string>,
  viewModelInstance?: MaybeRef<ViewModelInstance | null>
): UseViewModelInstanceBooleanResult {
  const result = useViewModelInstanceProperty<ViewModelInstanceBoolean, boolean, Omit<UseViewModelInstanceBooleanResult, 'value'>>(
    path,
    viewModelInstance,
    {
      getProperty: (vm, p) => vm.boolean(p),
      getValue: (prop) => prop.value,
      defaultValue: null,
      buildPropertyOperations: (safePropertyAccess) => ({
        setValue: (newValue: boolean) => {
          safePropertyAccess(prop => { prop.value = newValue; });
        }
      })
    }
  );

  return result;
} 