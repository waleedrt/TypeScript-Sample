import { useState, useEffect } from 'react';

/**
 * Organize input and text elements sent from API into a hierarchy
 * representing the different sections of the screen for single and
 * multiple choice questions.
 */
export default function useSortedQuestionsAndInjectedOptions(
  step,
  optionsToInject
) {
  const [questionHierarchy, setQuestionHierarchy] = useState([]);

  const { workflowstepinput_set: stepInputs } = step;

  useEffect(() => {
    const sortedQuestions = stepInputs
      .filter(text => text.ui_identifier.startsWith('question'))
      .sort(
        (elementOne, elementTwo) =>
          elementOne.ui_identifier.split('_')[1] -
          elementTwo.ui_identifier.split('_')[1]
      );

    setQuestionHierarchy(
      sortedQuestions.reduce((reduction, question) => {
        const headerSectionNumber = question.ui_identifier.split('_')[1];

        reduction.push({
          question: question,
          options: optionsToInject
            .filter(
              text => text.ui_identifier.split('_')[1] === headerSectionNumber
            )
            .sort(
              (elementOne, elementTwo) =>
                elementOne.ui_identifier.split('_')[3] -
                elementTwo.ui_identifier.split('_')[3]
            )
        });
        return reduction;
      }, [])
    );
  }, [step]);

  return questionHierarchy;
}
