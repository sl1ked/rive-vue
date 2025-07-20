<template>
  <div id="app">
    <h1>Rive Vue Component Demo</h1>

    <div class="demo-container">
      <h2>1. RiveCanvas - Declarative API</h2>
      <p>Pass props to configure the animation</p>
      <RiveCanvas :src="RiveAni" :animations="['dark', 'light']" style="width:
      100%; height: 300px; border: 1px solid #ccc" :autoplay="true" />
    </div>

    <div class="demo-container">
      <h2>2. useRive + RiveComponent - Imperative API</h2>
      <p>Control the Rive instance programmatically</p>
      <div class="controls">
        <button @click="playAnimation" :disabled="!riveController.rive.value">
          Play
        </button>
        <button @click="pauseAnimation" :disabled="!riveController.rive.value">
          Pause
        </button>
        <button @click="stopAnimation" :disabled="!riveController.rive.value">
          Stop
        </button>
      </div>
      <RiveComponent
        :riveController="riveController"
        style="
          width: 400px;
          height: 300px;
          border: 1px solid #42b983;
          margin-top: 10px;
        "
      />
      <p v-if="riveController.isLoaded.value" style="color: green">
        ✓ Animation loaded
      </p>
      <p v-else style="color: orange">Loading animation...</p>
    </div>

    <div class="demo-container">
      <h2>3. Multiple Instances</h2>
      <p>Each useRive call creates an independent instance</p>
      <div style="display: flex; gap: 20px; justify-content: center">
        <div>
          <h4>Instance 1</h4>
          <RiveComponent
            :riveController="riveController2"
            style="width: 200px; height: 200px; border: 1px solid #ff6b6b"
          />
        </div>
        <div>
          <h4>Instance 2</h4>
          <RiveComponent
            :riveController="riveController3"
            style="width: 200px; height: 200px; border: 1px solid #4ecdc4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RiveCanvas, RiveComponent, useRive } from '../../src-vue/index';
import RiveAni from './gnome2.riv';
// Declarative approach - just use the component with props
// No JavaScript needed, everything configured via props

// Imperative approach - get control over the Rive instance
const riveController = useRive({
  src: 'https://cdn.rive.app/animations/vehicles.riv',
  artboard: 'Truck',
  animations: ['idle'],
  autoplay: false, // We'll control this manually
});

// Multiple independent instances
const riveController2 = useRive({
  src: 'https://cdn.rive.app/animations/vehicles.riv',
  artboard: 'Truck',
  animations: ['curves'],
  autoplay: true,
});

const riveController3 = useRive({
  src: 'https://cdn.rive.app/animations/vehicles.riv',
  artboard: 'Truck',
  animations: ['idle'],
  autoplay: true,
});

// Control functions for the imperative example
const playAnimation = () => {
  if (riveController.rive.value) {
    riveController.rive.value.play();
  }
};

const pauseAnimation = () => {
  if (riveController.rive.value) {
    riveController.rive.value.pause();
  }
};

const stopAnimation = () => {
  if (riveController.rive.value) {
    riveController.rive.value.stop();
  }
};

// You can also listen to Rive events
// if (riveController.rive) {
//   riveController.rive.on('load', () => {
//     console.log('Animation loaded!');
//   });
// }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  padding: 20px;
  max-width: 1000px;
}

.demo-container {
  margin: 40px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.controls {
  margin: 10px 0;
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background-color: #369870;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

h1 {
  color: #42b983;
  margin-bottom: 40px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

h4 {
  margin: 5px 0;
  color: #555;
}

p {
  color: #666;
  margin-bottom: 15px;
}
</style>
