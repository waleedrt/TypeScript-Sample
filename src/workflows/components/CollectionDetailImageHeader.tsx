import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Image as CacheImage } from 'react-native-expo-image-cache';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';
import XButton from '../../components/XButton';
import MasterStyles from '../../styles/MasterStyles';
import { WorkflowCollectionDetailType } from '../types';

export default function CollectionDetailImageHeader({
  workflowCollectionDetails,
}: {
  workflowCollectionDetails: WorkflowCollectionDetailType | null;
}) {
  const deviceInsets = useSafeArea();
  const navigation = useNavigation();

  const designAdjustments = useCanonicalDesignAdjustments();

  if (!workflowCollectionDetails) return null;

  return (
    <Animatable.View animation='fadeIn' delay={0}>
      <CacheImage
        uri={workflowCollectionDetails.detail_image}
        style={{ height: 350 * designAdjustments.height }}
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
