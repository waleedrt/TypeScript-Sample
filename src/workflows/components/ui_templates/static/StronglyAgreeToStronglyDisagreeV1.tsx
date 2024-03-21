import React from 'react';

import GenericSingleChoiceQuestionRenderer from '../../GenericSingleChoiceQuestionRenderer';
import { DynamicUITemplateType } from '../../../types';

/**
 * StronglyAgreeToStronglyDisagreeV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'strongly_agree_to_strongly_disagree_v1'
 */
export default function StronglyAgreeToStronglyDisagreeV1({
  step,
  backAction,
  nextAction,
  cancelAction,
  syncInput
}: DynamicUITemplateType) {
  return (
    <GenericSingleChoiceQuestionRenderer
      step={step}
      backAction={backAction}
      nextAction={nextAction}
      cancelAction={cancelAction}
      syncInput={syncInput}
      injectedOptions={[
        {
          content: 'Strongly Agree',
          storage_value: 1,
          ui_identifier: 'question_1_option_1'
        },
        {
          content: 'Agree',
          storage_value: 2,
          ui_identifier: 'question_1_option_2'
        },
        {
          content: 'Neutral',
          storage_value: 3,
          ui_identifier: 'question_1_option_3'
        },
        {
          content: 'Disagree',
          storage_value: 4,
          ui_identifier: 'question_1_option_4'
        },
        {
          content: 'Strongly Disagree',
          storage_value: 5,
          ui_identifier: 'question_1_option_5'
        }
      ]}
    />
  );
}
