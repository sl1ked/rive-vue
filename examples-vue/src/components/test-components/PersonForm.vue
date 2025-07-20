<template>
  <div>
    <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
    <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
    <form v-else @submit="handleFormSubmit">
      <div>
        <label>
          Name:
          <input
            data-testid="name-input"
            type="text"
            :value="name || ''"
            @input="setName(($event.target as HTMLInputElement).value)"
          />
        </label>
        <div data-testid="name-value">{{ name }}</div>
      </div>
      <div>
        <label>
          Age:
          <input
            data-testid="age-input"
            type="number"
            :value="age || 0"
            @input="setAge(Number(($event.target as HTMLInputElement).value))"
          />
        </label>
        <div data-testid="age-value">{{ age }}</div>
      </div>
      <div>
        <label>
          <input
            data-testid="terms-checkbox"
            type="checkbox"
            :checked="agreedToTerms || false"
            @change="setAgreedToTerms(($event.target as HTMLInputElement).checked)"
          />
          Agree to Terms
        </label>
        <div data-testid="terms-value">{{ agreedToTerms ? 'true' : 'false' }}</div>
      </div>
      <div>
        <label>
          Favorite Color:
          <div 
            data-testid="color-value" 
            :style="{ 
              backgroundColor: colorNumberToHexString(colorNum), 
              width: '20px', 
              height: '20px', 
              display: 'inline-block', 
              marginLeft: '10px' 
            }"
          ></div>
        </label>
        <button
          data-testid="set-color-red"
          type="button"
          @click="setRgb(255, 0, 0)"
        >
          Red
        </button>
        <button
          data-testid="set-color-blue"
          type="button"
          @click="setRgb(0, 0, 255)"
        >
          Blue
        </button>
      </div>
      <div>
        <label>
          Country:
          <select
            data-testid="country-select"
            :value="country || ''"
            @change="setCountry(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
        <div data-testid="country-value">{{ country }}</div>
      </div>
      <div>
        <label>
          Favorite Drink Type:
          <select
            data-testid="drink-type-select"
            :value="drinkType || ''"
            @change="setDrinkType(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="dt in drinkTypes" :key="dt" :value="dt">{{ dt }}</option>
          </select>
        </label>
        <div data-testid="drink-type-value">{{ drinkType }}</div>
      </div>
      <div>
        <button data-testid="submit-button" type="submit">Submit</button>
        <button data-testid="reset-button" type="button" @click="handleFormReset">Reset</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { 
  useRive, 
  useViewModelInstanceString,
  useViewModelInstanceNumber,
  useViewModelInstanceBoolean,
  useViewModelInstanceColor,
  useViewModelInstanceEnum,
  useViewModelInstanceTrigger,
  RiveComponent,
  useViewModelInstance,
  useViewModel
} from '../../../../src-vue';

interface Props {
  src: string;
}

const props = defineProps<Props>();

const riveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: "Artboard",
  autoBind: true,
  stateMachines: "State Machine 1",
});

const viewModel = useViewModel(riveController.rive);
const viewModelInstance = useViewModelInstance(
  viewModel as any,
  riveController
);
// Basic properties
const { value: name, setValue: setName } = useViewModelInstanceString('name', viewModelInstance as any);
const { value: age, setValue: setAge } = useViewModelInstanceNumber('age', viewModelInstance as any);
const { value: agreedToTerms, setValue: setAgreedToTerms } = useViewModelInstanceBoolean('agreedToTerms', viewModelInstance as any);
const { value: colorNum, setRgb } = useViewModelInstanceColor('favColor', viewModelInstance as any);
const { value: country, setValue: setCountry, values: countries } = useViewModelInstanceEnum('country', viewModelInstance as any);
const { trigger: onFormSubmit } = useViewModelInstanceTrigger('onFormSubmit', viewModelInstance as any);
const { trigger: onFormReset } = useViewModelInstanceTrigger('onFormReset', viewModelInstance as any);

// Nested property
const { value: drinkType, setValue: setDrinkType, values: drinkTypes } = useViewModelInstanceEnum('favDrink/type', viewModelInstance);

const colorNumberToHexString = (colorNum: number | null) => {
  if (colorNum === null) return 'N/A';
  const unsignedInt = colorNum >>> 0;
  const r = (unsignedInt >> 16) & 0xff;
  const g = (unsignedInt >> 8) & 0xff;
  const b = unsignedInt & 0xff;
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const handleFormReset = () => {
  setName('');
  setAge(0);
  setAgreedToTerms(false);
  setRgb(0, 0, 0);
  if (countries?.length) setCountry(countries[0]);
  if (drinkTypes?.length) setDrinkType(drinkTypes[0]);
  onFormReset();
};

const handleFormSubmit = (e: Event) => {
  e.preventDefault();
  onFormSubmit();
};
</script> 