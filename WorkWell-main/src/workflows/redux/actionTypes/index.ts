/**
 * Definition of Action Types for Workflow Collections
 */

export const LOAD_WORKFLOW = {
  ACTION: 'workflows/LOAD_WORKFLOW',
  FAILURE: 'workflows/LOAD_WORKFLOW_FAILURE',
  SUCCESS: 'workflows/LOAD_WORKFLOW_SUCCESS',
};

export const RESET = 'workflows/RESET';
export const PARTIAL_RESET_AFTER_PRACTICE_ENGAGEMENT =
  'workflows/PARTIAL_RESET_AFTER_PRACTICE_ENGAGEMENT';

export const CLEAR_ERROR = 'workflows/CLEAR_ERROR';
export const SET_WORKFLOWS_PUSH_NOTIFICATION =
  'workflows/SET_PUSH_NOTIFICATION';
export const CLEAR_WORKFLOWS_PUSH_NOTIFICATION =
  'workflows/CLEAR_PUSH_NOTIFICATION';

export * from './workflowCollection';
export * from './workflowCollectionAssignment';
export * from './workflowCollectionEngagement';
export * from './workflowCollectionEngagementDetail';
export * from './workflowCollectionEngagementHistory';
export * from './workflowCollectionSubscription';
export * from './workflowCollectionRecommendation';
