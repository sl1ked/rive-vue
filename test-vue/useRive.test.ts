import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useRive } from '../src-vue/composables/useRive'
import * as rive from '@rive-app/canvas'

vi.mock('@rive-app/canvas')

describe('useRive', () => {
  let mockRive: any
  let canvasElement: HTMLCanvasElement

  beforeEach(() => {
    mockRive = {
      on: vi.fn(),
      off: vi.fn(),
      stop: vi.fn(),
      cleanup: vi.fn(),
      startRendering: vi.fn(),
      stopRendering: vi.fn(),
      resizeToCanvas: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      reset: vi.fn(),
      isPlaying: false,
      isPaused: false,
      animationNames: ['animation1'],
      stateMachineInputs: vi.fn(() => []),
      bounds: { maxX: 100, maxY: 100 }
    }

    vi.mocked(rive.Rive).mockImplementation(() => mockRive)

    canvasElement = document.createElement('canvas')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns null rive instance when no params provided', () => {
    const controller = useRive()
    expect(controller.rive.value).toBe(null)
    expect(controller.isLoaded.value).toBe(false)
  })

  it('returns controller with createRiveInstance method', () => {
    const controller = useRive({ src: 'test.riv' })
    expect(controller.createRiveInstance).toBeDefined()
    expect(typeof controller.createRiveInstance).toBe('function')
    expect(controller.rive.value).toBe(null)
  })

  it('creates rive instance when createRiveInstance is called', () => {
    const controller = useRive({ src: 'test.riv' })
    
    const instance = controller.createRiveInstance(canvasElement)
    
    expect(rive.Rive).toHaveBeenCalledWith({
      canvas: canvasElement,
      src: 'test.riv',
      useOffscreenRenderer: true
    })
    expect(instance).toBe(mockRive)
  })

  it('passes all rive parameters correctly to createRiveInstance', () => {
    const params = {
      src: 'test.riv',
      artboard: 'TestArtboard',
      animations: ['anim1', 'anim2'],
      stateMachines: ['sm1'],
      autoplay: false
    }
    
    const controller = useRive(params)
    controller.createRiveInstance(canvasElement)
    
    expect(rive.Rive).toHaveBeenCalledWith({
      canvas: canvasElement,
      useOffscreenRenderer: true,
      ...params
    })
  })

  it('handles rive creation errors gracefully', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(rive.Rive).mockImplementation(() => {
      throw new Error('Rive creation failed')
    })
    
    const controller = useRive({ src: 'test.riv' })
    const instance = controller.createRiveInstance(canvasElement)
    
    expect(instance).toBe(null)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating Rive instance:', expect.any(Error))
    
    consoleErrorSpy.mockRestore()
  })

  it('sets rive value when load event is triggered', () => {
    let loadCallback: Function | undefined
    mockRive.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'load') {
        loadCallback = callback
      }
    })

    const controller = useRive({ src: 'test.riv' })
    controller.createRiveInstance(canvasElement)
    
    expect(controller.rive.value).toBe(null)
    expect(controller.isLoaded.value).toBe(false)
    
    if (loadCallback) {
      loadCallback()
    }
    
    expect(controller.rive.value).toBe(mockRive)
    expect(controller.isLoaded.value).toBe(true)
  })

  it('calls onRiveReady callback when provided and load event is triggered', () => {
    let loadCallback: Function | undefined
    mockRive.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'load') {
        loadCallback = callback
      }
    })

    const onRiveReady = vi.fn()
    const controller = useRive({ 
      src: 'test.riv',
      onRiveReady 
    })
    controller.createRiveInstance(canvasElement)
    
    if (loadCallback) {
      loadCallback()
    }
    
    expect(onRiveReady).toHaveBeenCalledWith(mockRive)
  })

  it('handles load error event', () => {
    let errorCallback: Function | undefined
    mockRive.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'loaderror') {
        errorCallback = callback
      }
    })

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const controller = useRive({ src: 'test.riv' })
    controller.createRiveInstance(canvasElement)
    
    const error = new Error('Load failed')
    if (errorCallback) {
      errorCallback(error)
    }
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Rive load error:', error)
    
    consoleErrorSpy.mockRestore()
  })

  it('returns options with all default values', () => {
    const controller = useRive({ src: 'test.riv' })
    
    expect(controller.options.value).toEqual({
      useDevicePixelRatio: true,
      customDevicePixelRatio: 0,
      fitCanvasToArtboardHeight: false,
      useOffscreenRenderer: true,
      shouldResizeCanvasToContainer: true,
      shouldUseIntersectionObserver: true
    })
  })

  it('overrides default options when provided', () => {
    const opts = { 
      useOffscreenRenderer: false,
      useDevicePixelRatio: false 
    }
    const controller = useRive({ src: 'test.riv' }, opts)
    
    expect(controller.options.value).toEqual({
      useDevicePixelRatio: false,
      customDevicePixelRatio: 0,
      fitCanvasToArtboardHeight: false,
      useOffscreenRenderer: false,
      shouldResizeCanvasToContainer: true,
      shouldUseIntersectionObserver: true
    })
  })

  it('returns null when createRiveInstance called without params', () => {
    const controller = useRive()
    const instance = controller.createRiveInstance(canvasElement)
    
    expect(instance).toBe(null)
    expect(rive.Rive).not.toHaveBeenCalled()
  })
}) 