import { useSelector } from 'react-redux';
import { RootReduxType } from '../../../config/configureStore';
import { MYDEnrollmentType } from '../types';

/**
 * Custom hook which extracts MYD Participant Info
 * from the Redux store.
 *
 * NOTE: There is a rough edge in how the API calls
 * related to MYD enrollment works in the app which
 * results in the Redux store containing an array
 * at some points and an object at other for this
 * data. This hook abstracts away that bit of ugliness.
 */
export default function useMYDParticipantInfo() {
  return useSelector((state: RootReduxType): MYDEnrollmentType | null => {
    if (
      Array.isArray(state.myd.enrollment) &&
      state.myd.enrollment.length > 0
    ) {
      return state.myd.enrollment[0];
    } else if (!Array.isArray(state.myd.enrollment) && state.myd.enrollment) {
      return state.myd.enrollment;
    } else {
      return null;
    }
  });
}
