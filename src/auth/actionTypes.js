/**
 * Definition of Action Types for Authorization Module
 */

// Login Flow:
// 1. Use AuthSession to retrieve challenge code, no redux actions here
// 2. GET_CLIENT_SECRET_KEY with challenge code
// 3. Use secret key to obtain tokens to LOGIN

export const LOAD_USER = {
  ACTION: 'auth/LOAD_USER',
  FAILURE: 'auth/LOAD_USER_FAILURE',
  SUCCESS: 'auth/LOAD_USER_SUCCESS'
};

export const REGISTER_USER = {
  ACTION: 'auth/REGISTER_USER',
  FAILURE: 'auth/REGISTER_USER_FAILURE',
  SUCCESS: 'auth/REGISTER_USER_SUCCESS'
};

export const UPDATE_USER = {
  ACTION: 'auth/UPDATE_USER',
  FAILURE: 'auth/UPDATE_USER_FAILURE',
  SUCCESS: 'auth/UPDATE_USER_SUCCESS'
};

export const UPDATE_USER_TIMEZONE = {
  ACTION: 'auth/UPDATE_USER_TIMEZONE',
  FAILURE: 'auth/UPDATE_USER_TIMEZONE_FAILURE',
  SUCCESS: 'auth/UPDATE_USER_TIMEZONE_SUCCESS'
};

export const GET_CLIENT_SECRET_KEY = {
  ACTION: 'auth/GET_CLIENT_SECRET_KEY',
  FAILURE: 'auth/GET_CLIENT_SECRET_KEY_FAILURE',
  SUCCESS: 'auth/GET_CLIENT_SECRET_KEY_SUCCESS'
};

export const LOGIN = {
  ACTION: 'auth/LOGIN',
  FAILURE: 'auth/LOGIN_FAILURE',
  SUCCESS: 'auth/LOGIN_SUCCESS'
};

export const LOGOUT = {
  ACTION: 'auth/LOGOUT',
  FAILURE: 'auth/LOGOUT_FAILURE',
  SUCCESS: 'auth/LOGOUT_SUCCESS'
};

export const LOGOUT_INIT = 'auth/LOGOUT_INIT';

export const REFRESH_TOKENS = {
  ACTION: 'auth/REFRESH_TOKENS',
  FAILURE: 'auth/REFRESH_TOKENS_FAILURE',
  SUCCESS: 'auth/REFRESH_TOKENS_SUCCESS'
};

export const CODE = {
  ACTION: 'auth/CODE',
  SET: 'auth/CODE_SET'
};

export const CLEAR_ERROR = 'auth/CLEAR_ERROR';
export const CLEAR_PENDING_ACTIONS = 'auth/CLEAR_PENDING_ACTIONS';

export default {
  LOAD_USER,
  REGISTER_USER,
  GET_CLIENT_SECRET_KEY,
  LOGIN,
  LOGOUT,
  LOGOUT_INIT,
  REFRESH_TOKENS,
  CODE
};
