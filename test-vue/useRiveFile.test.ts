import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useRiveFile } from '../src-vue/composables/useRiveFile'
import * as rive from '@rive-app/canvas'

vi.mock('@rive-app/canvas')

describe('useRiveFile', () => {
  let mockRiveFile: any

  beforeEach(() => {
    mockRiveFile = {
      cleanup: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      init: vi.fn(),
      getInstance: vi.fn()
    }

    vi.mocked(rive.RiveFile).mockImplementation(() => mockRiveFile)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('creates RiveFile when src is provided', () => {
    const params = ref({ src: 'test.riv' })
    const result = useRiveFile(params)
    
    expect(rive.RiveFile).toHaveBeenCalledWith({ src: 'test.riv' })
    expect(result.riveFile.value).toStrictEqual(mockRiveFile)
    expect(result.status.value).toBe('loading')
  })

  it('creates RiveFile when buffer is provided', () => {
    const buffer = new ArrayBuffer(10)
    const params = ref({ buffer })
    const result = useRiveFile(params)
    
    expect(rive.RiveFile).toHaveBeenCalledWith({ buffer })
    expect(result.riveFile.value).toStrictEqual(mockRiveFile)
    expect(result.status.value).toBe('loading')
  })

  it('sets status to idle when no src or buffer provided', () => {
    const params = ref({} as any)
    const result = useRiveFile(params)
    
    expect(rive.RiveFile).not.toHaveBeenCalled()
    expect(result.riveFile.value).toBe(null)
    expect(result.status.value).toBe('idle')
  })

  it('handles RiveFile creation errors gracefully', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(rive.RiveFile).mockImplementation(() => {
      throw new Error('RiveFile creation failed')
    })
    
    const params = ref({ src: 'test.riv' })
    const result = useRiveFile(params)
    
    expect(result.status.value).toBe('failed')
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading Rive file:', expect.any(Error))
    
    consoleErrorSpy.mockRestore()
  })

  it('sets status to success when load event is triggered', () => {
    let loadCallback: Function | undefined
    mockRiveFile.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'load') {
        loadCallback = callback
      }
    })

    const params = ref({ src: 'test.riv' })
    const result = useRiveFile(params)
    
    expect(result.status.value).toBe('loading')
    
    if (loadCallback) {
      loadCallback()
    }
    
    expect(result.status.value).toBe('success')
    expect(mockRiveFile.getInstance).toHaveBeenCalled()
  })

  it('sets status to failed when LoadError event is triggered', () => {
    let errorCallback: Function | undefined
    mockRiveFile.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'loaderror') {
        errorCallback = callback
      }
    })

    const params = ref({ src: 'test.riv' })
    const result = useRiveFile(params)
    
    expect(result.status.value).toBe('loading')
    
    if (errorCallback) {
      errorCallback()
    }
    
    expect(result.status.value).toBe('failed')
  })

  it('recreates RiveFile when src changes', async () => {
    const params = ref({ src: 'test1.riv' })
    useRiveFile(params)
    
    expect(rive.RiveFile).toHaveBeenCalledTimes(1)
    expect(mockRiveFile.cleanup).not.toHaveBeenCalled()
    
    params.value = { src: 'test2.riv' }
    await nextTick() // Wait for reactivity
    
    expect(mockRiveFile.cleanup).toHaveBeenCalledTimes(1)
    expect(rive.RiveFile).toHaveBeenCalledTimes(2)
    expect(rive.RiveFile).toHaveBeenLastCalledWith({ src: 'test2.riv' })
  })

  it('recreates RiveFile when buffer changes', async () => {
    const buffer1 = new ArrayBuffer(10)
    const buffer2 = new ArrayBuffer(20)
    
    const params = ref({ buffer: buffer1 })
    useRiveFile(params)
    
    expect(rive.RiveFile).toHaveBeenCalledTimes(1)
    
    params.value = { buffer: buffer2 }
    await nextTick()
    
    expect(mockRiveFile.cleanup).toHaveBeenCalledTimes(1)
    expect(rive.RiveFile).toHaveBeenCalledTimes(2)
    expect(rive.RiveFile).toHaveBeenLastCalledWith({ buffer: buffer2 })
  })

  it('handles parameter updates correctly', async () => {
    const params = ref({ src: 'test.riv' })
    useRiveFile(params)
    
    expect(rive.RiveFile).toHaveBeenCalledTimes(1)
    
    // Update to different src should trigger recreation
    params.value = { src: 'different.riv' }
    await nextTick()
    
    expect(rive.RiveFile).toHaveBeenCalledTimes(2)
    expect(mockRiveFile.cleanup).toHaveBeenCalledTimes(1)
  })

  it('transitions from loading to idle when params are cleared', async () => {
    const params = ref({ src: 'test.riv' })
    const result = useRiveFile(params)
    
    expect(result.status.value).toBe('loading')
    
    params.value = {} as any
    await nextTick()
    
    expect(result.status.value).toBe('idle')
    expect(result.riveFile.value).toBe(null)
    expect(mockRiveFile.cleanup).toHaveBeenCalled()
  })

  it('calls init on RiveFile after creation', () => {
    const params = ref({ src: 'test.riv' })
    useRiveFile(params)
    
    expect(rive.RiveFile).toHaveBeenCalledWith({ src: 'test.riv' })
    expect(mockRiveFile.init).toHaveBeenCalled()
  })

  it('returns computed refs for reactive values', () => {
    const params = ref({ src: 'test.riv' })
    const result = useRiveFile(params)
    
    // Check that returned values are computed refs
    expect(result.status.value).toBeDefined()
    expect(result.riveFile.value).toBeDefined()
  })
}) 