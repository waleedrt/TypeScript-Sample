import { useReducer } from 'react';
import {
  WorkflowEngagementQuestionProcessedResponseType,
  WorkflowEngagementQuestionNodeType,
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
                    response: answer
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
              response: answer
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
 * 1 or more date based questions into an array that
 * can be used for submission to the API.
 */
export default function useDateBasedQuestionReducer() {
  return useReducer(reducer, { questions: [] });
}
