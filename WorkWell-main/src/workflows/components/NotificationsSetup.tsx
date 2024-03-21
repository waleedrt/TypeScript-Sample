import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Picker, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import MasterStyles from '../../styles/MasterStyles';
import ModalStyles from '../../styles/ModalStyles';
import { generateTime15MinuteIncrements } from '../../utils/datetime';
import {
  createWorkflowCollectionSubscription,
  updateWorkflowCollectionSubscription,
  loadWorkflowCollectionSubscriptions,
} from '../redux/actionCreators';
import StylizedButton from '../../components/StylizedButton';
import useRegisterReduxAPISideEffect from '../../hooks/useRegisterReduxAPISideEffect';
import {
  CREATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
  UPDATE_WORKFLOW_COLLECTION_SUBSCRIPTION,
} from '../redux/actionTypes';
import { WorkflowCollectionSubscriptionScheduleType } from '../types';
import useCollectionDetail from '../hooks/useCollectionDetail';
import useCollectionSubscription from '../hooks/useCollectionSubscription';
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';
import { RootReduxType } from '../../../config/configureStore';

const TIMES = generateTime15MinuteIncrements();
const NOTHING_SELECTED = [false, false, false, false, false, false, false];

type NotificationsSetupProps = {
  containerHeight: number;
  isVisible: boolean;
  toggleVisibility: () => void;
};

/**
 * NotificationsSetup
 *
 * This component is displayed to users when they are subscribing to
 * a WorkflowCollection. It is used to collect their preferences for
 * push notification reminders for the collection.
 */
function NotificationsSetup({
  containerHeight,
  isVisible,
  toggleVisibility,
}: NotificationsSetupProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const [userActionsHeight, setUserActionsHeight] = useState(0);
  const [selectedDays, setSelectedDays] = useState(NOTHING_SELECTED);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [
    appHasNotificationsPermission,
    setAppHasNotificationsPermission,
  ] = useState<boolean | null>(null);

  const appState = useSelector((state: RootReduxType) => state.main.appState);

  // Track Permission for Push Notifications
  useEffect(() => {
    const determinePermissions = async () => {
      const { status: pushNotificationPermission } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      pushNotificationPermission === 'granted' || !Constants.isDevice
        ? setAppHasNotificationsPermission(true)
        : setAppHasNotificationsPermission(false);
    };

    determinePermissions();
  }, [isVisible, appState]);

  const dispatch = useDispatch();

  const workflowCollectionDetail = useCollectionDetail();
  const workflowCollectionSubscription = useCollectionSubscription(
    workflowCollectionDetail
  );

  const pendingAPIOperations = useGlobalPendingAPIOperations();
  const registerSideEffect = useRegisterReduxAPISideEffect(
    pendingAPIOperations
  );

  const timePickerItems = TIMES.map((s) => {
    const t = s.format('h:mm A');
    return (
      <Picker.Item
        key={t}
        value={t}
        label={t}
        color={MasterStyles.officialColors.density}
      />
    );
  });

  /**
   * If the user already has a subscription to the collection
   * preload their existing data.
   */
  useEffect(() => {
    if (
      workflowCollectionSubscription &&
      workflowCollectionSubscription.active
    ) {
      const newSelectedDays = [...NOTHING_SELECTED];

      workflowCollectionSubscription.workflowcollectionsubscriptionschedule_set.forEach(
        (scheduledDay) => {
          setSelectedTime(
            moment(scheduledDay.time_of_day, 'HH:mm:SS').format('h:mm A')
          );

          newSelectedDays[scheduledDay.day_of_week] = true;
        }
      );

      setSelectedDays(newSelectedDays);
    }
  }, [workflowCollectionSubscription]);

  /**
   * Create new Collection Subscription and associated
   * notification schedules via the the onSave method
   * passed in as a prop.
   */
  const createSubscription = () => {
    const notificationSchedules = selectedDays.reduce<
      Array<WorkflowCollectionSubscriptionScheduleType>
    >((listOfDays, day, index) => {
      if (day) {
        listOfDays.push({
          day_of_week: index,
          weekly_interval: 1,
          time_of_day: moment(selectedTime, 'hh:mm A').format('HH:mm:SS'),
        });
      }

      return listOfDays;
    }, []);

    dispatch(
      createWorkflowCollectionSubscription(
        workflowCollectionDetail!.self_detail,
        notificationSchedules
      )
    );

    registerSideEffect(CREATE_WORKFLOW_COLLECTION_SUBSCRIPTION.ACTION, () => {
      toggleVisibility();
      dispatch(loadWorkflowCollectionSubscriptions());
    });
  };

  /**
   * Update an existing subscription.
   */
  const updateSubscription = () => {
    const notificationSchedules = selectedDays.reduce<
      Array<WorkflowCollectionSubscriptionScheduleType>
    >((listOfDays, day, index) => {
      if (day) {
        listOfDays.push({
          day_of_week: index,
          weekly_interval: 1,
          time_of_day: moment(selectedTime, 'hh:mm A').format('HH:mm:SS'),
        });
      }

      return listOfDays;
    }, []);

    dispatch(
      updateWorkflowCollectionSubscription(
        workflowCollectionSubscription,
        true,
        notificationSchedules
      )
    );

    registerSideEffect(UPDATE_WORKFLOW_COLLECTION_SUBSCRIPTION.ACTION, () => {
      toggleVisibility();
      dispatch(loadWorkflowCollectionSubscriptions());
    });
  };

  /**
   * Inactivate an existing subscription.
   */
  const inactivateSubscription = () => {
    dispatch(
      updateWorkflowCollectionSubscription(
        workflowCollectionSubscription,
        false,
        []
      )
    );

    registerSideEffect(UPDATE_WORKFLOW_COLLECTION_SUBSCRIPTION.ACTION, () => {
      toggleVisibility();
      dispatch(loadWorkflowCollectionSubscriptions());
      setSelectedDays(NOTHING_SELECTED);
      setSelectedTime('10:00 AM');
    });
  };

  /**
   * Used to toggle an individual day of the week
   * on/off for push notifications.
   */
  const toggleDay = (dayIndex: number) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[dayIndex] = !selectedDays[dayIndex];
    setSelectedDays(newSelectedDays);
  };

  /**
   * Render buttons for each day of the week.
   */
  const renderDay = (dayAbbreviation: string, index: number) => {
    return (
      <TouchableOpacity
        style={
          selectedDays[index]
            ? ModalStyles.selectedDay
            : ModalStyles.unselectedDay
        }
        onPress={() => toggleDay(index)}
      >
        <Text style={ModalStyles.dayText}>{dayAbbreviation}</Text>
      </TouchableOpacity>
    );
  };

  const renderModalIntroText = () => {
    if (!workflowCollectionDetail) return null;

    return (
      <>
        <Text
          style={{ ...MasterStyles.fontStyles.modalTitle, textAlign: 'left' }}
        >
          {workflowCollectionSubscription?.active
            ? 'Adjust Your Preferences'
            : 'Boost Your Wellbeing'}
        </Text>
        {appHasNotificationsPermission ? (
          <Text
            style={{ ...MasterStyles.fontStyles.modalBody, textAlign: 'left' }}
          >
            Make your wellbeing a daily priority. Set a reminder to engage in
            the {workflowCollectionDetail.name} practice.
          </Text>
        ) : (
          <>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
              }}
            >
              To help make your wellbeing a priority and receive reminders to
              engage with this practice, go to your device settings and enable
              notifications for the WorkWell app.
            </Text>

            {!workflowCollectionSubscription?.active && (
              <Text
                style={{
                  ...MasterStyles.fontStyles.modalBody,
                  textAlign: 'left',
                  paddingTop: 10,
                }}
              >
                Even without reminders, you can still add this practice to your
                home screen for easy access.
              </Text>
            )}
          </>
        )}
      </>
    );
  };

  const renderTimeOfDay = () => (
    <View style={{ display: 'flex', paddingTop: 25 }}>
      <Text style={{ ...MasterStyles.fontStyles.modalBody, textAlign: 'left' }}>
        What time of day do you want your reminder?
      </Text>

      <Picker
        selectedValue={selectedTime}
        onValueChange={(itemValue) => setSelectedTime(itemValue)}
        enabled
        style={ModalStyles.picker}
        itemStyle={ModalStyles.pickerItem}
      >
        {timePickerItems}
      </Picker>
    </View>
  );

  const renderDaysOfWeek = () => (
    <View style={{ display: 'flex', paddingTop: 25 }}>
      <Text style={{ ...MasterStyles.fontStyles.modalBody, textAlign: 'left' }}>
        Tap the days of the week you would like to receive a reminder. If you
        prefer not to get reminders, simply leave all days unselected.
      </Text>
      <View style={ModalStyles.dayContainer}>
        {renderDay('Su', 6)}
        {renderDay('M', 0)}
        {renderDay('Tu', 1)}
        {renderDay('W', 2)}
        {renderDay('Th', 3)}
        {renderDay('F', 4)}
        {renderDay('Sa', 5)}
      </View>
    </View>
  );

  const renderActionButtons = () => {
    return !workflowCollectionSubscription ||
      !workflowCollectionSubscription.active ? (
      <View
        style={
          contentHeight + userActionsHeight <= containerHeight
            ? { position: 'absolute', bottom: 0, width: '100%' }
            : null
        }
        onLayout={(e) => setUserActionsHeight(e.nativeEvent.layout.height)}
      >
        <StylizedButton
          onPress={
            !workflowCollectionSubscription
              ? createSubscription
              : updateSubscription
          }
          text={
            appHasNotificationsPermission ? 'Save Preferences' : 'Add to home'
          }
          outlineColor={MasterStyles.officialColors.density}
          textColor={MasterStyles.officialColors.density}
          noMargin
          additionalContainerStyles={{ marginBottom: 10 }}
        />
        <StylizedButton
          onPress={toggleVisibility}
          text='Cancel'
          outlineColor={MasterStyles.officialColors.cloudy}
          textColor={MasterStyles.officialColors.cloudy}
          noMargin
          additionalContainerStyles={{ marginTop: 0 }}
        />
      </View>
    ) : (
      <View
        style={
          contentHeight + userActionsHeight <= containerHeight
            ? { position: 'absolute', bottom: 0, width: '100%' }
            : { paddingTop: 50 }
        }
        onLayout={(e) => setUserActionsHeight(e.nativeEvent.layout.height)}
      >
        <StylizedButton
          onPress={
            appHasNotificationsPermission
              ? updateSubscription
              : toggleVisibility
          }
          text={appHasNotificationsPermission ? 'Update Preferences' : 'OK'}
          outlineColor={MasterStyles.officialColors.density}
          textColor={MasterStyles.officialColors.density}
          noMargin
          additionalContainerStyles={{ marginBottom: 10 }}
        />

        <StylizedButton
          onPress={inactivateSubscription}
          text='Remove From Home'
          outlineColor={MasterStyles.officialColors.cloudy}
          textColor={MasterStyles.officialColors.cloudy}
          noMargin
          additionalContainerStyles={{ marginTop: 0 }}
        />
      </View>
    );
  };

  return workflowCollectionDetail ? (
    <View style={{ flex: 1 }}>
      <ScrollView
        scrollEnabled={contentHeight + 175 > containerHeight}
        contentContainerStyle={[
          {
            minHeight: containerHeight,
          },
          MasterStyles.common.horizontalMargins25,
        ]}
      >
        <View
          style={{ paddingBottom: 25 }}
          onLayout={(event) => {
            setContentHeight(event.nativeEvent.layout.height);
          }}
        >
          {renderModalIntroText()}
          {appHasNotificationsPermission ? (
            <>
              {renderTimeOfDay()}
              {renderDaysOfWeek()}
            </>
          ) : null}
        </View>
        {renderActionButtons()}
      </ScrollView>
    </View>
  ) : null;
}

export default NotificationsSetup;
