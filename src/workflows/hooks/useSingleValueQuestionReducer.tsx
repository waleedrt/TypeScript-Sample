import { useReducer } from 'react';
import {
  WorkflowEngagementQuestionProcessedResponseType,
  WorkflowEngagementQuestionNodeType,
  WorkflowEngagementQuestionOptionType
} from '../types';

type ActionType = {
  type: 'QUESTION_RESPONSE';
  node: WorkflowEngagementQuestionNodeType;
  answer: WorkflowEngagementQuestionOptionType;
};

const reducer = (
  state: { questions: Array<WorkflowEngagementQuestionProcessedResponseType> },
  { type, node, answer }: ActionType
) => {
  const question = node.question;

  /**
   * The user's actual answer to a question can come from one of two places
   * and will be prioritized in the following way:
   * - A storage_value attribute on the `answer` object
   * - A content attribute on the `answer` object
   *
   * Things get a little complicated in terms of the `storage_value` attribute.
   * In particular, when the case arises that the admin wants to have storage values
   * for all answers but also include a null option.
   *
   * In this scenario, when considering using the `storage_value` attribute,
   * we need to detect if the storage_value is null because all storage values
   * are null - in which case we should consider the other two locations; OR,
   * if only this answer's storage value is null (but the other answer options
   * had storage values) this represents the case in which `null` is the
   * legitimate value to store for this question.
   */

  //  Determine if there are options with non-null storage values.
  const doesQuestionHaveNonNullStorageValues = node.options.filter(
    option =>
      option.hasOwnProperty('storage_value') && option.storage_value !== null
  ).length
    ? true
    : false;

  // If the question has non-null storage values, use
  // the `storage_value` attribute as the user's answer.
  const userAnswer = doesQuestionHaveNonNullStorageValues
    ? answer.storage_value
    : answer.content;

  switch (type) {
    case 'QUESTION_RESPONSE':
      // Is the given `question` already represented in the state?
      const matchedQuestionIndex = state.questions.findIndex(
        possibleMatch => possibleMatch.stepInputID === question.id
      );

      if (matchedQuestionIndex !== -1) {
        // If so, update that question's answer.
        return {
          questions: [
            ...state.questions.map((question, index) =>
              index === matchedQuestionIndex
                ? {
                    ...question,
                    response: userAnswer
                  }
                : question
            )
          ]
        };
      } else {
        // Otherwise add it to the `questions` array in `state`.
        return {
          questions: [
            ...state.questions,
            {
              stepInputID: question.id,
              stepInputUIIdentifier: question.ui_identifier,
              response: userAnswer
            }
          ]
        };
      }

    default:
      throw new Error();
  }
};

/**
 * A custom hook which is used to gather user input for
 * 1 or more single choice questions into an array that
 * can be used for submission to the API.
 */
export default function useSingleValueQuestionReducer() {
  return useReducer(reducer, { questions: [] });
}
