import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useStateMachineInput } from '../src/composables/useStateMachineInput'

vi.mock('@rive-app/canvas')

describe('useStateMachineInput', () => {
  let mockRive: any
  let mockStateMachineInput: any

  beforeEach(() => {
    mockStateMachineInput = {
      name: 'testInput',
      value: 0,
      type: 1
    }

    mockRive = {
      on: vi.fn(),
      off: vi.fn(),
      stateMachineInputs: vi.fn(() => [mockStateMachineInput])
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no rive instance provided', () => {
    const input = useStateMachineInput(ref(null))
    expect(input.value).toBe(null)
  })

  it('returns null when no state machine name provided', () => {
    const input = useStateMachineInput(ref(mockRive) as any)
    expect(input.value).toBe(null)
  })

  it('returns null when no input name provided', () => {
    const input = useStateMachineInput(ref(mockRive) as any, ref('TestStateMachine'))
    expect(input.value).toBe(null)
  })

  it('finds and returns state machine input when all params provided', () => {
    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      ref('testInput')
    )

    expect(mockRive.stateMachineInputs).toHaveBeenCalledWith('TestStateMachine')
    expect(input.value).toStrictEqual(mockStateMachineInput)
  })

  it('sets initial value when provided', () => {
    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      ref('testInput'),
      ref(42)
    )

    expect(input.value).toStrictEqual(mockStateMachineInput)
    expect(mockStateMachineInput.value).toBe(42)
  })

  it('returns null when input name not found', () => {
    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      ref('nonExistentInput')
    )

    expect(mockRive.stateMachineInputs).toHaveBeenCalledWith('TestStateMachine')
    expect(input.value).toBe(null)
  })

  it('returns null when stateMachineInputs returns null', () => {
    mockRive.stateMachineInputs.mockReturnValue(null)

    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      ref('testInput')
    )

    expect(input.value).toBe(null)
  })

  it('reacts to rive instance changes', async () => {
    const riveRef = ref<any>(null)
    const input = useStateMachineInput(
      riveRef,
      ref('TestStateMachine'),
      ref('testInput')
    )

    expect(input.value).toBe(null)

    riveRef.value = mockRive
    await nextTick()

    expect(input.value).toStrictEqual(mockStateMachineInput)
  })

  it('reacts to state machine name changes', async () => {
    const stateMachineRef = ref('InitialStateMachine')
    const input = useStateMachineInput(
      ref(mockRive) as any,
      stateMachineRef,
      ref('testInput')
    )
    void input

    expect(mockRive.stateMachineInputs).toHaveBeenCalledWith('InitialStateMachine')

    stateMachineRef.value = 'NewStateMachine'
    await nextTick()

    expect(mockRive.stateMachineInputs).toHaveBeenCalledWith('NewStateMachine')
  })

  it('reacts to input name changes', async () => {
    const mockSecondInput = { name: 'secondInput', value: 10, type: 2 }
    mockRive.stateMachineInputs.mockReturnValue([mockStateMachineInput, mockSecondInput])

    const inputNameRef = ref('testInput')
    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      inputNameRef
    )

    expect(input.value).toStrictEqual(mockStateMachineInput)

    inputNameRef.value = 'secondInput'
    await nextTick()

    expect(input.value).toStrictEqual(mockSecondInput)
  })

  it('sets up load event listener on rive instance', () => {
    useStateMachineInput(
      ref(mockRive),
      ref('TestStateMachine'),
      ref('testInput')
    )

    expect(mockRive.on).toHaveBeenCalledWith('load', expect.any(Function))
  })

  it('cleans up old listener when rive instance changes', async () => {
    const oldMockRive = {
      on: vi.fn(),
      off: vi.fn(),
      stateMachineInputs: vi.fn(() => [])
    }

    const riveRef = ref(oldMockRive) as any
    useStateMachineInput(
      riveRef,
      ref('TestStateMachine'),
      ref('testInput')
    )

    expect(oldMockRive.on).toHaveBeenCalled()

    riveRef.value = mockRive
    await nextTick()

    expect(oldMockRive.off).toHaveBeenCalledWith('load', expect.any(Function))
    expect(mockRive.on).toHaveBeenCalledWith('load', expect.any(Function))
  })

  it('handles boolean initial values', () => {
    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      ref('testInput'),
      ref(true)
    )

    expect(mockStateMachineInput.value).toBe(true)
    expect(input.value).toStrictEqual(mockStateMachineInput)
  })

  it('handles reactive initial values', async () => {
    const initialValueRef = ref(100)
    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      ref('testInput'),
      initialValueRef
    )
    void input

    expect(mockStateMachineInput.value).toBe(100)

    // Note: The composable doesn't watch for initialValue changes,
    // it only uses it on initial setup
    initialValueRef.value = 200
    await nextTick()
    
    // Value should remain 100 since initialValue is only used once
    expect(mockStateMachineInput.value).toBe(100)
  })

  it('handles empty inputs array', () => {
    mockRive.stateMachineInputs.mockReturnValue([])

    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      ref('testInput')
    )

    expect(input.value).toBe(null)
  })

  it('calls setStateMachineInput on load event', () => {
    let loadCallback: Function | undefined
    mockRive.on.mockImplementation((event: string, callback: Function) => {
      if (event === 'load') {
        loadCallback = callback
      }
    })

    const input = useStateMachineInput(
      ref(mockRive) as any,
      ref('TestStateMachine'),
      ref('testInput')
    )
    void input

    // Initially called multiple times due to immediate watch
    expect(mockRive.stateMachineInputs).toHaveBeenCalledTimes(2)

    if (loadCallback) {
      loadCallback()
    }

    // Should be called again on load event
    expect(mockRive.stateMachineInputs).toHaveBeenCalledTimes(3)
  })
}) 