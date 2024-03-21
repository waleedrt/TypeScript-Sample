import React, { useEffect } from 'react';
import { View, TextInput, Dimensions } from 'react-native';

import WorkflowStepSectionHeader from '../../../../components/WorkflowStepSectionHeader';
import MasterStyles from '../../../../styles/MasterStyles';
import GenericStepRenderer from '../../GenericStepRenderer';
import useSortedQuestionsAndAnswerOptions from '../../../hooks/useSortedQuestionsAndAnswerOptions';
import useBackgroundImage from '../../../hooks/useBackgroundImage';
import useSingleValueQuestionReducer from '../../../hooks/useSingleValueQuestionReducer';
import useCheckForRequiredAnswers from '../../../hooks/useCheckForRequiredAnswers';
import usePreviouslyGivenAnswers from '../../../hooks/usePreviouslyGivenAnswers';
import {
  DynamicUITemplateType,
  WorkflowEngagementQuestionNodeType,
} from '../../../types';

const deviceHeight = Dimensions.get('window').height;

/**
 * FreeformQuestionsV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'freeform_questions_v1'
 */
export default function FreeformQuestionsV1({
  step,
  backAction,
  nextAction,
  cancelAction,
  syncInput,
}: DynamicUITemplateType) {
  const questionHierarchy = useSortedQuestionsAndAnswerOptions(step);
  const backgroundImageURL = useBackgroundImage(step);
  const [state, dispatch] = useSingleValueQuestionReducer();
  const requiredAnswersProvided = useCheckForRequiredAnswers(step, state);

  usePreviouslyGivenAnswers(questionHierarchy, dispatch);

  useEffect(() => {
    syncInput(state);
  }, [state]);

  const currentNodeAnswer = (node: WorkflowEngagementQuestionNodeType) => {
    const answerForNode = state.questions.find(
      (question) => question.stepInputID === node.question.id
    );
    return answerForNode ? answerForNode.response : null;
  };

  const nodeRenderer = (
    nodesToRender: Array<WorkflowEngagementQuestionNodeType>
  ) => {
    return nodesToRender.map((node, index) => (
      <View key={index} style={{ paddingBottom: 50, flex: 1 }}>
        <WorkflowStepSectionHeader
          text={node.question.content}
          cancelAction={cancelAction}
          layoutIndex={index}
        />
        <TextInput
          multiline
          placeholder='Start typing your answer here'
          placeholderTextColor={MasterStyles.colors.whiteOpaque}
          style={[
            {
              height: deviceHeight / 2,
              backgroundColor: 'rgba(0, 0, 0, .20)',
              borderRadius: 10,
              padding: 15,
              paddingTop: 15,
              fontSize: 14,
              color: MasterStyles.colors.white,
              textAlignVertical: 'top',
            },
            MasterStyles.fontStyles.generalContent,
            MasterStyles.common.horizontalMargins25,
          ]}
          onChangeText={(event) =>
            dispatch({
              type: 'QUESTION_RESPONSE',
              node: node,
              answer: {
                content: event,
                storage_value: null,
              },
            })
          }
          value={currentNodeAnswer(node)}
        />
      </View>
    ));
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
