import { RSAA } from 'redux-api-middleware';
import { Base64 } from 'js-base64';
import config from '../../config/config';
import { LOGOUT, LOGIN } from '../auth/actionTypes';

// Inspired by:
// https://github.com/agraboso/redux-api-middleware/issues/12
// Appends authorization header so we don't have to in other places
const authMiddleware = ({ getState }) => next => (action) => {
  // Add Authorization Header
  const authAction = action;
  const state = getState();
  // rehydration breaks with this middleware if you don't early return
  if (!state || !state.auth) {
    return next(action);
  }
  const { tokens, clientSecret } = state.auth;

  let authHeader;
  if (authAction[RSAA] && authAction[RSAA].types[0] === LOGIN.ACTION && clientSecret) {
    // Need Basic auth to login
    authHeader = `Basic ${Base64.encode(`${config.clientID}:${clientSecret}`)}`;
  } else if (tokens.access_token) {
    authHeader = `Bearer ${tokens.access_token}`;
  }

  // Attach Authorization header when logged in, unless logging out
  if (authAction[RSAA] && authHeader && authAction[RSAA].types[0] !== LOGOUT.ACTION) {
    authAction[RSAA].headers = {
      Authorization: authHeader,
      ...authAction[RSAA].headers,
    };
  }

  return next(authAction);
};

export default authMiddleware;
