import { defineAPIAction } from '../utils/reduxAPIActions';
import featureConstants from '../constants/features';

export const { ENROLL } = defineAPIAction('ENROLL', featureConstants.MYD);
export const { LOAD_ENROLLMENT } = defineAPIAction(
  'LOAD_ENROLLMENT',
  featureConstants.MYD
);
export const { UPDATE_ENROLLMENT } = defineAPIAction(
  'UPDATE_ENROLLMENT',
  featureConstants.MYD
);
export const { CANCEL_ENROLLMENT } = defineAPIAction(
  'CANCEL_ENROLLMENT',
  featureConstants.MYD
);

// MYD ACTIVITIES
export const LOAD_ACTIVITIES = {
  ACTION: 'myd/LOAD_ACTIVITIES',
  FAILURE: 'myd/LOAD_ACTIVITIES_FAILURE',
  SUCCESS: 'myd/LOAD_ACTIVITIES_SUCCESS',
};

export const CLEAR_ACTIVITIES = 'myd/CLEAR_ACTIVITIES';

export const { LOAD_ACTIVITY } = defineAPIAction(
  'LOAD_ACTIVITY',
  featureConstants.MYD
);

// MYD ASSIGNMENTS
export const LOAD_ASSIGNMENTS = {
  ACTION: 'myd/LOAD_ASSIGNMENTS',
  FAILURE: 'myd/LOAD_ASSIGNMENTS_FAILURE',
  SUCCESS: 'myd/LOAD_ASSIGNMENTS_SUCCESS',
};
export const CLEAR_ASSIGNMENTS = 'myd/CLEAR_ASSIGNMENTS';

export const { UPDATE_ASSIGNMENT } = defineAPIAction(
  'UPDATE_ASSIGNMENT',
  featureConstants.MYD
);

export const UPDATE_USER_ACTIVITY_RESPONSE =
  'myd/UPDATE_USER_ACTIVITY_RESPONSE';
export const UNLOAD_USER_ACTIVITY_RESPONSE =
  'myd/UNLOAD_USER_ACTIVITY_RESPONSE';

export const LOAD_MYD_HISTORY = {
  ACTION: 'myd/LOAD_MYD_HISTORY',
  FAILURE: 'myd/LOAD_MYD_HISTORY_FAILURE',
  SUCCESS: 'myd/LOAD_MYD_HISTORY_SUCCESS',
};

export const REQUEST_MYD_HISTORY_PDF_EMAIL = {
  ACTION: 'myd/REQUEST_MYD_HISTORY_PDF_EMAIL',
  FAILURE: 'myd/REQUEST_MYD_HISTORY_PDF_EMAIL_FAILURE',
  SUCCESS: 'myd/REQUEST_MYD_HISTORY_PDF_EMAIL_SUCCESS'
};

export const RESET_REQUEST_MYD_HISTORY_PDF_EMAIL = 'myd/RESET_REQUEST_MYD_HISTORY_PDF_EMAIL'

export const RESET = 'myd/RESET';
export const CLEAR_ERROR = 'myd/CLEAR_ERROR';
export const SET_PUSH_NOTIFICATION = 'myd/SET_PUSH_NOTIFICATION';
export const CLEAR_PUSH_NOTIFICATION = 'myd/CLEAR_PUSH_NOTIFICATION';
