import { collectionEngagementHistoryType } from '../workflows/types';

export interface APIErrorAction {
  payload: {
    name: 'ApiError';
    status: number;
    response: { [key: string]: Array<string> };
    message: string;
  };
  type: string;
  error: true;
}

export interface ApiErrorType {
  statusCode: number;
  payload: { [key: string]: Array<string> };
}

export interface CalendarDay {
  dayIndex?: number;
  dayOfWeek: number;
  engagements: collectionEngagementHistoryType;
}

export interface YearCalendar {
  [month: number]: {
    monthName: string;
    daysInMonth: Array<CalendarDay>;
  };
}

export type SimplifiedExpoPushNotification = {
  event: 'WorkflowSubscriptionReminder' | 'MYDActivity';
  event_details: object;
};

export type MYDPushNotification = SimplifiedExpoPushNotification & {
  event: 'MYDActivity';
  event_details: {
    activity_id: string;
    assignment_id: string;
  };
};

export type WorkflowCollectionPushNotification = SimplifiedExpoPushNotification & {
  event: 'WorkflowSubscriptionReminder';
  event_details: {
    workflow_collection_url: string;
    workflow_collection_subscription_url: string;
  };
};
