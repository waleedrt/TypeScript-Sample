import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';

// Local
import { WorkflowCollectionType } from '../types';
import { HomeStackRouteOptions } from '../../main/navigators/HomeTabStackNavigator';

import MasterStyles from '../../styles/MasterStyles';
import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';
import { useSelector } from 'react-redux';
import { RootReduxType } from '../../../config/configureStore';
import moment from 'moment';

const IDEAL_DIMENSIONS = {
  height: 200,
  width: 325,
};

const styles = StyleSheet.create({
  expirationText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
    textShadowColor: MasterStyles.officialColors.graphite,
    textShadowRadius: 5,
    textShadowOffset: { width: 0.1, height: 0.1 },
  },
  collectionName:
    Platform.OS === 'ios'
      ? {
          color: MasterStyles.colors.white,
          textAlign: 'center',
          opacity: 0,
          textShadowColor: MasterStyles.officialColors.graphite,
          textShadowRadius: 10,
          paddingHorizontal: 15,
          fontSize: 24,
          fontWeight: '500',
        }
      : {
          color: MasterStyles.colors.white,
          textShadowColor: MasterStyles.officialColors.graphite,
          opacity: 0,
          textAlign: 'center',
          textShadowRadius: 5,
          textShadowOffset: { width: 0.1, height: 0.1 },
          paddingHorizontal: 15,
          fontSize: 22,
          fontFamily: 'OpenSans-SemiBold',
          letterSpacing: -1,
        },
});

type HomeScreenCollectionCardProps = {
  navigation: StackNavigationProp<HomeStackRouteOptions, 'Home'>;
  workflowCollection: WorkflowCollectionType;
  onLoad: () => void;
};

/**
 * HomeScreenCollectionCard
 *
 * This component is the button-like rectangular image
 * component that appears for each of the Workflow Collections
 * that a user has an subscription or assignment for.
 */
export default function HomeScreenCollectionCard({
  navigation,
  workflowCollection,
  onLoad = () => null,
}: HomeScreenCollectionCardProps) {
  const animatedImage = useRef(null);
  const animatedTitle = useRef(null);
  const endAnimationTimeout = useRef<any>(null);

  const [animationCompleted, setAnimationCompleted] = useState(false);

  /**
   * Reset/clear a potential setTimeout operation that isn't
   * completed when the component unmounts.
   */
  useEffect(() => {
    endAnimationTimeout.current = null;
    return () => {
      if (endAnimationTimeout.current)
        clearInterval(endAnimationTimeout.current);
    };
  }, []);

  const design_adjustments = useCanonicalDesignAdjustments();

  const collectionAssignment = useSelector((state: RootReduxType) =>
    state.workflows.collectionAssignments?.find(
      (assignment) =>
        assignment.workflow_collection === workflowCollection.detail
    )
  );

  const clicked = () => {
    navigation.navigate('CollectionDetail', { id: workflowCollection.detail });
  };

  return (
    <TouchableOpacity
      style={{ paddingBottom: 25 }}
      onPress={clicked}
      delayPressIn={200}
      disabled={!animationCompleted}
    >
      <View
        style={{
          zIndex: 100,
          opacity: 1,
          position: 'absolute',
          display: 'flex',
          height: IDEAL_DIMENSIONS.height * design_adjustments.width,
          width: IDEAL_DIMENSIONS.width * design_adjustments.width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text ref={animatedTitle} style={styles.collectionName}>
          {workflowCollection.name}
        </Text>
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 15,
            opacity: collectionAssignment ? 1 : 0,
          }}
        >
          <Text style={styles.expirationText}>
            {`EXPIRES ${moment(collectionAssignment?.assigned_on)
              .add(30, 'days')
              .format('MMMM DD')
              .toUpperCase()}`}
          </Text>
        </View>
      </View>
      <Image
        ref={animatedImage}
        onLoadEnd={() => {
          if (
            animatedImage.current !== null &&
            animatedTitle.current !== null
          ) {
            // @ts-ignore
            animatedImage.current.fadeIn(500).then(() => onLoad());
            // @ts-ignore
            animatedTitle.current.fadeIn(1500);

            /**
             * We create a setTimeout to mark when the animations
             * are complete, rather than using .then because we
             * can't cancel a promise if the user leaves the screen
             * early and it creates a memory leak.
             */
            endAnimationTimeout.current = setTimeout(
              () => setAnimationCompleted(true),
              1000
            );
          }
        }}
        source={{ uri: workflowCollection.home_image }}
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
