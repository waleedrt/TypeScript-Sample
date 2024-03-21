/**
 * RarelyOrNeverToMoreThanOnceADayV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'rarely_or_never_to_more_than_once_a_day_v1'
 */
import React from 'react';

import GenericSingleChoiceQuestionRenderer from '../../GenericSingleChoiceQuestionRenderer';
import { DynamicUITemplateType } from '../../../types';

export default function RarelyOrNeverToMoreThanOnceADayV1({
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
          content: 'More than Once a Day',
          storage_value: 6,
          ui_identifier: 'question_1_option_1'
        },
        {
          content: 'Daily',
          storage_value: 5,
          ui_identifier: 'question_1_option_2'
        },
        {
          content: 'Two or More Times/Week',
          storage_value: 4,
          ui_identifier: 'question_1_option_3'
        },
        {
          content: 'Once a Week',
          storage_value: 3,
          ui_identifier: 'question_1_option_4'
        },
        {
          content: 'A Few Times a Month',
          storage_value: 2,
          ui_identifier: 'question_1_option_5'
        },
        {
          content: 'Rarely or Never',
          storage_value: 1,
          ui_identifier: 'question_1_option_6'
        }
      ]}
    />
  );
}
