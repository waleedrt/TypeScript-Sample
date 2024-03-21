import React, { useRef, useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { View } from 'react-native-animatable';
import { RouteProp } from '@react-navigation/native';

import MasterStyles from '../../styles/MasterStyles';
import {
  WorkflowCollectionEngagementDetailViewType,
  WorkflowCollectionDetailType,
  WorkflowCollectionMemberType,
} from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackRouteOptions } from '../../main/navigators/HomeTabStackNavigator';
import { LibraryStackRouteOptions } from '../../main/navigators/LibraryTabStackNavigator';
import { defaultIndividualWorkflowImages } from '../images';

const lockIcon = require('../../../assets/userControl/icons/lock.png');
const completedIcon = require('../../../assets/icons/general/checkInBox.png');
const repeatIcon = require('../../../assets/userControl/icons/repeat.png');

const styles = StyleSheet.create({
  image: {
    height: 125,
    width: 200,
    borderRadius: 11,
  },

  UIOverlay: {
    height: 125,
    width: 200,
    borderRadius: 10,
    position: 'absolute',
    zIndex: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  workflowName: {
    color: MasterStyles.colors.white,
    textShadowColor: 'rgba(0,0,0,.5)',
    textShadowRadius: 5,
    textShadowOffset: { width: 0.1, height: 0.1 },
    paddingBottom: 5,
    textAlign: 'center',
    ...(Platform.OS === 'ios'
      ? { fontWeight: '500', fontSize: 17 }
      : { fontSize: 16, fontFamily: 'OpenSans-Regular' }),
  },
  workflowPart: {
    color: MasterStyles.colors.white,
    position: 'absolute',
    bottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,.5)',
    textShadowRadius: 5,
    textShadowOffset: { width: 0.1, height: 0.1 },
    paddingHorizontal: 10,

    ...(Platform.OS === 'ios'
      ? { fontWeight: '500', fontSize: 11 }
      : { fontSize: 11, fontFamily: 'OpenSans-Regular' }),
  },
  workflowCardIconText: {
    color: MasterStyles.colors.white,

    ...(Platform.OS === 'ios'
      ? { fontWeight: '500', fontSize: 9 }
      : { fontSize: 9, fontFamily: 'OpenSans-Regular' }),
  },
});

type CollectionDetailWorkflowCardProps = {
  navigation: StackNavigationProp<
    HomeStackRouteOptions & LibraryStackRouteOptions,
    'CollectionDetail' | 'LibraryCollectionDetail'
  >;
  route: RouteProp<
    HomeStackRouteOptions & LibraryStackRouteOptions,
    'CollectionDetail' | 'LibraryCollectionDetail'
  >;
  workflow: WorkflowCollectionMemberType;
  workflowCollection: WorkflowCollectionDetailType;
  workflowCollectionEngagement: WorkflowCollectionEngagementDetailViewType;
  animationDelay: number;
};

/**
 * The CollectionDetailWorkflowCard component is used to render Carousel items
 * on the bottom of the CollectionDetailScreen.
 */
export default function CollectionDetailWorkflowCard({
  navigation,
  route,
  workflow,
  workflowCollection,
  workflowCollectionEngagement,
  animationDelay = 0,
}: CollectionDetailWorkflowCardProps) {
  const animatedView = useRef(null);

  const workflowPreviouslyCompleted = workflowCollectionEngagement.state.previously_completed_workflows.find(
    (completedWorkflow) =>
      completedWorkflow.workflow === workflow.workflow.detail
  )
    ? true
    : false;

  /**
   * Determine if the current workflow should be unlocked or not.
   */
  const isWorkflowLocked = useMemo(() => {
    // Unorded Activity Collections never locked Workflow members.
    if (
      !workflowCollection.ordered &&
      workflowCollection.category !== 'SURVEY'
    ) {
      return false;
    }

    // Find which collection member workflows have an `order`
    // value of less than the provided `workflow` prop.
    const previousWorkflowsInCollection = workflowCollection.workflowcollectionmember_set
      .filter((workflowMember) => workflowMember.order < workflow.order)
      .map((collectionMember) => collectionMember.workflow);

    // What workflows in this collection has the user completed
    // in previous engagements?
    const previouslyCompletedWorkflowsInCollection =
      workflowCollectionEngagement.state.previously_completed_workflows;

    // Determine if there are any workflows in this collection
    // that come before the given `workflow` prop that have
    // not been completed in previous engagements
    const incompletePreviousWorkflowsInCollection = previousWorkflowsInCollection.filter(
      (previousWorkflow) =>
        previouslyCompletedWorkflowsInCollection.find(
          (completedWorkflow) =>
            completedWorkflow.workflow === previousWorkflow.detail
        )
          ? false
          : true
    );
    return incompletePreviousWorkflowsInCollection.length ? true : false;
  }, [workflow, workflowCollection, workflowCollectionEngagement]);

  /**
   * Push an instance of the CollectionEngagementScreen onto the
   * navigation stack. The correct "beginning" step is different
   * depending on whether the workflowCollection is a survey or activity.
   */
  const loadCollectionEngagementScreen = () => {
    switch (workflowCollection.category) {
      case 'ACTIVITY':
        // The user should be directed to the first step of the selected
        // workflow.
        navigation.push('CollectionEngagement', {
          workflowID: workflow.workflow.detail.split('/')[6],
          engagementStartedFrom: route.name,
        });
        break;
      case 'SURVEY':
        // The user should be directed to the last completed step of
        // the survey regardless of what workflow they select.
        navigation.push('CollectionEngagement', {
          workflowID: workflowCollectionEngagement.state.next_workflow!.split(
            '/'
          )[6],
          workflowStepID: workflowCollectionEngagement.state.next_step_id!,
          engagementStartedFrom: route.name,
        });
        break;
    }
  };

  /**
   * In some circumstances, we want to overlay the workflow
   * card with additional information for the user.
   *
   * We use this to indicate such things as whether the workflow
   * is locked, previously completed, etc.
   */
  const renderImageOverlays = () => {
    return (
      <View
        style={{
          backgroundColor: isWorkflowLocked
            ? 'rgba(0,0,0,.3)'
            : 'rgba(0,0,0,0)',
          ...styles.UIOverlay,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isWorkflowLocked ? (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 10,
              left: 10,
            }}
          >
            <Image
              source={isWorkflowLocked ? lockIcon : completedIcon}
              style={{ width: 10, height: 10 }}
            />
            <Text style={{ ...styles.workflowCardIconText, paddingLeft: 5 }}>
              {isWorkflowLocked ? 'LOCKED' : 'COMPLETED'}
            </Text>
          </View>
        ) : workflowPreviouslyCompleted ? (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 10,
              left: 10,
            }}
          >
            <Image
              source={
                workflowCollection.category === 'SURVEY'
                  ? completedIcon
                  : repeatIcon
              }
              style={{ width: 10, height: 10 }}
            />
            <Text style={{ ...styles.workflowCardIconText, paddingLeft: 5 }}>
              {workflowCollection.category === 'SURVEY'
                ? 'COMPLETED'
                : 'REPEAT ACTIVITY'}
            </Text>
          </View>
        ) : (
          <View />
        )}
        <View>
          <Text style={styles.workflowName}>{workflow.workflow.name}</Text>
        </View>
        {workflowCollection.ordered ? (
          <Text style={styles.workflowPart}>{`Part ${workflow.order}`}</Text>
        ) : (
          <></>
        )}
      </View>
    );
  };

  return (
    <View ref={animatedView} style={{ opacity: 0 }}>
      <TouchableOpacity
        onPress={loadCollectionEngagementScreen}
        delayPressIn={200}
        disabled={isWorkflowLocked}
      >
        {renderImageOverlays()}
        <Image
          source={
            workflow.workflow.image
              ? { uri: workflow.workflow.image }
              : defaultIndividualWorkflowImages[workflow.order - 1]
          }
          resizeMode='cover'
          style={styles.image}
          onLoadEnd={() => {
            setTimeout(() => {
              if (animatedView.current) {
                // @ts-ignore
                animatedView.current.fadeIn(1000);
              }
            }, animationDelay);
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
