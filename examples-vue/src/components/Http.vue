<template>
  <RiveCanvas 
    :src="'https://cdn.rive.app/animations/vehicles.riv'"
    :state-machines="'bumpy'"
    :autoplay="true"
  />
</template>

<script setup lang="ts">
import RiveCanvas from '@/components/RiveCanvas.vue'
</script> 