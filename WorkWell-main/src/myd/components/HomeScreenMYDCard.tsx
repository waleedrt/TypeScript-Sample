import React, { useRef } from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import { Image, Text } from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';

import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';
import MasterStyles from '../../styles/MasterStyles';
import { HomeStackRouteOptions } from '../../main/navigators/HomeTabStackNavigator';

const IDEAL_DIMENSIONS = {
  height: 200,
  width: 325,
};

const MYDImage = require('../../../assets/myd/MapYourDayHomeScreen_Title.jpg');

/**
 * HomeScreenMYDCard
 *
 * This component is the button-like rectangular image
 * component that appears on the HomeScreen if the user
 * is a Map-Your-Day participant.
 */
export default function HomeScreenMYDCard({
  navigation,
}: {
  navigation: StackNavigationProp<HomeStackRouteOptions, 'Home'>;
}) {
  const animatedImage = useRef(null);
  const animatedText = useRef(null);

  const design_adjustments = useCanonicalDesignAdjustments();

  const clicked = () => navigation.navigate('MYDPracticeDetail');

  return (
    <TouchableOpacity
      style={{ paddingBottom: 25 }}
      onPress={clicked}
      delayPressIn={200}
    >
      <View
        style={{
          zIndex: 100,
          position: 'absolute',
          display: 'flex',
          height: IDEAL_DIMENSIONS.height * design_adjustments.width,
          width: IDEAL_DIMENSIONS.width * design_adjustments.width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          ref={animatedText}
          style={[
            {
              color: MasterStyles.colors.white,
              textShadowColor: MasterStyles.officialColors.graphite,
              textShadowRadius: 10,
              paddingHorizontal: 15,
            },
            Platform.OS === 'ios'
              ? { fontSize: 22, fontWeight: '500' }
              : {
                  fontSize: 20,
                  fontFamily: 'OpenSans-SemiBold',
                  letterSpacing: -1,
                },
          ]}
        >
          Map Your Day
        </Text>
      </View>
      <Image
        ref={animatedImage}
        onLoadEnd={() => {
          if (animatedImage.current && animatedText.current !== null) {
            // @ts-ignore
            animatedImage.current.fadeIn(500);
            // @ts-ignore
            animatedText.current.fadeIn(2000);
          }
        }}
        source={MYDImage}
        style={{
          opacity: 0,
          borderRadius: 20,
          height: IDEAL_DIMENSIONS.height * design_adjustments.width,
          width: IDEAL_DIMENSIONS.width * design_adjustments.width,
        }}
        resizeMode='cover'
      />
    </TouchableOpacity>
  );
}
