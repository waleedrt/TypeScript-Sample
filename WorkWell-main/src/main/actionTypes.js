/**
 * Definition of Action Types for Main Module
 */

export const FIRST_TIME_USING_APP = 'main/FIRST_TIME_USING_APP';

export const GET_NOTIFICATION_DEVICES = {
  ACTION: 'main/GET_NOTIFICATION_DEVICES',
  FAILURE: 'main/GET_NOTIFICATION_DEVICES_FAILURE',
  SUCCESS: 'main/GET_NOTIFICATION_DEVICES_SUCCESS',
};

export const CLEAR_NOTIFICATION_DEVICES = 'main/CLEAR_NOTIFICATION_DEVICES';

export const ENABLE_NOTIFICATIONS = {
  ACTION: 'main/ENABLE_NOTIFICATIONS',
  FAILURE: 'main/ENABLE_NOTIFICATIONS_FAILURE',
  SUCCESS: 'main/ENABLE_NOTIFICATIONS_SUCCESS',
};

export const SET_EXPO_PUSH_TOKEN = 'main/SET_EXPO_PUSH_TOKEN';
export const CLEAR_EXPO_PUSH_TOKEN = 'main/CLEAR_EXPO_PUSH_TOKEN';
export const SET_PUSH_NOTIFICATION = 'main/SET_PUSH_NOTIFICATION';
export const CLEAR_PUSH_NOTIFICATION = 'main/CLEAR_PUSH_NOTIFICATION';

export const SET_APP_STATE = 'main/SET_APP_STATE';
export const GET_SUPPORTED_APP_VERSIONS = {
  ACTION: 'main/GET_SUPPORTED_APP_VERSIONS',
  FAILURE: 'main/GET_SUPPORTED_APP_VERSIONS_FAILURE',
  SUCCESS: 'main/GET_SUPPORTED_APP_VERSIONS_SUCCESS',
};

export const IGNORE_APP_UPDATE = 'main/IGNORE_APP_UPDATE';
export const APP_START = 'main/APP_START';