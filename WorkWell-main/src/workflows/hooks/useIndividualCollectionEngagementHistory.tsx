import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Moment from 'moment';
import { cloneDeep } from 'lodash';

// Definitions
import { RootReduxType } from '../../../config/configureStore';
import {
  historySingleEngagementType,
  historySingleWorkflowType,
} from '../types';
import { YearCalendar } from '../../types';

// Hooks
import useCalendarGenerator from '../../hooks/useCalendarGenerator';

// Redux
import {
  loadWorkflowCollectionDetailForEngagementHistory,
  clearWorkflowHistoryForSingleCollection,
  loadWorkflowCollectionEngagementHistory,
} from '../redux/actionCreators';

/**
 * Process available data on collection engagement history and
 * transform it into a usable format for components.
 *
 * We do this adding historical engagement data to calendar
 * object returned by the `useCalendarGenerator` hook.
 */
export default function useIndividualCollectionEngagementHistory({
  year,
  currentMonth,
  workflowCollectionURL,
}: {
  year: number;
  currentMonth: number;
  workflowCollectionURL: string;
}): { calendar: YearCalendar; dataProcessed: boolean } {
  const collectionEngagementHistory = useSelector(
    (state: RootReduxType) => state.workflowHistory.collectionEngagementHistory
  );

  const collectionDetails = useSelector((state: RootReduxType) =>
    state.workflowHistory.collections?.find(
      (collection) => collection.self_detail === workflowCollectionURL
    )
  );

  const dispatch = useDispatch();
  const calendar = useCalendarGenerator(year);

  useEffect(() => {
    if (!collectionDetails) {
      // console.log('LOAD COLLECTION DETAILS');
      dispatch(
        loadWorkflowCollectionDetailForEngagementHistory(workflowCollectionURL)
      );
    }
  }, [workflowCollectionURL, collectionDetails]);

  useEffect(() => {
    if (collectionDetails) {
      dispatch(clearWorkflowHistoryForSingleCollection());
      dispatch(
        loadWorkflowCollectionEngagementHistory({
          collectionUUID: collectionDetails.id,
          startDateTime: Moment()
            .year(year)
            .month(currentMonth)
            .startOf('month')
            .format(),
          endDateTime: Moment()
            .year(year)
            .month(currentMonth)
            .startOf('month')
            .add(1, 'month')
            .format(),
        })
      );
    }
  }, [year, currentMonth, collectionDetails]);

  return useMemo(() => {
    const calendarClone = cloneDeep(calendar);
    /**
     * If engagement history is not yet loaded, or we are waiting
     * for pending actions to resolve, just return an empty
     * calendar.
     */
    if (!collectionEngagementHistory || !collectionDetails) {
      // console.log('PRE_REQUISITES NOT MEET FOR PROCESSING DATA');
      return { calendar: calendarClone, dataProcessed: false };
    }

    /**
     * Augment each Workflow with a top-level reference
     * to it's affirmation step ID. This will help us later
     * to identify which workflows a user completed in a given
     * engagement.
     */
    const workflowsWithAffirmationStep = collectionDetails.workflowcollectionmember_set
      // Get the steps for each workflow
      .map((workflow) => ({
        id: workflow.workflow.id,
        name: workflow.workflow.name,
        steps: workflow.workflow.workflowstep_set,
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
        (mappedWorkflow) => mappedWorkflow.affirmationStepID !== undefined
      );

    // Just the affirmation step IDs in an array.
    const affirmationStepIDs = workflowsWithAffirmationStep.map(
      (entry) => entry.affirmationStepID
    );

    /**
     * Filter out engagements that we aren't interested in so that
     * we only have to deal with relevant data.
     * any non-finished engagements and transform
     * them so that we only have to deal with the data
     * we are interested in.
     */
    const engagementsOfInterest = collectionEngagementHistory
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
     * Now that we have gathered the necessary raw data, we can
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
       * Step 1: Determine which workflows in the collection were completed
       * for the current engagement by cross-referencing completed step
       * IDs with affirmation step IDs
       */
      const workflowsCompletedInEngagement = engagement.completedSteps
        // Pull out just the step IDs for completed steps
        .map((completedStep) => completedStep.step)
        // Filter out all step IDs that aren't for affirmation steps.
        .filter((stepID) => affirmationStepIDs.includes(stepID))
        // Find the workflows that correspond to remaining steps.
        .map((affirmationStepID) =>
          workflowsWithAffirmationStep.find(
            (workflow) => workflow.affirmationStepID === affirmationStepID
          )
        );

      // We don't want to include engagements without at least
      // one firsted workflow.
      if (!workflowsCompletedInEngagement.length) return;

      /**
       * Step 2: Construct a reprsentation of the completed
       * workflow that merges in relevant engagment data
       * so that we have a complete picture of all the
       * questions/answers for each completed workflow.
       */
      workflowsCompletedInEngagement.forEach((completedWorkflow) => {
        let workflowHistoryRepresentation: historySingleWorkflowType = {
          name: completedWorkflow!.name,
          stepTypes: [],
          finished: null,
          stepData: [],
        };

        completedWorkflow!.steps.forEach((workflowStep) => {
          // Update Recorded Steptypes for the Workflow
          workflowHistoryRepresentation.stepTypes = [
            ...new Set([
              ...workflowHistoryRepresentation.stepTypes,
              workflowStep.ui_template,
            ]),
          ];

          // Find the matching step in the engagement
          const matchingEngagementStep = engagement.completedSteps.find(
            (completedStep) => completedStep.step === workflowStep.id
          );

          /**
           * Update the finished timestamp for the workflow with the current engagement
           * step's `finished` value if (1) hasn't been recorded yet or (2) the current
           * value is later than the currently recorded one.
           * */
          if (
            !workflowHistoryRepresentation.finished ||
            Moment(matchingEngagementStep!.finished).isAfter(
              workflowHistoryRepresentation.finished
            )
          ) {
            workflowHistoryRepresentation.finished = matchingEngagementStep!.finished;
          }

          workflowStep.workflowstepinput_set.forEach((stepInput) => {
            const userResponse = matchingEngagementStep?.user_response.questions.find(
              (response) => response.stepInputID === stepInput.id
            );
            workflowHistoryRepresentation.stepData.push({
              question: stepInput.content,
              answer: userResponse?.response,
            });
          });
        });

        processedSingleEngagementHistory.workflowsCompleted.push(
          workflowHistoryRepresentation
        );
      });

      /**
       * Add the processed engagement to the relevant calendarClone entry
       * if there were any completed workflows.
       */
      calendarClone[
        Moment(processedSingleEngagementHistory.finished).month()
      ].daysInMonth[
        Moment(processedSingleEngagementHistory.finished).date() - 1
      ].engagements!.push(processedSingleEngagementHistory);
    });

    return { calendar: calendarClone, dataProcessed: true };
  }, [collectionDetails, collectionEngagementHistory, calendar]);
}
