import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Dimensions, StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

// Definitions
import { MYDUITemplateType } from '../../types';
import { RootReduxType } from '../../../../config/configureStore';
import MasterStyles from '../../../styles/MasterStyles';

// Components
import StylizedButton from '../../../components/StylizedButton';
import FullScreenBackground from '../../../workflows/components/FullScreenBackground';

// Hooks
import useBackgroundImage from '../../hooks/useBackgroundImage';

const deviceHeight = Dimensions.get('window').height;

/**
 * MYDAffirmationScreenV1
 *
 * This component is one of many "screens" that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'myd_affirmation_v1'
 *
 */
function MYDAffirmationScreenV1({ step, nextAction }: MYDUITemplateType) {
  const backgroundImageURL = useBackgroundImage(step);
  const safeAreaInsets = useSafeArea();

  const userResponseToFirstStep = useSelector(
    (state: RootReduxType) => state.myd.activityUserResponse[0]?.response
  );

  const determineAffirmationTitle = () => {
    switch (userResponseToFirstStep) {
      case 5:
        return 'Great Job!';
      case 4:
        return 'Well Done!';
      case 3:
        return 'Stay Committed!';
      case 2:
        return 'Be Encouraged!';
      case 1:
        return 'Stay Strong!';
      default:
        return 'Well Done!';
    }
  };

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
        <Text style={MasterStyles.fontStyles.dominantText}>
          {determineAffirmationTitle()}
        </Text>
        <Text style={MasterStyles.fontStyles.generalContent}>{step.text}</Text>
      </View>
      <View
        style={{
          marginBottom: safeAreaInsets.bottom ? safeAreaInsets.bottom : 25,
          flexBasis: 100,
          width: '75%',
        }}
      >
        <StylizedButton
          text='COMPLETE ACTIVITY'
          onPress={nextAction}
          outlineColor={MasterStyles.colors.white}
        />
      </View>
    </View>
  );
}

export default MYDAffirmationScreenV1;
