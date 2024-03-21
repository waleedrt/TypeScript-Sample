import { WorkflowStepType, WorkflowStepInputType } from './workflowTypes';

/**
 * Type definition for a summary view of a
 * Workflow Collection Engagement from the API
 */
export interface WorkflowCollectionEngagementSummaryType {
  detail: string;
  workflow_collection: string;
  started: string;
  finished: string;
  state: WorkflowCollectionEngagementStateType;
  workflowcollectionengagementdetail_set?: Array<
    WorkflowCollectionEngagementDetailType
  >;
}

/**
 * Type definition for a detailed view of a
 * Workflow Collection Engagement from the API
 *
 * NOTE: This can easily be confused with the
 * WorkflowCollectionEngagementDetailType
 */
export interface WorkflowCollectionEngagementDetailViewType {
  self_detail: string;
  workflow_collection: string;
  started: string;
  finished: string;
  workflowcollectionengagementdetail_set: Array<
    WorkflowCollectionEngagementDetailType
  >;
  state: WorkflowCollectionEngagementStateType;
}

export interface WorkflowCollectionEngagementDetailType {
  step: string;
  user_response: {
    questions: Array<WorkflowEngagementQuestionProcessedResponseType>;
  };
  started: string;
  finished: string;
}

/**
 * Type definition for Workflow Collection Engagement State
 */
export interface WorkflowCollectionEngagementStateType {
  next_step_id: string | null;
  prev_step_id: string | null;
  steps_completed_in_collection: number;
  steps_in_collection: number;
  steps_completed_in_workflow: number;
  steps_in_workflow: number;
  next_workflow: string | null;
  prev_workflow: string | null;
  previously_completed_workflows: Array<{ workflow: string }>;
}

/**
 * Type definition for Workflow Engagement question responses
 * that have been processed and are ready to be stored via the
 * API.
 */
export interface WorkflowEngagementQuestionProcessedResponseType {
  stepInputID: string;
  stepInputUIIdentifier: string;
  response: any;
}

export interface WorkflowEngagementQuestionOptionType {
  content: string;
  storage_value: number | null;
  ui_identifier?: string;
  image?: string;
}

/**
 * Type definition for Workflow Engagement Question Nodes
 */
export interface WorkflowEngagementQuestionNodeType {
  order: number;
  question: WorkflowStepInputType;
  options: Array<WorkflowEngagementQuestionOptionType>;
}

/**
 * Type definition for injected options to Workflow Questions
 */
export interface WorkflowEngagementQuestionInjectedOptionType {
  content: string;
  ui_identifier: string;
  storage_value?: number | null;
}

/**
 * Type definition for injected option images to Workflow Questions
 */
export interface WorkflowEngagementQuestionInjectedOptionImageType {
  ui_identifier: string;
  url: string;
}

/**
 * Interface for all Dynamic UI Templates for Workflow Engagements
 */
export interface DynamicUITemplateType {
  step: WorkflowStepType;
  backAction: () => void;
  nextAction: () => void;
  cancelAction: () => void;
  isFocused: boolean;
  syncInput: (input: {
    questions: Array<WorkflowEngagementQuestionProcessedResponseType>;
  }) => void;
  injectedOptions?: Array<WorkflowEngagementQuestionInjectedOptionType>;
  injectedImages?: Array<WorkflowEngagementQuestionInjectedOptionImageType>;
}
