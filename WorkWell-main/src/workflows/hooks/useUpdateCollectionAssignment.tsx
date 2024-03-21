import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useRegisterReduxAPISideEffect from '../../hooks/useRegisterReduxAPISideEffect';
import {
  updateWorkflowCollectionAssignment,
  loadWorkflowCollectionAssignments,
} from '../redux/actionCreators';
import { UPDATE_WORKFLOW_COLLECTION_ASSIGNMENT } from '../redux/actionTypes';
import { RootReduxType } from '../../../config/configureStore';
import useCollectionDetail from './useCollectionDetail';

/**
 * This hook is responsible for updating collection assignments
 * as a user moves through the engagement process in two specific ways.
 *
 * (1) When a collection engagement is loaded, the hook will see if there is
 *     a corresponding assignment to associate it with.
 * (2) When a collection engagement is finished, mark the associated
 *     assignment as CLOSED_COMPLETE.
 */
export default function useUpdateCollectionAssignment() {
  const dispatch = useDispatch();
  const collection = useCollectionDetail();
  const engagement = useSelector(
    (state: RootReduxType) => state.workflows.collectionEngagement
  );
  const assignments = useSelector(
    (state: RootReduxType) => state.workflows.collectionAssignments
  );

  const matchingAssignment = assignments?.find(
    (assignment) => assignment.workflow_collection === collection?.self_detail
  );

  const pendingAPIActions = useSelector(
    (state: RootReduxType) => state.workflows.pendingActions
  );

  const registerSideEffect = useRegisterReduxAPISideEffect(pendingAPIActions);

  useEffect(() => {
    if (collection && engagement && matchingAssignment) {
      // Make sure that engagement and assignment both reference
      // the same workflow collection.
      if (
        engagement.workflow_collection !==
        matchingAssignment.workflow_collection
      ) {
        console.log(
          'useUpdateCollectionAssignment: Engagement/Assignment Collection Mismatch'
        );
        return;
      }

      if (
        matchingAssignment.status !== 'IN_PROGRESS' &&
        engagement.state &&
        engagement.started &&
        !engagement.finished
      ) {
        console.log(
          'useUpdateCollectionAssignment: Mark matching assignment as IN_PROGRESS'
        );
        dispatch(
          updateWorkflowCollectionAssignment(
            matchingAssignment,
            engagement,
            'IN_PROGRESS'
          )
        );
        registerSideEffect(UPDATE_WORKFLOW_COLLECTION_ASSIGNMENT.ACTION, () => {
          dispatch(loadWorkflowCollectionAssignments());
        });
      } else if (
        matchingAssignment.status !== 'CLOSED_COMPLETE' &&
        engagement.state &&
        engagement.started &&
        engagement.finished
      ) {
        console.log(
          'useUpdateCollectionAssignment: Mark matching assignment as CLOSED_COMPLETE'
        );
        dispatch(
          updateWorkflowCollectionAssignment(
            matchingAssignment,
            engagement,
            'CLOSED_COMPLETE'
          )
        );
        registerSideEffect(UPDATE_WORKFLOW_COLLECTION_ASSIGNMENT.ACTION, () => {
          dispatch(loadWorkflowCollectionAssignments());
        });
      }
    }
  }, [engagement]);
}
