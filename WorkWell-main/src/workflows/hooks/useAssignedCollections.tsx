import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootReduxType } from '../../../config/configureStore';

/**
 * Cross-reference different areas of the Redux store to derive necessary
 * information to display assigned workflow collections.
 */
export default function useAssignedCollections() {
  const { collections, collectionAssignments } = useSelector(
    (state: RootReduxType) => ({
      collections: state.workflows.collections,
      collectionAssignments: state.workflows.collectionAssignments,
    })
  );

  return useMemo(() => {
    if (!collectionAssignments) return null;

    const workflowCollectionsReferencedInAssignments = collectionAssignments.map(
      (assignment) => assignment.workflow_collection
    );

    return collections.filter((collection) =>
      workflowCollectionsReferencedInAssignments.includes(collection.detail)
    );
  }, [collectionAssignments, collections]);
}
