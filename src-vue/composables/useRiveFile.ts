import { ref, watch, onUnmounted, computed, type MaybeRef } from 'vue';
import { unref } from 'vue';
import { EventType, RiveFile } from '@rive-app/canvas';

export interface UseRiveFileParameters {
  src?: string;
  buffer?: ArrayBuffer;
}

export type FileStatus = 'idle' | 'loading' | 'success' | 'failed';

export interface RiveFileState {
  riveFile: RiveFile | null;
  status: FileStatus;
}

/**
 * Custom composable for initializing and managing a RiveFile instance within a component.
 * It sets up a RiveFile based on provided source parameters (URL or ArrayBuffer) and ensures
 * proper cleanup to avoid memory leaks when the component unmounts or inputs change.
 *
 * @param params - Object containing parameters accepted by the Rive file in the @rive-app/canvas runtime
 * @returns Reactive RiveFileState with the active RiveFile instance and loading status
 */
export function useRiveFile(params: MaybeRef<UseRiveFileParameters>) {
  const riveFile = ref<RiveFile | null>(null);
  const status = ref<FileStatus>('idle');

  let currentFile: RiveFile | null = null;

  const loadRiveFile = async () => {
    const currentParams = unref(params);
    
    // Cleanup previous file
    if (currentFile) {
      currentFile.cleanup();
      currentFile = null;
    }

    if (!currentParams.src && !currentParams.buffer) {
      riveFile.value = null;
      status.value = 'idle';
      return;
    }

    try {
      status.value = 'loading';
      currentFile = new RiveFile(currentParams);
      currentFile.init();
      
      currentFile.on(EventType.Load, () => {
        if (currentFile) {
          // We request an instance to add +1 to the referencesCount so it doesn't get destroyed
          // while this composable is active
          currentFile.getInstance();
          riveFile.value = currentFile;
          status.value = 'success';
        }
      });
      
      currentFile.on(EventType.LoadError, () => {
        status.value = 'failed';
      });
      
      riveFile.value = currentFile;
    } catch (error) {
      console.error('Error loading Rive file:', error);
      status.value = 'failed';
    }
  };

  // Watch for parameter changes and reload file
  watch(
    () => {
      const p = unref(params);
      return [p.src, p.buffer];
    },
    () => {
      loadRiveFile();
    },
    { immediate: true }
  );

  // Cleanup on unmount
  onUnmounted(() => {
    if (currentFile) {
      currentFile.cleanup();
      currentFile = null;
    }
  });

  return {
    riveFile: computed(() => riveFile.value),
    status: computed(() => status.value),
  };
} 