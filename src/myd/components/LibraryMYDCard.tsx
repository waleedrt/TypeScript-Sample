import React, { useRef } from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';

import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';
import MasterStyles from '../../styles/MasterStyles';
import { LibraryStackRouteOptions } from '../../main/navigators/LibraryTabStackNavigator';

const MYDImage = require('../../../assets/myd/MapYourDayLibrary_Title.jpg');

/**
 * LibraryMYDCard
 *
 * This component is used to display a button for Map-Your-Day
 * on the LibraryScreen
 */
export default function LibraryMYDCard({
  navigation,
}: {
  navigation: StackNavigationProp<LibraryStackRouteOptions, 'Library'>;
}) {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const designAdjustments = useCanonicalDesignAdjustments();

  const idealDimensions = {
    height: 200,
    width: 275,
  };

  const clicked = () => {
    navigation.navigate('LibraryMYDPracticeDetail');
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
              textShadowColor: MasterStyles.officialColors.graphite,
              textShadowRadius: 10,
              paddingHorizontal: 25,
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
