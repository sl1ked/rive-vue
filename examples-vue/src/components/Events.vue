<template>
  <RiveComponent :rive-controller="riveController" />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRive } from '@/composables/useRive'
import RiveComponent from '@/components/RiveComponent.vue'
import { EventType, RiveEventType } from '@rive-app/canvas'
import Rating from '../assets/rating.riv'

const riveController = useRive({
  src: Rating,
  stateMachines: 'State Machine 1',
  autoplay: true,
  automaticallyHandleEvents: true,
})

const onRiveEventReceived = (riveEvent: any) => {
  console.log('Rive event received:', riveEvent)
  const eventData = riveEvent.data
  const eventProperties = eventData.properties
  if (eventData.type === RiveEventType.General) {
    console.log('Event name', eventData.name)
    console.log('Rating', eventProperties.rating)
    console.log('Message', eventProperties.message)
  }
}

// Wait until the rive object is instantiated before adding the Rive
// event listener
watch(() => riveController.rive.value, (rive) => {
  if (rive) {
    rive.on(EventType.RiveEvent, onRiveEventReceived)
  }
}, { immediate: true })
</script> 