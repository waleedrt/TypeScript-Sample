import React from 'react';

import GenericSingleChoiceQuestionRenderer from '../../GenericSingleChoiceQuestionRenderer';
import { DynamicUITemplateType } from '../../../types';

/**
 * AnExtremeAmountToNoneAtAll
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'an_extreme_amount_to_none_at_all_v1'
 */
export default function AnExtremeAmountToNoneAtAll({
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
          content: 'An Extreme Amount',
          storage_value: 1,
          ui_identifier: 'question_1_option_1'
        },
        {
          content: 'A Lot',
          storage_value: 2,
          ui_identifier: 'question_1_option_2'
        },
        {
          content: 'A Moderate Amount',
          storage_value: 3,
          ui_identifier: 'question_1_option_3'
        },
        {
          content: 'Very Little',
          storage_value: 4,
          ui_identifier: 'question_1_option_4'
        },
        {
          content: 'None at All',
          storage_value: 5,
          ui_identifier: 'question_1_option_5'
        }
      ]}
    />
  );
}
