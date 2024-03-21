import { createAction } from 'redux-actions';

import { createAPIAction } from '../../../utils/reduxAPIActions';
import {
  // API ACTIONS
  CREATE_WORKFLOW_COLLECTION_ENGAGEMENT,
  CREATE_WORKFLOW_COLLECTION_ENGAGEMENT_DETAIL,
  CREATE_WORKFLOW_COLLECTION_RECOMMENDATION,
  CREATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
  LOAD_WORKFLOW,
  LOAD_WORKFLOW_COLLECTIONS,
  LOAD_WORKFLOW_COLLECTION_ASSIGNMENTS,
  LOAD_WORKFLOW_COLLECTION_ENGAGEMENTS,
  LOAD_WORKFLOW_COLLECTION_RECOMMENDATIONS,
  LOAD_WORKFLOW_COLLECTION_SUBSCRIPTIONS,
  UPDATE_WORKFLOW_COLLECTION_ASSIGNMENT,
  UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT,
  UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT_DETAIL,
  UPDATE_WORKFLOW_COLLECTION_RECOMMENDATION,
  UPDATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
  RETRIEVE_WORKFLOW_COLLECTION_ENGAGEMENT,
  UNLOAD_WORKFLOW_COLLECTION_ENGAGEMENT,
  UNLOAD_WORKFLOW_COLLECTION_ENGAGEMENTS,

  // Non-API Actions
  RESET,
  PARTIAL_RESET_AFTER_PRACTICE_ENGAGEMENT,
  CLEAR_ERROR,
  CLEAR_WORKFLOWS_PUSH_NOTIFICATION,
  SET_WORKFLOWS_PUSH_NOTIFICATION,
  SET_CURRENT_WORKFLOW_COLLECTION_URL,
  CLEAR_CURRENT_WORKFLOW_COLLECTION_URL,
} from '../actionTypes';

import { GET, POST, PATCH, PUT } from '../../../constants/http';
import { WorkflowCollectionRecommendationType } from '../../types';
import {
  WORKFLOW_COLLECTIONS_URL,
  WORKFLOW_COLLECTION_ENGAGEMENTS_URL,
  WORKFLOW_COLLECTION_ENGAGEMENT_URL,
  WORKFLOW_COLLECTION_ENGAGEMENT_DETAILS_URL,
  WORKFLOW_COLLECTION_ASSIGNMENTS_URL,
  WORKFLOW_COLLECTION_ASSIGNMENT_URL,
  WORKFLOW_COLLECTION_RECOMMENDATIONS_URL,
  WORKFLOW_COLLECTION_RECOMMENDATION_URL,
  WORKFLOW_COLLECTION_SUBSCRIPTIONS_URL,
  WORKFLOW_COLLECTION_SUBSCRIPTION_URL,
  WORKFLOW_URL,
} from './uriSegments';

////////////////////////////////////////////
////////////////////////////////////////////
// WORKFLOW COLLECTIONS
////////////////////////////////////////////
////////////////////////////////////////////

export const loadWorkflowCollections = createAPIAction(
  WORKFLOW_COLLECTIONS_URL,
  GET,
  LOAD_WORKFLOW_COLLECTIONS,
  null,
  3
);

export const setCurrentWorkflowCollectionURL = createAction(
  SET_CURRENT_WORKFLOW_COLLECTION_URL
);
export const clearCurrentWorkflowCollectionURL = createAction(
  CLEAR_CURRENT_WORKFLOW_COLLECTION_URL
);

////////////////////////////////////////////
////////////////////////////////////////////
// WORKFLOW COLLECTION ENGAGEMENTS
////////////////////////////////////////////
////////////////////////////////////////////

export const createWorkflowCollectionEngagement = createAPIAction(
  WORKFLOW_COLLECTION_ENGAGEMENTS_URL,
  POST,
  CREATE_WORKFLOW_COLLECTION_ENGAGEMENT,
  (workflowCollectionURL, started) => ({
    workflow_collection: workflowCollectionURL,
    started,
  }),
  3
);

export const retrieveWorkflowCollectionEngagement = createAPIAction(
  WORKFLOW_COLLECTION_ENGAGEMENT_URL,
  GET,
  RETRIEVE_WORKFLOW_COLLECTION_ENGAGEMENT,
  (engagement) => {
    const url = engagement.hasOwnProperty('detail')
      ? engagement.detail
      : engagement.self_detail;
    return {
      id: url.split('/')[8],
    };
  },
  3
);

// WORKFLOW COLLECTION ENGAGEMENT DETAILS
export const createWorkflowCollectionEngagementDetail = createAPIAction(
  WORKFLOW_COLLECTION_ENGAGEMENT_DETAILS_URL,
  POST,
  CREATE_WORKFLOW_COLLECTION_ENGAGEMENT_DETAIL,
  (collectionEngagement, stepId, userResponse, started, finished) => {
    const url = collectionEngagement.hasOwnProperty('detail')
      ? collectionEngagement.detail
      : collectionEngagement.self_detail;

    return {
      id: url.split('/')[8],
      step: stepId,
      user_response: userResponse,
      started,
      finished,
    };
  },
  3
);

export const updateWorkflowCollectionEngagementDetail = createAPIAction(
  'users/self/workflows/engagements/:id/',
  PATCH,
  UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT_DETAIL,
  (collectionEngagementDetail, userResponse, started, finished) => {
    const urlSegments = collectionEngagementDetail.detail.split('/');
    const engagementID = urlSegments[8];
    const detailID = urlSegments[10];

    // Since the URL for this endpoint has two variable segments, but the
    // API framework being used only has support for one, we sidestep the issue
    // by injecting /engagementID/details/detailID into the :id placeholder
    return {
      id: `${engagementID}/details/${detailID}`,
      user_response: userResponse,
      started,
      finished,
    };
  },
  3
);

////////////////////////////////////////////
////////////////////////////////////////////
// WORKFLOW COLLECTION ASSIGNMENTS
////////////////////////////////////////////
////////////////////////////////////////////
export const loadWorkflowCollectionAssignments = createAPIAction(
  WORKFLOW_COLLECTION_ASSIGNMENTS_URL,
  GET,
  LOAD_WORKFLOW_COLLECTION_ASSIGNMENTS,
  null,
  3
);

export const updateWorkflowCollectionAssignment = createAPIAction(
  WORKFLOW_COLLECTION_ASSIGNMENT_URL,
  PATCH,
  UPDATE_WORKFLOW_COLLECTION_ASSIGNMENT,
  (collectionAssignment, collectionEngagement, status) => {
    return {
      id: collectionAssignment.id,
      engagement: collectionEngagement.self_detail,
      status,
    };
  },
  3
);

// WORKFLOW COLLECTION RECOMMENDATIONS
export const loadWorkflowCollectionRecommendations = createAPIAction(
  WORKFLOW_COLLECTION_RECOMMENDATIONS_URL,
  GET,
  LOAD_WORKFLOW_COLLECTION_RECOMMENDATIONS,
  null,
  3
);

export const createWorkflowCollectionRecommendation = createAPIAction(
  WORKFLOW_COLLECTION_RECOMMENDATIONS_URL,
  POST,
  CREATE_WORKFLOW_COLLECTION_RECOMMENDATION,
  (payload: { workflow_collection?: string; start?: string; end?: string }) =>
    payload,
  3
);

export const updateWorkflowCollectionRecommendation = createAPIAction(
  WORKFLOW_COLLECTION_RECOMMENDATION_URL,
  PATCH,
  UPDATE_WORKFLOW_COLLECTION_RECOMMENDATION,
  (
    workflowCollectionRecommendation: WorkflowCollectionRecommendationType,
    modifications: {
      workflow_collection?: string;
      start?: string;
      end?: string;
    }
  ) => ({
    id: workflowCollectionRecommendation.detail.split('/')[8],
    ...modifications,
  }),
  3
);

// WORKFLOW COLLECTION SUBSCRIPTIONS
export const createWorkflowCollectionSubscription = createAPIAction(
  WORKFLOW_COLLECTION_SUBSCRIPTIONS_URL,
  POST,
  CREATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
  (workflowCollectionURL, notificationSchedules) => ({
    workflow_collection: workflowCollectionURL,
    active: true,
    workflowcollectionsubscriptionschedule_set: notificationSchedules,
  }),
  3
);

export const loadWorkflowCollectionSubscriptions = createAPIAction(
  WORKFLOW_COLLECTION_SUBSCRIPTIONS_URL,
  GET,
  LOAD_WORKFLOW_COLLECTION_SUBSCRIPTIONS,
  null,
  3
);

export const updateWorkflowCollectionSubscription = createAPIAction(
  WORKFLOW_COLLECTION_SUBSCRIPTION_URL,
  PUT,
  UPDATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
  (
    workflowCollectionSubscription,
    keepSubscription,
    notificationSchedules
  ) => ({
    id: workflowCollectionSubscription.detail.split('/')[8],
    workflow_collection: workflowCollectionSubscription.workflow_collection,
    active: keepSubscription,
    workflowcollectionsubscriptionschedule_set: notificationSchedules,
  }),
  3
);

// INDIVIDUAL WORKFLOWS
export const loadWorkflow = createAPIAction(
  WORKFLOW_URL,
  GET,
  LOAD_WORKFLOW,
  (workflowURL) => ({
    id: workflowURL.split('/')[6], // Extract ID for ResourceURL
  }),
  3
);

export const resetWorkflowsState = createAction(RESET);
export const partialResetAfterPracticeEngagement = createAction(
  PARTIAL_RESET_AFTER_PRACTICE_ENGAGEMENT
);

// ERROR HANDLING
export const clearError = createAction(CLEAR_ERROR);

// PUSH NOTIFICATIONS
export const setWorkflowsPushNotification = createAction(
  SET_WORKFLOWS_PUSH_NOTIFICATION
);
export const clearWorkflowsPushNotification = createAction(
  CLEAR_WORKFLOWS_PUSH_NOTIFICATION
);

export * from './workflowEngagementHistory';
export * from './workflowEngagement';
