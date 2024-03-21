import React, { useRef, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { View } from 'react-native-animatable';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';

// Definitions
import MasterStyles from '../../styles/MasterStyles';
import { MYDActivityType, MYDAssignmentType } from '../types';
import { HomeStackRouteOptions } from '../../main/navigators/HomeTabStackNavigator';

const lockIcon = require('../../../assets/icons/lock.png');
const previouslyCompletedIcon = require('../../../assets/icons/general/checkInBox.png');

const styles = StyleSheet.create({
  image: {
    height: 125,
    width: 200,
    borderRadius: 11,
  },
  lockedImage: {
    minHeight: 125,
    minWidth: 200,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    position: 'absolute',
    zIndex: 50,
    flexDirection: 'row',
    padding: 10,
  },
  workflowName: {
    color: MasterStyles.colors.white,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowRadius: 5,
    textShadowOffset: { width: 0.1, height: 0.1 },
    paddingHorizontal: 10,
    ...(Platform.OS === 'ios'
      ? { fontWeight: '500', fontSize: 17 }
      : { fontSize: 16, fontFamily: 'OpenSans-Regular' }),
  },
  workflowOrder: {
    color: MasterStyles.colors.white,
    position: 'absolute',
    bottom: 15,
    textShadowColor: 'rgba(0,0,0,.5)',
    textShadowRadius: 5,
    textShadowOffset: { width: 0.1, height: 0.1 },
    ...(Platform.OS === 'ios'
      ? { fontWeight: '500', fontSize: 11 }
      : { fontSize: 11, fontFamily: 'OpenSans-Regular' }),
  },
  workflowCardIconText: {
    color: MasterStyles.colors.white,
    paddingLeft: 5,
    ...(Platform.OS === 'ios'
      ? { fontWeight: '500', fontSize: 9 }
      : { fontSize: 9, fontFamily: 'OpenSans-Regular' }),
  },
});

type MYDDetailActivityCardProps = {
  navigation: StackNavigationProp<HomeStackRouteOptions, 'MYDPracticeDetail'>;
  activity: MYDActivityType;
  assignment: MYDAssignmentType;
  animationDelay: number;
};

/**
 * MYDDetailActivityCard
 *
 * This component is used to render Carousel items
 * on the bottom of the MYDPracticeDetailScreen.
 */
export default function MYDDetailActivityCard({
  navigation,
  activity,
  assignment,
  animationDelay,
}: MYDDetailActivityCardProps) {
  const animatedView = useRef(null);
  const [previouslyCompleted, setPreviouslyCompleted] = useState(false);

  /**
   * Determine if the provided assignment is currently active.
   */
  const isAssignmentActive = () => {
    return (
      moment().isAfter(assignment.eligible_start) &&
      moment().isBefore(assignment.eligible_end)
    );
  };

  useEffect(() => {
    if (assignment.response?.length) {
      setPreviouslyCompleted(true);
    } else {
      setPreviouslyCompleted(false);
    }
  }, [assignment]);

  return (
    <View ref={animatedView} style={{ opacity: 0 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('MYDEngagement', {
            MYDAssignmentID: assignment.id,
            MYDActivityID: activity.id,
          });
        }}
        delayPressIn={200}
        disabled={!isAssignmentActive() || previouslyCompleted}
      >
        <View
          style={{
            zIndex: 100,
            position: 'absolute',
            height: 125,
            width: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={styles.workflowName}>{activity.name}</Text>
          <Text style={styles.workflowOrder}>{activity.schedule_block}</Text>
        </View>

        {/* Additional UI for Previously Completed */}
        {previouslyCompleted ? (
          <View style={styles.lockedImage}>
            <Image
              source={previouslyCompletedIcon}
              style={{
                // width: 7,
                height: 10,
              }}
            />
            <Text style={styles.workflowCardIconText}>COMPLETED</Text>
          </View>
        ) : null}

        {/* Additional UI for Locked */}
        {!isAssignmentActive() && !previouslyCompleted ? (
          <View style={styles.lockedImage}>
            <Image
              source={lockIcon}
              style={{
                // width: 7,
                height: 10,
              }}
            />
            <Text style={styles.workflowCardIconText}>INACTIVE</Text>
          </View>
        ) : null}

        <Image
          source={{ uri: activity.image }}
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
