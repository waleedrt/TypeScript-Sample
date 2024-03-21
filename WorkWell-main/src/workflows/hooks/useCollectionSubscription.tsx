import { useSelector } from 'react-redux';

import { RootReduxType } from '../../../config/configureStore';
import {
  WorkflowCollectionDetailType,
  WorkflowCollectionSubscriptionType,
} from '../types';

/**
 * Return the user's subscription for a given workflow collection if it exists.
 */
export default function useCollectionSubscription(
  collection: WorkflowCollectionDetailType | null
): WorkflowCollectionSubscriptionType | undefined {
  return useSelector((state: RootReduxType) =>
    collection
      ? state.workflows.collectionSubscriptions?.find(
          (subscription) =>
            subscription.workflow_collection === collection.self_detail
        )
      : undefined
  );
}
