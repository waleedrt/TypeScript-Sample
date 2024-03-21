import { useMemo } from 'react';
import {
  WorkflowStepType,
  WorkflowEngagementQuestionNodeType,
  WorkflowEngagementQuestionInjectedOptionType,
  WorkflowEngagementQuestionInjectedOptionImageType
} from '../types';

/**
 * Organize step input, text, and image elements sent from API (or injected
 * via a static UI template) into a hierarchy representing the different
 * sections of the screen for single and multiple choice questions.
 */
export default function useSortedQuestionsAndAnswerOptions(
  step: WorkflowStepType,
  injectedOptions?: Array<WorkflowEngagementQuestionInjectedOptionType>,
  injectedOptionImages?: Array<
    WorkflowEngagementQuestionInjectedOptionImageType
  >
) {
  const sortedQuestionsAndAnswerOptions = useMemo(() => {
    const { workflowstepinput_set: stepInputs } = step;
    const stepTexts = injectedOptions || step.workflowsteptext_set;
    const stepImages = injectedOptionImages || step.workflowstepimage_set;

    // Get an array of the questions from the step
    const sortedQuestions = stepInputs
      .filter(text => text.ui_identifier.startsWith('question'))
      .sort(
        (elementOne, elementTwo) =>
          Number(elementOne.ui_identifier.split('_')[1]) -
          Number(elementTwo.ui_identifier.split('_')[1])
      );

    // Extract an images from the step data that
    // are associated with question options.
    const optionImages = stepImages.filter(image =>
      image.ui_identifier.match(/option_[0-9]+_image/g)
    );

    // Get an array of question options in the step's text element
    const questionOptions = stepTexts
      .filter(text => text.ui_identifier.includes('option'))
      // See if there is an image associated with this option
      .map(option => {
        const optionImage = optionImages.find(image =>
          image.ui_identifier.includes(option.ui_identifier)
        );

        return {
          ...option,
          image: optionImage ? optionImage.url : undefined
        };
      });

    return sortedQuestions.reduce(
      (reduction: Array<WorkflowEngagementQuestionNodeType>, question) => {
        const nodeIdentifier = Number(question.ui_identifier.split('_')[1]);

        reduction.push({
          order: nodeIdentifier,
          question: question,
          options: questionOptions
            .filter(
              text =>
                Number(text.ui_identifier.split('_')[1]) === nodeIdentifier
            )
            .sort(
              (elementOne, elementTwo) =>
                Number(elementOne.ui_identifier.split('_')[3]) -
                Number(elementTwo.ui_identifier.split('_')[3])
            )
        });
        return reduction;
      },
      []
    );
  }, [step]);

  return sortedQuestionsAndAnswerOptions;
}
