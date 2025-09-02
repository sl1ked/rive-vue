<template>
  <div>
    <!-- String Property Test -->
    <div v-if="currentTest === 'string'">
      <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
      <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
      <div v-else>
        <label>
          Name:
          <input
            data-testid="name-input"
            type="text"
            :value="name || ''"
            @input="setName($event.target.value)"
          />
        </label>
        <div data-testid="name-value">{{ name }}</div>
      </div>
    </div>

    <!-- Number Property Test -->
    <div v-if="currentTest === 'number'">
      <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
      <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
      <div v-else>
        <label>
          Age:
          <input
            data-testid="age-input"
            type="number"
            :value="age ?? 0"
            @input="setAge(Number($event.target.value))"
          />
        </label>
        <div data-testid="age-value">{{ age }}</div>
      </div>
    </div>

    <!-- Boolean Property Test -->
    <div v-if="currentTest === 'boolean'">
      <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
      <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
      <div v-else>
        <label>
          <input
            data-testid="terms-checkbox"
            type="checkbox"
            :checked="agreedToTerms ?? false"
            @change="setAgreedToTerms($event.target.checked)"
          />
          Agree to Terms
        </label>
        <div data-testid="terms-value">{{ agreedToTerms ? 'true' : 'false' }}</div>
      </div>
    </div>

    <!-- Color Property Test -->
    <div v-if="currentTest === 'color'">
      <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
      <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
      <div v-else>
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
          <div data-testid="number-value">
            Number value: {{ typeof colorNum === 'number' ? colorNum : 'N/A' }}
          </div>
          <div data-testid="hex-value">
            Hex value: {{ colorNumberToHexString(colorNum) }}
          </div>
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
    </div>

    <!-- Enum Property Test -->
    <div v-if="currentTest === 'enum'">
      <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
      <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
      <div v-else>
        <label>
          Country:
          <select
            data-testid="country-select"
            :value="country || ''"
            @change="setCountry($event.target.value)"
          >
            <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
        <div data-testid="country-value">{{ country }}</div>
      </div>
    </div>

    <!-- Nested ViewModel Test -->
    <div v-if="currentTest === 'nested'">
      <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
      <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
      <div v-else>
        <label>
          Favorite Drink Type:
          <select
            data-testid="drink-type-select"
            :value="drinkType || ''"
            @change="setDrinkType($event.target.value)"
          >
            <option v-for="dt in drinkTypes" :key="dt" :value="dt">{{ dt }}</option>
          </select>
        </label>
        <div data-testid="drink-type-value">{{ drinkType }}</div>
      </div>
    </div>

    <!-- Trigger Property Test -->
    <div v-if="currentTest === 'trigger'">
      <RiveComponent :rive-controller="riveController" style="width: 400px; height: 400px" />
      <div v-if="!riveController.rive.value" data-testid="loading-text">Loading…</div>
      <div v-else>
        <button data-testid="submit-button" type="button" @click="handleSubmit">Submit</button>
        <button data-testid="reset-button" type="button" @click="handleReset">Reset</button>
        <div data-testid="callback-triggered">
          Last callback triggered: {{ callbackTriggered || 'none' }}
        </div>
      </div>
    </div>

    <!-- Person Instances Test -->
    <div v-if="currentTest === 'instances'">
      <RiveComponent :rive-controller="instanceRiveController" style="width: 400px; height: 400px" />
      <div v-if="!instanceRiveController.rive.value" data-testid="loading-text">Loading…</div>
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
          <h3 data-testid="instance-name">Instance: {{ useDefaultInstance ? 'Default' : activeInstance }}</h3>
          <p data-testid="person-name">Name: {{ instanceName }}</p>
          <p data-testid="person-age">Age: {{ instanceAge }}</p>
          <p data-testid="person-country">Country: {{ instanceCountry }}</p>
        </div>
      </div>
    </div>

    <!-- Image Property Test -->
    <div v-if="currentTest === 'image'">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px">
        <div style="width: 400px; height: 300px; border: 1px solid #ccc">
          <RiveComponent :rive-controller="imageRiveController" />
        </div>
        <div v-if="!imageRiveController.rive.value" data-testid="loading-text">Loading…</div>
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
    </div>

    <!-- Todo List Test -->
    <div v-if="currentTest === 'todolist'">
      <RiveComponent :rive-controller="todoRiveController" style="width: 400px; height: 400px" />
      <div v-if="!todoRiveController.rive.value" data-testid="loading-text">Loading…</div>
      <div v-else>
        <div data-testid="list-length">Items: {{ todoLength }}</div>
        <div style="margin-bottom: 10px; display: flex; gap: 8px; flex-wrap: wrap">
          <button data-testid="add-item-button" @click="handleAddItem">
            Add Item (End)
          </button>
          <button 
            data-testid="add-item-at-button" 
            @click="handleAddItemAt"
            :disabled="(todoLength ?? 0) === 0"
          >
            Add Item at Index 1
          </button>
          <button 
            data-testid="remove-instance-button" 
            @click="handleRemoveFirstInstance"
            :disabled="(todoLength ?? 0) === 0"
          >
            Remove First (by Instance)
          </button>
          <button 
            data-testid="remove-index-button" 
            @click="handleRemoveFirstByIndex"
            :disabled="(todoLength ?? 0) === 0"
          >
            Remove First (by Index)
          </button>
          <button 
            data-testid="swap-button" 
            @click="handleSwapItems"
            :disabled="(todoLength ?? 0) < 2"
          >
            Swap First Two
          </button>
        </div>
        <div data-testid="todo-items">
          <TodoItemComponent
            v-for="index in (todoLength ?? 0)"
            :key="index"
            :index="index - 1"
            :todo-item="todoGetInstanceAt(index - 1)"
          />
        </div>
      </div>
    </div>

    <!-- Person Form Test -->
    <div v-if="currentTest === 'form'">
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
              @input="setName($event.target.value)"
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
              @input="setAge(Number($event.target.value))"
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
              @change="setAgreedToTerms($event.target.checked)"
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
              @change="setCountry($event.target.value)"
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
              @change="setDrinkType($event.target.value)"
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
  useViewModelInstanceBoolean,
  useViewModelInstanceColor,
  useViewModelInstanceEnum,
  useViewModelInstanceTrigger,
  useViewModelInstanceImage,
  useViewModelInstanceList,
  decodeImage,
  RiveComponent 
} from '@/';
import TodoItemComponent from './test-components/TodoItemComponent.vue';

interface Props {
  src: string;
  testType: 'string' | 'number' | 'boolean' | 'color' | 'enum' | 'nested' | 'trigger' | 'instances' | 'image' | 'todolist' | 'form';
}

const props = defineProps<Props>();
const currentTest = computed(() => props.testType);

// Base Rive controller
const riveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: "Artboard",
  autoBind: true,
  stateMachines: "State Machine 1",
});

// Instance test controller (separate instance)
const instanceRiveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: "Artboard",
  stateMachines: "State Machine 1",
});

// Image test controller
const imageRiveController = useRive({
  src: props.src,
  artboard: "Artboard",
  stateMachines: "State Machine 1",
  autoplay: true,
  autoBind: false,
});

// Todo list controller
const todoRiveController = useRive({
  src: props.src,
  autoplay: true,
  artboard: "Artboard",
  autoBind: false,
  stateMachines: "State Machine 1",
});

// Basic properties
const { value: name, setValue: setName } = useViewModelInstanceString('name', riveController.rive?.value?.viewModelInstance);
const { value: age, setValue: setAge } = useViewModelInstanceNumber('age', riveController.rive?.value?.viewModelInstance);
const { value: agreedToTerms, setValue: setAgreedToTerms } = useViewModelInstanceBoolean('agreedToTerms', riveController.rive?.value?.viewModelInstance);
const { value: colorNum, setValue: setColor, setRgb } = useViewModelInstanceColor('favColor', riveController.rive?.value?.viewModelInstance);
const { value: country, setValue: setCountry, values: countries } = useViewModelInstanceEnum('country', riveController.rive?.value?.viewModelInstance);
const { trigger: onFormSubmit } = useViewModelInstanceTrigger('onFormSubmit', riveController.rive?.value?.viewModelInstance);
const { trigger: onFormReset } = useViewModelInstanceTrigger('onFormReset', riveController.rive?.value?.viewModelInstance);

// Nested property
const { value: drinkType, setValue: setDrinkType, values: drinkTypes } = useViewModelInstanceEnum('favDrink/type', riveController.rive?.value?.viewModelInstance);

// Trigger test state
const callbackTriggered = ref('');
const { trigger: onSubmitTrigger } = useViewModelInstanceTrigger('onFormSubmit', riveController.rive?.value?.viewModelInstance, {
  onTrigger: () => { callbackTriggered.value = 'submit-callback'; }
});
const { trigger: onResetTrigger } = useViewModelInstanceTrigger('onFormReset', riveController.rive?.value?.viewModelInstance, {
  onTrigger: () => { callbackTriggered.value = 'reset-callback'; }
});

// Instance test state
const activeInstance = ref('Steve');
const useDefaultInstance = ref(false);
const instanceViewModel = useViewModel(instanceRiveController.rive, { name: 'PersonViewModel' });
const params = computed(() => useDefaultInstance.value ? { useDefault: true, rive: instanceRiveController.rive?.value } : { name: activeInstance.value, rive: instanceRiveController.rive?.value });
const instanceViewModelInstance = useViewModelInstance(instanceViewModel, params);
const { value: instanceName } = useViewModelInstanceString('name', instanceViewModelInstance);
const { value: instanceAge } = useViewModelInstanceNumber('age', instanceViewModelInstance);
const { value: instanceCountry } = useViewModelInstanceEnum('country', instanceViewModelInstance);

// Image test state
const currentImageUrl = ref('');
const isLoading = ref(false);
const imageViewModel = useViewModel(imageRiveController.rive, { name: 'Post' });
const imageViewModelInstance = useViewModelInstance(imageViewModel, { rive: imageRiveController.rive?.value });
const { setValue: setImage } = useViewModelInstanceImage('image', imageViewModelInstance);

// Todo list state
const todoViewModel = useViewModel(todoRiveController.rive, { name: 'TodoList' });
const todoViewModelInstance = useViewModelInstance(todoViewModel, { rive: todoRiveController.rive?.value });
const {
  length: todoLength,
  addInstance: todoAddInstance,
  addInstanceAt: todoAddInstanceAt,
  removeInstance: todoRemoveInstance,
  removeInstanceAt: todoRemoveInstanceAt,
  getInstanceAt: todoGetInstanceAt,
  swap: todoSwap
} = useViewModelInstanceList('items', todoViewModelInstance);

// Helper functions
const colorNumberToHexString = (colorNum: number | null) => {
  if (colorNum === null) return 'N/A';
  const unsignedInt = colorNum >>> 0;
  const r = (unsignedInt >> 16) & 0xff;
  const g = (unsignedInt >> 8) & 0xff;
  const b = unsignedInt & 0xff;
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Event handlers
const handleSubmit = () => onSubmitTrigger();
const handleReset = () => onResetTrigger();

const switchToNamedInstance = (instanceName: string) => {
  activeInstance.value = instanceName;
  useDefaultInstance.value = false;
};

const switchToDefaultInstance = () => {
  useDefaultInstance.value = true;
};

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

const handleAddItem = () => {
  const todoItemViewModel = todoRiveController.rive?.value?.viewModelByName?.('TodoItem');
  if (todoItemViewModel) {
    const newTodoItem = todoItemViewModel.instance?.();
    if (newTodoItem) {
      todoAddInstance(newTodoItem);
    }
  }
};

const handleAddItemAt = () => {
  const todoItemViewModel = todoRiveController.rive?.value?.viewModelByName?.('TodoItem');
  if (todoItemViewModel && (todoLength ?? 0) > 0) {
    const newTodoItem = todoItemViewModel.instance?.();
    if (newTodoItem) {
      todoAddInstanceAt(newTodoItem, 1);
    }
  }
};

const handleRemoveFirstInstance = () => {
  const firstInstance = todoGetInstanceAt(0);
  if (firstInstance) {
    todoRemoveInstance(firstInstance);
  }
};

const handleRemoveFirstByIndex = () => {
  if ((todoLength ?? 0) > 0) {
    todoRemoveInstanceAt(0);
  }
};

const handleSwapItems = () => {
  if ((todoLength ?? 0) >= 2) {
    todoSwap(0, 1);
  }
};

const handleFormReset = () => {
  setName('');
  setAge(0);
  setAgreedToTerms(false);
  setRgb(0, 0, 0);
  setCountry(countries.value[0]);
  setDrinkType(drinkTypes.value[0]);
  onFormReset();
};

const handleFormSubmit = (e: Event) => {
  e.preventDefault();
  onFormSubmit();
};
</script> 