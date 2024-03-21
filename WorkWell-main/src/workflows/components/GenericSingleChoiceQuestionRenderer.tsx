import React, { useEffect } from 'react';
import { View } from 'react-native';

import useSortedQuestionsAndAnswerOptions from '../hooks/useSortedQuestionsAndAnswerOptions';
import useBackgroundImage from '../hooks/useBackgroundImage';
import useSingleValueQuestionReducer from '../hooks/useSingleValueQuestionReducer';
import useCheckForRequiredAnswers from '../hooks/useCheckForRequiredAnswers';
import WorkflowStepSectionHeader from '../../components/WorkflowStepSectionHeader';
import SingleChoiceButton from '../../components/SingleChoiceButton';
import MasterStyles from '../../styles/MasterStyles';
import GenericStepRenderer from './GenericStepRenderer';
import usePreviouslyGivenAnswers from '../hooks/usePreviouslyGivenAnswers';
import {
  DynamicUITemplateType,
  WorkflowEngagementQuestionNodeType,
  WorkflowEngagementQuestionProcessedResponseType,
  WorkflowEngagementQuestionOptionType
} from '../types';

/**
 * Identify the selected option (if any) for a given question node
 * by evaluating a given node and the array of answered questions.
 *
 * @param node An object representing a single question "node"
 * that is presented to the user on a given ui_template screen. Each node
 * will contain a question and the available answer options.
 * @param answeredQuestions An array of answered question objects that
 * typically come from the internal state of an ui_template screen.
 */
function selectedOptionForNode(
  node: WorkflowEngagementQuestionNodeType,
  answeredQuestions: Array<WorkflowEngagementQuestionProcessedResponseType>
): WorkflowEngagementQuestionOptionType | null {
  const matchingQuestion = answeredQuestions.find(
    question => question.stepInputID === node.question.id
  );
  if (!matchingQuestion) return null;

  const selectedOptionForQuestion = node.options.find(option =>
    [option.storage_value, option.content].includes(matchingQuestion.response)
  );
  return selectedOptionForQuestion ? selectedOptionForQuestion : null;
}

/**
 * GenericSingleChoiceQuestionRenderer
 *
 * This component is used to render many UI templates
 * where the user is asked to answer one or more single choice
 * questions on a given screen.
 */
export default function GenericSingleChoiceQuestionRenderer({
  step,
  backAction,
  nextAction,
  cancelAction,
  syncInput,
  injectedOptions,
  injectedImages
}: DynamicUITemplateType) {
  const questionHierarchy = useSortedQuestionsAndAnswerOptions(
    step,
    injectedOptions,
    injectedImages
  );
  const backgroundImageURL = useBackgroundImage(step);
  const [state, dispatch] = useSingleValueQuestionReducer();
  const requiredAnswersProvided = useCheckForRequiredAnswers(step, state);
  usePreviouslyGivenAnswers(questionHierarchy, dispatch);

  // Whenever state is mutated, issue a call to syncInput
  useEffect(() => {
    syncInput(state);
  }, [state]);

  /**
   * When given an array of nodes, generate the UI for
   * each of them.
   */
  const nodeRenderer = (
    nodesToRender: Array<WorkflowEngagementQuestionNodeType>
  ) => {
    return nodesToRender.map((node, index) => (
      <View key={index} style={{ paddingBottom: 50 }}>
        <WorkflowStepSectionHeader
          text={node.question.content}
          cancelAction={cancelAction}
          layoutIndex={index}
        />
        <View style={MasterStyles.common.horizontalPadding25}>
          {node.options.map((option, index) => (
            <SingleChoiceButton
              option={option}
              selectedOption={selectedOptionForNode(node, state.questions)}
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
