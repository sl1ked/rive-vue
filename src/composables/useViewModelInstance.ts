import { ref, watch, markRaw, type MaybeRef, nextTick } from 'vue';
import { unref } from 'vue';
import { ViewModel, ViewModelInstance } from '@rive-app/canvas';
import type { UseViewModelInstanceParameters } from '../types';

/**
 * Composable for fetching a ViewModelInstance from a ViewModel.
 *
 * @param viewModel - The ViewModel to get an instance from
 * @param params - Options for retrieving a ViewModelInstance
 * @returns The ViewModelInstance or null if not found
 */
export function useViewModelInstance(
  viewModel: MaybeRef<ViewModel | null>,
  params?: MaybeRef<UseViewModelInstanceParameters>
) {
  const instance = ref<ViewModelInstance | null>(null);
  const { rive } = params || {};
  const fetchInstance = () => {
    const vm = unref(viewModel);
    const parameters = unref(params);

    if (!vm) {
      instance.value = null;
      return;
    }

    const { name, useDefault = false, useNew = false, rive } = parameters || {};
    let result: ViewModelInstance | null = null;

    if (name != null) {
      result = vm.instanceByName(name) || null;
    } else if (useDefault) {
      result = vm.defaultInstance?.() || null;
    } else if (useNew) {
      result = vm.instance?.() || null;
    } else {
      result = vm.defaultInstance?.() || null;
    }

    instance.value = result ? markRaw(result) : null;
    const riveInstance = unref(rive);
    nextTick(() => {
      if (
        riveInstance &&
        result &&
        typeof riveInstance.bindViewModelInstance === 'function'
      ) {
        try {
          if (riveInstance.viewModelInstance !== result) {
            riveInstance.bindViewModelInstance(result);
          }
        } catch (error) {
          console.warn('Failed to bind view model instance:', error);
        }
      }
    });
  };

  watch(
    [() => unref(viewModel), () => unref(params)],
    () => {
      fetchInstance();
    },
    { immediate: true }
  );

  watch(
    () => rive,
    (newRive) => {
      if (newRive) {
        newRive.bindViewModelInstance(instance.value);
      }
    }
  );
  return instance;
}
