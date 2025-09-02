import { type MaybeRef } from 'vue';
import { ViewModelInstance, ViewModelInstanceAssetImage } from '@rive-app/canvas';
import type { UseViewModelInstanceImageResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Composable for interacting with image properties of a ViewModelInstance.
 *
 * @param path - Path to the property (e.g. "image" or "nested/avatar")
 * @param viewModelInstance - The ViewModelInstance containing the image property
 * @param options - Optional configuration including executeWhenReady function
 * @returns An object with a setter function for the image
 */
export function useViewModelInstanceImage(
  path: MaybeRef<string>,
  viewModelInstance?: MaybeRef<ViewModelInstance | null>,
  options?: { executeWhenReady?: (operation: () => void) => void }
): UseViewModelInstanceImageResult {
  const result = useViewModelInstanceProperty<ViewModelInstanceAssetImage, any, Omit<UseViewModelInstanceImageResult, 'value'>>(
    path,
    viewModelInstance,
    {
      getProperty: (vm, p) => vm.image(p),
      getValue: () => null,
      defaultValue: null,
      executeWhenReady: options?.executeWhenReady,
      buildPropertyOperations: (safePropertyAccess) => ({
        setValue: (newValue: any) => {
          safePropertyAccess(prop => { prop.value = newValue; });
        }
      })
    }
  );

  return {
    setValue: result.setValue
  };
} 