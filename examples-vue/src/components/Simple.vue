<template>
  <RiveCanvas 
    :src="Avatars"
    :artboard="'Avatar 3'"
    :autoplay="true"
    style="width: 100%; height: 100px;"
  />
</template>

<script setup lang="ts">
import Avatars from '../assets/avatars.riv'
import RiveCanvas from '@/components/RiveCanvas.vue'
</script> 