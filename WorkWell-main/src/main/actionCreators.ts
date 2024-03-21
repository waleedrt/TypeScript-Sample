import { createAction } from 'redux-actions';
// @ts-ignore
import identity from 'redux-actions/lib/utils/identity';
import * as Device from 'expo-device';

import {
  FIRST_TIME_USING_APP,
  ENABLE_NOTIFICATIONS,
  GET_NOTIFICATION_DEVICES,
  SET_PUSH_NOTIFICATION,
  CLEAR_PUSH_NOTIFICATION,
  SET_APP_STATE,
  GET_SUPPORTED_APP_VERSIONS,
  IGNORE_APP_UPDATE,
  APP_START,
  SET_EXPO_PUSH_TOKEN,
  CLEAR_EXPO_PUSH_TOKEN,
} from './actionTypes';
import { createAPIAction } from '../utils/reduxAPIActions';
import { POST, GET } from '../constants/http';

const NOTIFICATIONS_URL = 'users/self/notifications/targets/';

export const getNotificationDevices = createAPIAction(
  NOTIFICATIONS_URL,
  GET,
  GET_NOTIFICATION_DEVICES,
  identity,
  3
);

export const enableNotifications = createAPIAction(
  NOTIFICATIONS_URL,
  POST,
  ENABLE_NOTIFICATIONS,
  (devicePushToken) => ({
    user_target_id: devicePushToken,
    user_target_friendly_name: `${Device.modelName} [${Device.osName}]`,
    target: 'Expo',
  }),
  3
);

export const getSupportedAppVersions = createAPIAction(
  'app-versions/',
  GET,
  GET_SUPPORTED_APP_VERSIONS,
  identity,
  3
);

export const setExpoPushToken = createAction(SET_EXPO_PUSH_TOKEN);
export const clearExpoPushToken = createAction(CLEAR_EXPO_PUSH_TOKEN);

export const setPushNotification = createAction(SET_PUSH_NOTIFICATION);
export const clearPushNotification = createAction(CLEAR_PUSH_NOTIFICATION);

export const setFirstTimeUsingApp = createAction(FIRST_TIME_USING_APP);
export const setAppState = createAction(SET_APP_STATE);
export const ignoreAppUpdate = createAction(IGNORE_APP_UPDATE);
export const partialResetOnAppStart = createAction(APP_START);

export default {
  setFirstTime: setFirstTimeUsingApp,
  getNotificationDevices,
  enableNotifications,
  setPushNotification,
  clearPushNotification,
};
