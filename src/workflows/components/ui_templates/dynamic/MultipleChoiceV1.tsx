import React, { useEffect } from 'react';
import { View } from 'react-native';

import useSortedQuestionsAndAnswerOptions from '../../../hooks/useSortedQuestionsAndAnswerOptions';
import useBackgroundImage from '../../../hooks/useBackgroundImage';
import useCheckForRequiredAnswers from '../../../hooks/useCheckForRequiredAnswers';
import useMultiValueQuestionReducer from '../../../hooks/useMultiValueQuestionReducer';
import GenericStepRenderer from '../../GenericStepRenderer';
import MasterStyles from '../../../../styles/MasterStyles';
import WorkflowStepSectionHeader from '../../../../components/WorkflowStepSectionHeader';
import MultipleChoiceButton from '../../../../components/MultipleChoiceButton';
import usePreviouslyGivenAnswers from '../../../hooks/usePreviouslyGivenAnswers';
import {
  DynamicUITemplateType,
  WorkflowEngagementQuestionNodeType
} from '../../../types';

/**
 * MultipleChoiceV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'multiple_choice_v1'
 */
export default function MultipleChoiceV1({
  step,
  backAction,
  nextAction,
  cancelAction,
  syncInput
}: DynamicUITemplateType) {
  const questionHierarchy = useSortedQuestionsAndAnswerOptions(step);
  const backgroundImageURL = useBackgroundImage(step);
  const [state, dispatch] = useMultiValueQuestionReducer();
  const requiredAnswersProvided = useCheckForRequiredAnswers(step, state);

  usePreviouslyGivenAnswers(questionHierarchy, dispatch);

  // Whenever state is mutated, issue a call to syncInput
  useEffect(() => {
    syncInput(state);
  }, [state]);

  /**
   * Render a multiple choice question along with
   * it's possible answers.
   */
  const nodeRenderer = (
    nodesToRender: Array<WorkflowEngagementQuestionNodeType>
  ) => {
    return nodesToRender.map((node, index) => {
      const questionInState = state.questions.find(
        question => question.stepInputID === node.question.id
      );

      return (
        <View key={index} style={{ paddingBottom: 50 }}>
          <WorkflowStepSectionHeader
            text={node.question.content}
            subtext='You can select more than one option.'
            cancelAction={cancelAction}
            layoutIndex={index}
          />
          <View style={MasterStyles.common.horizontalPadding25}>
            {node.options.map((option, index) => (
              <MultipleChoiceButton
                option={option}
                selectedOptions={
                  questionInState ? questionInState.response : []
                }
                key={index}
                onPress={() => {
                  dispatch({
                    type: 'QUESTION_RESPONSE',
                    node: node,
                    answer: option
                  });
                }}
              />
            ))}
          </View>
        </View>
      );
    });
  };

  return (
    <GenericStepRenderer
      nodeRenderer={() => nodeRenderer(questionHierarchy)}
      backAction={backAction}
      nextAction={nextAction}
      backgroundImage={backgroundImageURL}
      requiredAnswersProvided={requiredAnswersProvided}
    />
  );
}
