import { createAction } from 'redux-actions';

import {
  LOAD_WELLBEING_PROFILE_DATA,
  LOAD_WELLBEING_INSIGHTS_DATA,
  RESET,
  REQUEST_WELLBEING_RESULTS_PDF_EMAIL,
  RESET_REQUEST_WELLBEING_RESULTS_PDF_EMAIL,
  CLEAR_ERROR
} from './actionTypes';
import { GET, POST } from '../constants/http';
import { createAPIAction } from '../utils/reduxAPIActions';

export const loadWellbeingProfileData = createAPIAction(
  'users/self/cup/?data_group_code=wellbeing_dimension',
  GET,
  LOAD_WELLBEING_PROFILE_DATA,
  null,
  3
);

export const loadWellbeingInsightsData = createAPIAction(
  'users/self/cup/?data_group_code=wellbeing_insight',
  GET,
  LOAD_WELLBEING_INSIGHTS_DATA,
  null,
  3
);

export const requestWellbeingResultsPDF = createAPIAction(
  'users/self/pdf/',
  POST,
  REQUEST_WELLBEING_RESULTS_PDF_EMAIL,
  () => ({ type: 'wellbeing_profile' }),
  3
)

export const clearUserProfileError = createAction(CLEAR_ERROR)
export const resetRequestWellbeingResultsPDF = createAction(RESET_REQUEST_WELLBEING_RESULTS_PDF_EMAIL)
export const resetUserProfileState = createAction(RESET);
