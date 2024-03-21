import { handleActions } from 'redux-actions';
import {
  FIRST_TIME_USING_APP,
  GET_NOTIFICATION_DEVICES,
  CLEAR_NOTIFICATION_DEVICES,
  ENABLE_NOTIFICATIONS,
  SET_PUSH_NOTIFICATION,
  CLEAR_PUSH_NOTIFICATION,
  SET_APP_STATE,
  GET_SUPPORTED_APP_VERSIONS,
  IGNORE_APP_UPDATE,
  APP_START,
  SET_EXPO_PUSH_TOKEN,
  CLEAR_EXPO_PUSH_TOKEN,
} from './actionTypes';
import {
  apiActionReducers,
  stateSuccessFuncs,
  genericAPIstate,
} from '../utils/reduxAPIActions';
import { ApiErrorType, SimplifiedExpoPushNotification } from '../types';
import { NotificationDeviceType } from './types';
import { AppStateStatus } from 'react-native';

export type MainReduxStoreType = {
  isPending: boolean;
  error: ApiErrorType | null;
  pendingActions: string[];
  firstTimeUsingApp: boolean;
  notificationDevices: NotificationDeviceType[] | null;
  pushNotification: SimplifiedExpoPushNotification | null;
  appState: AppStateStatus;
  appVersions: Array<{
    version_code: string;
    status: 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED';
  }> | null;
  ignoredUpdates: Array<string>;
  expoPushToken: string | null;
};

const initialState: MainReduxStoreType = {
  ...genericAPIstate,
  firstTimeUsingApp: true,
  notificationDevices: null,
  pushNotification: null,
  appState: 'active',
  appVersions: null,
  ignoredUpdates: [],
  expoPushToken: null,
};

const actionsToStateChange = {
  ...apiActionReducers(
    GET_NOTIFICATION_DEVICES,
    'notificationDevices',
    stateSuccessFuncs.set
  ),
  ...apiActionReducers(
    ENABLE_NOTIFICATIONS,
    'notificationDevices',
    stateSuccessFuncs.nothing
  ),
  ...apiActionReducers(
    GET_SUPPORTED_APP_VERSIONS,
    'appVersions',
    stateSuccessFuncs.set
  ),
  [FIRST_TIME_USING_APP]: (state: MainReduxStoreType, action) => ({
    ...state,
    firstTimeUsingApp: action.payload,
  }),
  [CLEAR_NOTIFICATION_DEVICES]: (
    state: MainReduxStoreType
  ): MainReduxStoreType => ({
    ...state,
    notificationDevices: initialState.notificationDevices,
  }),
  [SET_PUSH_NOTIFICATION]: (
    state: MainReduxStoreType,
    action
  ): MainReduxStoreType => ({
    ...state,
    pushNotification: action.payload,
  }),
  [CLEAR_PUSH_NOTIFICATION]: (
    state: MainReduxStoreType
  ): MainReduxStoreType => ({
    ...state,
    pushNotification: initialState.pushNotification,
  }),
  [SET_EXPO_PUSH_TOKEN]: (
    state: MainReduxStoreType,
    action: { payload: string }
  ): MainReduxStoreType => ({
    ...state,
    expoPushToken: action.payload,
  }),
  [CLEAR_EXPO_PUSH_TOKEN]: (state: MainReduxStoreType): MainReduxStoreType => ({
    ...state,
    expoPushToken: initialState.expoPushToken,
  }),
  [SET_APP_STATE]: (state: MainReduxStoreType, action): MainReduxStoreType => ({
    ...state,
    appState: action.payload,
  }),
  [APP_START]: (state: MainReduxStoreType, action): MainReduxStoreType => ({
    ...state,
    pendingActions: initialState.pendingActions,
    appVersions: initialState.appVersions,
    expoPushToken: initialState.expoPushToken,
    notificationDevices: initialState.notificationDevices,
    error: null,
  }),
  [IGNORE_APP_UPDATE]: (
    state: MainReduxStoreType,
    action
  ): MainReduxStoreType => ({
    ...state,
    ignoredUpdates: action.payload.map(
      (appRelease: {
        version_code: string;
        status: 'SUPPORTED' | 'DEPRECATED' | 'UNSUPPORTED';
      }) => appRelease.version_code
    ),
  }),
};

export default handleActions(actionsToStateChange, initialState);
