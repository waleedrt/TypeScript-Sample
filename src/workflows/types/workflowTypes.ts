export interface WorkflowType {
  id: string;
  self_detail: string;
  code: string;
  name: string;
  image: string;
  author: WorkflowAuthorType;
  workflowstep_set: Array<WorkflowStepType>;
}

export interface WorkflowStepTextType {
  id: string;
  workflow_step: string;
  content: string;
  ui_identifier: string;
  storage_value: number | null;
}

export interface WorkflowStepInputType {
  id: string;
  workflow_step: string;
  content: string;
  ui_identifier: string;
  required: boolean;
  response_schema: string;
}

export interface WorkflowStepImageType {
  id: string;
  workflow_step: string;
  ui_identifier: string;
  url: string;
}

export interface WorkStepVideoType extends WorkflowStepImageType {}
export interface WorkflowStepAudioType extends WorkflowStepImageType {}

export interface WorkflowStepType {
  id: string;
  code: string;
  order: number;
  ui_template: string;
  workflowstepinput_set: Array<WorkflowStepInputType>;
  workflowsteptext_set: Array<WorkflowStepTextType>;
  workflowstepaudio_set: Array<WorkflowStepAudioType>;
  workflowstepimage_set: Array<WorkflowStepImageType>;
  workflowstepvideo_set: Array<WorkStepVideoType>;
}

export interface WorkflowAuthorType {
  id: string;
  user: { first_name: string; last_name: string };
  detail: string;
  title: string;
  image: string;
}
