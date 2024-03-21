import { useEffect, useMemo } from 'react';
import { Keyboard, KeyboardEvent, KeyboardEventListener } from 'react-native';

interface useKeyboardEventCallbacksType {
  keyboardDidShowCallback?: (event: KeyboardEvent) => void;
  keyboardDidHideCallback?: (event: KeyboardEvent) => void;
  keyboardWillShowCallback?: (event: KeyboardEvent) => void;
  keyboardWillHideCallback?: (event: KeyboardEvent) => void;
}

/**
 * A custom hook that allows the client to setup callbacks
 * for keyboard events.
 *
 * Important note: For performance reasons, we utilized
 * useMemo here. The side effect of this is that once
 * the callbacks are set in the client, they cannot
 * be changed until the component unmounts/remounts.
 */
function useKeyboardEventCallbacks({
  keyboardDidShowCallback = (event: KeyboardEvent) => null,
  keyboardDidHideCallback = (event: KeyboardEvent) => null,
  keyboardWillShowCallback = (event: KeyboardEvent) => null,
  keyboardWillHideCallback = (event: KeyboardEvent) => null
}: useKeyboardEventCallbacksType) {
  const memoizedKeyboardDidShowCallback = useMemo<KeyboardEventListener>(
    () => keyboardDidShowCallback,
    []
  );

  const memoizedKeyboardDidHideCallback = useMemo<KeyboardEventListener>(
    () => keyboardDidHideCallback,
    []
  );

  const memoizedKeyboardWillShowCallback = useMemo<KeyboardEventListener>(
    () => keyboardWillShowCallback,
    []
  );

  const memoizedKeyboardWillHideCallback = useMemo<KeyboardEventListener>(
    () => keyboardWillHideCallback,
    []
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      memoizedKeyboardDidShowCallback
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      memoizedKeyboardDidHideCallback
    );
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      memoizedKeyboardWillShowCallback
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      memoizedKeyboardWillHideCallback
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [
    memoizedKeyboardWillShowCallback,
    memoizedKeyboardDidShowCallback,
    memoizedKeyboardWillHideCallback,
    memoizedKeyboardDidHideCallback
  ]);
}

export default useKeyboardEventCallbacks;
