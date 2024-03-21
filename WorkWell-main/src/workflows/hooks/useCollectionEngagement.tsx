import { useSelector } from 'react-redux';

import { RootReduxType } from '../../../config/configureStore';
import { WorkflowCollectionEngagementSummaryType } from '../types';

/**
 * Return the current collectionEngagement value from Redux store.
 */
export default function useCollectionEngagement():
  | WorkflowCollectionEngagementSummaryType
  | null
  | undefined {
  return useSelector(
    (state: RootReduxType) => state.workflows.collectionEngagement
  );
}
