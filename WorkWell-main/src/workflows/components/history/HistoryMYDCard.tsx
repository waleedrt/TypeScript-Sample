import React, { useRef, useEffect, useState } from 'react';
import { TouchableOpacity, View, Animated, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { HistoryTabStackRouteOptions } from '../../../main/navigators/HistoryTabStackNavigator';
import MasterStyles from '../../../styles/MasterStyles';
import useCanonicalDesignAdjustments from '../../../hooks/useCanonicalDesignAdjustments';

type HistoryMYDCardProps = {
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  randomizer: number;
};

/**
 * HistoryMYDCard
 * Displayed when MYD was completed on a given day
 * on the History Overview Screen.
 */
function HistoryMYDCard({
  currentYear,
  currentMonth,
  currentDay,
  randomizer,
}: HistoryMYDCardProps) {
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

  useEffect(() => {
    imageAnimationValue.setValue(0);
    textAnimationValue.setValue(0);
    Animated.stagger(350, [
      Animated.timing(imageAnimationValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textAnimationValue, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
    setInternallyStoredRandomValue(randomizer);
  }, [randomizer]);

  const idealDimensions = {
    height: 100,
    width: 155,
  };

  const clicked = () => {
    console.log('Go to MYD History');
    navigation.navigate('MYDHistoryCalendar', {
      currentYear,
      currentMonth,
      currentDay,
    });
  };

  if (randomizer !== internallyStoredRandomValue) return null;

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
            Map Your Day
          </Animated.Text>
        </View>

        <Animated.Image
          ref={imageRef}
          source={require('../../../../assets/myd/MapYourDayLibrary_Title.jpg')}
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

export default HistoryMYDCard;
