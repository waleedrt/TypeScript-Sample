import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  WorkflowEngagementQuestionNodeType,
  WorkflowEngagementQuestionOptionType
} from '../types';
import { RootReduxType } from '../../../config/configureStore';

type ActionType = {
  type: 'QUESTION_RESPONSE';
  node: WorkflowEngagementQuestionNodeType;
  answer:
    | WorkflowEngagementQuestionOptionType
    | { month: number; day: number; year: number };
};

/**
 * Search for a questionOption object in an array of such objects
 * where the given `answer` is a part of the searched for option.
 *
 * @param {Array} questionOptions
 * @param {Object|String} answer
 */
const matchingQuestionOption = (
  questionOptions: Array<WorkflowEngagementQuestionOptionType>,
  answer: string | number
) =>
  questionOptions.find(
    option => option.content === answer || option.storage_value === answer
  );

/**
 * When a user returns to an previous engagement, we need to reload
 * answers to previously completed questions.
 *
 * That is where this custom hook comes in. It looks in a
 * WorkflowCollectionEngagement's history to
 * see if there if the user has previously answered
 * questions in a given step's questionHierarchy.
 *
 * If so, used the passed `dispatch` argument to "reload" the answers
 * into the component's state.
 */
export default function usePreviouslyGivenAnswers(
  questionHierarchy: Array<WorkflowEngagementQuestionNodeType>,
  dispatch: (action: ActionType) => void
) {
  // Grab the currently active engagement from Redux
  const collectionEngagement = useSelector(
    (state: RootReduxType) => state.workflows.collectionEngagement
  );

  useEffect(() => {
    // Wait for questionHierarchy and collectionEngagement
    if (!questionHierarchy || !collectionEngagement) return;

    const engagementDetails =
      collectionEngagement.workflowcollectionengagementdetail_set;

    // Iterate through all questions in the provided question hierarchy.
    questionHierarchy.forEach(questionNode => {
      /**
       * Attempt to find an existing engagement detail for
       * the Workflow step associated with the question
       * referenced in the current node.
       */
      const existingEngagementDetail = engagementDetails.find(
        detail => detail.step === questionNode.question.workflow_step
      );

      // Nothing to do if there is no existingEngagementDetail
      if (!existingEngagementDetail) return;

      // Attempt to retrieve the answer to the current question
      // from the existing engagement detail
      const previouslySavedResponse = existingEngagementDetail.user_response.questions.find(
        question => question.stepInputID === questionNode.question.id
      );

      if (previouslySavedResponse) {
        // Handle Single Choice Questions
        if (
          ['number', 'string'].includes(typeof previouslySavedResponse.response)
        ) {
          // Determine if the previously saved response is one of the
          // predefined options for this node. This would be the case
          // for nodes which represent non-freeform questions.
          const matchingOption = matchingQuestionOption(
            questionNode.options,
            previouslySavedResponse.response
          );

          matchingOption
            ? // Handle case where question has defined options.
              dispatch({
                type: 'QUESTION_RESPONSE',
                node: questionNode,
                answer: matchingOption
              })
            : //  Handle case where question has no defined options.
              dispatch({
                type: 'QUESTION_RESPONSE',
                node: questionNode,
                answer: {
                  content: previouslySavedResponse.response,
                  storage_value: null
                }
              });
        }
        // Handle Multiple Choice Questions
        else if (Array.isArray(previouslySavedResponse.response)) {
          /**
           * There is no such thing as a free-form multiple choice question.
           * So, in this scenario we would always expect there to be an
           * question option for an existing answer. If a match cannot
           * be found this represents an unexpected error condition.
           */

          previouslySavedResponse.response.forEach((answer, index) => {
            const matchingOption = matchingQuestionOption(
              questionNode.options,
              answer
            );
            // console.log('Processing Answer:', index, matchingOption);

            if (matchingOption) {
              dispatch({
                type: 'QUESTION_RESPONSE',
                node: questionNode,
                answer: matchingOption
              });
            } else {
              console.error(
                'Could not find question option for answer:',
                answer
              );
            }
          });
        }
        // Handle Questions where the response is an object
        else if (
          typeof previouslySavedResponse.response === 'object' &&
          previouslySavedResponse.response !== null
        ) {
          dispatch({
            type: 'QUESTION_RESPONSE',
            node: questionNode,
            answer: previouslySavedResponse.response
          });
        }
      }
    });
  }, [questionHierarchy, dispatch]);
}
