export interface MYDUITemplateType {
  step: MYDActivityStepType;
  backAction: () => void;
  nextAction: () => void;
  cancelAction: () => void;
  syncInput: (input: { stepID: string; response: any }) => void;
}

export interface MYDEnrollmentType {
  id: string;
  detail: string;
  active: boolean;
  group: string;
  participantdailyschedule_set: Array<{
    day_of_week: number;
    work_day: boolean;
    notification_opt_out: boolean;
  }>;
  participantscheduleblock_set: Array<MYDEnrollmentScheduleBlock>;
}

export interface MYDEnrollmentScheduleBlock {
  schedule_block: string;
  start: string;
  end: string;
}

export interface MYDActivityType {
  id: string;
  detail: string;
  name: string;
  image: string;
  start: string;
  end: string;
  schedule_block: string;
  group: Array<string>;
  activitystep_set: Array<MYDActivityStepType>;
}

export interface MYDActivityStepType {
  id: string;
  image: string;
  ui_template: string;
  text: string;
  order: number;
  response_schema: any;
}

export interface MYDAssignmentType {
  id: string;
  detail: string;
  activity: string;
  activity_id: string;
  eligible_start: string;
  eligible_end: string;
  actual_start: string;
  actual_end: string;
  response: Array<{ step: string; response: any }> | null;
}

export * from './mydHistoryTypes';
