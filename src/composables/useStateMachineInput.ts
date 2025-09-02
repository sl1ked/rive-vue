import { ref, watch, onUnmounted, type MaybeRef } from 'vue';
import { unref } from 'vue';
import { EventType, Rive, StateMachineInput } from '@rive-app/canvas';

/**
 * Custom composable for fetching a stateMachine input from a rive file.
 *
 * @param rive - Rive instance (reactive or static)
 * @param stateMachineName - Name of the state machine
 * @param inputName - Name of the input
 * @param initialValue - Optional initial value for the input
 * @returns Reactive StateMachineInput
 */
export function useStateMachineInput(
  rive: MaybeRef<Rive | null>,
  stateMachineName?: MaybeRef<string>,
  inputName?: MaybeRef<string>,
  initialValue?: MaybeRef<number | boolean>
) {
  const input = ref<StateMachineInput | null>(null);

  const setStateMachineInput = () => {
    const riveInstance = unref(rive);
    const stateMachine = unref(stateMachineName);
    const inputNameValue = unref(inputName);
    
    if (!riveInstance || !stateMachine || !inputNameValue) {
      input.value = null;
      return;
    }

    const inputs = riveInstance.stateMachineInputs(stateMachine);
    if (inputs) {
      const selectedInput = inputs.find(
        (inp) => inp.name === inputNameValue
      );
      
      if (selectedInput) {
        const initValue = unref(initialValue);
        if (initValue !== undefined) {
          selectedInput.value = initValue;
        }
        input.value = selectedInput;
      } else {
        input.value = null;
      }
    } else {
      input.value = null;
    }
  };

  watch(
    [() => unref(rive), () => unref(stateMachineName), () => unref(inputName)],
    () => {
      setStateMachineInput();
    },
    { immediate: true }
  );

  watch(
    () => unref(rive),
    (riveInstance, oldRiveInstance) => {
      if (oldRiveInstance) {
        oldRiveInstance.off(EventType.Load, setStateMachineInput);
      }
      
      if (riveInstance) {
        riveInstance.on(EventType.Load, setStateMachineInput);
        setStateMachineInput();
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    const riveInstance = unref(rive);
    if (riveInstance) {
      riveInstance.off(EventType.Load, setStateMachineInput);
    }
  });

  return input;
} 