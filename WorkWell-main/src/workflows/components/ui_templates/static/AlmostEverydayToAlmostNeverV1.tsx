import React from 'react';

import GenericSingleChoiceQuestionRenderer from '../../GenericSingleChoiceQuestionRenderer';
import { DynamicUITemplateType } from '../../../types';

/**
 * AlmostEverydayToAlmostNeverV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'almost_everyday_to_almost_never_v1'
 */
export default function AlmostEverydayToAlmostNeverV1({
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
          content: 'Almost Never',
          storage_value: 5,
          ui_identifier: 'question_1_option_5'
        },
        {
          content: 'Less than Once a Month',
          storage_value: 4,
          ui_identifier: 'question_1_option_4'
        },
        {
          content: 'Once a Month',
          storage_value: 3,
          ui_identifier: 'question_1_option_3'
        },
        {
          content: 'Several Times a Month',
          storage_value: 2,
          ui_identifier: 'question_1_option_2'
        },
        {
          content: 'Almost Every day',
          storage_value: 1,
          ui_identifier: 'question_1_option_1'
        }
      ]}
    />
  );
}
