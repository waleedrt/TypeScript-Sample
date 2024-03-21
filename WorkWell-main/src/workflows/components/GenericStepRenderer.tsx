import React, { useState, useRef, ReactElement, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import FullScreenBackground from './FullScreenBackground';
import MasterStyles from '../../styles/MasterStyles';
import PreviousNextButtonBar from '../../components/PreviousNextButtonBar';
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';
import ScrollViewWithBottomControls from '../../components/layout/ScrollViewWithBottomControls';
import WorkflowCollectionProgressBar from './WorkflowCollectionProgressBar';

type GenericStepRendererProps = {
  nodeRenderer: () => Array<ReactElement>;
  backAction: () => void;
  nextAction: () => void;
  backgroundImage: string | number;
  requiredAnswersProvided: boolean;
};

GenericStepRenderer.defaultProps = {
  requiredAnswersProvided: true,
};
/**
 * The GenericStepRenderer component is called most other UI components
 * which represent the various types of Workflow Engagement Steps that
 * a user can interact with. It provides a uniform skeleton for rendering
 * such components.

 */
function GenericStepRenderer({
  nodeRenderer,
  backAction,
  nextAction,
  backgroundImage,
  requiredAnswersProvided,
}: GenericStepRendererProps) {
  const safeAreaInsets = useSafeArea();
  const [userHasPressedControl, setUserHasPressedControl] = useState(false);

  const scrollViewRef = useRef(null);

  const pendingAPIActions = useGlobalPendingAPIOperations();

  useFocusEffect(
    useCallback(() => {
      setUserHasPressedControl(false);
      return () => setUserHasPressedControl(true);
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle='light-content' animated hidden={true} />
      <FullScreenBackground backgroundImage={backgroundImage} />
      <ScrollViewWithBottomControls
        scrollViewRef={scrollViewRef}
        contentComponent={
          <View
            style={{
              paddingTop: safeAreaInsets.top ? safeAreaInsets.top + 25 : 50,
            }}
          >
            {nodeRenderer()}
          </View>
        }
        controlsComponent={
          <View
            style={{
              paddingBottom: safeAreaInsets.bottom
                ? safeAreaInsets.bottom + 25
                : 25,
            }}
          >
            <WorkflowCollectionProgressBar
              styleOverrides={{ marginHorizontal: 25 }}
            />
            <PreviousNextButtonBar
              previousText='Back'
              previousAction={() => {
                setUserHasPressedControl(true);
                backAction();
              }}
              previousDisabled={
                pendingAPIActions.length !== 0 || userHasPressedControl
              }
              previousOutlineColor={MasterStyles.colors.white}
              nextText='Next'
              nextAction={() => {
                setUserHasPressedControl(true);
                nextAction();
              }}
              nextDisabled={
                pendingAPIActions.length !== 0 ||
                !requiredAnswersProvided ||
                userHasPressedControl
              }
              nextOutlineColor={MasterStyles.colors.white}
              additionalStyles={{
                ...MasterStyles.common.horizontalMargins25,
                paddingVertical: 0,
                marginVertical: 0,
              }}
            />
          </View>
        }
      />
    </View>
  );
}

export default GenericStepRenderer;
