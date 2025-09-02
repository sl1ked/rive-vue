<template>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 20px">
    <div style="width: 400px; height: 300px; border: 1px solid #ccc">
      <RiveComponent :rive-controller="riveController" />
    </div>
    <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
    <div v-else style="display: flex; gap: 10px; align-items: center">
      <button
        @click="loadRandomImage"
        :disabled="isLoading"
        data-testid="load-random-image"
      >
        {{ isLoading ? 'Loading...' : 'Load Random Image' }}
      </button>
      <button
        @click="clearImage"
        :disabled="isLoading"
        data-testid="clear-image"
      >
        Clear Image
      </button>
    </div>
    <div v-if="currentImageUrl" style="font-size: 12px; color: #666">
      <span data-testid="current-image-url">Current image: {{ currentImageUrl }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  useRive, 
  useViewModel, 
  useViewModelInstance,
  useViewModelInstanceImage,
  decodeImage,
  RiveComponent 
} from '../../../../src';

interface Props {
  src: string;
}

const props = defineProps<Props>();

const currentImageUrl = ref('');
const isLoading = ref(false);

const riveController = useRive({
  src: props.src,
  artboard: "Artboard",
  stateMachines: "State Machine 1",
  autoplay: true,
  autoBind: false,
});

const viewModel = useViewModel(riveController.rive);    
const viewModelInstance = useViewModelInstance(
  viewModel as any,
  riveController
);
// For now, use simplified approach
const { setValue: setImage } = useViewModelInstanceImage('image', viewModelInstance as any);

const loadRandomImage = async () => {
  if (!setImage) return;
  isLoading.value = true;
  try {
    const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    currentImageUrl.value = imageUrl;
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    const decodedImage = await decodeImage(new Uint8Array(imageBuffer));
    setImage(decodedImage);
    decodedImage.unref();
  } catch (error) {
    console.error('Failed to load image:', error);
  } finally {
    isLoading.value = false;
  }
};

const clearImage = () => {
  if (setImage) {
    setImage(null);
    currentImageUrl.value = '';
  }
};
</script> 