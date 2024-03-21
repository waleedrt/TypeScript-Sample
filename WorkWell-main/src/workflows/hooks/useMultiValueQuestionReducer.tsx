import { useReducer } from 'react';
import {
  WorkflowEngagementQuestionNodeType,
  WorkflowEngagementQuestionProcessedResponseType,
  WorkflowEngagementQuestionOptionType
} from '../types';

type ActionType = {
  type: 'QUESTION_RESPONSE';
  node: WorkflowEngagementQuestionNodeType;
  answer:
    | WorkflowEngagementQuestionOptionType
    | { month: number; day: number; year: number };
};

const reducer = (
  state: { questions: Array<WorkflowEngagementQuestionProcessedResponseType> },
  { type, node, answer }: ActionType
) => {
  const question = node.question;

  // console.log('REDUCER PROCESSING ANSWER', answer);

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
        // Retrieve existing answers array for the matched question.
        const existing_response_array =
          state.questions[matchedQuestionIndex].response;

        // Determine if the new answer already exists in the array.
        if (existing_response_array.includes(userAnswer)) {
          // If so, this effectively means the user has unselected
          // the option, so we need to filter it out of the array.
          const filtered_response_array = existing_response_array.filter(
            (response: any) => response !== userAnswer
          );

          return {
            questions: [
              ...state.questions.map((question, index) =>
                index === matchedQuestionIndex
                  ? {
                      ...question,
                      response: filtered_response_array
                    }
                  : question
              )
            ]
          };
        } else {
          // Otherwise, append the new answer to the array.
          return {
            questions: [
              ...state.questions.map((question, index) =>
                index === matchedQuestionIndex
                  ? {
                      ...question,
                      response: [...question.response, answer.content]
                    }
                  : question
              )
            ]
          };
        }
      } else {
        // If there is not an existing answer to the provided question
        return {
          questions: [
            ...state.questions,
            {
              stepInputID: question.id,
              stepInputUIIdentifier: question.ui_identifier,
              response: [userAnswer]
            }
          ]
        };
      }

    default:
      throw new Error();
  }
};

export default function useMultiValueQuestionReducer() {
  return useReducer(reducer, { questions: [] });
}
