// @ts-ignore
import { RSAA } from 'redux-api-middleware';

import { PATCH, GET } from '../../../constants/http';
import {
  UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT,
  LOAD_WORKFLOW_COLLECTION_ENGAGEMENT,
  CLEAR_WORKFLOW_COLLECTION_ENGAGEMENTS,
  CLEAR_WORKFLOW_COLLECTION_ENGAGEMENT,
} from '../actionTypes';

import config from '../../../../config/config';
import { WORKFLOW_COLLECTION_ENGAGEMENTS_URL } from './uriSegments';
import { createAction } from 'redux-actions';

const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const loadWorkflowCollectionEngagement = (args: {
  workflowCollectionURL: string;
}) => {
  const workflowCollectionUUID = args.workflowCollectionURL.split('/')[6];
  const resource_uri = `${WORKFLOW_COLLECTION_ENGAGEMENTS_URL}?collection_id=${workflowCollectionUUID}&include_details=true`;
  return {
    [RSAA]: {
      endpoint: `${config.apiUrl}api_v3/${resource_uri}`,
      method: GET,
      headers: HEADERS,
      types: [
        LOAD_WORKFLOW_COLLECTION_ENGAGEMENT.ACTION,
        LOAD_WORKFLOW_COLLECTION_ENGAGEMENT.SUCCESS,
        LOAD_WORKFLOW_COLLECTION_ENGAGEMENT.FAILURE,
      ],
      body: undefined,
    },
  };
};

/**
 * Load all collection engagements for a specific practice during a given time period.
 */
export const updateWorkflowCollectionEngagement = ({
  engagementURL,
  startDateTime,
  endDateTime,
}: {
  engagementURL: string;
  startDateTime?: string;
  endDateTime?: string;
}) => {
  const body = {
    ...(startDateTime ? { started: startDateTime } : {}),
    ...(endDateTime ? { finished: endDateTime } : {}),
  };

  return {
    [RSAA]: {
      endpoint: engagementURL,
      method: PATCH,
      headers: HEADERS,
      types: [
        UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT.ACTION,
        UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT.SUCCESS,
        UPDATE_WORKFLOW_COLLECTION_ENGAGEMENT.FAILURE,
      ],
      body: JSON.stringify({
        ...(startDateTime ? { started: startDateTime } : {}),
        ...(endDateTime ? { finished: endDateTime } : {}),
      }),
    },
  };
};

export const clearWorkflowCollectionEngagements = createAction(
  CLEAR_WORKFLOW_COLLECTION_ENGAGEMENTS
);

export const clearWorkflowCollectionEngagement = createAction(
  CLEAR_WORKFLOW_COLLECTION_ENGAGEMENT
);
