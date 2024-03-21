import { useMemo } from 'react';

import { randomWorkflowBackgroundImage } from '../images';
import { WorkflowStepType } from '../types';

/**
 * Extract the background image URL from the workflow step
 * or supply a default local image if nothing is specified.
 */
export default function useBackgroundImage(
  step: WorkflowStepType
): string | number {
  return useMemo(() => {
    const backgroundImageInStep = step.workflowstepimage_set.find(
      image => image.ui_identifier === 'background_image'
    );

    return backgroundImageInStep
      ? backgroundImageInStep.url
      : randomWorkflowBackgroundImage();
  }, [step]);
}
