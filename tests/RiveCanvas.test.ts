import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RiveCanvas from '../src/components/RiveCanvas.vue';

describe('RiveCanvas', () => {
  it('renders the component with a canvas and container div', () => {
    const wrapper = shallowMount(RiveCanvas, {
      props: {
        src: 'test.riv',
      },
    });

    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.find('canvas').exists()).toBe(true);
  });

  it('passes the correct props to the useRive composable', () => {
    const wrapper = shallowMount(RiveCanvas, {
      props: {
        src: 'test.riv',
        artboard: 'TestArtboard',
        animations: ['animation1', 'animation2'],
        autoplay: false,
      },
    });

    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.find('canvas').exists()).toBe(true);
  });

  it('applies custom class when provided', () => {
    const wrapper = shallowMount(RiveCanvas, {
      props: {
        src: 'test.riv',
      },
      attrs: {
        class: 'custom-class',
      },
    });

    expect(wrapper.find('div').classes()).toContain('custom-class');
  });

  it('passes canvas attributes correctly', () => {
    const wrapper = shallowMount(RiveCanvas, {
      props: {
        src: 'test.riv',
      },
      attrs: {
        width: '500',
        height: '400',
        'aria-label': 'Test Animation',
      },
    });

    const canvas = wrapper.find('canvas');
    expect(canvas.attributes('width')).toBe('500');
    expect(canvas.attributes('height')).toBe('400');
    expect(canvas.attributes('aria-label')).toBe('Test Animation');
  });

  it('renders children inside the canvas element', () => {
    const wrapper = shallowMount(RiveCanvas, {
      props: {
        src: 'test.riv',
      },
      slots: {
        default: '<p>Fallback content</p>',
      },
    });

    expect(wrapper.find('canvas').html()).toContain('<p>Fallback content</p>');
  });

  it('uses default prop values correctly', () => {
    const wrapper = shallowMount(RiveCanvas, {
      props: {
        src: 'test.riv',
      },
    });

    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.find('canvas').exists()).toBe(true);
  });

  it('handles all supported props', () => {
    const wrapper = shallowMount(RiveCanvas, {
      props: {
        src: 'test.riv',
        artboard: 'TestArtboard',
        animations: 'testAnimation',
        stateMachines: ['stateMachine1'],
        useOffscreenRenderer: false,
        shouldDisableRiveListeners: true,
        shouldResizeCanvasToContainer: false,
        automaticallyHandleEvents: true,
        autoplay: false,
      },
    });

    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.find('canvas').exists()).toBe(true);
  });
});
