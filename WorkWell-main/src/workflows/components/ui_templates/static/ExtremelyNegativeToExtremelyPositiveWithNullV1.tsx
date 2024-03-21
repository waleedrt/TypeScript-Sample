import React from 'react';

import GenericSingleChoiceQuestionRenderer from '../../GenericSingleChoiceQuestionRenderer';
import { DynamicUITemplateType } from '../../../types';

/**
 * ExtremelyNegativeToExtremelyPositiveWithNullV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'not_at_all_to_a_great_deal_with_null_v1'
 */
export default function ExtremelyNegativeToExtremelyPositiveWithNullV1({
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
          content: 'Extremely Positive',
          storage_value: 2,
          ui_identifier: 'question_1_option_1'
        },
        {
          content: 'Somewhat Positive',
          storage_value: 1,
          ui_identifier: 'question_1_option_2'
        },
        {
          content: 'No Impact',
          storage_value: 0,
          ui_identifier: 'question_1_option_3'
        },
        {
          content: 'Somewhat Negative',
          storage_value: -1,
          ui_identifier: 'question_1_option_4'
        },
        {
          content: 'Extremely Negative',
          storage_value: -2,
          ui_identifier: 'question_1_option_5'
        },
        {
          content: 'Not Applicable',
          storage_value: null,
          ui_identifier: 'question_1_option_6'
        }
      ]}
    />
  );
}
