import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { WorkflowCollectionType } from '../types';
import { RootReduxType } from '../../../config/configureStore';

/**
 * Cross-reference different areas of the Redux store to derive necessary
 * information to display recommended workflow collections.
 *
 * @param {boolean} includeMYD Whether or not to include MYD as a recommendation.
 */
export default function useRecommendedCollections(
  includeMYD: boolean = false
):
  | Array<WorkflowCollectionType>
  | Array<WorkflowCollectionType | { category: 'MYD' }>
  | null {
  const { collections, collectionRecommendations } = useSelector(
    (state: RootReduxType) => ({
      collections: state.workflows.collections,
      collectionRecommendations: state.workflows.collectionRecommendations,
    })
  );

  return useMemo(() => {
    if (!collections || !collectionRecommendations) return null;

    const referencedWorkflowCollections = collectionRecommendations.map(
      (recommendation) => recommendation.workflow_collection
    );

    const recommendedCollections = collections.filter((collection) =>
      referencedWorkflowCollections.includes(collection.detail)
    );

    if (includeMYD && recommendedCollections.length) {
      return [{ category: 'MYD' }, ...recommendedCollections];
    }

    return recommendedCollections;
  }, [collectionRecommendations, collections]);
}
