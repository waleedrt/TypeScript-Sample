import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootReduxType } from '../../../config/configureStore';

/**
 * Cross-reference different areas of the Redux store to derive necessary
 * information to interact with workflow collection subscriptions.
 *
 * @param {boolean} activeOnly Whether to only return information on
 * active subscriptions. Defaults to `true`.
 */
export default function useSubscribedCollections(activeOnly = true) {
  const collections = useSelector(
    (state: RootReduxType) => state.workflows.collections
  );

  const collectionSubscriptions = useSelector(
    (state: RootReduxType) => state.workflows.collectionSubscriptions
  );

  return useMemo(() => {
    if (!collections || !collectionSubscriptions) return null;

    // Filter out non-Active subscription if indicated.
    const potentiallyFilteredSubscriptions = activeOnly
      ? collectionSubscriptions.filter(
          (subscription) => subscription.active === true
        )
      : collectionSubscriptions;

    const workflowCollectionsReferencedInSubscriptions = potentiallyFilteredSubscriptions.map(
      (subscription) => subscription.workflow_collection
    );

    return collections.filter((collection) =>
      workflowCollectionsReferencedInSubscriptions.includes(collection.detail)
    );
  }, [collectionSubscriptions, collections]);
}
