import { type MaybeRef } from 'vue';
import { ViewModelInstance, ViewModelInstanceTrigger } from '@rive-app/canvas';
import type { UseViewModelInstanceTriggerParameters, UseViewModelInstanceTriggerResult } from '../types';
import { useViewModelInstanceProperty } from './useViewModelInstanceProperty';

/**
 * Composable for interacting with trigger properties of a ViewModelInstance.
 *
 * @param path - Path to the trigger property (e.g. "onTap" or "group/onTap")
 * @param viewModelInstance - The ViewModelInstance containing the trigger property
 * @param params - Parameters including optional onTrigger callback
 * @returns An object with a trigger function
 */
export function useViewModelInstanceTrigger(
  path: MaybeRef<string>,
  viewModelInstance?: MaybeRef<ViewModelInstance | null>,
  params?: UseViewModelInstanceTriggerParameters
): UseViewModelInstanceTriggerResult {
  const { onTrigger } = params ?? {};

  const { trigger } = useViewModelInstanceProperty<ViewModelInstanceTrigger, undefined, UseViewModelInstanceTriggerResult>(
    path,
    viewModelInstance,
    {
      getProperty: (vm, p) => vm.trigger(p),
      getValue: () => undefined,
      defaultValue: null,
      onPropertyEvent: onTrigger,
      buildPropertyOperations: (safePropertyAccess) => ({
        trigger: () => {
          safePropertyAccess(prop => {
            prop.trigger();
          });
        }
      })
    }
  );

  return { trigger };
} 