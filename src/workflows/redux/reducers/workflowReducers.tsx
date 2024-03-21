import { handleActions } from 'redux-actions';

import {
  LOAD_WORKFLOW_COLLECTIONS,
  LOAD_WORKFLOW_COLLECTION_ENGAGEMENTS,
  CREATE_WORKFLOW_COLLECTION_ENGAGEMENT,
  UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT,
  CREATE_WORKFLOW_COLLECTION_ENGAGEMENT_DETAIL,
  UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT_DETAIL,
  LOAD_WORKFLOW_COLLECTION_ASSIGNMENTS,
  LOAD_WORKFLOW_COLLECTION_SUBSCRIPTIONS,
  CLEAR_WORKFLOW_COLLECTION_ENGAGEMENT,
  LOAD_WORKFLOW,
  RESET,
  RETRIEVE_WORKFLOW_COLLECTION_ENGAGEMENT,
  CREATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
  UPDATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
  UPDATE_WORKFLOW_COLLECTION_ASSIGNMENT,
  PARTIAL_RESET_AFTER_PRACTICE_ENGAGEMENT,
  CLEAR_WORKFLOW_COLLECTION_ENGAGEMENTS,
  CLEAR_ERROR,
  CLEAR_WORKFLOWS_PUSH_NOTIFICATION,
  SET_WORKFLOWS_PUSH_NOTIFICATION,
  LOAD_WORKFLOW_COLLECTION_RECOMMENDATIONS,
  SET_CURRENT_WORKFLOW_COLLECTION_URL,
  CLEAR_CURRENT_WORKFLOW_COLLECTION_URL,
  LOAD_WORKFLOW_COLLECTION_ENGAGEMENT,
} from '../actionTypes';

import {
  apiActionReducers,
  genericAPIstate,
  stateSuccessFuncs,
} from '../../../utils/reduxAPIActions';
import {
  WorkflowCollectionType,
  WorkflowCollectionAssignmentType,
  WorkflowCollectionSubscriptionType,
  WorkflowCollectionEngagementDetailViewType,
  WorkflowCollectionRecommendationType,
  WorkflowCollectionEngagementSummaryType,
} from '../../types';
import {
  ApiErrorType,
  WorkflowCollectionPushNotification,
} from '../../../types';

export type WorkflowsReduxStoreType = {
  isPending: boolean;
  error: ApiErrorType | null;
  pendingActions: string[];
  collections: Array<WorkflowCollectionType>;
  currentCollectionURL: string | null;
  collectionAssignments: Array<WorkflowCollectionAssignmentType> | null;
  collectionAssignment: WorkflowCollectionAssignmentType | null;
  collectionEngagements: Array<WorkflowCollectionEngagementSummaryType> | null;
  collectionEngagement:
    | WorkflowCollectionEngagementSummaryType
    | null
    | undefined;
  collectionEngagementDetail: object | null;
  collectionRecommendations: Array<WorkflowCollectionRecommendationType> | null;
  collectionSubscriptions: Array<WorkflowCollectionSubscriptionType> | null;
  collectionSubscription: WorkflowCollectionSubscriptionType | null;
  pushNotification: WorkflowCollectionPushNotification | null;
};

const initialState: WorkflowsReduxStoreType = {
  ...genericAPIstate,
  collections: [],
  currentCollectionURL: null,
  collectionAssignments: null,
  collectionAssignment: null,
  collectionEngagements: null,
  collectionEngagement: undefined,
  collectionEngagementDetail: null,
  collectionRecommendations: null,
  collectionSubscriptions: null,
  collectionSubscription: null,
  pushNotification: null,
};

const actionsToStateChange = {
  ...apiActionReducers(LOAD_WORKFLOW_COLLECTIONS, 'collections'),
  [SET_CURRENT_WORKFLOW_COLLECTION_URL]: (
    state: WorkflowsReduxStoreType,
    action: { payload: string }
  ): WorkflowsReduxStoreType => ({
    ...state,
    currentCollectionURL: action.payload,
  }),
  [CLEAR_CURRENT_WORKFLOW_COLLECTION_URL]: (
    state: WorkflowsReduxStoreType
  ): WorkflowsReduxStoreType => ({
    ...state,
    currentCollectionURL: null,
  }),

  // WORKFLOW_COLLECTION_ENGAGEMENTS
  ...apiActionReducers(
    LOAD_WORKFLOW_COLLECTION_ENGAGEMENTS,
    'collectionEngagements'
  ),
  [CLEAR_WORKFLOW_COLLECTION_ENGAGEMENTS]: (
    state: WorkflowsReduxStoreType
  ): WorkflowsReduxStoreType => ({
    ...state,
    collectionEngagements: initialState.collectionEngagements,
  }),
  ...apiActionReducers(
    CREATE_WORKFLOW_COLLECTION_ENGAGEMENT,
    'collectionEngagement'
  ),
  ...apiActionReducers(
    RETRIEVE_WORKFLOW_COLLECTION_ENGAGEMENT,
    'collectionEngagement'
  ),
  ...apiActionReducers(
    LOAD_WORKFLOW_COLLECTION_ENGAGEMENT,
    'collectionEngagement',
    ({
      payload,
    }: {
      payload: Array<WorkflowCollectionEngagementDetailViewType>;
    }) => {
      return { collectionEngagement: payload.length ? payload[0] : null };
    }
  ),
  ...apiActionReducers(
    UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT,
    'collectionEngagement'
  ),
  ...apiActionReducers(
    CREATE_WORKFLOW_COLLECTION_ENGAGEMENT_DETAIL,
    'collectionEngagementDetail'
  ),
  ...apiActionReducers(
    UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT_DETAIL,
    'collectionEngagementDetail'
  ),
  [CLEAR_WORKFLOW_COLLECTION_ENGAGEMENT]: (
    state: WorkflowsReduxStoreType
  ): WorkflowsReduxStoreType => {
    return {
      ...state,
      collectionEngagement: initialState.collectionEngagement,
    };
  },
  // WORKFLOW COLLECTION ASSIGNMENTS
  ...apiActionReducers(
    LOAD_WORKFLOW_COLLECTION_ASSIGNMENTS,
    'collectionAssignments'
  ),
  ...apiActionReducers(
    UPDATE_WORKFLOW_COLLECTION_ASSIGNMENT,
    'collectionAssignment'
  ),
  // WORKFLOW COLLECTION RECOMMENDATIONS
  ...apiActionReducers(
    LOAD_WORKFLOW_COLLECTION_RECOMMENDATIONS,
    'collectionRecommendations'
  ),
  // WORKFLOW COLLECTION SUBSCRIPTIONS
  ...apiActionReducers(
    CREATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
    'collectionSubscription'
  ),
  ...apiActionReducers(
    LOAD_WORKFLOW_COLLECTION_SUBSCRIPTIONS,
    'collectionSubscriptions'
  ),
  ...apiActionReducers(
    UPDATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
    'collectionSubscription'
  ),
  ...apiActionReducers(LOAD_WORKFLOW, 'workflows', stateSuccessFuncs.merge),
  [RESET]: () => initialState,
  [PARTIAL_RESET_AFTER_PRACTICE_ENGAGEMENT]: (
    state: WorkflowsReduxStoreType
  ): WorkflowsReduxStoreType => ({
    ...state,
    currentCollectionURL: initialState.currentCollectionURL,
    collectionEngagement: initialState.collectionEngagement,
    collectionEngagements: initialState.collectionEngagements,
  }),
  [CLEAR_ERROR]: (state: WorkflowsReduxStoreType): WorkflowsReduxStoreType => ({
    ...state,
    error: null,
  }),
  // Push Notifications
  [SET_WORKFLOWS_PUSH_NOTIFICATION]: (
    state: WorkflowsReduxStoreType,
    action
  ): WorkflowsReduxStoreType => ({
    ...state,
    pushNotification: action.payload,
  }),
  [CLEAR_WORKFLOWS_PUSH_NOTIFICATION]: (
    state: WorkflowsReduxStoreType
  ): WorkflowsReduxStoreType => ({
    ...state,
    pushNotification: initialState.pushNotification,
  }),
};

export default handleActions(actionsToStateChange, initialState);
