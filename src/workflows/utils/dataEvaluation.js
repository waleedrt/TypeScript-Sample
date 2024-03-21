/**
 * Determine if the questions array of state has all of the
 * required inputs in it.
 */
export function hasUserAnsweredAllRequiredQuestions(questions, answers) {
  // Start with the stepInputs and return any Input that
  // there isn't a corresponding answer too.
  const unansweredQuestions = questions.filter(question => {
    // If the question isn't required, don't evaluate whether there is
    // a corresponding answer.
    if (!question.required) return false;

    return answers.find(answer => answer.stepInputID === question.id)
      ? false
      : true;
  });

  return unansweredQuestions.length > 0;
}
