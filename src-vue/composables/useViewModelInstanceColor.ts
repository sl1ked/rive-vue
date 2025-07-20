import { type MaybeRef } from 'vue';
import { ViewModelInstance, ViewModelInstanceColor } from '@rive-app/canvas';
import type { UseViewModelInstanceColorResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Composable for interacting with color properties of a ViewModelInstance.
 *
 * @param path - Path to the property (e.g. "tint" or "nested/backgroundColor")
 * @param viewModelInstance - The ViewModelInstance containing the color property
 * @param options - Optional configuration including executeWhenReady function
 * @returns An object with the color value and a setter function
 */
export function useViewModelInstanceColor(
  path: MaybeRef<string>,
  viewModelInstance?: MaybeRef<ViewModelInstance | null>,
  options?: { executeWhenReady?: (operation: () => void) => void }
): UseViewModelInstanceColorResult {
  const result = useViewModelInstanceProperty<ViewModelInstanceColor, number, Omit<UseViewModelInstanceColorResult, 'value'>>(
    path,
    viewModelInstance,
    {
      getProperty: (vm, p) => vm.color(p),
      getValue: (prop) => prop.value,
      defaultValue: null,
      executeWhenReady: options?.executeWhenReady,
      buildPropertyOperations: (safePropertyAccess) => ({
        setValue: (newValue: number) => {
          safePropertyAccess(prop => { prop.value = newValue; });
        },

        setRgb: (r: number, g: number, b: number) => {
          safePropertyAccess(prop => { prop.rgb(r, g, b); });
        },

        setRgba: (r: number, g: number, b: number, a: number) => {
          safePropertyAccess(prop => { prop.rgba(r, g, b, a); });
        },

        setAlpha: (a: number) => {
          safePropertyAccess(prop => { prop.alpha(a); });
        },

        setOpacity: (o: number) => {
          safePropertyAccess(prop => { prop.opacity(o); });
        }
      })
    }
  );

  return {
    value: result.value,
    setValue: result.setValue,
    setRgb: result.setRgb,
    setRgba: result.setRgba,
    setAlpha: result.setAlpha,
    setOpacity: result.setOpacity
  };
} 