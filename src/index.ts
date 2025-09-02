// Vue components
export { default as RiveCanvas } from './components/RiveCanvas.vue';
export { default as RiveComponent } from './components/RiveComponent.vue';

// Core composables
export { useRive } from './composables/useRive';

// Utility composables  
export { useStateMachineInput } from './composables/useStateMachineInput';
export { useRiveFile } from './composables/useRiveFile';

// ViewModel composables
export { useViewModel } from './composables/useViewModel';
export { useViewModelInstance } from './composables/useViewModelInstance';

// ViewModel property composables
export { useViewModelInstanceString } from './composables/useViewModelInstanceString';
export { useViewModelInstanceNumber } from './composables/useViewModelInstanceNumber';
export { useViewModelInstanceBoolean } from './composables/useViewModelInstanceBoolean';
export { useViewModelInstanceColor } from './composables/useViewModelInstanceColor';
export { useViewModelInstanceEnum } from './composables/useViewModelInstanceEnum';
export { useViewModelInstanceTrigger } from './composables/useViewModelInstanceTrigger';
export { useViewModelInstanceImage } from './composables/useViewModelInstanceImage';
export { useViewModelInstanceList } from './composables/useViewModelInstanceList';

// Re-export utilities from canvas package
export { decodeImage } from '@rive-app/canvas';

// Re-export types
export type { UseRiveParameters, UseRiveOptions } from './types';
export type { UseRiveFileParameters, FileStatus, RiveFileState } from './composables/useRiveFile';
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
} from './types';

// Re-export Rive types that users might need
export type { Layout, Fit, Alignment } from '@rive-app/canvas';
