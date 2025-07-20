import type { UseRiveOptions } from './types';

/**
 * Get options with default values
 */
export function getOptions(opts: Partial<UseRiveOptions> = {}): UseRiveOptions {
  return {
    useDevicePixelRatio: true,
    customDevicePixelRatio: 0,
    fitCanvasToArtboardHeight: false,
    useOffscreenRenderer: true,
    shouldResizeCanvasToContainer: true,
    shouldUseIntersectionObserver: true,
    ...opts,
  };
}
