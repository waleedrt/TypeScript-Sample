import React from 'react';

import GenericSingleChoiceQuestionRenderer from '../../GenericSingleChoiceQuestionRenderer';
import { DynamicUITemplateType } from '../../../types';

/**
 * VeryUnhappyFaceToVeryHappyFaceV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'very_unhappy_face_to_very_happy_face_v1'
 */
export default function VeryUnhappyFaceToVeryHappyFaceV1({
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
      injectedImages={[
        {
          ui_identifier: 'question_1_option_1_image',
          url: 'icons/faceVeryPositive.png'
        },
        {
          ui_identifier: 'question_1_option_2_image',
          url: 'icons/facePositive.png'
        },
        {
          ui_identifier: 'question_1_option_3_image',
          url: 'icons/faceNeutral.png'
        },
        {
          ui_identifier: 'question_1_option_4_image',
          url: 'icons/faceNegative.png'
        },
        {
          ui_identifier: 'question_1_option_5_image',
          url: 'icons/faceVeryNegative.png'
        }
      ]}
    />
  );
}
