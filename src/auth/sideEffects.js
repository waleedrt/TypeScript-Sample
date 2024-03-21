/**
 * Redux side effect definitions for Authorization module.
 */
import authActions from './actionCreators';
import {
  GET_CLIENT_SECRET_KEY,
  CODE,
  LOGOUT_INIT,
  REFRESH_TOKENS,
} from './actionTypes';
import genericErrorHandler from '../utils/genericErrorHandler';

async function loginWithSecret({ dispatch, getState }) {
  const { code } = getState().auth;
  dispatch(authActions.login(code)); // clientSecret added in authMiddleware
}

async function getSecretWithCode({ action, dispatch }) {
  dispatch(authActions.getSecretKey(action.payload));
}

async function logoutRemote({ dispatch, getState }) {
  const state = getState();
  const accessToken = state.auth.tokens.access_token;
  dispatch(authActions.logout(accessToken));
}

export default [
  {
    action: CODE.SET,
    effect: getSecretWithCode,
    error: genericErrorHandler,
  },
  {
    action: GET_CLIENT_SECRET_KEY.SUCCESS,
    effect: loginWithSecret,
    error: genericErrorHandler,
  },
  {
    action: LOGOUT_INIT,
    effect: logoutRemote,
    error: genericErrorHandler,
  },
  {
    action: REFRESH_TOKENS.FAILURE,
    effect: logoutRemote,
    error: genericErrorHandler,
  },
];
