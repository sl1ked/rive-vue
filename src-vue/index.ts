// Vue components
export { default as RiveCanvas } from './components/RiveCanvas.vue';
export { default as RiveComponent } from './components/RiveComponent.vue';

// Core composables
export { useRive } from './composables/useRive.ts';

// Utility composables  
export { useStateMachineInput } from './composables/useStateMachineInput.ts';
export { useRiveFile } from './composables/useRiveFile.ts';

// ViewModel composables
export { useViewModel } from './composables/useViewModel.ts';
export { useViewModelInstance } from './composables/useViewModelInstance.ts';

// ViewModel property composables
export { useViewModelInstanceString } from './composables/useViewModelInstanceString.ts';
export { useViewModelInstanceNumber } from './composables/useViewModelInstanceNumber.ts';
export { useViewModelInstanceBoolean } from './composables/useViewModelInstanceBoolean.ts';
export { useViewModelInstanceColor } from './composables/useViewModelInstanceColor.ts';
export { useViewModelInstanceEnum } from './composables/useViewModelInstanceEnum.ts';
export { useViewModelInstanceTrigger } from './composables/useViewModelInstanceTrigger.ts';
export { useViewModelInstanceImage } from './composables/useViewModelInstanceImage.ts';
export { useViewModelInstanceList } from './composables/useViewModelInstanceList.ts';

// Re-export utilities from canvas package
export { decodeImage } from '@rive-app/canvas';

// Re-export types
export type { UseRiveParameters, UseRiveOptions } from './types.ts';
export type { UseRiveFileParameters, FileStatus, RiveFileState } from './composables/useRiveFile.ts';
export type { 
  UseViewModelParameters,
  UseViewModelInstanceParameters,
  UseViewModelInstanceStringResult,
  UseViewModelInstanceNumberResult,
  UseViewModelInstanceBooleanResult,
  UseViewModelInstanceColorResult,
  UseViewModelInstanceEnumResult,
  UseViewModelInstanceTriggerParameters,
  UseViewModelInstanceTriggerResult,
  UseViewModelInstanceImageResult,
  UseViewModelInstanceListResult
} from './types.ts';

// Re-export Rive types that users might need
export type { Layout, Fit, Alignment } from '@rive-app/canvas';
