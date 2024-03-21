import { useMemo } from 'react';
import {
  WorkflowStepType,
  WorkflowEngagementQuestionNodeType,
  WorkflowEngagementQuestionOptionType
} from '../types';

const generateIntervalOptions = (
  interval: number,
  lowValue: number,
  highValue: number
): Array<WorkflowEngagementQuestionOptionType> => {
  const intervals = [];
  for (
    let currentValue = lowValue;
    currentValue <= highValue;
    currentValue = currentValue + interval
  ) {
    intervals.push({
      content: currentValue.toString(),
      storage_value: currentValue
    });
  }

  return intervals;
};

/**
 * Organize input and text elements sent from API into a hierarchy
 * representing the different questions that have been specified
 * by the program administrator.
 *
 * This hook is meant to handle questions that need to have
 * automatically generated interval value options.
 *
 * Ex. A question that asks, how many years have you been
 * at your job? And needs to generate options between 1 and 15
 */
export default function useSortedQuestionsAndIntervalValues(
  step: WorkflowStepType,
  interval: number
) {
  const questionHierarchy = useMemo(() => {
    const { workflowstepinput_set: stepInputs } = step;
    const stepTexts = step.workflowsteptext_set;

    // Find and sort the step's questions
    const sortedQuestions = stepInputs
      .filter(text => text.ui_identifier.startsWith('question'))
      .sort(
        (elementOne, elementTwo) =>
          +elementOne.ui_identifier.split('_')[1] -
          +elementTwo.ui_identifier.split('_')[1]
      );

    // Find all of the step texts which specify top/bottom
    // of the question ranges.
    const questionRangeValues = stepTexts.filter(text =>
      text.ui_identifier.includes('value')
    );

    return sortedQuestions.reduce(
      (reduction: Array<WorkflowEngagementQuestionNodeType>, question) => {
        const nodeIdentifier = question.ui_identifier.split('_')[1];

        reduction.push({
          order: +nodeIdentifier,
          question: question,
          options: generateIntervalOptions(
            interval,
            // NOTE: We are making an assuming here that the question is correctly
            // setup. Notice the typescript ! operator. This could be improved
            // to be more defensive and provide better error handling.
            +questionRangeValues.find(
              value =>
                value.ui_identifier.includes('low') &&
                value.ui_identifier.includes(nodeIdentifier)
            )!.content,
            +questionRangeValues.find(
              value =>
                value.ui_identifier.includes('high') &&
                value.ui_identifier.includes(nodeIdentifier)
            )!.content
          )
        });
        return reduction;
      },
      []
    );
  }, [step]);

  return questionHierarchy;
}
