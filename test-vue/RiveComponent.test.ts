import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { computed } from 'vue'
import RiveComponent from '../src-vue/components/RiveComponent.vue'

vi.mock('@rive-app/canvas')

describe('RiveComponent', () => {
  let mockRive: any
  let mockRiveController: any

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

    mockRiveController = {
      rive: computed(() => mockRive),
      isLoaded: computed(() => true),
      createRiveInstance: vi.fn(() => mockRive),
      options: computed(() => ({
        useDevicePixelRatio: true,
        customDevicePixelRatio: 0,
        fitCanvasToArtboardHeight: false,
        useOffscreenRenderer: true,
        shouldResizeCanvasToContainer: true,
        shouldUseIntersectionObserver: true
      }))
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders canvas element and container div', () => {
    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: mockRiveController
      }
    })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('passes canvas attributes correctly', () => {
    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: mockRiveController
      },
      attrs: {
        width: '500',
        height: '400',
        'aria-label': 'Test Animation'
      }
    })

    const canvas = wrapper.find('canvas')
    expect(canvas.attributes('width')).toBe('500')
    expect(canvas.attributes('height')).toBe('400')
    expect(canvas.attributes('aria-label')).toBe('Test Animation')
  })

  it('renders children inside the canvas element', () => {
    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: mockRiveController
      },
      slots: {
        default: '<p>Fallback content</p>'
      }
    })

    expect(wrapper.find('canvas').html()).toContain('<p>Fallback content</p>')
  })

  it('handles null rive controller gracefully', () => {
    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: null
      }
    })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('applies custom class to container', () => {
    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: mockRiveController
      },
      attrs: {
        class: 'custom-class'
      }
    })

    expect(wrapper.find('div').classes()).toContain('custom-class')
  })

  it('has default shouldResizeCanvasToContainer prop', () => {
    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: mockRiveController
      }
    })

    expect(wrapper.vm.shouldResizeCanvasToContainer).toBe(true)
  })

  it('accepts custom shouldResizeCanvasToContainer prop', () => {
    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: mockRiveController,
        shouldResizeCanvasToContainer: false
      }
    })

    expect(wrapper.vm.shouldResizeCanvasToContainer).toBe(false)
  })

  it('handles rive controller without rive instance', () => {
    const controllerWithoutRive = {
      rive: computed(() => null),
      isLoaded: computed(() => false),
      createRiveInstance: vi.fn(() => null),
      options: computed(() => ({}))
    }

    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: controllerWithoutRive
      }
    })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('sets canvas style properties', () => {
    const wrapper = shallowMount(RiveComponent, {
      props: {
        riveController: mockRiveController
      }
    })

    const canvas = wrapper.find('canvas')
    const style = canvas.attributes('style')
    
    // Check that canvas has styling (specific values may vary)
    expect(style).toBeTruthy()
  })
})