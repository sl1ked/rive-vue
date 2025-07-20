import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import useDevicePixelRatio from '../src-vue/composables/useDevicePixelRatio'

describe('useDevicePixelRatio', () => {
  let mockMediaQueryList: any
  let originalMatchMedia: any

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    }

    originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockReturnValue(mockMediaQueryList)

    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: 2
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia
    }
  })

  it('returns device pixel ratio from window when no custom value provided', () => {
    const dpr = useDevicePixelRatio()
    expect(dpr.value).toBe(2)
  })

  it('returns custom device pixel ratio when provided', () => {
    const dpr = useDevicePixelRatio(1.5)
    expect(dpr.value).toBe(1.5)
  })

  it('returns 1 as default when window is undefined', () => {
    const originalWindow = global.window
    delete (global as any).window

    const dpr = useDevicePixelRatio()
    expect(dpr.value).toBe(1)

    global.window = originalWindow
  })

  it('handles missing matchMedia API gracefully', () => {
    window.matchMedia = undefined as any
    
    const dpr = useDevicePixelRatio()
    expect(dpr.value).toBe(2)
  })

  it('does not update DPR when custom value is provided', () => {
    const dpr = useDevicePixelRatio(1.5)
    
    // Mock window.devicePixelRatio changing
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: 3
    })

    // Should still return the custom value
    expect(dpr.value).toBe(1.5)
  })

  it('handles case when devicePixelRatio is undefined', () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      value: undefined,
      writable: true
    })

    const dpr = useDevicePixelRatio()
    expect(dpr.value).toBe(1)
  })

  it('returns consistent ref type', () => {
    const dpr1 = useDevicePixelRatio()
    const dpr2 = useDevicePixelRatio(2.5)

    expect(typeof dpr1.value).toBe('number')
    expect(typeof dpr2.value).toBe('number')
    expect(dpr1.value).toBe(2)
    expect(dpr2.value).toBe(2.5)
  })

  it('handles parameter changes correctly', () => {
    // Test without custom value
    const dpr1 = useDevicePixelRatio()
    expect(dpr1.value).toBe(2)

    // Test with custom value
    const dpr2 = useDevicePixelRatio(3)
    expect(dpr2.value).toBe(3)

    // Test with different custom value
    const dpr3 = useDevicePixelRatio(0.5)
    expect(dpr3.value).toBe(0.5)
  })

  it('maintains separate instances', () => {
    const dpr1 = useDevicePixelRatio(1)
    const dpr2 = useDevicePixelRatio(2)

    expect(dpr1.value).toBe(1)
    expect(dpr2.value).toBe(2)
    expect(dpr1).not.toBe(dpr2)
  })

  it('handles window object variations', () => {
    // Test with normal window
    Object.defineProperty(window, 'devicePixelRatio', { value: 2.5, writable: true })
    const dpr1 = useDevicePixelRatio()
    expect(dpr1.value).toBe(2.5)

    // Test with window.devicePixelRatio as 0
    Object.defineProperty(window, 'devicePixelRatio', { value: 0, writable: true })
    const dpr2 = useDevicePixelRatio()
    expect(dpr2.value).toBe(1) // Should default to 1 when 0

    // Test with fractional value
    Object.defineProperty(window, 'devicePixelRatio', { value: 1.25, writable: true })
    const dpr3 = useDevicePixelRatio()
    expect(dpr3.value).toBe(1.25)
  })

  it('validates return type is reactive ref', () => {
    const dpr = useDevicePixelRatio()
    
    // Should be a ref object
    expect(dpr).toHaveProperty('value')
    expect(typeof dpr.value).toBe('number')
  })

  it('handles edge cases with custom values', () => {
    // Test with zero (falls back to window.devicePixelRatio due to || operator)
    const dpr1 = useDevicePixelRatio(0)
    expect(dpr1.value).toBe(2) // Falls back to window.devicePixelRatio

    // Test with negative value
    const dpr2 = useDevicePixelRatio(-1)
    expect(dpr2.value).toBe(-1)

    // Test with very large value
    const dpr3 = useDevicePixelRatio(10)
    expect(dpr3.value).toBe(10)

    // Test with fractional value
    const dpr4 = useDevicePixelRatio(1.33333)
    expect(dpr4.value).toBe(1.33333)
  })

  it('works without any parameters', () => {
    const dpr = useDevicePixelRatio(undefined)
    expect(typeof dpr.value).toBe('number')
    expect(dpr.value).toBe(2) // From window.devicePixelRatio
  })

  it('handles different window states', async () => {
    // Test with normal window
    const dpr1 = useDevicePixelRatio()
    expect(dpr1.value).toBe(2)

    // Test state consistency
    await nextTick()
    expect(dpr1.value).toBe(2)
  })

  it('validates matchMedia mock setup', () => {
    expect(window.matchMedia).toBeDefined()
    expect(typeof window.matchMedia).toBe('function')
    
    const result = window.matchMedia('test')
    expect(result).toBe(mockMediaQueryList)
  })
}) 