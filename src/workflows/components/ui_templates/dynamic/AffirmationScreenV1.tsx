import React, { useState } from 'react';
import { Text, View, StatusBar, Dimensions } from 'react-native';

import StylizedButton from '../../../../components/StylizedButton';
import MasterStyles from '../../../../styles/MasterStyles';
import useBackgroundImage from '../../../hooks/useBackgroundImage';
import FullScreenBackground from '../../FullScreenBackground';
import { WorkflowStepType } from '../../../types';
import { useSafeArea } from 'react-native-safe-area-context';
import useCollectionDetail from '../../../hooks/useCollectionDetail';

const deviceHeight = Dimensions.get('window').height;

/**
 * AffirmationScreenV1
 *
 * This component is one of many "screens" that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'affirmation_v1'
 */
function AffirmationScreenV1({
  step,
  nextAction,
}: {
  step: WorkflowStepType;
  nextAction: () => void;
}) {
  const [submissionStarted, setSubmissionStarted] = useState(false);

  const workflowCollection = useCollectionDetail();
  const backgroundImageURL = useBackgroundImage(step);

  const titleTextNode = step.workflowsteptext_set.find(
    (t) => t.ui_identifier === 'title'
  );
  const bodyTextNode = step.workflowsteptext_set.find(
    (t) => t.ui_identifier === 'body'
  );

  const titleText = titleTextNode ? titleTextNode.content : 'Well Done';
  const bodyText = bodyTextNode
    ? bodyTextNode.content
    : "You've taken a small step towards making positive change in your life.";

  const safeAreaInsets = useSafeArea();

  return (
    <View
      style={[
        { paddingHorizontal: 40 },
        { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
      ]}
    >
      <FullScreenBackground backgroundImage={backgroundImageURL} />
      <StatusBar barStyle='light-content' animated />
      <View
        style={{
          flex: 1,
          paddingTop: deviceHeight / 4.5,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={MasterStyles.fontStyles.dominantText}>{titleText}</Text>
        <Text style={MasterStyles.fontStyles.generalContent}>{bodyText}</Text>
      </View>
      <View
        style={{
          marginBottom: safeAreaInsets.bottom ? safeAreaInsets.bottom : 25,
          flexBasis: 100,
          width: '75%',
        }}
      >
        <StylizedButton
          text={
            workflowCollection?.category === 'ACTIVITY'
              ? 'COMPLETE PRACTICE'
              : 'SUBMIT'
          }
          onPress={() => {
            setSubmissionStarted(true);
            nextAction();
          }}
          outlineColor={MasterStyles.colors.white}
          disabled={submissionStarted}
        />
      </View>
    </View>
  );
}

export default AffirmationScreenV1;
