import type { Ref } from 'vue';
import type { 
  Layout, 
  RiveParameters, 
  Rive,
  RiveFile,
  RiveFileParameters,
  ViewModelInstance 
} from '@rive-app/canvas';

export type MaybeRefOrGetter<T> = T | Ref<T> | (() => T);

export interface UseRiveParameters extends Partial<Omit<RiveParameters, 'canvas'>> {
  onRiveReady?: (rive: Rive) => void;
}

export interface UseRiveOptions {
  useDevicePixelRatio: boolean;
  customDevicePixelRatio: number;
  fitCanvasToArtboardHeight: boolean;
  useOffscreenRenderer: boolean;
  shouldResizeCanvasToContainer: boolean;
  shouldUseIntersectionObserver?: boolean;
}

export interface UseRiveReturn {
  rive: Rive | null;
  canvas: HTMLCanvasElement | null;
  container: HTMLElement | null;
}

export interface UseRiveFileParameters
  extends Partial<Omit<RiveFileParameters, 'onLoad' | 'onLoadError'>> {}

export type FileStatus = 'idle' | 'loading' | 'failed' | 'success';

export interface RiveFileState {
  riveFile: Readonly<Ref<RiveFile | null>>;
  status: Readonly<Ref<FileStatus>>;
}

// ViewModel Types
export type UseViewModelParameters =
  | { name: string; useDefault?: never }
  | { useDefault?: boolean; name?: never };

export type UseViewModelInstanceParameters =
  | { name: string; useDefault?: never; useNew?: never; rive?: Rive | null }
  | { useDefault?: boolean; name?: never; useNew?: never; rive?: Rive | null }
  | { useNew?: boolean; name?: never; useDefault?: never; rive?: Rive | null };

// ViewModel Instance Property Result Types
export interface UseViewModelInstanceStringResult {
  value: string | null;
  setValue: (value: string) => void;
}

export interface UseViewModelInstanceNumberResult {
  value: number | null;
  setValue: (value: number) => void;
}

export interface UseViewModelInstanceBooleanResult {
  value: boolean | null;
  setValue: (value: boolean) => void;
}

export interface UseViewModelInstanceColorResult {
  value: number | null;
  setValue: (value: number) => void;
  setRgb: (r: number, g: number, b: number) => void;
  setRgba: (r: number, g: number, b: number, a: number) => void;
  setAlpha: (a: number) => void;
  setOpacity: (o: number) => void;
}

export interface UseViewModelInstanceEnumResult {
  value: string | null;
  values: string[];
  setValue: (value: string) => void;
}

export interface UseViewModelInstanceTriggerParameters {
  onTrigger?: () => void;
}

export interface UseViewModelInstanceTriggerResult {
  trigger: () => void;
}

export interface UseViewModelInstanceImageResult {
  setValue: (value: any) => void; // RiveRenderImage type
}

export interface UseViewModelInstanceListResult {
  length: number | null;
  addInstance: (instance: ViewModelInstance) => void;
  addInstanceAt: (instance: ViewModelInstance, index: number) => boolean;
  removeInstance: (instance: ViewModelInstance) => void;
  removeInstanceAt: (index: number) => void;
  getInstanceAt: (index: number) => ViewModelInstance | null;
  swap: (a: number, b: number) => void;
}

export interface RiveCanvasProps {
  src: string;
  artboard?: string;
  animations?: string | string[];
  stateMachines?: string | string[];
  layout?: Layout;
  useOffscreenRenderer?: boolean;
  shouldDisableRiveListeners?: boolean;
  shouldResizeCanvasToContainer?: boolean;
  automaticallyHandleEvents?: boolean;
  autoplay?: boolean;
}

export interface UseViewModelStringResult {
  value: Readonly<Ref<string | null>>;
  setValue: (value: string) => void;
}

export interface UseViewModelNumberResult {
  value: Readonly<Ref<number | null>>;
  setValue: (value: number) => void;
}

export interface UseViewModelBooleanResult {
  value: Readonly<Ref<boolean | null>>;
  setValue: (value: boolean) => void;
}

export interface UseViewModelColorResult {
  value: Readonly<Ref<number | null>>;
  setValue: (value: number) => void;
  setRgb: (r: number, g: number, b: number) => void;
  setRgba: (r: number, g: number, b: number, a: number) => void;
  setAlpha: (a: number) => void;
  setOpacity: (o: number) => void;
}

export interface UseViewModelEnumResult {
  value: Readonly<Ref<string | null>>;
  setValue: (value: string) => void;
  values: Readonly<Ref<string[]>>;
}

export interface UseViewModelTriggerResult {
  trigger: () => void;
}

export interface UseViewModelTriggerParameters {
  onTrigger?: () => void;
}

export interface UseViewModelImageResult {
  setValue: (value: any) => void;
}

export interface UseViewModelListResult {
  length: Readonly<Ref<number>>;
  addInstance: (instance: ViewModelInstance) => void;
  addInstanceAt: (instance: ViewModelInstance, index: number) => boolean;
  removeInstance: (instance: ViewModelInstance) => void;
  removeInstanceAt: (index: number) => void;
  getInstanceAt: (index: number) => ViewModelInstance | null;
  swap: (a: number, b: number) => void;
}

export interface Dimensions {
  width: number;
  height: number;
}
