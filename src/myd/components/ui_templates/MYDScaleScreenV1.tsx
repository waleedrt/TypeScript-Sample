import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

// Definitions
import MasterStyles from '../../../styles/MasterStyles';
import { MYDUITemplateType } from '../../types';

import PreviousNextButtonBar from '../../../components/PreviousNextButtonBar';
import FullScreenBackground from '../../../workflows/components/FullScreenBackground';
import useBackgroundImageURL from '../../hooks/useBackgroundImage';
import WorkflowStepSectionHeader from '../../../components/WorkflowStepSectionHeader';
import SingleChoiceButton from '../../../components/SingleChoiceButton';
import ScrollViewWithBottomControls from '../../../components/layout/ScrollViewWithBottomControls';

const OPTIONS = [
  {
    image: 'icons/faceVeryPositive.png',
    content: 'Very Positive',
    storage_value: 5,
  },
  {
    image: 'icons/facePositive.png',
    content: 'Moderately Positive',
    storage_value: 4,
  },
  { image: 'icons/faceNeutral.png', content: 'Neutral', storage_value: 3 },
  {
    image: 'icons/faceNegative.png',
    content: 'Moderately Negative',
    storage_value: 2,
  },
  {
    image: 'icons/faceVeryNegative.png',
    content: 'Very Negative',
    storage_value: 1,
  },
];

/**
 * MYDScaleScreenV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a Map-Your-Day Activity.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the activity's current step must be 'myd_scale_v1'
 */
function MYDScaleScreenV1({
  step,
  nextAction,
  backAction,
  cancelAction,
  syncInput,
}: MYDUITemplateType) {
  const stepID = step.id;

  const [selectedOption, setSelectedOption] = useState<{
    image: string;
    content: string;
    storage_value: number;
  } | null>(null);

  const scrollViewRef = useRef(null);

  const backgroundImageURL = useBackgroundImageURL(step);

  const safeAreaInsets = useSafeArea();

  useEffect(() => {
    if (selectedOption) {
      syncInput({
        stepID: stepID,
        response: selectedOption.storage_value,
      });
    }
  }, [selectedOption]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle='light-content' animated translucent={false} />
      <FullScreenBackground backgroundImage={backgroundImageURL} />
      <ScrollViewWithBottomControls
        accountForAndroidStatusBarHeight={false}
        scrollViewRef={scrollViewRef}
        contentComponent={
          <View
            style={{
              paddingTop: safeAreaInsets.top ? safeAreaInsets.top + 25 : 50,
            }}
          >
            <WorkflowStepSectionHeader
              text={step.text}
              layoutIndex={0}
              cancelAction={cancelAction}
            />
            <View
              style={[
                {
                  flex: 1,
                },
                MasterStyles.common.horizontalPadding25,
              ]}
            >
              {OPTIONS.map((option, index) => (
                <SingleChoiceButton
                  option={option}
                  key={index}
                  selectedOption={selectedOption}
                  onPress={() => setSelectedOption(option)}
                />
              ))}
            </View>
          </View>
        }
        controlsComponent={
          <PreviousNextButtonBar
            additionalStyles={{
              paddingBottom: safeAreaInsets.bottom
                ? safeAreaInsets.bottom + 25
                : 25,
              ...MasterStyles.common.horizontalMargins25,
            }}
            previousText='Back'
            previousAction={backAction}
            previousOutlineColor={MasterStyles.colors.white}
            nextText='Next'
            nextAction={nextAction}
            nextOutlineColor={MasterStyles.colors.white}
          />
        }
      />
    </View>
  );
}

export default MYDScaleScreenV1;
