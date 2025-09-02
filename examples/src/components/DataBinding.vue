<template>
  <RiveComponent :rive-controller="riveController" />
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useRive } from '@/';
import { RiveComponent } from '@/';
import {
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
  useViewModelInstanceNumber,
  useViewModelInstanceString,
  useViewModelInstanceEnum,
  useViewModelInstanceTrigger,
} from '@/';

const randomValue = () => Math.random() * 200 - 100;

const riveController = useRive({
  src: 'stocks.riv',
  artboard: 'Main',
  stateMachines: 'State Machine 1',
  autoplay: true,
  autoBind: false,
});

// Get the default instance of the view model (with type assertions to bypass type issues)

let stockInterval: ReturnType<typeof setInterval> | null = null;

riveController.executeWhenReady(() => {
  const viewModel = useViewModel(riveController.rive, { name: 'Dashboard' });
  const viewModelInstance = useViewModelInstance(
    viewModel as any,
    riveController
  );
  // Get the view model instance properties (with type assertions)
  const { setValue: setTitle } = useViewModelInstanceString(
    'title',
    viewModelInstance as any
  );

  const { setValue: setLogoShape } = useViewModelInstanceEnum(
    'logoShape',
    viewModelInstance as any
  );

  const { setValue: setRootColor } = useViewModelInstanceColor(
    'rootColor',
    viewModelInstance as any
  );

  const { trigger: triggerSpinLogo } = useViewModelInstanceTrigger(
    'triggerSpinLogo',
    viewModelInstance as any
  );

  useViewModelInstanceTrigger('triggerButton', viewModelInstance as any, {
    onTrigger: () => console.log('Button Triggered!'),
  });

  const { setValue: setAppleName } = useViewModelInstanceString(
    'apple/name',
    viewModelInstance as any
  );
  const { setValue: setAppleStockChange } = useViewModelInstanceNumber(
    'apple/stockChange',
    viewModelInstance as any
  );
  const { value: appleColor, setValue: setAppleColor } = useViewModelInstanceColor(
    'apple/currentColor',
    viewModelInstance as any
  );

  // Microsoft Values
  const { setValue: setMicrosoftName } = useViewModelInstanceString(
    'microsoft/name',
    viewModelInstance as any
  );
  const { setValue: setMicrosoftStockChange } = useViewModelInstanceNumber(
    'microsoft/stockChange',
    viewModelInstance as any
  );

  // Tesla Values
  const { setValue: setTeslaName } = useViewModelInstanceString(
    'tesla/name',
    viewModelInstance as any
  );
  const { setValue: setTeslaStockChange } = useViewModelInstanceNumber(
    'tesla/stockChange',
    viewModelInstance as any
  );

  setTitle('Rive Stocks Dashboard');
  setRootColor(parseInt('ffc0ffee', 16));
  setAppleColor(parseInt('ffc0ffee', 16));
  setAppleName('AAPL');
  setMicrosoftName('MSFT');
  setTeslaName('TSLA');
  setLogoShape('triangle');

  stockInterval = setInterval(() => {
    const appleValue = randomValue();
    const microsoftValue = randomValue();
    const teslaValue = randomValue();

    try {
      setAppleStockChange(appleValue);
      setMicrosoftStockChange(microsoftValue);
      setTeslaStockChange(teslaValue);

      if (
        triggerSpinLogo &&
        ((appleValue > 0 && microsoftValue > 0 && teslaValue > 0) ||
          (appleValue < 0 && microsoftValue < 0 && teslaValue < 0))
      ) {
        triggerSpinLogo();
        console.log('Logo spin triggered!');
      }
    } catch (error) {
      console.warn('Error updating stock values:', error);
    }
  }, 2000);
});

onUnmounted(() => {
  if (stockInterval) {
    clearInterval(stockInterval);
  }
});
</script>
