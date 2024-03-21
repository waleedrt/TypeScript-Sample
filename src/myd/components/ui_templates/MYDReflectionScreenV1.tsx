import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import MasterStyles from '../../../styles/MasterStyles';
import PreviousNextButtonBar from '../../../components/PreviousNextButtonBar';
import useBackgroundImageURL from '../../hooks/useBackgroundImage';
import FullScreenBackground from '../../../workflows/components/FullScreenBackground';
import WorkflowStepSectionHeader from '../../../components/WorkflowStepSectionHeader';
import { MYDUITemplateType } from '../../types';
import useKeyboardEventCallbacks from '../../../hooks/useKeyboardEventCallbacks';

const deviceHeight = Dimensions.get('window').height;

/**
 * MYDReflectionScreenV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a MYD Activity.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'myd_reflection_v1'
 */
function MYDReflectionScreenV1({
  step,
  nextAction,
  backAction,
  cancelAction,
  syncInput,
}: MYDUITemplateType) {
  const stepID = step.id;
  const [answer, setAnswer] = useState<string | null>(null);
  const [sectionHeaderHeight, setSectionHeaderHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(deviceHeight);
  const [controlsHeight, setControlsHeight] = useState(0);
  const backgroundImageURL = useBackgroundImageURL(step);
  const scrollViewRef = useRef<ScrollView>(null);

  const safeAreaInsets = useSafeArea();

  useEffect(() => {
    if (answer) {
      syncInput({
        stepID: stepID,
        response: answer,
      });
    }
  }, [answer]);

  useKeyboardEventCallbacks({
    keyboardDidShowCallback: (event) =>
      setScrollViewHeight(deviceHeight + event.endCoordinates.height),
    keyboardDidHideCallback: () => setScrollViewHeight(deviceHeight),
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle='light-content' animated translucent={false} />
      <FullScreenBackground backgroundImage={backgroundImageURL} />
      <ScrollView
        style={{
          flex: 1,
          paddingTop: safeAreaInsets.top ? safeAreaInsets.top + 25 : 50,
        }}
        contentContainerStyle={{ minHeight: scrollViewHeight }}
        ref={scrollViewRef}
      >
        <WorkflowStepSectionHeader
          text={step.text}
          onLayout={(event) =>
            setSectionHeaderHeight(event.nativeEvent.layout.height)
          }
          layoutIndex={0}
          cancelAction={cancelAction}
        />
        <View style={[MasterStyles.common.horizontalPadding25]}>
          <TextInput
            scrollEnabled={false}
            multiline
            placeholder='Start typing your answer here'
            placeholderTextColor={MasterStyles.colors.whiteOpaque}
            style={[
              {
                textAlignVertical: 'top',
                height:
                  deviceHeight -
                  (safeAreaInsets.top ? safeAreaInsets.top + 25 : 50) -
                  sectionHeaderHeight -
                  controlsHeight -
                  (safeAreaInsets.bottom ? safeAreaInsets.bottom : 25),
                backgroundColor: 'rgba(0, 0, 0, .2)',
                borderRadius: 10,
                padding: 15,
                fontSize: 14,
                color: MasterStyles.colors.white,
              },
              MasterStyles.fontStyles.generalContent,
            ]}
            onChangeText={(event) => setAnswer(event)}
            onEndEditing={() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
              }
            }}
          />
          <PreviousNextButtonBar
            onLayout={(event) =>
              setControlsHeight(event.nativeEvent.layout.height)
            }
            previousText='Back'
            previousAction={backAction}
            previousOutlineColor={MasterStyles.colors.white}
            nextText='Next'
            nextAction={nextAction}
            nextOutlineColor={MasterStyles.colors.white}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default MYDReflectionScreenV1;
