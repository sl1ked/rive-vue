// Main entry point for Vue components and composables
export { default as RiveCanvas } from './components/RiveCanvas.vue'

// Core composables
export { useRive } from './composables/useRive'
export { useRiveFile } from './composables/useRiveFile'

// View Model composables
export { useViewModel } from './composables/useViewModel'
export { useViewModelInstance } from './composables/useViewModelInstance'
export { useViewModelString } from './composables/useViewModelString'
export { useViewModelNumber } from './composables/useViewModelNumber'
export { useViewModelBoolean } from './composables/useViewModelBoolean'
export { useViewModelColor } from './composables/useViewModelColor'
export { useViewModelEnum } from './composables/useViewModelEnum'
export { useViewModelTrigger } from './composables/useViewModelTrigger'
export { useViewModelImage } from './composables/useViewModelImage'
export { useViewModelList } from './composables/useViewModelList'

// Utility composables
export { useStateMachineInput } from './composables/useStateMachineInput'
export { useResizeCanvas } from './composables/useResizeCanvas'
export { useDevicePixelRatio } from './composables/useDevicePixelRatio'
export { useIntersectionObserver } from './composables/useIntersectionObserver'
export { useContainerSize } from './composables/useContainerSize'

// Types
export * from './types'

// Re-export everything from @rive-app/canvas for convenience
export * from '@rive-app/canvas' 