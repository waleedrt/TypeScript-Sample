import { useSelector } from 'react-redux';

import { RootReduxType } from '../../config/configureStore';

/**
 * Custom hook which returns an array of pending API
 * operations from anywhere in the Redux store.
 */
export default function useGlobalPendingAPIOperations() {
  return useSelector((state: RootReduxType) => [
    ...state.main.pendingActions,
    ...state.auth.pendingActions,
    ...state.chronologicalUserProfile.pendingActions,
    ...state.myd.pendingActions,
    ...state.workflows.pendingActions,
    ...state.workflowHistory.pendingActions,
  ]);
}
