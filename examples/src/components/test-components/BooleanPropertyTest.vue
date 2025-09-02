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
      <label>
        <input
          data-testid="terms-checkbox"
          type="checkbox"
          :checked="agreedToTerms ?? false"
          @change="
            setAgreedToTerms(($event.target as HTMLInputElement).checked)
          "
        />
        Agree to Terms
      </label>
      <div data-testid="terms-value">
        {{ agreedToTerms ? 'true' : 'false' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useRive,
  useViewModelInstanceBoolean,
  RiveComponent,
  useViewModelInstance,
  useViewModel,
} from '../../../../src';

interface Props {
  src: string;
}

const props = defineProps<Props>();

const riveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: 'Artboard',
  autoBind: true,
  stateMachines: 'State Machine 1',
});

const viewModel = useViewModel(riveController.rive);
const viewModelInstance = useViewModelInstance(
  viewModel as any,
  riveController
);

const { value: agreedToTerms, setValue: setAgreedToTerms } =
  useViewModelInstanceBoolean('agreedToTerms', viewModelInstance as any);
</script>
