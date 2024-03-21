import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Moment from 'moment';
import { cloneDeep } from 'lodash';

import { RootReduxType } from '../../../config/configureStore';
import useCalendarGenerator from '../../hooks/useCalendarGenerator';
import { YearCalendar } from '../../types';
import { historySingleEngagementType, WorkflowStepType } from '../types';
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';
import { loadWorkflowCollectionDetailForEngagementHistory } from '../redux/actionCreators';

/**
 * Process available data on collection engagement history and
 * transform it into a usable format for components.
 */
export default function useAllCollectionsEngagementHistory(
  year: number
): { calendar: YearCalendar; dataProcessed: boolean } {
  const engagementHistory = useSelector(
    (state: RootReduxType) => state.workflowHistory.collectionsEngagementHistory
  );

  const collectionDetails = useSelector(
    (state: RootReduxType) => state.workflowHistory.collections
  );

  const dispatch = useDispatch();
  const pendingActions = useGlobalPendingAPIOperations();

  const calendar = useCalendarGenerator(year);

  // START HERE - CONSOLIDATE THE TWO HOOKS
  return useMemo(() => {
    const calendarClone = cloneDeep(calendar);

    /**
     * If engagement history is not yet loaded, or we are waiting
     * for pending actions to resolve, just return an empty
     * calendar.
     */
    if (!engagementHistory || pendingActions.length)
      return { calendar: calendarClone, dataProcessed: false };

    // console.log('Determining if any collection details need to be loaded...');
    /**
     * Determine if any collection details that we will need for the
     * currently loaded engagement history are not yet available
     * and load them.
     */
    const collectionsEngagedByUser = [
      ...new Set(
        engagementHistory
          .filter((engagement) => engagement.finished)
          .map((engagement) => engagement.workflow_collection)
      ),
    ];

    const collectionDetailsAlreadyLoaded =
      collectionDetails?.map((collection) => collection.self_detail) ?? [];

    const collectionDetailsToLoad = collectionsEngagedByUser.filter(
      (collection) => !collectionDetailsAlreadyLoaded.includes(collection)
    );

    if (collectionDetailsToLoad.length) {
      // console.log('COLLECTIONS DETAILS TO LOAD', collectionDetailsToLoad);
      collectionDetailsToLoad.forEach((collectionURL) =>
        dispatch(
          loadWorkflowCollectionDetailForEngagementHistory(collectionURL)
        )
      );
      return { calendar: calendarClone, dataProcessed: false };
    }

    // Early return if user has no engagements.
    if (!collectionsEngagedByUser.length)
      return { calendar: calendarClone, dataProcessed: true };

    // console.log('Collection Details Loaded, Processing Data');

    /**
     * Step 1: We need to gather a list of all workflows
     * and their completions steps so that we can tell
     * which user engagements actually contain
     * at least a single completed workflow.
     */
    const allWorkflows: Array<{
      affirmationStepID: string;
      id: string;
      name: string;
      steps: WorkflowStepType[];
    }> = [];

    collectionDetails!.forEach((collection) => {
      // Get the steps of each workflow
      const workflows = collection.workflowcollectionmember_set
        .map((collectionMember) => ({
          id: collectionMember.workflow.id,
          name: collectionMember.workflow.name,
          steps: collectionMember.workflow.workflowstep_set,
        }))
        // Find the affirmation step of each workflow
        .map((mappedWorkflow) => {
          return {
            ...mappedWorkflow,
            affirmationStepID: mappedWorkflow.steps.find((step) =>
              step.ui_template.includes('affirmation')
            )?.id,
          };
        })
        // Filter out any workflows that don't have an affirmation step.
        // NOTE: This is an error in the administrative setup.
        .filter(
          (mappedWorkflow) =>
            typeof mappedWorkflow.affirmationStepID !== 'undefined'
        );

      // @ts-ignore - I'm not sure why it doesn't recognize
      // that workflow.affirmationStepID can't be undefined here.
      workflows.forEach((workflow) => allWorkflows.push(workflow));
    });

    // console.log(allWorkflows);

    // Just the affirmation step IDs in an array.
    const affirmationStepIDs = allWorkflows.map(
      (entry) => entry.affirmationStepID
    );

    // console.log(affirmationStepIDs);

    /**
     * Step 2: Filter out engagements that we aren't interested in so that
     * we only have to deal with relevant data.
     *
     * We only want:
     * 1. Finished engagements with at least one recorded engagment detail.
     * 2. Engagements that correspond to activity collections since we
     *    not providing history for surveys.
     */
    const engagementsOfInterest = engagementHistory
      .filter((engagement) =>
        collectionDetails!.find(
          (collection) =>
            collection.category === 'ACTIVITY' &&
            collection.self_detail === engagement.workflow_collection
        )
      )
      // Filter out engagements that aren't finished OR don't have
      // any details recorded.
      .filter(
        (engagment) =>
          engagment.finished &&
          engagment.workflowcollectionengagementdetail_set.length
      )
      // Filter out engagements not for the currently specified year.
      .filter((engagement) => Moment(engagement.finished).year() === year)
      .map((engagement) => ({
        date: Moment(engagement.finished).startOf('day').format('YYYY-MM-DD'),
        completionTimestamp: engagement.finished,
        collection: engagement.workflow_collection,
        completedSteps: engagement.workflowcollectionengagementdetail_set.filter(
          (step) => step.finished
        ),
      }));

    /**
     * Step 3: Now that we have gathered the necessary raw data, we can
     * start to process it to get something that is easy to
     * work with for UI components.
     */
    engagementsOfInterest.forEach((engagement) => {
      // Start constructing the transformed representation of
      // this engagment.
      let processedSingleEngagementHistory: historySingleEngagementType = {
        engagementDate: engagement.date,
        finished: engagement.completionTimestamp,
        collection: engagement.collection,
        workflowsCompleted: [],
      };

      /**
       * Step 3A: Determine which workflows in the collection were completed
       * for the current engagement by cross-referencing completed step
       * IDs with affirmation step IDs
       */
      engagement.completedSteps
        // Pull out just the step IDs for completed steps
        .map((completedStep) => completedStep.step)
        // Filter out all step IDs that aren't for affirmation steps.
        .filter((stepID) => affirmationStepIDs.includes(stepID))
        // Find the workflows that correspond to remaining steps.
        .map((affirmationStepID) =>
          allWorkflows.find(
            (workflow) => workflow.affirmationStepID === affirmationStepID
          )
        )
        .forEach((completedWorkflow) =>
          processedSingleEngagementHistory.workflowsCompleted.push({
            name: completedWorkflow!.name,
            stepTypes: [],
            finished: null,
            stepData: [],
          })
        );

      if (processedSingleEngagementHistory.workflowsCompleted.length) {
        calendarClone[
          Moment(processedSingleEngagementHistory.finished).month()
        ].daysInMonth[
          Moment(processedSingleEngagementHistory.finished).date() - 1
        ].engagements.push(processedSingleEngagementHistory);
      }
    });

    return { calendar: calendarClone, dataProcessed: true };
  }, [collectionDetails, engagementHistory, calendar, pendingActions]);
}
