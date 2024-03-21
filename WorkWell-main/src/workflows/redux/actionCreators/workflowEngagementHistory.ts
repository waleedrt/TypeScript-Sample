// @ts-ignore
import { RSAA } from 'redux-api-middleware';

import { GET, POST } from '../../../constants/http';
import {
  LOAD_WORKFLOW_COLLECTIONS_HISTORICAL_ENGAGEMENTS,
  LOAD_WORKFLOW_COLLECTION_HISTORICAL_ENGAGEMENTS,
  CLEAR_WORKFLOW_HISTORY_ERROR,
  RESET_WORKFLOW_HISTORY,
  LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY,
  CLEAR_WORKFLOW_HISTORY_FOR_ALL_COLLECTIONS,
  CLEAR_WORKFLOW_HISTORY_FOR_SINGLE_COLLECTION,
  RESET_REQUEST_COLLECTION_HISTORY_PDF_EMAIL,
  REQUEST_COLLECTION_HISTORY_PDF_EMAIL,
} from '../actionTypes';
import { WORKFLOW_COLLECTION_ENGAGEMENTS_URL } from './uriSegments';
import config from '../../../../config/config';
import { createAction } from 'redux-actions';

const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * Load all collection engagements, optionally specifying
 * a particular time period.
 */
export const loadWorkflowCollectionsEngagementHistory = (args?: {
  startDateTime?: string;
  endDateTime?: string;
}) => {
  let resource_uri = `${WORKFLOW_COLLECTION_ENGAGEMENTS_URL}?include_finished=true`;
  if (args?.startDateTime && args?.endDateTime) {
    resource_uri =
      resource_uri +
      `&start=${args.startDateTime}&end=${args.endDateTime}&include_details=true`;
  }
  return {
    [RSAA]: {
      endpoint: `${config.apiUrl}api_v3/${resource_uri}`,
      method: GET,
      headers: HEADERS,
      types: [
        LOAD_WORKFLOW_COLLECTIONS_HISTORICAL_ENGAGEMENTS.ACTION,
        LOAD_WORKFLOW_COLLECTIONS_HISTORICAL_ENGAGEMENTS.SUCCESS,
        LOAD_WORKFLOW_COLLECTIONS_HISTORICAL_ENGAGEMENTS.FAILURE,
      ],
      body: undefined,
    },
  };
};

/**
 * Load all collection engagements for a specific practice during a given time period.
 */
export const loadWorkflowCollectionEngagementHistory = ({
  collectionUUID,
  startDateTime,
  endDateTime,
}: {
  collectionUUID: string;
  startDateTime?: string;
  endDateTime?: string;
}) => {
  let resource_uri = `${WORKFLOW_COLLECTION_ENGAGEMENTS_URL}?include_finished=true&collection_id=${collectionUUID}&include_details=true`;
  if (startDateTime && endDateTime) {
    resource_uri = resource_uri + `&start=${startDateTime}&end=${endDateTime}`;
  }

  return {
    [RSAA]: {
      endpoint: `${config.apiUrl}api_v3/${resource_uri}`,
      method: GET,
      headers: HEADERS,
      types: [
        LOAD_WORKFLOW_COLLECTION_HISTORICAL_ENGAGEMENTS.ACTION,
        LOAD_WORKFLOW_COLLECTION_HISTORICAL_ENGAGEMENTS.SUCCESS,
        LOAD_WORKFLOW_COLLECTION_HISTORICAL_ENGAGEMENTS.FAILURE,
      ],
      body: undefined,
    },
  };
};

/**
 * Load all collection engagements for a specific practice during a given time period.
 */
export const loadWorkflowCollectionDetailForEngagementHistory = (
  collectionURL: string
) => {
  return {
    [RSAA]: {
      endpoint: `${collectionURL}?include_steps=true`,
      method: GET,
      headers: HEADERS,
      types: [
        LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.ACTION,
        LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.SUCCESS,
        LOAD_WORKFLOW_COLLECTION_DETAIL_FOR_ENGAGEMENT_HISTORY.FAILURE,
      ],
      body: undefined,
    },
  };
};

export const resetWorkflowHistoryState = createAction(RESET_WORKFLOW_HISTORY);
export const clearWorkflowHistoryForAllCollections = createAction(
  CLEAR_WORKFLOW_HISTORY_FOR_ALL_COLLECTIONS
);
export const clearWorkflowHistoryForSingleCollection = createAction(
  CLEAR_WORKFLOW_HISTORY_FOR_SINGLE_COLLECTION
);
export const clearWorkflowHistoryError = createAction(
  CLEAR_WORKFLOW_HISTORY_ERROR
);

/**
 * Load all collection engagements for a specific practice during a given time period.
 */
export const requestCollectionHistoryPDF = ({
  workflowCollectionURL,
}: {
  workflowCollectionURL: string;
}) => {
  return {
    [RSAA]: {
      endpoint: `${config.apiUrl}api_v3/users/self/pdf/`,
      method: POST,
      headers: HEADERS,
      types: [
        REQUEST_COLLECTION_HISTORY_PDF_EMAIL.ACTION,
        REQUEST_COLLECTION_HISTORY_PDF_EMAIL.SUCCESS,
        REQUEST_COLLECTION_HISTORY_PDF_EMAIL.FAILURE,
      ],
      body: JSON.stringify({
        type: 'workflow_history',
        id: workflowCollectionURL.split('/')[6],
      }),
    },
  };
};

export const resetRequestCollectionHistoryPDF = createAction(
  RESET_REQUEST_COLLECTION_HISTORY_PDF_EMAIL
);
