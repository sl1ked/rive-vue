import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock DOM APIs that aren't available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: vi.fn().mockImplementation(cb => setTimeout(cb, 16))
})

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: vi.fn().mockImplementation(id => clearTimeout(id))
})

// Mock Rive dependencies globally for all Vue tests
vi.mock('@rive-app/canvas', () => ({
  Rive: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    off: vi.fn(),
    stop: vi.fn(),
    cleanup: vi.fn(),
    startRendering: vi.fn(),
    stopRendering: vi.fn(),
    resizeToCanvas: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    isPlaying: false,
    isPaused: false,
    animationNames: [],
    stateMachineInputs: vi.fn(() => []),
    bounds: { maxX: 100, maxY: 100 }
  })),
  RiveFile: vi.fn().mockImplementation(() => ({
    cleanup: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    init: vi.fn(),
    getInstance: vi.fn()
  })),
  Layout: vi.fn(),
  Fit: {
    Cover: 'cover',
    Contain: 'contain',
    Fill: 'fill',
    FitWidth: 'fitWidth',
    FitHeight: 'fitHeight',
    None: 'none',
    ScaleDown: 'scaleDown',
    Layout: 'layout'
  },
  Alignment: {
    Center: 'center',
    TopLeft: 'topLeft',
    TopCenter: 'topCenter',
    TopRight: 'topRight',
    CenterLeft: 'centerLeft',
    CenterRight: 'centerRight',
    BottomLeft: 'bottomLeft',
    BottomCenter: 'bottomCenter',
    BottomRight: 'bottomRight'
  },
  EventType: {
    Load: 'load',
    LoadError: 'loadError',
    Play: 'play',
    Pause: 'pause',
    Stop: 'stop',
    Loop: 'loop',
    Draw: 'draw',
    Advance: 'advance',
    StateChange: 'statechange',
    RiveEvent: 'riveevent'
  },
  StateMachineInputType: {
    Number: 1,
    Boolean: 2,
    Trigger: 3
  }
}))

// Global test configuration for Vue Test Utils
config.global.stubs = {
  // Stub transition components if needed
  transition: false,
  'transition-group': false
} 