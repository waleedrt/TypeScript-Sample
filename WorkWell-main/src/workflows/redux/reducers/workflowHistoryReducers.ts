import { handleActions } from 'redux-actions';

import {
  LOAD_WORKFLOW_COLLECTIONS_HISTORICAL_ENGAGEMENTS,
  LOAD_WORKFLOW_COLLECTION_HISTORICAL_ENGAGEMENTS,
  CLEAR_WORKFLOW_HISTORY_ERROR,
  RESET_WORKFLOW_HISTORY,
  LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY,
  CLEAR_WORKFLOW_HISTORY_FOR_ALL_COLLECTIONS,
  CLEAR_WORKFLOW_HISTORY_FOR_SINGLE_COLLECTION,
  REQUEST_COLLECTION_HISTORY_PDF_EMAIL,
  RESET_REQUEST_COLLECTION_HISTORY_PDF_EMAIL,
} from '../actionTypes';
import {
  apiActionReducers,
  genericAPIstate,
} from '../../../utils/reduxAPIActions';
import {
  WorkflowCollectionEngagementDetailViewType,
  WorkflowCollectionDetailType,
} from '../../types';
import { ApiErrorType, APIErrorAction } from '../../../types';

export type WorkflowHistoryReduxStoreType = {
  isPending: boolean;
  error: ApiErrorType | null;
  pendingActions: string[];
  collections: Array<WorkflowCollectionDetailType> | null;
  collectionsEngagementHistory: Array<
    WorkflowCollectionEngagementDetailViewType
  > | null;
  collectionEngagementHistory: Array<
    WorkflowCollectionEngagementDetailViewType
  > | null;
  historyPDFEmailRequest: null | 'requested' | 'completed' | 'failed';
};

const initialState: WorkflowHistoryReduxStoreType = {
  ...genericAPIstate,
  collections: null,
  collectionsEngagementHistory: null,
  collectionEngagementHistory: null,
  historyPDFEmailRequest: null,
};

const actionsToStateChange = {
  ...apiActionReducers(
    LOAD_WORKFLOW_COLLECTIONS_HISTORICAL_ENGAGEMENTS,
    'collectionsEngagementHistory'
  ),
  ...apiActionReducers(
    LOAD_WORKFLOW_COLLECTION_HISTORICAL_ENGAGEMENTS,
    'collectionEngagementHistory'
  ),
  [CLEAR_WORKFLOW_HISTORY_ERROR]: (
    state: WorkflowHistoryReduxStoreType
  ): WorkflowHistoryReduxStoreType => ({
    ...state,
    error: null,
  }),
  [RESET_WORKFLOW_HISTORY]: () => initialState,
  [CLEAR_WORKFLOW_HISTORY_FOR_ALL_COLLECTIONS]: (
    state: WorkflowHistoryReduxStoreType
  ): WorkflowHistoryReduxStoreType => ({
    ...state,
    collectionsEngagementHistory: null,
  }),
  [CLEAR_WORKFLOW_HISTORY_FOR_SINGLE_COLLECTION]: (
    state: WorkflowHistoryReduxStoreType
  ): WorkflowHistoryReduxStoreType => ({
    ...state,
    collectionEngagementHistory: null,
  }),
  [LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.ACTION]: (
    state: WorkflowHistoryReduxStoreType
  ) => {
    return {
      ...state,
      isPending: true,
      error: null,
      pendingActions: [
        ...state.pendingActions,
        LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.ACTION,
      ],
    };
  },

  [LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.FAILURE]: (
    state: WorkflowHistoryReduxStoreType,
    { payload, type }
  ) => {
    const error = {
      statusCode: payload.status,
      payload:
        payload?.status >= 500 || payload?.status < 400
          ? {
              detail: `An unexpected server error occurred. Status code ${payload.status}`,
            }
          : payload?.response || { detail: payload?.message },
    };

    const pendingActionIndex = state.pendingActions.indexOf(
      LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.ACTION
    );

    return pendingActionIndex !== -1
      ? {
          ...state,
          isPending: false,
          pendingActions: state.pendingActions.filter(
            (action, index) => index !== pendingActionIndex
          ),
          error,
        }
      : {
          ...state,
          isPending: false,
          error,
        };
  },

  [LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.SUCCESS]: (
    state: WorkflowHistoryReduxStoreType,
    action: { payload: WorkflowCollectionDetailType }
  ): WorkflowHistoryReduxStoreType => {
    const pendingActionIndex = state.pendingActions.indexOf(
      LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.ACTION
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
      collections: state.collections
        ? [
            action.payload,
            ...state.collections.filter(
              (collection) => collection.id !== action.payload.id
            ),
          ]
        : [action.payload],
    };
  },

  [REQUEST_COLLECTION_HISTORY_PDF_EMAIL.ACTION]: (
    state: WorkflowHistoryReduxStoreType
  ): WorkflowHistoryReduxStoreType => {
    return {
      ...state,
      isPending: true,
      pendingActions: [
        ...state.pendingActions,
        REQUEST_COLLECTION_HISTORY_PDF_EMAIL.ACTION,
      ],
      historyPDFEmailRequest: 'requested',
    };
  },
  [REQUEST_COLLECTION_HISTORY_PDF_EMAIL.SUCCESS]: (
    state: WorkflowHistoryReduxStoreType
  ): WorkflowHistoryReduxStoreType => {
    const pendingActionIndex = state.pendingActions.indexOf(
      REQUEST_COLLECTION_HISTORY_PDF_EMAIL.ACTION
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
  [REQUEST_COLLECTION_HISTORY_PDF_EMAIL.FAILURE]: (
    state: WorkflowHistoryReduxStoreType,
    action: APIErrorAction
  ): WorkflowHistoryReduxStoreType => {
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
      REQUEST_COLLECTION_HISTORY_PDF_EMAIL.ACTION
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
  [RESET_REQUEST_COLLECTION_HISTORY_PDF_EMAIL]: (
    state: WorkflowHistoryReduxStoreType
  ): WorkflowHistoryReduxStoreType => ({
    ...state,
    historyPDFEmailRequest: initialState.historyPDFEmailRequest,
  }),
};

export default handleActions(actionsToStateChange, initialState);
