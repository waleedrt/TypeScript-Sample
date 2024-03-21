import { createActions, createAction } from 'redux-actions';
import identity from 'redux-actions/lib/utils/identity';

import {
  ENROLL,
  UPDATE_ENROLLMENT,
  CANCEL_ENROLLMENT,
  LOAD_ACTIVITIES,
  LOAD_ACTIVITY,
  LOAD_ASSIGNMENTS,
  UPDATE_ASSIGNMENT,
  LOAD_ENROLLMENT,
  UNLOAD_USER_ACTIVITY_RESPONSE,
  UPDATE_USER_ACTIVITY_RESPONSE,
  LOAD_MYD_HISTORY,
  RESET,
  CLEAR_ACTIVITIES,
  CLEAR_ASSIGNMENTS,
  CLEAR_ERROR,
  CLEAR_PUSH_NOTIFICATION,
  SET_PUSH_NOTIFICATION,
  REQUEST_MYD_HISTORY_PDF_EMAIL,
  RESET_REQUEST_MYD_HISTORY_PDF_EMAIL,
} from './actionTypes';
import { GET, POST, PUT, PATCH } from '../constants/http';
import { createAPIAction } from '../utils/reduxAPIActions';

const ENROLLMENTS_URL = 'users/self/map-your-day/enrollments/';
const ENROLLMENT_DETAIL_URL = 'users/self/map-your-day/enrollments/:id/';

const ASSIGNMENTS_URL = 'users/self/map-your-day/assignments/';
const ASSIGNMENT_DETAIL_URL = 'users/self/map-your-day/assignments/:id/';

const ACTIVITIES_URL = 'map-your-day/activities/';
const ACTIVITY_DETAIL_URL = 'map-your-day/activities/:id/';

export const enroll = createAPIAction(
  ENROLLMENTS_URL,
  POST,
  ENROLL,
  (scheduleBlocks, dailySchedule) => ({
    participantscheduleblock_set: scheduleBlocks,
    participantdailyschedule_set: dailySchedule,
    group: 'Research',
    active: true,
  }),
  3
);

export const loadEnrollment = createAPIAction(
  ENROLLMENTS_URL,
  GET,
  LOAD_ENROLLMENT,
  identity,
  3
);

export const updateEnrollment = createAPIAction(
  ENROLLMENT_DETAIL_URL,
  PUT,
  UPDATE_ENROLLMENT,
  (enrollmentId, scheduleBlocks, dailySchedule) => ({
    id: enrollmentId,
    group: 'Research',
    active: true,
    participantscheduleblock_set: scheduleBlocks,
    participantdailyschedule_set: dailySchedule,
  }),
  3
);

export const cancelEnrollment = createAPIAction(
  ENROLLMENT_DETAIL_URL,
  PUT,
  CANCEL_ENROLLMENT,
  (enrollmentId) => ({
    id: enrollmentId,
    group: 'Research',
    active: false,
    participantscheduleblock_set: [],
    participantdailyschedule_set: [],
  }),
  3
);

// MYD ACTIVITIES
export const loadActivities = createAPIAction(
  ACTIVITIES_URL,
  GET,
  LOAD_ACTIVITIES,
  identity,
  3
);

export const loadActivity = createAPIAction(
  ACTIVITY_DETAIL_URL,
  GET,
  LOAD_ACTIVITY,
  (activityId) => ({
    id: activityId,
  }),
  3
);

export const clearActivities = createAction(CLEAR_ACTIVITIES);

// MYD ASSIGNMENTS
export const loadAssignments = createAPIAction(
  ASSIGNMENTS_URL,
  GET,
  LOAD_ASSIGNMENTS,
  identity,
  3
);

export const updateAssignment = createAPIAction(
  ASSIGNMENT_DETAIL_URL,
  PATCH,
  UPDATE_ASSIGNMENT,
  (assignmentId, response, actualStart, actualEnd) => ({
    id: assignmentId,
    response,
    actual_start: actualStart,
    actual_end: actualEnd,
  }),
  3
);

export const clearAssignments = createAction(CLEAR_ASSIGNMENTS);

// MYD HISTORY
export const loadMYDHistory = createAPIAction(
  'users/self/cup/?data_group_code=map_your_day',
  GET,
  LOAD_MYD_HISTORY,
  null,
  3
);

export const requestMYDHistoryPDF = createAPIAction(
  'users/self/pdf/',
  POST,
  REQUEST_MYD_HISTORY_PDF_EMAIL,
  () => ({ type: 'map_your_day' }),
  3
)
export const resetRequestMYDHistoryPDF = createAction(RESET_REQUEST_MYD_HISTORY_PDF_EMAIL)

// MISC
const nonAPIactionCreators = createActions({
  [UPDATE_USER_ACTIVITY_RESPONSE]: ({ stepID, response }) => ({
    stepID,
    response,
  }),
  [UNLOAD_USER_ACTIVITY_RESPONSE]: () => { },
});

export const {
  updateUserActivityResponse,
  unloadUserActivityResponse,
} = nonAPIactionCreators.myd;

export const resetMYDState = createAction(RESET);

// ERROR HANDLING
export const clearError = createAction(CLEAR_ERROR);

// PUSH NOTIFICATIONS
export const setPushNotification = createAction(SET_PUSH_NOTIFICATION);
export const clearPushNotification = createAction(CLEAR_PUSH_NOTIFICATION);

export default {
  enroll,
  loadEnrollment,
  updateEnrollment,
  cancelEnrollment,
  loadActivities,
  loadActivity,
  loadAssignments,
  updateAssignment,
  updateUserActivityResponse,
  unloadUserActivityResponse,
};
