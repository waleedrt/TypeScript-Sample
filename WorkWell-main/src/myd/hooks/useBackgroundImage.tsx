import { useMemo } from 'react';

import { MYDActivityStepType } from '../types';
import { randomBackgroundImage } from '../images';

/**
 * Extract the background image URL from the activity step
 * or supply a default local image if nothing is specified.
 */
export default (step: MYDActivityStepType) => {
  return useMemo(() => (step.image ? step.image : randomBackgroundImage()), [
    step
  ]);
};
