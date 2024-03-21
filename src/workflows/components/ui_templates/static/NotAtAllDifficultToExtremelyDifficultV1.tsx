import React from 'react';

import GenericSingleChoiceQuestionRenderer from '../../GenericSingleChoiceQuestionRenderer';
import { DynamicUITemplateType } from '../../../types';

/**
 * NotAtAllDifficultToExtremelyDifficultV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'not_at_all_difficult_to_extremely_difficult_v1'
 */
export default function NotAtAllDifficultToExtremelyDifficultV1({
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
          content: 'Extremely Difficult or Impossible',
          storage_value: 5,
          ui_identifier: 'question_1_option_5'
        },
        {
          content: 'Very Difficult or Losing Proposition',
          storage_value: 4,
          ui_identifier: 'question_1_option_4'
        },
        {
          content: 'Difficult or can Barely Get By',
          storage_value: 3,
          ui_identifier: 'question_1_option_3'
        },
        {
          content: 'Somewhat Difficult',
          storage_value: 2,
          ui_identifier: 'question_1_option_2'
        },
        {
          content: 'Not at all Difficult',
          storage_value: 1,
          ui_identifier: 'question_1_option_1'
        }
      ]}
    />
  );
}
