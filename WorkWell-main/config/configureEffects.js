/**
 * The "effects" being imported here are eventually tied into
 * the Redux store middleware.
 *
 * There is another library in play called redux-effex which
 * I'm not confident is the best approach since it is fairly
 * old and not currently maintained.
 */

import { sideEffects as authEffects } from '../src/auth';
import { sideEffects as wellbeingEffects } from '../src/userProfile';

const allEffects = [...authEffects, ...wellbeingEffects];

export default allEffects;
