import { useRef, useEffect } from 'react';

/**
 * An custom hook that can be used to register side-effects
 * when there are no pending API operations of one or more
 * given actionType(s).
 *
 * This hook should be used judiciously as it is tempting
 * to use this when there are other ways to accomplish
 * a given task.
 *
 * @param {Array} pendingAPIOperations
 */
export default function useRegisterReduxAPISideEffect(pendingAPIOperations) {
  const sideEffectsRef = useRef([]);
  const previousPendingAPIOperations = useRef([]);

  const registerSideEffect = (reduxActionTypes, sideEffect) => {
    const actionsAsArray =
      typeof reduxActionTypes === 'string' || reduxActionTypes instanceof String
        ? [reduxActionTypes]
        : reduxActionTypes;

    sideEffectsRef.current = [
      ...sideEffectsRef.current,
      { actions: actionsAsArray, effect: sideEffect }
    ];
  };

  useEffect(() => {
    const completedActions = previousPendingAPIOperations.current.filter(
      operation => !pendingAPIOperations.includes(operation)
    );

    const remainingSideEffects = [];

    sideEffectsRef.current.forEach(registeredEffect => {
      if (
        completedActions.filter(completedAction =>
          registeredEffect.actions.includes(completedAction)
        ).length
      ) {
        registeredEffect.effect();
      } else {
        remainingSideEffects.push(registeredEffect);
      }
    });

    previousPendingAPIOperations.current = [...pendingAPIOperations];
    sideEffectsRef.current = remainingSideEffects;
  }, [pendingAPIOperations]);

  return registerSideEffect;
}
