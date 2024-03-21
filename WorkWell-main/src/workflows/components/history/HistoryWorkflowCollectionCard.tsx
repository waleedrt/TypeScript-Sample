import React, { useRef, useEffect, useState } from 'react';
import { TouchableOpacity, View, Animated, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { HistoryTabStackRouteOptions } from '../../../main/navigators/HistoryTabStackNavigator';
import MasterStyles from '../../../styles/MasterStyles';
import useCanonicalDesignAdjustments from '../../../hooks/useCanonicalDesignAdjustments';
import { RootReduxType } from '../../../../config/configureStore';

type HistoryWorkflowCollectionCardProps = {
  workflowCollectionURI: string;
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  layoutIndex: number;
  randomizer: number;
};

/**
 * HistoryWorkflowCollectionCard
 *
 * This component is used to display the various Workflow
 * collections that a user engaged with on a given day
 * on WorkflowsHistoryScreen
 */
function HistoryWorkflowCollectionCard({
  workflowCollectionURI,
  currentYear,
  currentMonth,
  currentDay,
  layoutIndex,
  randomizer,
}: HistoryWorkflowCollectionCardProps) {
  const [
    internallyStoredRandomValue,
    setInternallyStoredRandomValue,
  ] = useState<number | null>(null);
  const imageAnimationValue = useRef(new Animated.Value(0)).current;
  const textAnimationValue = useRef(new Animated.Value(0)).current;
  const imageRef = useRef(null);
  const designAdjustments = useCanonicalDesignAdjustments();

  const navigation = useNavigation<
    StackNavigationProp<HistoryTabStackRouteOptions, 'HistoryOverview'>
  >();

  const workflowCollectionDetails = useSelector((state: RootReduxType) =>
    state.workflowHistory.collections?.find(
      (collection) => collection.self_detail === workflowCollectionURI
    )
  );

  useEffect(() => {
    imageAnimationValue.setValue(0);
    textAnimationValue.setValue(0);
    Animated.sequence([
      Animated.delay(layoutIndex * 250),
      Animated.stagger(350, [
        Animated.timing(imageAnimationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textAnimationValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    setInternallyStoredRandomValue(randomizer);
  }, [randomizer]);

  const idealDimensions = {
    height: 100,
    width: 155,
  };

  const clicked = () => {
    navigation.navigate('IndividualWorkflowHistory', {
      workflowCollectionURL: workflowCollectionURI,
      currentYear,
      currentMonth,
      currentDay,
    });
  };

  if (!workflowCollectionDetails || randomizer !== internallyStoredRandomValue)
    return null;

  return (
    <View onLayout={() => {}}>
      <TouchableOpacity
        onPress={clicked}
        style={{
          height: idealDimensions.height * designAdjustments.width,
          width: idealDimensions.width * designAdjustments.width,
          borderRadius: 7.5,
          marginBottom: 15,
        }}
      >
        <View
          style={{
            zIndex: 100,
            position: 'absolute',
            height: idealDimensions.height * designAdjustments.width,
            width: idealDimensions.width * designAdjustments.width,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Animated.Text
            style={[
              {
                color: MasterStyles.colors.white,
                opacity: textAnimationValue,
                textAlign: 'center',
                textShadowColor: MasterStyles.officialColors.graphite,
                textShadowRadius: 10,
                paddingHorizontal: 15,
              },
              Platform.OS === 'ios'
                ? { fontSize: 14, fontWeight: '500' }
                : {
                    fontSize: 13,
                    fontFamily: 'OpenSans-SemiBold',
                    letterSpacing: -1,
                  },
            ]}
          >
            {workflowCollectionDetails.name}
          </Animated.Text>
        </View>

        <Animated.Image
          ref={imageRef}
          source={{ uri: workflowCollectionDetails.library_image }}
          resizeMode='cover'
          style={{
            height: idealDimensions.height * designAdjustments.width,
            width: idealDimensions.width * designAdjustments.width,
            borderRadius: 7.5,
            opacity: imageAnimationValue,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default HistoryWorkflowCollectionCard;
