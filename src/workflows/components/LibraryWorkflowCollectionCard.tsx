import React, { useRef } from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';

import { WorkflowCollectionType } from '../types';
import { LibraryStackRouteOptions } from '../../main/navigators/LibraryTabStackNavigator';
import MasterStyles from '../../styles/MasterStyles';
import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';

type LibraryWorkflowCollectionCardProps = {
  navigation: StackNavigationProp<LibraryStackRouteOptions, 'Library'>;

  workflowCollection: WorkflowCollectionType;
};

/**
 * LibraryWorkflowCollectionCard
 *
 * This component is used to display the various Workflow
 * collections available on the LibraryScreen of the app.
 */
function LibraryWorkflowCollectionCard({
  navigation,
  workflowCollection,
}: LibraryWorkflowCollectionCardProps) {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const designAdjustments = useCanonicalDesignAdjustments();

  const idealDimensions = {
    height: 200,
    width: 275,
  };

  const clicked = () => {
    navigation.navigate('LibraryCollectionDetail', {
      id: workflowCollection.detail,
    });
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
          {workflowCollection.name}
        </Animatable.Text>
      </View>
      <Animatable.Image
        ref={imageRef}
        onLoadEnd={() => {
          if (imageRef.current !== null && textRef.current !== null) {
            // @ts-ignore
            imageRef.current.fadeIn(500);
            // @ts-ignore
            textRef.current.fadeIn(2500);
          }
        }}
        source={{ uri: workflowCollection.library_image }}
        resizeMode='cover'
        style={{
          height: idealDimensions.height * designAdjustments.width,
          width: idealDimensions.width * designAdjustments.width,
          borderRadius: 11,
          opacity: 0,
        }}
      />
    </TouchableOpacity>
  );
}

export default LibraryWorkflowCollectionCard;
