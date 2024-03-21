import { handleActions } from 'redux-actions';
import moment from 'moment';

import {
  LOAD_USER,
  GET_CLIENT_SECRET_KEY,
  LOGIN,
  LOGOUT,
  CODE,
  LOGOUT_INIT,
  REGISTER_USER,
  REFRESH_TOKENS,
  UPDATE_USER_TIMEZONE,
  UPDATE_USER,
  CLEAR_ERROR,
  CLEAR_PENDING_ACTIONS,
} from './actionTypes';
import {
  apiActionReducers,
  genericAPIstate,
  stateSuccessFuncs,
} from '../utils/reduxAPIActions';
import { ApiErrorType } from '../types';

export type AuthReduxStoreType = {
  isPending: boolean;
  error: ApiErrorType | null;
  pendingActions: string[];
  user: {
    id: number | null;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    timezone: string | null;
    links: Array<string>;
    referral_code: string | null;
  };
  tokens: {
    access_token: string | null;
    refresh_token: string | null;
    status:
      | 'Requested'
      | 'Received'
      | 'Failure'
      | 'Not Yet Requested'
      | 'Invalid';
    expires: string | null;
  };
  clientSecret: string | null;
  code: string | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
};

const initialState: AuthReduxStoreType = {
  ...genericAPIstate,
  user: {
    id: null,
    username: null,
    first_name: null,
    last_name: null,
    email: null,
    timezone: null,
    links: [],
    referral_code: null,
  },
  tokens: {
    access_token: null,
    refresh_token: null,
    status: 'Not Yet Requested',
    expires: null,
  },
  clientSecret: null,
  code: null,
  isAuthenticated: false,
  isRegistered: false, // For being in the process of registration.
};

type OAuthTokensReceivedActionType = {
  payload: {
    access_token: string;
    expires_in: number;
    token_type: 'Bearer';
    scope: 'read write';
    refresh_token: string;
  };
};

const actionsToStateChange = {
  ...apiActionReducers(LOAD_USER, 'user'),
  ...apiActionReducers(REGISTER_USER, 'user', stateSuccessFuncs.set, 'id', {
    isRegistered: true,
  }),
  ...apiActionReducers(UPDATE_USER, 'user'),
  ...apiActionReducers(UPDATE_USER_TIMEZONE, 'user'),
  ...apiActionReducers(
    GET_CLIENT_SECRET_KEY,
    'clientSecret',
    stateSuccessFuncs.spread
  ),
  [LOGIN.ACTION]: (state: AuthReduxStoreType): AuthReduxStoreType => ({
    ...state,
    tokens: { ...state.tokens, status: 'Requested' },
  }),
  [LOGIN.SUCCESS]: (
    state: AuthReduxStoreType,
    action: OAuthTokensReceivedActionType
  ): AuthReduxStoreType => {
    return {
      ...state,
      isAuthenticated: true,
      tokens: {
        ...state.tokens,
        status: 'Received',
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
        expires: moment().add(action.payload.expires_in, 'seconds').format(),
      },
    };
  },
  [LOGIN.FAILURE]: (state: AuthReduxStoreType): AuthReduxStoreType => {
    return {
      ...state,
      isAuthenticated: false,
      tokens: {
        ...state.tokens,
        status: 'Failure',
        access_token: null,
        refresh_token: null,
        expires: null,
      },
    };
  },

  [REFRESH_TOKENS.ACTION]: (state: AuthReduxStoreType): AuthReduxStoreType => ({
    ...state,
    tokens: { ...state.tokens, status: 'Requested' },
  }),
  [REFRESH_TOKENS.SUCCESS]: (
    state: AuthReduxStoreType,
    action: OAuthTokensReceivedActionType
  ): AuthReduxStoreType => {
    return {
      ...state,
      isAuthenticated: true,
      tokens: {
        ...state.tokens,
        status: 'Received',
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
        expires: moment().add(action.payload.expires_in, 'seconds').format(),
      },
    };
  },
  [REFRESH_TOKENS.FAILURE]: (state: AuthReduxStoreType): AuthReduxStoreType => {
    return {
      ...state,
      isAuthenticated: false,
      tokens: {
        ...state.tokens,
        status: 'Failure',
        access_token: null,
        refresh_token: null,
        expires: null,
      },
    };
  },
  ...apiActionReducers(LOGOUT, 'tokens', stateSuccessFuncs.clear, 'id', {
    isAuthenticated: false,
  }),
  [CODE.SET]: (state: AuthReduxStoreType, { payload }): AuthReduxStoreType => ({
    ...state,
    code: payload,
  }),
  [LOGOUT_INIT]: (state: AuthReduxStoreType): AuthReduxStoreType => ({
    ...state,
    isAuthenticated: false,
    isRegistered: false,
  }),
  [CLEAR_ERROR]: (state: AuthReduxStoreType): AuthReduxStoreType => ({
    ...state,
    error: null,
  }),
  [CLEAR_PENDING_ACTIONS]: (state: AuthReduxStoreType): AuthReduxStoreType => ({
    ...state,
    pendingActions: [],
  }),
};

export default handleActions(actionsToStateChange, initialState);
