import React, { useState, useRef, useEffect } from 'react';
import { Text, View, TouchableOpacity, Picker, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import moment from 'moment';

// Definitions
import NotificationsModalStyles from '../../styles/NotificationsModalStyles';
import MasterStyles from '../../styles/MasterStyles';
import ModalStyles from '../../styles/ModalStyles';

// Components
import StylizedButton from '../../components/StylizedButton';

// Hooks
import useMYDParticipantInfo from '../hooks/useMYDParticipantInfo';
import useMYDScheduleBlockReducer from '../hooks/useMYDScheduleBlockReducer';
import useRegisterReduxAPISideEffect from '../../hooks/useRegisterReduxAPISideEffect';
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';

// Redux
import {
  enroll as createEnrollment,
  updateEnrollment,
  cancelEnrollment,
  loadAssignments,
} from '../actionCreators';
import { UPDATE_ENROLLMENT, ENROLL, CANCEL_ENROLLMENT } from '../actionTypes';

// Utilities
import { generateTime15MinuteIncrements } from '../../utils/datetime';
import ScrollViewWithBottomControls from '../../components/layout/ScrollViewWithBottomControls';
import { RootReduxType } from '../../../config/configureStore';
import InfoMessageSmall from '../../components/InfoMessageSmall';

const TIMES = generateTime15MinuteIncrements();
const NOTHING_SELECTED = [false, false, false, false, false, false, false];
const WEEK_DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * WARNING: HARDCODING
 *
 * The Map Your Day practice currently consists of 3 activities that are intended
 * to be completely to participants every workday.
 *
 * The following array HARDCODES the currently defined "schedule blocks" for which
 * this activities are intended to take place. If that is ever changed on the
 * backend, a corresponding change will need to take place here.
 */
const scheduleBlocks = [
  {
    name: 'Morning',
    description: 'When does the first half of your workday begin and end?',
  },
  {
    name: 'Afternoon',
    description: 'When does the second half of your workday begin and end?',
  },
  {
    name: 'End of day',
    description:
      'During what hours after work would you like to complete your reflections for the day?',
  },
];

type MYDModalProps = {
  toggleVisibility: () => void;
  isVisible: boolean;
};

/**
 * MYDModal
 *
 * This component is displayed to users when they are subscribing
 * to the the Map Your Day program or modifying/canceling
 * an existing subscription.
 *
 */
export default function MYDScheduleSetup({
  toggleVisibility,
  isVisible,
}: MYDModalProps) {
  const [selectedDays, setSelectedDays] = useState(NOTHING_SELECTED);
  const [step, setStep] = useState(0);
  const [modalHeight, setModalHeight] = useState(0);
  const [
    appHasNotificationsPermission,
    setAppHasNotificationsPermission,
  ] = useState(false);

  const [scheduleState, scheduleDispatch] = useMYDScheduleBlockReducer();

  const scrollViewRef = useRef<ScrollView>(null);

  const dispatch = useDispatch();
  const appState = useSelector((state: RootReduxType) => state.main.appState);

  const pendingAPIOperations = useGlobalPendingAPIOperations();
  const registerSideEffect = useRegisterReduxAPISideEffect(
    pendingAPIOperations
  );

  const participantInfo = useMYDParticipantInfo();

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

  // Load Current User Preferences for Current Participants
  useEffect(() => {
    if (isVisible && participantInfo) {
      // Reload the days of the week that a participant has indicated
      // are their work days.
      const participantWorkDays = participantInfo.participantdailyschedule_set
        .filter((dailySchedule) => dailySchedule.work_day)
        .map((dailySchedule) => dailySchedule.day_of_week);

      const updatedWorkDays = [...NOTHING_SELECTED];

      participantWorkDays.forEach((workDay) => {
        updatedWorkDays[workDay] = !updatedWorkDays[workDay];
      });
      setSelectedDays(updatedWorkDays);

      // Reload the start/end times for each of the daily participants
      // schedule blocks.
      participantInfo.participantscheduleblock_set.forEach((scheduleBlock) => {
        scheduleDispatch({
          type: 'setStartTime',
          scheduleBlock: scheduleBlock.schedule_block,
          time: scheduleBlock.start,
        });
        scheduleDispatch({
          type: 'setEndTime',
          scheduleBlock: scheduleBlock.schedule_block,
          time: scheduleBlock.end,
        });
      });
    }
  }, [participantInfo, isVisible]);

  const renderModalIntroText = () => {
    return participantInfo?.active ? (
      <>
        <Text
          style={{ ...MasterStyles.fontStyles.modalTitle, textAlign: 'left' }}
        >
          Map Your Day Preferences
        </Text>

        {appHasNotificationsPermission ? (
          <>
            <View>
              <Text
                style={[
                  MasterStyles.fontStyles.modalBody,
                  { textAlign: 'left' },
                ]}
              >
                Please make any necessary adjustments to your typical work days
                by selecting/de-selecting the buttons below.
              </Text>
              <View style={NotificationsModalStyles.dayContainer}>
                {renderDay('S', 6)}
                {renderDay('M', 0)}
                {renderDay('Tu', 1)}
                {renderDay('W', 2)}
                {renderDay('Th', 3)}
                {renderDay('F', 4)}
                {renderDay('S', 5)}
              </View>
              <View
                style={{
                  marginTop: 20,
                  paddingTop: 10,
                  borderStyle: 'solid',
                  borderTopWidth: 1,
                  borderTopColor: MasterStyles.officialColors.cloudy,
                  paddingBottom: 10,
                  marginBottom: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: MasterStyles.officialColors.cloudy,
                }}
              >
                <Text
                  style={[
                    MasterStyles.fontStyles.modalBody,
                    {
                      textAlign: 'left',
                      color: MasterStyles.officialColors.brightSkyShade4,
                    },
                  ]}
                >
                  Note that changes to your schedule will not take effect until
                  tomorrow.
                </Text>
              </View>
            </View>
            <Text
              style={[
                MasterStyles.fontStyles.modalBody,
                {
                  textAlign: 'left',
                },
              ]}
            >
              Click continue to finish adjusting your preferences.
            </Text>
          </>
        ) : (
          <>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
              }}
            >
              The unique nature of this practice requires us to be able to send
              you reminders.
            </Text>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
                paddingTop: 10,
              }}
            >
              To continue you will need to enable push notifications for the
              WorkWell app in your phone's settings.
            </Text>
          </>
        )}
      </>
    ) : (
      <>
        <Text
          style={{
            ...MasterStyles.fontStyles.modalTitle,
            textAlign: 'left',
          }}
        >
          Start Mapping Your Days
        </Text>

        {appHasNotificationsPermission ? (
          <>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
              }}
            >
              This practice is meant to be completed at certain periods during
              your typical workdays. So we will need to know a little about your
              normal schedule.
            </Text>

            <View
              style={{
                marginTop: 25,
                paddingTop: 10,
                paddingBottom: 20,
                borderTopWidth: 1,
                borderTopColor: MasterStyles.officialColors.cloudy,
                borderBottomWidth: 1,
                borderBottomColor: MasterStyles.officialColors.cloudy,
              }}
            >
              <Text
                style={[
                  MasterStyles.fontStyles.modalBody,
                  { textAlign: 'left' },
                ]}
              >
                Get started by selecting your typical work days using the
                buttons below.
              </Text>
              <View style={NotificationsModalStyles.dayContainer}>
                {renderDay('S', 6)}
                {renderDay('M', 0)}
                {renderDay('Tu', 1)}
                {renderDay('W', 2)}
                {renderDay('Th', 3)}
                {renderDay('F', 4)}
                {renderDay('S', 5)}
              </View>
            </View>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
                paddingTop: 25,
              }}
            >
              When you hit the "next" button below you'll have the chance to
              define what “Morning”, “Afternoon”, and “End of the Day” mean in
              your daily schedule. We will use this information to send you
              notifications during each section of your day that will remind you
              to partake in the short activity.
            </Text>
          </>
        ) : (
          <>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
              }}
            >
              The unique nature of this practice requires us to be able to send
              you reminders.
            </Text>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
                paddingTop: 10,
              }}
            >
              To continue you will need to enable push notifications for the
              WorkWell app in your phone's settings.
            </Text>
          </>
        )}
      </>
    );
  };

  const renderDay = (day: string, index: number) => {
    return (
      <TouchableOpacity
        style={
          selectedDays[index]
            ? ModalStyles.selectedDay
            : ModalStyles.unselectedDay
        }
        onPress={() => selectDay(index)}
      >
        <Text style={ModalStyles.dayText}>{day}</Text>
      </TouchableOpacity>
    );
  };

  /**
   * Used to toggle an individual day of the week
   * on/off for push notifications.
   */
  const selectDay = (dayIndex: number) => {
    const newselectedDays = [...selectedDays];
    newselectedDays[dayIndex] = !selectedDays[dayIndex];

    setSelectedDays(newselectedDays);
  };

  /**
   * Render components necessary to allow users to specify what
   * various schedule blocks (i.e. Morning, Afternoon, End of Day)
   * mean in their personal schedules.
   */
  const renderScheduleBlock = () => {
    const timePickerItems = TIMES.map((s) => {
      const val = s.format('HH:mm:ss');
      const label = s.format('h:mm A');
      return (
        <Picker.Item
          key={val}
          value={val}
          label={label}
          color={MasterStyles.officialColors.density}
        />
      );
    });
    const scheduleBlock = scheduleBlocks[step - 1];
    const previousScheduleBlock = scheduleBlocks[step - 2] ?? null;
    const nextScheduleBlock = scheduleBlocks[step] ?? null;
    const selectedTimeBlock = scheduleState[scheduleBlock.name];

    return (
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View>
          <Text style={MasterStyles.fontStyles.modalTitle}>
            {scheduleBlock.description}
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              paddingVertical: 20,
              flex: 1,
              paddingRight: 10,
            }}
          >
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBodyHighlight,
                textAlign: 'center',
              }}
            >
              Start
            </Text>
            <Picker
              selectedValue={selectedTimeBlock.start}
              onValueChange={(time) => {
                scheduleDispatch({
                  type: 'setStartTime',
                  scheduleBlock: scheduleBlock.name,
                  time,
                });
              }}
              enabled
              itemStyle={NotificationsModalStyles.pickerItem}
            >
              {timePickerItems}
            </Picker>
          </View>
          <View style={{ paddingVertical: 20, flex: 1, paddingLeft: 10 }}>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBodyHighlight,
                textAlign: 'center',
              }}
            >
              End
            </Text>
            <Picker
              selectedValue={selectedTimeBlock.end}
              onValueChange={(time) => {
                scheduleDispatch({
                  type: 'setEndTime',
                  scheduleBlock: scheduleBlock.name,
                  time,
                });
                nextScheduleBlock &&
                  scheduleDispatch({
                    type: 'setStartTime',
                    scheduleBlock: nextScheduleBlock.name,
                    time,
                  });
              }}
              enabled
              itemStyle={NotificationsModalStyles.pickerItem}
            >
              {timePickerItems}
            </Picker>
          </View>
        </View>

        {/* Notify user if start time is after end time. */}
        {moment(scheduleState[scheduleBlock.name].start, 'HH:mm:ss').isAfter(
          moment(scheduleState[scheduleBlock.name].end, 'HH:mm:ss')
        ) ? (
          <InfoMessageSmall
            containerStyleOverrides={{ paddingBottom: 10 }}
            message='It looks like you have selected a start time that is later than the end time. Please review.'
            iconColor={MasterStyles.officialColors.density}
            textColor={MasterStyles.officialColors.density}
          />
        ) : null}

        {previousScheduleBlock &&
        moment(
          scheduleState[previousScheduleBlock.name].end,
          'HH:mm:ss'
        ).isAfter(
          moment(scheduleState[scheduleBlock.name].start, 'HH:mm:ss')
        ) ? (
          <InfoMessageSmall
            message='It looks like the start time you’ve selected here overlaps the end time on the previous screen. Please make an adjustment.'
            iconColor={MasterStyles.officialColors.density}
            textColor={MasterStyles.officialColors.density}
          />
        ) : null}
      </View>
    );
  };

  /**
   * Transform the data provided by the user into a format
   * that is acceptable to the API and dispatch the
   * necessary Redux action.
   */
  const enrollUserOrUpdateEnrollment = () => {
    const userScheduleStructured = Object.entries(scheduleState).map(
      (entry) => {
        const [name, block] = entry;
        return {
          schedule_block: name,
          start: block.start,
          end: block.end,
        };
      }
    );

    const selectedDaysStructured = WEEK_DAY_NAMES.map((day, i) => ({
      day_of_week: i,
      work_day: selectedDays[i],
      notification_opt_out: !selectedDays[i],
    }));

    if (participantInfo) {
      dispatch(
        updateEnrollment(
          participantInfo.id,
          userScheduleStructured,
          selectedDaysStructured
        )
      );
      registerSideEffect(UPDATE_ENROLLMENT.ACTION, () => {
        toggleVisibility();
        setTimeout(() => setStep(0), 500);
      });
    } else {
      dispatch(
        createEnrollment(userScheduleStructured, selectedDaysStructured)
      );
      registerSideEffect(ENROLL.ACTION, () => {
        dispatch(loadAssignments());
        toggleVisibility();
        setTimeout(() => setStep(0), 500);
      });
    }
  };

  /**
   * Render the action buttons at the bottom of the modal.
   */
  const renderActionButtons = () => {
    const userScheduleForCurrentBlock =
      step > 0 ? scheduleState[scheduleBlocks[step - 1].name] : undefined;

    return participantInfo?.active ? (
      <View style={{ paddingTop: step === 0 ? 50 : 25, paddingBottom: 10 }}>
        <StylizedButton
          onPress={handleNextAction}
          text={
            step === Object.keys(scheduleState).length
              ? 'Update Preferences'
              : 'Continue'
          }
          outlineColor={MasterStyles.officialColors.density}
          textColor={MasterStyles.officialColors.density}
          noMargin
          additionalContainerStyles={{ marginBottom: 10 }}
          disabled={
            userScheduleForCurrentBlock &&
            userScheduleForCurrentBlock.start ===
              userScheduleForCurrentBlock.end
          }
        />
        <StylizedButton
          onPress={step === 0 ? handleCancelAction : handleBackAction}
          text={step === 0 ? 'Cancel Subscription' : 'Back'}
          outlineColor={MasterStyles.officialColors.density}
          textColor={MasterStyles.officialColors.density}
          noMargin
        />
      </View>
    ) : (
      <View style={{ paddingTop: step === 0 ? 50 : 25, paddingBottom: 10 }}>
        <StylizedButton
          onPress={handleNextAction}
          text={
            step === Object.keys(scheduleState).length ? 'Save' : 'Continue'
          }
          outlineColor={MasterStyles.officialColors.density}
          textColor={MasterStyles.officialColors.density}
          noMargin
          additionalContainerStyles={{ marginBottom: 10 }}
          disabled={
            userScheduleForCurrentBlock &&
            userScheduleForCurrentBlock.start ===
              userScheduleForCurrentBlock.end
          }
        />
        <StylizedButton
          onPress={handleBackAction}
          text={step === 0 ? 'Cancel' : 'Back'}
          outlineColor={MasterStyles.officialColors.density}
          textColor={MasterStyles.officialColors.density}
          noMargin
        />
      </View>
    );
  };

  const renderOKButton = () => (
    <StylizedButton
      onPress={handleBackAction}
      text='Ok'
      outlineColor={MasterStyles.officialColors.density}
      textColor={MasterStyles.officialColors.density}
      noMargin
      noPadding
    />
  );
  const handleNextAction = () => {
    // TODO: This represents an error condition that the user
    // should be alerted to.
    if (!scrollViewRef.current) return;

    if (step === Object.keys(scheduleState).length) {
      enrollUserOrUpdateEnrollment();
    } else {
      setStep(step + 1);
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  /**
   * Go back a step if possible, otherwise close the modal.
   */
  const handleBackAction = () => {
    // Do nothing if scrollViewRef has not been registered yet.
    if (!scrollViewRef.current) return;

    step === 0 ? toggleVisibility() : setStep(step - 1);
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  const handleCancelAction = () => {
    dispatch(cancelEnrollment(participantInfo!.id));
    registerSideEffect(CANCEL_ENROLLMENT.ACTION, () => {
      toggleVisibility();
      setTimeout(() => setStep(0), 500);
    });
  };

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(e) => {
        setModalHeight(e.nativeEvent.layout.height);
      }}
    >
      <ScrollViewWithBottomControls
        initialContainerHeight={modalHeight}
        scrollViewRef={scrollViewRef}
        additionalScrollViewStyles={{
          paddingHorizontal: 25,
        }}
        contentComponent={
          <>{step === 0 ? renderModalIntroText() : renderScheduleBlock()}</>
        }
        controlsComponent={
          appHasNotificationsPermission
            ? renderActionButtons()
            : renderOKButton()
        }
      />
    </View>
  );
}
