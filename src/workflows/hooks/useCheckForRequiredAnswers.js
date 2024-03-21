import { useState, useEffect } from 'react';
/**
 * Return a boolean indicating if there are required questions
 * that have not been answered by the user.
 */
export default useCheckForRequiredAnswers = (step, state) => {
  const [requiredAnswersProvided, setRequiredAnswersProvided] = useState(false);

  useEffect(() => {
    const requiredQuestionIDs = step.workflowstepinput_set
      .filter(input => input.required)
      .map(input => input.id);

    const answeredQuestionIDs = state.questions.map(
      question => question.stepInputID
    );

    const unansweredQuestions = requiredQuestionIDs.filter(
      requiredQuestion => !answeredQuestionIDs.includes(requiredQuestion)
    );

    setRequiredAnswersProvided(!unansweredQuestions.length > 0);
  }, [step, state]);

  return requiredAnswersProvided;
};
