import React from 'react';

import GenericSingleChoiceQuestionRenderer from '../../GenericSingleChoiceQuestionRenderer';
import { DynamicUITemplateType } from '../../../types';

/**
 * OnlyNegativeToOnlyPositiveV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'none_at_all_to_an_extreme_amount_v1'
 */
export default function OnlyNegativeToOnlyPositiveV1({
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
          content: 'Only Positive',
          storage_value: 5,
          ui_identifier: 'question_1_option_1'
        },
        {
          content: 'Mostly Positive',
          storage_value: 4,
          ui_identifier: 'question_1_option_2'
        },
        {
          content: 'An Equal Mix of Negative and Positive',
          storage_value: 3,
          ui_identifier: 'question_1_option_3'
        },
        {
          content: 'Mostly Negative',
          storage_value: 2,
          ui_identifier: 'question_1_option_4'
        },
        {
          content: 'Only Negative',
          storage_value: 1,
          ui_identifier: 'question_1_option_5'
        }
      ]}
    />
  );
}
