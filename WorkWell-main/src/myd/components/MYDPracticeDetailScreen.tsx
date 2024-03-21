import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';

// Definitions
import MasterStyles from '../../styles/MasterStyles';
import { RootReduxType } from '../../../config/configureStore';
import { HomeStackRouteOptions } from '../../main/navigators/HomeTabStackNavigator';

// Components
import MYDScheduleSetup from './MYDScheduleSetup';
import GradientStyleButton from '../../components/GradientStyleButton';
import MYDDetailActivityCarousel from './MYDDetailActivityCarousel';
import RibbonModal from '../../components/modals/RibbonModal';
import MYDPracticeDetailImageHeader from './MYDPracticeDetailImageHeader';
import ScrollViewWithBottomControls from '../../components/layout/ScrollViewWithBottomControls';

// Hooks
import useSortedMYDActivitiesAndAssignments from '../hooks/useMYDActivities';
import useMYDParticipantInfo from '../hooks/useMYDParticipantInfo';
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';

// Redux
import {
  loadMYDHistory,
  loadActivities,
  loadAssignments,
  clearActivities,
  clearAssignments,
  unloadUserActivityResponse,
} from '../actionCreators';
import { clearPushNotification } from '../actionCreators';
import { useSafeArea } from 'react-native-safe-area-context';
import SolidTopModal from '../../components/modals/SolidTopModal';
import StylizedButton from '../../components/StylizedButton';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  collectionAuthor:
    Platform.OS === 'ios'
      ? {
          fontSize: 10,
          color: MasterStyles.officialColors.density,
          // textTransform: 'uppercase',
        }
      : {
          fontFamily: 'OpenSans-Regular',
          fontSize: 10,
          // textTransform: 'uppercase',
          color: MasterStyles.officialColors.density,
        },
  practiceImage: {
    height: 350,
    width: deviceWidth,
  },
  divider: {
    borderBottomColor: MasterStyles.officialColors.density,
    borderBottomWidth: 1,
  },
});

/**
 * MYDPracticeDetailScreen
 *
 * This component is displayed when a user selects the MYD practice
 * from either the Home/My Practices screen or the library screen.
 */
function MYDPracticeDetailScreen({
  navigation,
}: {
  navigation: StackNavigationProp<HomeStackRouteOptions, 'MYDPracticeDetail'>;
}) {
  const [MYDScheduleModalVisibility, setMYDScheduleModalVisibility] = useState(
    false
  );
  const [pushNotificationException, setPushNotificationException] = useState<
    'inactive' | 'previouslyCompleted' | null
  >(null);

  const pendingPushNotification = useSelector(
    (state: RootReduxType) => state.myd.pushNotification
  );

  const pendingAPIOperations = useGlobalPendingAPIOperations();

  const dispatch = useDispatch();

  const safeAreaInsets = useSafeArea();

  // Load the data needed for the screen
  useEffect(() => {
    dispatch(clearActivities());
    dispatch(clearAssignments());
    dispatch(loadMYDHistory());
    dispatch(loadAssignments());
    dispatch(loadActivities());

    return () => {
      dispatch(clearActivities());
      dispatch(clearAssignments());
    };
  }, []);

  const participantInfo = useMYDParticipantInfo();
  const [
    sortedActivites,
    sortedAssignments,
  ] = useSortedMYDActivitiesAndAssignments();

  /**
   * Effect to handle pending MYD push notifications.
   *
   * The user should either by moved forward into the engagement
   * or presented with a modal if the notification is old
   * or they have already completed the referenced assignment.
   */
  useEffect(() => {
    // console.log(
    //   'Sorted Activities',
    //   sortedActivites.length,
    //   'Sorted Assignemnts',
    //   sortedAssignments.length
    // );
    if (
      sortedActivites?.length &&
      sortedAssignments?.length &&
      pendingAPIOperations.length === 0 &&
      pendingPushNotification
    ) {
      const assignmentReferencedByNotification = sortedAssignments.find(
        (assignment) =>
          assignment.id === pendingPushNotification.event_details.assignment_id
      );

      if (assignmentReferencedByNotification?.response?.length) {
        // User has previously completed activity assignment.
        setPushNotificationException('previouslyCompleted');
        dispatch(clearPushNotification());
      } else if (
        !assignmentReferencedByNotification ||
        !moment().isBetween(
          assignmentReferencedByNotification?.eligible_start,
          assignmentReferencedByNotification?.eligible_end
        )
      ) {
        // The activity assignment is not currently active.
        setPushNotificationException('inactive');
        dispatch(clearPushNotification());
      } else {
        // User should be able to complete the assignment.
        navigation.push('MYDEngagement', {
          MYDAssignmentID: pendingPushNotification.event_details.assignment_id,
          MYDActivityID: pendingPushNotification.event_details.activity_id,
        });
        dispatch(clearPushNotification());
      }
    }
  }, [sortedAssignments, sortedActivites, pendingAPIOperations.length]);

  // Clear previous activity answers from the store
  //  so that we have a clear slate to start a new assignment.
  useFocusEffect(
    useCallback(() => {
      dispatch(unloadUserActivityResponse());
    }, [])
  );

  // What text to display to a use who clicks on
  // a push notification that isn't currently valid.
  const renderPushNotificationExceptionContent = ({
    acceptAction,
    containerHeight,
  }: {
    acceptAction: () => void;
    containerHeight: number;
  }) => {
    switch (pushNotificationException) {
      case 'inactive':
        return (
          <ScrollViewWithBottomControls
            initialContainerHeight={containerHeight}
            contentComponent={
              <View style={MasterStyles.common.horizontalPadding25}>
                <Text
                  style={{
                    ...MasterStyles.fontStyles.modalTitle,
                    textAlign: 'left',
                  }}
                >
                  The Map Your Day activity you requested isn't currently
                  active.
                </Text>
                <Text
                  style={{
                    ...MasterStyles.fontStyles.modalBody,
                    textAlign: 'left',
                    paddingBottom: 15,
                  }}
                >
                  It looks like the push notification that you just selected was
                  for a Map Your Day activity that is not currently active.
                </Text>
                <Text
                  style={{
                    ...MasterStyles.fontStyles.modalBody,
                    textAlign: 'left',
                    paddingBottom: 15,
                  }}
                >
                  This usually occurs when you select the push notification
                  after the schedule block you defined for the activity has
                  ended.
                </Text>
                <Text
                  style={{
                    ...MasterStyles.fontStyles.modalBody,
                    textAlign: 'left',
                  }}
                >
                  You may however have another active activity that you can
                  choose from so we will take you to the Map Your Day overview
                  page.
                </Text>
              </View>
            }
            accountForAndroidStatusBarHeight={false}
            controlsComponent={
              <StylizedButton
                text='OK'
                onPress={() => acceptAction()}
                textColor={MasterStyles.officialColors.density}
                outlineColor={MasterStyles.officialColors.density}
                additionalContainerStyles={
                  MasterStyles.common.horizontalMargins25
                }
              />
            }
          />
        );

      case 'previouslyCompleted':
        return (
          <ScrollViewWithBottomControls
            initialContainerHeight={containerHeight}
            contentComponent={
              <View style={MasterStyles.common.horizontalPadding25}>
                <Text
                  style={{
                    ...MasterStyles.fontStyles.modalTitle,
                    textAlign: 'left',
                  }}
                >
                  The Map Your Day activity you requested has already been
                  completed.
                </Text>
                <Text
                  style={{
                    ...MasterStyles.fontStyles.modalBody,
                    textAlign: 'left',
                    paddingBottom: 15,
                  }}
                >
                  It looks like the push notification that you just selected was
                  for a Map Your Day activity that you've already completed for
                  today.
                </Text>
                <Text
                  style={{
                    ...MasterStyles.fontStyles.modalBody,
                    textAlign: 'left',
                  }}
                >
                  You may however have another active activity that you can
                  choose from so we will take you to the Map Your Day overview
                  page.
                </Text>
              </View>
            }
            accountForAndroidStatusBarHeight={false}
            controlsComponent={
              <StylizedButton
                text='OK'
                onPress={() => acceptAction()}
                textColor={MasterStyles.officialColors.density}
                outlineColor={MasterStyles.officialColors.density}
                additionalContainerStyles={
                  MasterStyles.common.horizontalMargins25
                }
              />
            }
          />
        );

      default:
        return <></>;
    }
  };

  const renderCollectionHeaderAndDescription = () => (
    <Animatable.View
      animation='fadeIn'
      delay={250}
      style={[{ paddingTop: 20 }, MasterStyles.common.horizontalPadding25]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View>
          <Text
            style={[
              MasterStyles.fontStyles.contentHeaderDark,
              { fontWeight: '500' },
            ]}
          >
            Mapping Your Days
          </Text>
          <Text style={styles.collectionAuthor}>With Matt Bloom</Text>
        </View>
        <TouchableOpacity
          key='historyButton'
          onPress={() => navigation.push('MYDHistoryCalendar')}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: MasterStyles.officialColors.density,
              borderRadius: 15,
              height: 30,
              width: 30,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../assets/icons/historySmall.png')}
              style={{ height: 25, resizeMode: 'contain', tintColor: 'white' }}
            />
          </View>
          <Text style={styles.collectionAuthor}>History</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text
          style={[
            MasterStyles.fontStyles.generalContentSmallDark,
            { paddingTop: 15 },
          ]}
        >
          We all have them. Good days and bad days. This practice will help
          raise your awareness of work tasks and how it impacts your day. You
          will be asked a short question once during the first part of your
          workday and once during the second part of your workday.
        </Text>
        <Text
          style={[
            MasterStyles.fontStyles.generalContentSmallDark,
            { paddingTop: 15 },
          ]}
        >
          At the end of your workday, you will briefly describe the highs and
          lows of each day—an abbreviated daily diary.
        </Text>
      </View>
      {!participantInfo || !participantInfo.active ? (
        <Text
          style={[
            MasterStyles.fontStyles.generalContentSmallDark,
            { paddingTop: 15 },
          ]}
        >
          In order to participate in this unique experience, you will need to
          setup your daily schedule.
        </Text>
      ) : null}
    </Animatable.View>
  );

  const renderActivityCarousel = () => {
    if (
      !participantInfo ||
      !participantInfo.active ||
      pendingAPIOperations.length ||
      !sortedAssignments ||
      !sortedActivites
    ) {
      return <></>;
    } else if (sortedAssignments.length > 0) {
      return (
        <View style={{ paddingTop: 50 }}>
          <MYDDetailActivityCarousel
            activities={sortedActivites}
            assignments={sortedAssignments}
            participantInfo={participantInfo}
            navigation={navigation}
          />
        </View>
      );
    } else {
      return (
        <View>
          <View style={[MasterStyles.common.horizontalMargins25]}>
            <Text style={MasterStyles.fontStyles.generalContentSmallDark}>
              You don't have any assignments for today. Check back tomorrow.
            </Text>
          </View>
        </View>
      );
    }
  };

  const renderActionButtons = () => {
    if (pendingAPIOperations.length > 0) {
      return <></>;
    }

    return (
      <Animatable.View
        animation='fadeInUp'
        delay={750}
        style={{ paddingTop: 20, ...MasterStyles.common.horizontalPadding25 }}
      >
        {participantInfo && participantInfo.active ? (
          <View>
            <GradientStyleButton
              onPress={() => setMYDScheduleModalVisibility(true)}
              text='Adjust My Schedule'
              noMargin
            />
          </View>
        ) : (
          <View>
            <GradientStyleButton
              text='Setup my Daily Schedule'
              onPress={() => setMYDScheduleModalVisibility(true)}
            />
          </View>
        )}
      </Animatable.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar hidden={true} />
      <ScrollViewWithBottomControls
        accountForAndroidStatusBarHeight={false}
        initialContainerHeight={deviceHeight}
        contentComponent={
          <>
            <MYDPracticeDetailImageHeader />
            {renderCollectionHeaderAndDescription()}
            {renderActivityCarousel()}
          </>
        }
        controlsComponent={
          <View
            style={{
              paddingBottom: safeAreaInsets.bottom
                ? safeAreaInsets.bottom + 25
                : 25,
            }}
          >
            {renderActionButtons()}
          </View>
        }
      />

      <SolidTopModal
        key='invalidPushNotificationsModal'
        cancelAction={() => setPushNotificationException(null)}
        completionAction={() => setPushNotificationException(null)}
        isVisible={pushNotificationException !== null}
        animationIn='bounceIn'
        animationInDuration={2000}
        animationOut='bounceOut'
        animationOutDuration={1000}
        contentComponent={renderPushNotificationExceptionContent}
      />
      <RibbonModal
        key='mydScheduleModal'
        isVisible={MYDScheduleModalVisibility}
        toggleVisibility={() =>
          setMYDScheduleModalVisibility(!MYDScheduleModalVisibility)
        }
        ContentComponent={MYDScheduleSetup}
      />
    </View>
  );
}

export default MYDPracticeDetailScreen;
