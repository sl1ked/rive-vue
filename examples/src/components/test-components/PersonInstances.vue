<template>
  <div>
    <RiveComponent
      :rive-controller="riveController"
      style="width: 400px; height: 400px"
    />
    <div v-if="!riveController.rive.value" data-testid="loading-text">
      Loading…
    </div>
    <div v-else>
      <button
        data-testid="select-steve"
        @click="switchToNamedInstance('Steve')"
        :disabled="!useDefaultInstance && activeInstance === 'Steve'"
      >
        Steve
      </button>
      <button
        data-testid="select-jane"
        @click="switchToNamedInstance('Jane')"
        :disabled="!useDefaultInstance && activeInstance === 'Jane'"
      >
        Jane
      </button>
      <button
        data-testid="select-default"
        @click="switchToDefaultInstance"
        :disabled="useDefaultInstance"
      >
        Default
      </button>
      <div>
        <h3 data-testid="instance-name">
          Instance: {{ useDefaultInstance ? 'Default' : activeInstance }}
        </h3>
        <p data-testid="person-name">Name: {{ instanceName }}</p>
        <p data-testid="person-age">Age: {{ instanceAge }}</p>
        <p data-testid="person-country">Country: {{ instanceCountry }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceString,
  useViewModelInstanceNumber,
  useViewModelInstanceEnum,
  RiveComponent,
} from '../../../../src';

interface Props {
  src: string;
}

const props = defineProps<Props>();

const activeInstance = ref('Steve');
const useDefaultInstance = ref(false);

const riveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: 'Artboard',
  stateMachines: 'State Machine 1',
});

const viewModel = useViewModel(riveController.rive, {
  name: 'PersonViewModel',
});

const params = computed(() =>
  useDefaultInstance.value
    ? { useDefault: true, ...riveController }
    : { name: activeInstance.value, ...riveController }
);

const viewModelInstance = useViewModelInstance(viewModel as any, params);

const { value: instanceName } = useViewModelInstanceString(
  'name',
  viewModelInstance as any
);
const { value: instanceAge } = useViewModelInstanceNumber(
  'age',
  viewModelInstance as any
);
const { value: instanceCountry } = useViewModelInstanceEnum(
  'country',
  viewModelInstance as any
);

const switchToNamedInstance = (instanceName: string) => {
  activeInstance.value = instanceName;
  useDefaultInstance.value = false;
};

const switchToDefaultInstance = () => {
  useDefaultInstance.value = true;
};
</script>
