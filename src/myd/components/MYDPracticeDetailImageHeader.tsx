import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { View, Image } from 'react-native';

import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';
import XButton from '../../components/XButton';
import MasterStyles from '../../styles/MasterStyles';

export default function MYDPracticeDetailImageHeader() {
  const deviceInsets = useSafeArea();
  const navigation = useNavigation();
  const MYDImage = require('../../../assets/myd/CollectionDetail.jpg');

  const designAdjustments = useCanonicalDesignAdjustments();

  return (
    <Animatable.View animation='fadeIn' delay={0}>
      <Image
        source={MYDImage}
        style={{ height: 350 * designAdjustments.height, width: '100%' }}
        resizeMode='cover'
      />
      <View
        style={{
          borderBottomColor: MasterStyles.officialColors.density,
          borderBottomWidth: 1,
        }}
      />
      <XButton
        onPress={() => navigation.goBack()}
        containerStyle={{
          position: 'absolute',
          top: deviceInsets.top || 25,
          right: 25,
          zIndex: 500,
          width: 100,
          height: 100,
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
        }}
      />
    </Animatable.View>
  );
}
