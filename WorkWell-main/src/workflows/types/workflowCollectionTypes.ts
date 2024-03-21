import { WorkflowAuthorType, WorkflowType } from './workflowTypes';

export interface WorkflowCollectionType {
  id: string;
  detail: string;
  name: string;
  code: string;
  version: number;
  active: boolean;
  created_date: string;
  modified_date: string;
  description: string;
  home_image: string;
  detail_image: string;
  library_image: string;
  assignment_only: boolean;
  newer_version: string;
  ordered: boolean;
  category: 'SURVEY' | 'ACTIVITY';
  tags: Array<string>;
  authors: Array<WorkflowAuthorType>;
}

export interface WorkflowCollectionDetailType extends WorkflowCollectionType {
  self_detail: string;
  workflowcollectionmember_set: Array<WorkflowCollectionMemberType>;
}

export interface WorkflowCollectionMemberType {
  order: number;
  workflow: WorkflowType;
}

export interface WorkflowCollectionAssignmentType {
  id: string;
  workflow_collection: string;
  detail: string;
  engagement: string;
  assigned_on: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'CLOSED_COMPLETE' | 'CLOSED_INCOMPLETE';
}

export interface WorkflowCollectionSubscriptionType {
  detail: string;
  workflow_collection: string;
  active: boolean;
  workflowcollectionsubscriptionschedule_set: Array<
    WorkflowCollectionSubscriptionScheduleType
  >;
}

export interface WorkflowCollectionSubscriptionScheduleType {
  time_of_day: string;
  day_of_week: number;
  weekly_interval: number;
}

export interface WorkflowCollectionRecommendationType {
  detail: string;
  workflow_collection: string;
  start: string;
  null: string | null;
}
