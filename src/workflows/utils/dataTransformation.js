/**
 * Organize input and text elements sent from API into a hierarchy
 * representing the different sections of the screen for single and
 * multiple choice questions.
 */
export function sortedQuestionsAndAnswerOptions(stepInputs, stepTexts) {
  const sortedQuestions = stepInputs
    .filter(text => text.ui_identifier.startsWith('question'))
    .sort(
      (elementOne, elementTwo) =>
        elementOne.ui_identifier.split('_')[1] -
        elementTwo.ui_identifier.split('_')[1]
    );

  const questionOptions = stepTexts.filter(text =>
    text.ui_identifier.includes('option')
  );

  const questionHierarchy = sortedQuestions.reduce((reduction, question) => {
    const headerSectionNumber = question.ui_identifier.split('_')[1];

    reduction.push({
      question: question,
      options: questionOptions
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
  }, []);

  return questionHierarchy;
}
