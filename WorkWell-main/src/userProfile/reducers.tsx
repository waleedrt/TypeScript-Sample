import { handleActions } from 'redux-actions';
import {
  LOAD_WELLBEING_PROFILE_DATA,
  LOAD_WELLBEING_INSIGHTS_DATA,
  RESET,
  REQUEST_WELLBEING_RESULTS_PDF_EMAIL,
  RESET_REQUEST_WELLBEING_RESULTS_PDF_EMAIL,
  CLEAR_ERROR,
} from './actionTypes';
import { apiActionReducers, genericAPIstate } from '../utils/reduxAPIActions';
import { WellbeingSurveyResult, WellbeingSurveyInsightsRecord } from './types';
import { APIErrorAction } from '../types';

export type UserProfileReduxStoreType = {
  isPending: boolean;
  error: string | null;
  pendingActions: string[];
  wellbeing: Array<WellbeingSurveyResult>;
  wellbeingInsights: Array<WellbeingSurveyInsightsRecord>;
  wellbeingResultsPDFEmailRequest: null | 'requested' | 'completed' | 'failed';
};

/**
 * The initial state for the portion of the Redux
 * store handled by these reducers.
 */
const initialState = {
  ...genericAPIstate,
  wellbeing: [],
  wellbeingInsights: [],
  wellbeingResultsPDFEmailRequest: null,
};

const actionsToStateChange = {
  ...apiActionReducers(LOAD_WELLBEING_PROFILE_DATA, 'wellbeing'),
  ...apiActionReducers(LOAD_WELLBEING_INSIGHTS_DATA, 'wellbeingInsights'),
  // PROFILE RESULTS PDF
  [REQUEST_WELLBEING_RESULTS_PDF_EMAIL.ACTION]: (
    state: UserProfileReduxStoreType
  ): UserProfileReduxStoreType => {
    return {
      ...state,
      isPending: true,
      pendingActions: [
        ...state.pendingActions,
        REQUEST_WELLBEING_RESULTS_PDF_EMAIL.ACTION,
      ],
      wellbeingResultsPDFEmailRequest: 'requested',
    };
  },
  [REQUEST_WELLBEING_RESULTS_PDF_EMAIL.SUCCESS]: (
    state: UserProfileReduxStoreType
  ): UserProfileReduxStoreType => {
    const pendingActionIndex = state.pendingActions.indexOf(
      REQUEST_WELLBEING_RESULTS_PDF_EMAIL.ACTION
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
      wellbeingResultsPDFEmailRequest: 'completed',
    };
  },
  [REQUEST_WELLBEING_RESULTS_PDF_EMAIL.FAILURE]: (
    state: UserProfileReduxStoreType,
    action: APIErrorAction
  ): UserProfileReduxStoreType => {
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
      REQUEST_WELLBEING_RESULTS_PDF_EMAIL.ACTION
    );

    return pendingActionIndex !== -1
      ? {
          ...state,
          isPending: false,
          pendingActions: state.pendingActions.filter(
            (action, index) => index !== pendingActionIndex
          ),
          error,
          wellbeingResultsPDFEmailRequest: 'failed',
        }
      : {
          ...state,
          isPending: false,
          error,
          wellbeingResultsPDFEmailRequest: 'failed',
        };
  },
  [RESET_REQUEST_WELLBEING_RESULTS_PDF_EMAIL]: (
    state: UserProfileReduxStoreType
  ): UserProfileReduxStoreType => ({
    ...state,
    wellbeingResultsPDFEmailRequest:
      initialState.wellbeingResultsPDFEmailRequest,
  }),
  // MISC
  [CLEAR_ERROR]: (
    state: UserProfileReduxStoreType
  ): UserProfileReduxStoreType => ({ ...state, error: null }),
  [RESET]: () => initialState,
};

export default handleActions(actionsToStateChange, initialState);
