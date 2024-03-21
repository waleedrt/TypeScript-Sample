import { useSelector } from 'react-redux';

/**
 * Return a boolean indicating if there are pending API
 * actions in the `workflows` section of the Redux store.
 */
export default useWaitingOnAPI = () => {
  const pendingAPIActions = useSelector(
    state => state.workflows.pendingActions.length > 0
  );
  return pendingAPIActions;
};
