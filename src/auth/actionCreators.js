import { createAction } from 'redux-actions';
import { getRedirectUrl } from 'expo-auth-session';
import * as Localization from 'expo-localization';

import { createAPIAction } from '../utils/reduxAPIActions';
import {
  LOAD_USER,
  GET_CLIENT_SECRET_KEY,
  LOGOUT,
  LOGIN,
  REFRESH_TOKENS,
  CODE,
  LOGOUT_INIT,
  REGISTER_USER,
  UPDATE_USER_TIMEZONE,
  UPDATE_USER,
  CLEAR_ERROR,
  CLEAR_PENDING_ACTIONS
} from './actionTypes';
import { GET, POST, PATCH } from '../constants/http';
import config from '../../config/config';

// URL segments needed for actions
// defined in this module of the mobile app.
const url_segments = {
  USER_URL: 'users/self/',
  USERS_URL: 'users/',
  AUTH_URL: 'oauth2/authorize/', // Needed for AuthSession, keeping here for organization
  SECRET_KEY_URL: 'oauth2/public_client_secret_key/',
  TOKEN_URL: 'oauth2/token/',
  REVOKE_TOKEN_URL: 'oauth2/revoke-token/',
  REDIRECT_URL: getRedirectUrl(),
};

// Non-API Action Creators
const initLogin = createAction(CODE.SET);
export const initLogout = createAction(LOGOUT_INIT);
export const clearError = createAction(CLEAR_ERROR);
export const clearPendingActions = createAction(CLEAR_PENDING_ACTIONS)

// API Action Creators
export const loadUser = createAPIAction(
  url_segments.USER_URL,
  GET,
  LOAD_USER,
  undefined,
  3
);

const getSecretKey = createAPIAction(
  url_segments.SECRET_KEY_URL,
  GET,
  GET_CLIENT_SECRET_KEY,
  (code) => ({
    params: {
      code,
      client_id: config.clientID,
    },
  }),
  3
);

const register = createAPIAction(
  url_segments.USERS_URL,
  POST,
  REGISTER_USER,
  ({ email, password, referralCode, firstName, lastName }) => ({
    email,
    password,
    referral_code: referralCode,
    first_name: firstName,
    last_name: lastName,
    user_agreed_to_terms: true,
    timezone: Localization.timezone,
  }),
  3
);

export const updateUser = createAPIAction(
  url_segments.USER_URL,
  PATCH,
  UPDATE_USER,
  ({ username, emailAddress, firstName, lastName }) => {
    return {
      username: username,
      email: emailAddress,
      first_name: firstName,
      last_name: lastName,
    };
  },
  3
);

export const updateUserTimezone = createAPIAction(
  url_segments.USER_URL,
  PATCH,
  UPDATE_USER_TIMEZONE,
  () => ({
    timezone: Localization.timezone,
  }),
  3
);

const login = createAPIAction(
  url_segments.TOKEN_URL,
  POST,
  LOGIN,
  (code) => {
    const formData = new FormData();
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', url_segments.REDIRECT_URL);

    return {
      form: formData,
    };
  },
  3
);

const logout = createAPIAction(
  url_segments.REVOKE_TOKEN_URL,
  POST,
  LOGOUT,
  (accessToken) => {
    const formData = new FormData();
    formData.append('token', accessToken);
    formData.append('client_id', config.clientID);
    return {
      form: formData,
    };
  },
  3
);

export const refreshTokens = createAPIAction(
  url_segments.TOKEN_URL,
  POST,
  REFRESH_TOKENS,
  (refreshToken) => {
    const formData = new FormData();
    formData.append('grant_type', 'refresh_token');
    formData.append('client_id', config.clientID);
    formData.append('refresh_token', refreshToken);
    return {
      form: formData,
    };
  },
  3
);

export default {
  loadUser,
  initLogin,
  getSecretKey,
  register,
  login,
  logout,
  initLogout,
  refreshTokens,
  updateUserTimezone,
  clearError,
  AUTH_URL: url_segments.AUTH_URL,
};
