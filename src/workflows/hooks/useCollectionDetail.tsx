import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootReduxType } from '../../../config/configureStore';
import { WorkflowCollectionDetailType } from '../types';
import { loadWorkflowCollectionDetailForEngagementHistory } from '../redux/actionCreators';

/**
 * Return details about a given workflow collection from Redux store
 * and load them if not yet present.
 */
export default function useCollectionDetail(): WorkflowCollectionDetailType | null {
  const dispatch = useDispatch();
  const workflowCollectionURL = useSelector(
    (state: RootReduxType) => state.workflows.currentCollectionURL
  );

  const collectionDetail = useSelector(
    (state: RootReduxType) =>
      state.workflowHistory.collections?.find(
        (collection) => collection.self_detail === workflowCollectionURL
      ) ?? null
  );

  useEffect(() => {
    if (!collectionDetail && workflowCollectionURL) {
      console.log('Load collection details.');
      dispatch(
        loadWorkflowCollectionDetailForEngagementHistory(workflowCollectionURL)
      );
    }
  }, [collectionDetail, workflowCollectionURL]);

  return collectionDetail;
}
