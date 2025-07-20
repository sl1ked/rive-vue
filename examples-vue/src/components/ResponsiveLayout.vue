<template>
  <RiveComponent :rive-controller="riveController" />
</template>

<script setup lang="ts">
import { useRive } from '@/composables/useRive'
import RiveComponent from '@/components/RiveComponent.vue'
import { Fit, Layout } from '@rive-app/canvas'

const riveController = useRive({
  src: 'layout_test.riv',
  artboard: 'Artboard',
  stateMachines: 'State Machine 1',
  autoplay: true,
  layout: new Layout({
    fit: Fit.Layout,
  }),
})
</script> 