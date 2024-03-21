/**
 * This is Eric's attempt to reduce the boilerplate necessary
 * for defining Redux action creators.
 *
 * I think it is quite clever, but since it is not well documented
 * difficult to understand.
 */
import { RSAA } from 'redux-api-middleware';
import { defineAction } from 'redux-define';
import identity from 'redux-actions/lib/utils/identity';
import isFunction from 'redux-actions/lib/utils/isFunction';
import isNull from 'redux-actions/lib/utils/isNull';
import invariant from 'invariant';

import { FAILURE, SUCCESS } from '../constants/statusOptions';
import {
  updateItem,
  removeItem,
  insertItem,
  updateOrInsertItem,
} from './immutableUpdates';
import config from '../../config/config';

function constructUrl(base, path, id = null, params = {}) {
  const paramStr = Object.keys(params).length
    ? `?${Object.entries(params)
      .map(([key, val]) => `${key}=${val}`)
      .join('&')}`
    : '';
  return `${base}${id ? path.replace(':id', id) : path}${paramStr}`;
}

// DO NOT manipulate this, use it by spreading it (...genericAPIState) into your feature's state
export const genericAPIstate = {
  isPending: false,
  error: null,
  pendingActions: [],
};

/**
 * Create an "action creator" function that will be invoked
 * when part of the program wants to manipulate the Redux
 * store in conjunction with interacting with the backend
 * API.
 *
 * @param {string} url The URL of the API to hit.
 * @param {string} method The HTTP request method
 * @param {object} actionType The Redux action type for this action.
 * @param {Function|undefined} payloadCreator A function which is used to generate
 * the payload for the API endpoint. If not supplied, it will default to a function
 * which simply passes through what it receives.
 * @param {number} version The version of the API to hit. Defaults to version 1.
 */
export const createAPIAction = (
  url,
  method,
  actionType,
  payloadCreator = identity,
  version = 1
) => {
  // Throw an error if payloadCreator is not
  // a function or null.
  invariant(
    isFunction(payloadCreator) || isNull(payloadCreator),
    'Expected payloadCreator to be a function, undefined or null'
  );

  // If the payloadCreator function is not `identity` (passthrough)
  // then specify that it will be a function that receives (head, ...args)
  // from the caller and passes those into an invocation of payloadCreator.
  // Try and wrap your head around that. ;)
  const finalPayloadCreator =
    isNull(payloadCreator) || payloadCreator === identity
      ? identity
      : (head, ...args) =>
        head instanceof Error ? head : payloadCreator(head, ...args);

  // Here we are constructing the actual action creator function
  // that will be returned from this function.

  // Step 1: Function will accept any number of arguments.
  const actionCreator = (...args) => {
    // Step 2: Pass those arguments to the payload creator
    // which should generate the necessary API payload.
    const fullPayload = finalPayloadCreator(...args);

    // Step 3: This doesn't appear to apply to first examples I am looking at.
    //         will come back to this later.
    // Extract special keys 'id' and 'params' for url and query params, respectively
    // 'form' is also a special key extracted below
    // Payload is the rest
    const { id: urlId = null, params: urlParams = {}, ...payload } =
      fullPayload || {};

    // Step 4: Setup the request body and headers.
    // Don't define body on GET/HEAD requests.
    let body;
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // It seems a little weird to me to mix forms in like this.
    // But I suppose this is an artifact of having forms in the
    // UI that ultimately translate to API requests.
    if (payload.form) {
      body = payload.form;
      // Don't send headers for forms
      // https://github.com/agraboso/redux-api-middleware/issues/125
      headers = undefined;
    } else if (Object.keys(payload).length) {
      body = JSON.stringify(payload);
    }

    // Step 5: Construct the completed API endpoint URL.
    const urlWithVersion = `${config.apiUrl}api_v${version}/`;
    const endpoint = constructUrl(urlWithVersion, url, urlId, urlParams);

    // Step 6: This object is the actual action that will be dispatched
    // to the Redux store. The [RSAA] key here as well as the attributes
    // of the object come from the redux-api-middleware library.

    // Essentially, actions that follow this format will trigger API
    // interactions via the redux-api-middleware library.

    action = {
      [RSAA]: {
        endpoint,
        method,
        headers,
        types: [actionType.ACTION, actionType.SUCCESS, actionType.FAILURE],
        body,
      },
    };

    return action;
  };

  return actionCreator;
};

export const defineAPIAction = (typeName, feature) => {
  const actionType = defineAction(typeName, [FAILURE, SUCCESS], feature);
  return {
    [typeName]: actionType,
  };
};

function setPayload({ payload, payloadField }) {
  return {
    [payloadField]: payload,
  };
}

function spreadPayload({ payload }) {
  return {
    ...payload,
  };
}

function clearField({ payloadField }) {
  return {
    [payloadField]: {},
  };
}

function appendWithPayload({ state, payload, payloadField, idField }) {
  return {
    [payloadField]: insertItem(state[payloadField], payload, idField),
  };
}

function updateWithPayload({ state, payload, payloadField, idField }) {
  return {
    [payloadField]: updateItem(state[payloadField], payload, idField),
  };
}

function updateorAppendWithPayload({ state, payload, payloadField, idField }) {
  return {
    [payloadField]: updateOrInsertItem(state[payloadField], payload, idField),
  };
}

function deletePayload({ state, payload, payloadField, idField }) {
  return {
    [payloadField]: removeItem(state[payloadField], payload, idField),
  };
}

function doNothingWithPayload() {
  return {};
}

export const stateSuccessFuncs = {
  set: setPayload,
  clear: clearField,
  append: appendWithPayload,
  update: updateWithPayload,
  merge: updateorAppendWithPayload,
  delete: deletePayload,
  nothing: doNothingWithPayload,
  spread: spreadPayload,
};

/**
 * This function returns 3 reducer functions corresponding
 * to the initialization of a API call, and it's 2 potential
 * outcomes: success and failure.
 *
 * @param {Object} actionTypes
 *  An object with ACTION, SUCCESS, and FAILURE attributes.
 * @param {string} storeAttributeToUpdate
 *  The attribute of the Redux store that should be updated
 *  by these reducers.
 * @param {Function} onAPISuccess
 *  A optional function parameter that will be executed only on
 *  actions indicating successful API interactions. You can use
 *  this to customize how the store is mutated. The default
 *  behavior is simply to take the HTTP response payload and
 *  populate the storeAttributeToUpdate with it.
 *
 *  IMPORTANT NOTE: Whatever code is calling this function, will
 *  also have to import `stateSuccessFuncs` from this module
 *  to be able to specify a non-default option.
 * @param {string} idField
 * @param {Object} extra
 */
export function apiActionReducers(
  actionTypes,
  storeAttributeToUpdate,
  onAPISuccess = stateSuccessFuncs.set,
  idField = 'id',
  extra = {}
) {
  return {
    [actionTypes.ACTION]: (state) => {
      return {
        ...state,
        isPending: true,
        error: null,
        pendingActions: [...state.pendingActions, actionTypes.ACTION],
      };
    },

    [actionTypes.FAILURE]: (state, { payload, type }) => {
      const error = {
        statusCode: payload.status,
        payload:
          payload?.status >= 500 || payload?.status < 400
            ? {
              detail: `An unexpected server error occurred. Status code ${payload.status}`,
            }
            : payload?.response || { detail: payload?.message },
      };

      const pendingActionIndex = state.pendingActions.indexOf(
        actionTypes.ACTION
      );

      return pendingActionIndex !== -1
        ? {
          ...state,
          isPending: false,
          pendingActions: state.pendingActions.filter(
            (action, index) => index !== pendingActionIndex
          ),
          error,
        }
        : {
          ...state,
          isPending: false,
          error,
        };
    },

    [actionTypes.SUCCESS]: (state, { payload }) => {
      const pendingActionIndex = state.pendingActions.indexOf(
        actionTypes.ACTION
      );

      return pendingActionIndex !== -1
        ? {
          ...state,
          isPending: false,
          error: null,
          pendingActions: state.pendingActions.filter(
            (action, index) => index !== pendingActionIndex
          ),
          ...onAPISuccess({
            state,
            payload,
            payloadField: storeAttributeToUpdate,
            idField,
          }),
          ...extra,
        }
        : {
          ...state,
          isPending: false,
          error: null,
          ...onAPISuccess({
            state,
            payload,
            payloadField: storeAttributeToUpdate,
            idField,
          }),
          ...extra,
        };
    },
  };
}
