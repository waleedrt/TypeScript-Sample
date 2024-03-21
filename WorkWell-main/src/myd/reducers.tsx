import { handleActions } from 'redux-actions';
import {
  LOAD_ACTIVITIES,
  LOAD_ASSIGNMENTS,
  LOAD_ACTIVITY,
  ENROLL,
  LOAD_ENROLLMENT,
  UPDATE_ENROLLMENT,
  UPDATE_ASSIGNMENT,
  CANCEL_ENROLLMENT,
  UPDATE_USER_ACTIVITY_RESPONSE,
  UNLOAD_USER_ACTIVITY_RESPONSE,
  LOAD_MYD_HISTORY,
  RESET,
  CLEAR_ASSIGNMENTS,
  CLEAR_ACTIVITIES,
  CLEAR_ERROR,
  CLEAR_PUSH_NOTIFICATION,
  SET_PUSH_NOTIFICATION,
  REQUEST_MYD_HISTORY_PDF_EMAIL,
  RESET_REQUEST_MYD_HISTORY_PDF_EMAIL,
} from './actionTypes';
import {
  apiActionReducers,
  stateSuccessFuncs,
  genericAPIstate,
} from '../utils/reduxAPIActions';
import { ApiErrorType, MYDPushNotification, APIErrorAction } from '../types';
import {
  MYDActivityType,
  MYDAssignmentType,
  MYDEnrollmentType,
  MYDHistoryEntry,
} from './types';

export type MYDReduxStoreType = {
  isPending: boolean;
  error: ApiErrorType | null;
  pendingActions: string[];
  activities: Array<MYDActivityType>;
  assignments: Array<MYDAssignmentType>;
  enrollment: MYDEnrollmentType | Array<MYDEnrollmentType> | null;
  activityUserResponse: Array<{ stepID: string; response: string | number }>;
  participantHistory: Array<MYDHistoryEntry>;
  pushNotification: MYDPushNotification | null;
  historyPDFEmailRequest: null | 'requested' | 'completed' | 'failed';
};

const initialState: MYDReduxStoreType = {
  ...genericAPIstate,
  activities: [],
  assignments: [],
  enrollment: null,
  activityUserResponse: [],
  participantHistory: [],
  pushNotification: null,
  historyPDFEmailRequest: null,
};

const actionsToStateChange = {
  ...apiActionReducers(ENROLL, 'enrollment', stateSuccessFuncs.set),
  ...apiActionReducers(LOAD_ENROLLMENT, 'enrollment', stateSuccessFuncs.set),
  ...apiActionReducers(UPDATE_ENROLLMENT, 'enrollment', stateSuccessFuncs.set),
  ...apiActionReducers(CANCEL_ENROLLMENT, 'enrollment', stateSuccessFuncs.set),

  // MYD ACTIVITIES
  ...apiActionReducers(LOAD_ACTIVITIES, 'activities'),
  ...apiActionReducers(LOAD_ACTIVITY, 'activities', stateSuccessFuncs.update),
  [CLEAR_ACTIVITIES]: (state: MYDReduxStoreType) => ({
    ...state,
    activities: [],
  }),

  // MYD ASSIGNMENTS
  ...apiActionReducers(LOAD_ASSIGNMENTS, 'assignments'),
  ...apiActionReducers(
    UPDATE_ASSIGNMENT,
    'assignments',
    stateSuccessFuncs.update
  ),
  [CLEAR_ASSIGNMENTS]: (state: MYDReduxStoreType) => ({
    ...state,
    assignments: [],
  }),

  // MYD HISTORY
  ...apiActionReducers(
    LOAD_MYD_HISTORY,
    'participantHistory',
    stateSuccessFuncs.set
  ),
  [REQUEST_MYD_HISTORY_PDF_EMAIL.ACTION]: (
    state: MYDReduxStoreType
  ): MYDReduxStoreType => {
    return {
      ...state,
      isPending: true,
      pendingActions: [
        ...state.pendingActions,
        REQUEST_MYD_HISTORY_PDF_EMAIL.ACTION,
      ],
      historyPDFEmailRequest: 'requested',
    };
  },
  [REQUEST_MYD_HISTORY_PDF_EMAIL.SUCCESS]: (
    state: MYDReduxStoreType
  ): MYDReduxStoreType => {
    const pendingActionIndex = state.pendingActions.indexOf(
      REQUEST_MYD_HISTORY_PDF_EMAIL.ACTION
    );

    return {
      ...state,
      isPending: false,
      error: null,
      pendingActions:
        pendingActionIndex !== -1
          ? state.pendingActions.filter(
              (action, index) => index !== pendingActionIndex
            )
          : [...state.pendingActions],
      historyPDFEmailRequest: 'completed',
    };
  },
  [REQUEST_MYD_HISTORY_PDF_EMAIL.FAILURE]: (
    state: MYDReduxStoreType,
    action: APIErrorAction
  ): MYDReduxStoreType => {
    const error: any = {
      statusCode: action.payload.status,
    };

    if (action.payload.status >= 500 || action.payload.status < 400) {
      error.payload = {
        detail: `An unexpected server error occurred. Status code ${action.payload.status}`,
      };
    } else if (action.payload.status === 429) {
      error.payload = action.payload.response;
    } else {
      error.payload = action.payload.response['email'].includes(
        'User is opted out'
      )
        ? {
            'Update Notification Preferences': [
              'It looks like you have opted out of receiving notifications, including emails, from us in the past.\n\nTo update your notification preferences, please contact our team at happy@nd.edu and use the subject line “Opt Me In.”',
            ],
          }
        : {
            'Update Notification Preferences': [
              'It looks like you do not have an active email address on file.\n\nTo update your notification preferences, please contact our team at happy@nd.edu and use the subject line “Update Email Address”',
            ],
          };
    }

    const pendingActionIndex = state.pendingActions.indexOf(
      REQUEST_MYD_HISTORY_PDF_EMAIL.ACTION
    );

    return pendingActionIndex !== -1
      ? {
          ...state,
          isPending: false,
          pendingActions: state.pendingActions.filter(
            (action, index) => index !== pendingActionIndex
          ),
          error,
          historyPDFEmailRequest: 'failed',
        }
      : {
          ...state,
          isPending: false,
          error,
          historyPDFEmailRequest: 'failed',
        };
  },
  [RESET_REQUEST_MYD_HISTORY_PDF_EMAIL]: (
    state: MYDReduxStoreType
  ): MYDReduxStoreType => ({
    ...state,
    historyPDFEmailRequest: initialState.historyPDFEmailRequest,
  }),
  //  MISC
  [UPDATE_USER_ACTIVITY_RESPONSE]: (state: MYDReduxStoreType, action) => {
    let newActivityUserResponse = null;
    const stepRecordExists =
      state.activityUserResponse.findIndex(
        (activity) => activity.stepID === action.payload.stepID
      ) !== -1;

    if (stepRecordExists) {
      newActivityUserResponse = state.activityUserResponse.map((entry) =>
        entry.stepID === action.payload.stepID ? action.payload : entry
      );
    } else {
      state.activityUserResponse.push(action.payload);
      newActivityUserResponse = state.activityUserResponse;
    }

    return {
      ...state,
      activityUserResponse: newActivityUserResponse,
    };
  },
  [UNLOAD_USER_ACTIVITY_RESPONSE]: (state: MYDReduxStoreType) => {
    return {
      ...state,
      activityUserResponse: [],
    };
  },
  [RESET]: () => initialState,
  [CLEAR_ERROR]: (state: MYDReduxStoreType) => ({ ...state, error: null }),

  // Push Notifications
  [SET_PUSH_NOTIFICATION]: (state: MYDReduxStoreType, action) => ({
    ...state,
    pushNotification: action.payload,
  }),
  [CLEAR_PUSH_NOTIFICATION]: (state: MYDReduxStoreType) => ({
    ...state,
    pushNotification: initialState.pushNotification,
  }),
};

export default handleActions(actionsToStateChange, initialState);
