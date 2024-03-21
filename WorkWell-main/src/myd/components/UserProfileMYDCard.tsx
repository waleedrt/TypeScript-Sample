import React, { useRef } from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';

import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';
import MasterStyles from '../../styles/MasterStyles';
import { UserProfileStackRouteOptions } from '../../main/navigators/UserProfileStackNavigator';

const MYDImage = require('../../../assets/myd/MapYourDayLibrary_Title.jpg');

/**
 * UserProfileMYDCard
 *
 * This component is used to display a button for Map-Your-Day
 * on the Wellbeing Profile screen.
 */
export default function UserProfileMYDCard({
  navigation,
}: {
  navigation: StackNavigationProp<
    UserProfileStackRouteOptions,
    'WellbeingProfile'
  >;
}) {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const designAdjustments = useCanonicalDesignAdjustments();

  const idealDimensions = {
    height: 200,
    width: 275,
  };

  const clicked = () => {
    navigation.navigate('UserProfileMYDPracticeDetail');
  };

  return (
    <TouchableOpacity onPress={clicked} delayPressIn={200}>
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
        <Animatable.Text
          ref={textRef}
          style={[
            {
              color: MasterStyles.colors.white,
              opacity: 0,
              textAlign: 'center',
              textShadowColor: '#000000',
              textShadowRadius: 5,
              textShadowOffset: { width: 0.1, height: 0.1 },
              paddingHorizontal: 25,
            },
            Platform.OS === 'ios'
              ? { fontSize: 24, fontWeight: '400' }
              : {
                  fontSize: 22,
                  fontFamily: 'OpenSans-Regular',
                  letterSpacing: -1,
                },
          ]}
        >
          Map Your Day
        </Animatable.Text>
      </View>
      <Animatable.Image
        ref={imageRef}
        onLoad={() => {
          if (imageRef.current !== null && textRef.current !== null) {
            // @ts-ignore
            imageRef.current.fadeIn(500);
            // @ts-ignore
            textRef.current.fadeIn(2500);
          }
        }}
        source={MYDImage}
        resizeMode='cover'
        style={{
          height: 200 * designAdjustments.width,
          width: 275 * designAdjustments.width,
          borderRadius: 11,
          opacity: 0,
        }}
      />
    </TouchableOpacity>
  );
}
