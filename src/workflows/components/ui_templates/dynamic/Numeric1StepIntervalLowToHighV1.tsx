import React, { useEffect } from 'react';
import { View, Picker, Platform } from 'react-native';

import WorkflowStepSectionHeader from '../../../../components/WorkflowStepSectionHeader';
import useBackgroundImage from '../../../hooks/useBackgroundImage';
import GenericStepRenderer from '../../GenericStepRenderer';
import MasterStyles from '../../../../styles/MasterStyles';
import useSortedQuestionsAndIntervalValues from '../../../hooks/useSortedQuestionsAndIntervalValues';
import useSingleValueQuestionReducer from '../../../hooks/useSingleValueQuestionReducer';
import usePreviouslyGivenAnswers from '../../../hooks/usePreviouslyGivenAnswers';
import {
  DynamicUITemplateType,
  WorkflowEngagementQuestionNodeType,
} from '../../../types';
import useCheckForRequiredAnswers from '../../../hooks/useCheckForRequiredAnswers';
import Button35x30 from '../../../../components/Button35x30';

/**
 * Numeric1StepIntervalLowToHighV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'numeric_1_step_interval_low_to_high_v1'
 */
export default function Numeric1StepIntervalLowToHighV1({
  step,
  backAction,
  nextAction,
  cancelAction,
  syncInput,
}: DynamicUITemplateType) {
  const questionHierarchy = useSortedQuestionsAndIntervalValues(step, 1);
  const backgroundImageURL = useBackgroundImage(step);
  const [state, dispatch] = useSingleValueQuestionReducer();
  const requiredAnswersProvided = useCheckForRequiredAnswers(step, state);
  usePreviouslyGivenAnswers(questionHierarchy, dispatch);

  // Whenever state is mutated, issue a call to syncInput
  useEffect(() => {
    syncInput(state);
  }, [state]);

  const nodeRendererIOS = (
    nodesToRender: WorkflowEngagementQuestionNodeType[]
  ) => {
    return nodesToRender.map((node, index) => {
      return (
        <View key={index} style={{ paddingBottom: 50 }}>
          <WorkflowStepSectionHeader
            text={node.question.content}
            cancelAction={cancelAction}
            layoutIndex={index}
          />
          <Picker
            mode='dropdown'
            style={MasterStyles.common.horizontalPadding25}
            selectedValue={
              // Is there a response stored for the current node's question yet?
              answerForNode(node)
                ? // If so, set the selected value to the matching option.
                  node.options.find(
                    (option) =>
                      option.storage_value ===
                      state.questions.find(
                        (question) => question.stepInputID === node.question.id
                      )!.response
                  )
                : null
            }
            onValueChange={(itemValue) => {
              dispatch({
                type: 'QUESTION_RESPONSE',
                node: node,
                answer: itemValue,
              });
            }}
          >
            {node.options.map((option) => (
              <Picker.Item
                value={option}
                key={option.storage_value!}
                label={option.content}
                color={Platform.OS === 'ios' ? 'white' : 'black'}
              />
            ))}
          </Picker>
        </View>
      );
    });
  };

  const answerForNode = (node: WorkflowEngagementQuestionNodeType) => {
    const nodeQuestionResponse = state.questions.find(
      (question) => question.stepInputID === node.question.id
    );
    return nodeQuestionResponse ? nodeQuestionResponse.response : null;
  };

  const nodeRendererAndroid = (
    nodesToRender: WorkflowEngagementQuestionNodeType[]
  ) => {
    return nodesToRender.map((node, index) => {
      return (
        <View key={index} style={{ paddingBottom: 50 }}>
          <WorkflowStepSectionHeader
            text={node.question.content}
            cancelAction={cancelAction}
          />
          <View
            style={[
              {
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                flexWrap: 'wrap',
              },
              MasterStyles.common.horizontalPadding25,
            ]}
          >
            {node.options.map((option) => (
              <Button35x30
                text={option.content}
                key={option.content}
                containerStyle={{ marginRight: 10, marginBottom: 12 }}
                onPress={() =>
                  dispatch({
                    type: 'QUESTION_RESPONSE',
                    node: node,
                    answer: option,
                  })
                }
                selected={answerForNode(node) === option.storage_value}
              />
            ))}
          </View>
        </View>
      );
    });
  };

  return (
    <GenericStepRenderer
      nodeRenderer={() =>
        Platform.OS === 'ios'
          ? nodeRendererIOS(questionHierarchy)
          : nodeRendererAndroid(questionHierarchy)
      }
      backAction={backAction}
      nextAction={nextAction}
      backgroundImage={backgroundImageURL}
      requiredAnswersProvided={requiredAnswersProvided}
    />
  );
}
