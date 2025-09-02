import { ref, watch, onUnmounted, markRaw, type MaybeRef } from 'vue';
import { unref } from 'vue';
import { Rive, ViewModel, EventType } from '@rive-app/canvas';
import type { UseViewModelParameters } from '../types';

/**
 * Composable for fetching a ViewModel from a Rive instance.
 *
 * @param rive - The Rive instance to retrieve the ViewModel from
 * @param params - Options for retrieving a ViewModel
 * @returns The ViewModel or null if not found
 */
export function useViewModel(
  rive: MaybeRef<Rive | null>,
  params?: MaybeRef<UseViewModelParameters>
) {
  const viewModel = ref<ViewModel | null>(null);

  const fetchViewModel = () => {
    const riveInstance = unref(rive);
    const parameters = unref(params);
    
    if (!riveInstance) {
      viewModel.value = null;
      return;
    }

    let model: ViewModel | null = null;
    const { name, useDefault = false } = parameters || {};

    if (name != null) {
      model = riveInstance.viewModelByName?.(name) || null;
    } else if (useDefault) {
      model = riveInstance.defaultViewModel() || null;
    } else {
      model = riveInstance.defaultViewModel() || null;
    }

    viewModel.value = model ? markRaw(model) : null;
  };

  watch(
    [() => unref(rive), () => unref(params)],
    () => {
      fetchViewModel();
    },
    { immediate: true }
  );

  watch(
    () => unref(rive),
    (riveInstance, oldRiveInstance) => {
      if (oldRiveInstance) {
        oldRiveInstance.off(EventType.Load, fetchViewModel);
      }
      
      if (riveInstance) {
        riveInstance.on(EventType.Load, fetchViewModel);
        fetchViewModel();
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    const riveInstance = unref(rive);
    if (riveInstance) {
      riveInstance.off(EventType.Load, fetchViewModel);
    }
  });

  return viewModel;
} 