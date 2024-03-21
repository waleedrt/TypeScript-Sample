import React from 'react';
import { ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';

import ProgressBar from '../../components/ProgressBar';
import useCollectionDetail from '../hooks/useCollectionDetail';
import useCollectionEngagement from '../hooks/useCollectionEngagement';
import { RootReduxType } from '../../../config/configureStore';

/**
 * A progress bar for workflow engagements that
 * only is displayed if the collection is a survey.
 */
export default function WorkflowCollectionProgressBar({
  styleOverrides = {},
}: {
  styleOverrides?: ViewStyle;
}) {
  const currentCollectionURL = useSelector(
    (state: RootReduxType) => state.workflows.currentCollectionURL!
  );
  const collectionDetail = useCollectionDetail({
    workflowCollectionURL: currentCollectionURL,
  });
  const collectionEngagement = useCollectionEngagement();

  if (collectionEngagement?.state && collectionDetail?.category === 'SURVEY') {
    return (
      <ProgressBar
        percentComplete={
          collectionEngagement.state.steps_completed_in_collection /
          collectionEngagement?.state.steps_in_collection
        }
        additionalStyles={{ paddingBottom: 10, ...styleOverrides }}
      />
    );
  } else {
    return <></>;
  }
}
