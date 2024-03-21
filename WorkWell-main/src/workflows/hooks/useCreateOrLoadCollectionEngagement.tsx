import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

// Definitions
import { UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT } from '../redux/actionTypes';
import { RootReduxType } from '../../../config/configureStore';

// Redux
import {
  updateWorkflowCollectionEngagement,
  createWorkflowCollectionEngagement,
  retrieveWorkflowCollectionEngagement,
  loadWorkflowCollectionEngagement,
} from '../redux/actionCreators';

// Functions
import useRegisterReduxAPISideEffect from '../../hooks/useRegisterReduxAPISideEffect';

/**
 * This custom hook will create or load an
 * existing WorkflowCollectionEngagement when a collection
 * is currently specified in the Redux store along with
 * all of the user's engagements.
 *
 * Essentially, it provides a simple plug-in for components
 * which allow the user to engage in a workflow through which
 * to obtain a new or existing engagement.
 *
 * For Workflow Collections with a category of activity, there should
 * in general not be an existing engagement. So if there is, we look to
 * see if there is any engagements details associated with it. If so, it means
 * that the user did some steps in the collection, but they abandoned it.
 * In this case, we close it. However, if the engagement is empty, we just
 * update the start time to be "now" and continue.
 *
 * For Workflow Collections with a category of survey, we do not automatically
 * close existing engagements since we want the user to be able to resume
 * from where they left off.
 */
export default function useCreateOrLoadCollectionEngagement(
  componentHasFocus: boolean
) {
  const [engagementReady, setEngagementReady] = useState(false);
  const [
    updateEngagementCheckComplete,
    setUpdateEngagementCheckComplete,
  ] = useState(false);
  const [newEngagementCheckComplete, setNewEngagementCheckComplete] = useState(
    false
  );

  const dispatch = useDispatch();
  const currentCollectionURL = useSelector(
    (state: RootReduxType) => state.workflows.currentCollectionURL
  );

  const currentCollectionDetails = useSelector((state: RootReduxType) =>
    state.workflowHistory.collections?.find(
      (collection) => collection.self_detail === currentCollectionURL
    )
  );

  const existingEngagement = useSelector(
    (state: RootReduxType) => state.workflows.collectionEngagement
  );

  const pendingWorkflowAPIActions = useSelector(
    (state: RootReduxType) => state.workflows.pendingActions
  );

  const registerSideEffect = useRegisterReduxAPISideEffect(
    pendingWorkflowAPIActions
  );

  /**
   * Effect 1: If no attempt has been made to load an
   * possible existing engagment, do so first.
   */
  useEffect(() => {
    if (
      componentHasFocus &&
      currentCollectionURL &&
      typeof existingEngagement === 'undefined'
    ) {
      console.log('Attempt to load previous engagement.');
      dispatch(
        loadWorkflowCollectionEngagement({
          workflowCollectionURL: currentCollectionURL,
        })
      );
    }
  }, [currentCollectionURL, existingEngagement]);

  /**
   * Effect 2: If an existing engagment exists, determine
   * if it needs to be updated or closed. Create new
   * engagements as necessary.
   */
  useEffect(() => {
    /**
     * Ensure that preconditions are meet.
     * 1. Attempt has been made to load engagement.
     * 2. Collection details are available.
     * 3. Component has focus.
     * */
    if (
      newEngagementCheckComplete ||
      updateEngagementCheckComplete ||
      typeof existingEngagement === 'undefined' ||
      !currentCollectionDetails ||
      !componentHasFocus
    )
      return;

    // If no existing engagment exists, just create one.
    // Mark the engagment as ready
    if (!existingEngagement) {
      console.log('No existing engagment exists. Create new one.');
      dispatch(
        createWorkflowCollectionEngagement(
          currentCollectionDetails.self_detail,
          moment().toISOString()
        )
      );
      setNewEngagementCheckComplete(true);
      setUpdateEngagementCheckComplete(true);
    } else {
      /** If an existing engagment DOES exist, what we do with it depends on whether the
       * collection is an ACTIVITY or SURVEY.
       */
      switch (currentCollectionDetails.category) {
        case 'ACTIVITY':
          /**
           * If there is an existing engagement, determine if there is actual data in it.
           * If so, close it since this represents an previous engagement that was not properly
           * closed. If not, just update the start time of the current engagement so that we
           * can re-use it.
           */
          if (
            existingEngagement.workflowcollectionengagementdetail_set?.length
          ) {
            console.log('Existing engagement with data detected. Closing it.');
            dispatch(
              updateWorkflowCollectionEngagement({
                engagementURL: existingEngagement.detail,
                endDateTime: moment().toISOString(),
              })
            );

            setUpdateEngagementCheckComplete(true);

            registerSideEffect(
              UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT.ACTION,
              () => {
                console.log('Creating new engagement.');
                dispatch(
                  createWorkflowCollectionEngagement(
                    currentCollectionDetails.self_detail,
                    moment().toISOString()
                  )
                );
                setNewEngagementCheckComplete(true);
              }
            );
          } else {
            console.log(
              'Empty existing engagement deteched. Will update and reuse.'
            );
            dispatch(
              updateWorkflowCollectionEngagement({
                engagementURL: existingEngagement.detail,
                startDateTime: moment().toISOString(),
              })
            );
            setNewEngagementCheckComplete(true);
            setUpdateEngagementCheckComplete(true);
          }

          break;

        case 'SURVEY':
          if (!existingEngagement) {
            console.log('Creating Survey Engagement');
            dispatch(
              createWorkflowCollectionEngagement(
                currentCollectionDetails.self_detail,
                moment().toISOString()
              )
            );
          } else {
            console.log('Loading Survey Engagement');
            dispatch(retrieveWorkflowCollectionEngagement(existingEngagement));
          }
          setNewEngagementCheckComplete(true);
          setUpdateEngagementCheckComplete(true);
          break;
      }
    }
  }, [
    currentCollectionDetails,
    existingEngagement,
    componentHasFocus,
    newEngagementCheckComplete,
    updateEngagementCheckComplete,
  ]);

  // When all checks have completed and there are no pending operations
  // mark the engagement as ready.
  useEffect(() => {
    if (
      newEngagementCheckComplete &&
      updateEngagementCheckComplete &&
      !pendingWorkflowAPIActions.length
    )
      setEngagementReady(true);
  }, [
    newEngagementCheckComplete,
    updateEngagementCheckComplete,
    pendingWorkflowAPIActions,
  ]);

  // When component loses focus, reset internal hook state.
  useEffect(() => {
    if (!componentHasFocus) {
      setEngagementReady(false);
      setNewEngagementCheckComplete(false);
      setUpdateEngagementCheckComplete(false);
    }
  }, [componentHasFocus]);

  return engagementReady;
}
