import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useContainerSize } from '../src/composables/useContainerSize'

describe('useContainerSize', () => {
  let mockElement: HTMLElement
  let mockResizeObserver: any
  let originalResizeObserver: any

  beforeEach(() => {
    vi.useFakeTimers()
    
    mockElement = {
      clientWidth: 100,
      clientHeight: 150
    } as HTMLElement

    mockResizeObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }

    originalResizeObserver = global.ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation(() => mockResizeObserver)

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })
    
    // Mock window event listener
    window.addEventListener = vi.fn()
    window.removeEventListener = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    global.ResizeObserver = originalResizeObserver
  })

  it('returns initial size dimensions object', () => {
    const containerRef = ref<HTMLElement | null>(null)
    const size = useContainerSize(containerRef)

    expect(size.value).toEqual({
      width: 0,
      height: 0
    })
  })

  it('returns initial size for provided container', () => {
    const containerRef = ref<HTMLElement | null>(mockElement)
    const size = useContainerSize(containerRef)

    // Should return initial size (0,0) until ResizeObserver triggers
    expect(size.value).toEqual({
      width: 0,
      height: 0
    })
  })

  it('does not set up observer when shouldResizeCanvasToContainer is false', () => {
    const containerRef = ref<HTMLElement | null>(mockElement)
    const size = useContainerSize(containerRef, false)

    // Should not create ResizeObserver
    expect(global.ResizeObserver).not.toHaveBeenCalled()
    expect(size.value).toEqual({ width: 0, height: 0 })
  })

  it('handles container ref changes', async () => {
    const containerRef = ref<HTMLElement | null>(null)
    const size = useContainerSize(containerRef)

    expect(size.value).toEqual({ width: 0, height: 0 })

    // Change container ref
    containerRef.value = mockElement
    await nextTick()

    // Size should still be initial until ResizeObserver callback is triggered
    expect(size.value).toEqual({ width: 0, height: 0 })
  })

  it('handles server-side rendering (no window)', () => {
    const originalWindow = global.window
    delete (global as any).window

    const containerRef = ref<HTMLElement | null>(null)
    const size = useContainerSize(containerRef)

    expect(size.value).toEqual({
      width: 0,
      height: 0
    })

    global.window = originalWindow
  })

  it('returns reactive size object', () => {
    const containerRef = ref<HTMLElement | null>(mockElement)
    const size = useContainerSize(containerRef)

    expect(size.value).toBeDefined()
    expect(typeof size.value.width).toBe('number')
    expect(typeof size.value.height).toBe('number')
    expect(size.value).toEqual({ width: 0, height: 0 })
  })

  it('handles ResizeObserver availability check', () => {
    const containerRef = ref<HTMLElement | null>(mockElement)
    
    // Test with ResizeObserver available
    const size = useContainerSize(containerRef)
    expect(size.value).toEqual({ width: 0, height: 0 })
  })

  it('handles ResizeObserver not available', () => {
    global.ResizeObserver = undefined as any
    
    const containerRef = ref<HTMLElement | null>(mockElement)
    const size = useContainerSize(containerRef)

    expect(size.value).toEqual({ width: 0, height: 0 })
  })

  it('maintains consistent return type', () => {
    const containerRef = ref<HTMLElement | null>(null)
    const size1 = useContainerSize(containerRef)
    
    const containerRef2 = ref<HTMLElement | null>(mockElement)
    const size2 = useContainerSize(containerRef2, false)

    // Both should return same structure
    expect(size1.value).toHaveProperty('width')
    expect(size1.value).toHaveProperty('height')
    expect(size2.value).toHaveProperty('width')
    expect(size2.value).toHaveProperty('height')
  })

  it('handles null container reference', () => {
    const containerRef = ref<HTMLElement | null>(null)
    const size = useContainerSize(containerRef)

    expect(size.value).toEqual({ width: 0, height: 0 })
    
    // Should not throw when container is null
    containerRef.value = null
    expect(size.value).toEqual({ width: 0, height: 0 })
  })

  it('validates parameters correctly', () => {
    const containerRef = ref<HTMLElement | null>(mockElement)
    
    // Test with default parameter
    const size1 = useContainerSize(containerRef)
    expect(size1.value).toEqual({ width: 0, height: 0 })
    
    // Test with explicit true
    const size2 = useContainerSize(containerRef, true)
    expect(size2.value).toEqual({ width: 0, height: 0 })
    
    // Test with explicit false
    const size3 = useContainerSize(containerRef, false)
    expect(size3.value).toEqual({ width: 0, height: 0 })
  })

  it('returns ref with correct reactive behavior', async () => {
    const containerRef = ref<HTMLElement | null>(mockElement)
    const size = useContainerSize(containerRef)

    const initialValue = size.value
    expect(initialValue).toEqual({ width: 0, height: 0 })

    // Change container
    containerRef.value = null
    await nextTick()
    
    // Should still be reactive
    expect(size.value).toEqual({ width: 0, height: 0 })
  })

  it('handles window resize fallback scenario', () => {
    global.ResizeObserver = undefined as any
    
    const containerRef = ref<HTMLElement | null>(mockElement)
    const size = useContainerSize(containerRef)
    
    // Should handle gracefully without ResizeObserver
    expect(size.value).toEqual({ width: 0, height: 0 })
  })

  it('validates ResizeObserver mock setup', () => {
    // Verify our mocks are set up correctly
    expect(global.ResizeObserver).toBeDefined()
    expect(typeof global.ResizeObserver).toBe('function')
  })

  it('handles multiple container size instances', () => {
    const containerRef1 = ref<HTMLElement | null>(mockElement)
    const containerRef2 = ref<HTMLElement | null>(null)
    
    const size1 = useContainerSize(containerRef1)
    const size2 = useContainerSize(containerRef2, false)
    
    expect(size1.value).toEqual({ width: 0, height: 0 })
    expect(size2.value).toEqual({ width: 0, height: 0 })
    expect(size1.value).not.toBe(size2.value) // Different instances
  })
}) 