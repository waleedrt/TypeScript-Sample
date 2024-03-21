import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { sortBy } from 'lodash';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Analytics from 'expo-firebase-analytics';

// Definitions
import { RootReduxType } from '../../../config/configureStore';
import { HomeStackRouteOptions } from '../../main/navigators/HomeTabStackNavigator';

// Components
import MYDScaleScreenV1 from './ui_templates/MYDScaleScreenV1';
import MYDReflectionScreenV1 from './ui_templates/MYDReflectionScreenV1';
import MYDAffirmationScreenV1 from './ui_templates/MYDAffirmationScreenV1';

// Redux
import mydActions from '../actionCreators';

// TODO: This shouldn't be any, but I don't yet know how to type this.
const stepMap: { [key: string]: any } = {
  myd_affirmation_v1: MYDAffirmationScreenV1,
  myd_scale_v1: MYDScaleScreenV1,
  myd_reflection_v1: MYDReflectionScreenV1,
};

/**
 * MYDPracticeEngagementScreen
 *
 * This component is used while the user is engaging
 * with a given MYD Activity.
 *
 * It does not have any UI of it's own, but rather using used to load (via nesting)
 * various "UI Templates" that have been created for the
 * steps of individual steps within the activity.
 */
function MYDActivityEngagementScreen({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<HomeStackRouteOptions, 'MYDEngagement'>;
  route: RouteProp<HomeStackRouteOptions, 'MYDEngagement'>;
}) {
  const currentStepIndex = route.params.currentStepIndex ?? 0;
  const MYDAssignmentID = route.params.MYDAssignmentID;
  const MYDActivityID = route.params.MYDActivityID;

  const dispatch = useDispatch();

  const MYDAssignment = useSelector((state: RootReduxType) =>
    state.myd.assignments.find(
      (assignment) => assignment.id === MYDAssignmentID
    )
  );

  const MYDActivity = useSelector((state: RootReduxType) =>
    state.myd.activities.find((activity) => activity.id === MYDActivityID)
  );

  const MYDActivitySteps = MYDActivity
    ? sortBy(MYDActivity.activitystep_set, ['order'])
    : [];

  const activityUserResponse = useSelector(
    (state: RootReduxType) => state.myd.activityUserResponse
  );

  const currentStep = MYDActivitySteps.length
    ? MYDActivitySteps[currentStepIndex]
    : null;

  const CurrentScreen =
    MYDActivitySteps.length && currentStep
      ? stepMap[currentStep.ui_template]
      : View;

  const next = () => {
    const newStepIndex = currentStepIndex + 1;

    if (newStepIndex === MYDActivity!.activitystep_set.length) {
      const endTime = moment();

      // TODO: This needs to be stored in Redux when the user first starts activity.
      const startTime = moment().startOf('minute');

      dispatch(
        mydActions.updateAssignment(
          MYDAssignment!.id,
          activityUserResponse,
          startTime,
          endTime
        )
      );

      // Send Event to Firebase
      Analytics.logEvent('myd_activity_completed');

      navigation.popToTop();
    } else {
      navigation.push('MYDEngagement', {
        MYDAssignmentID: MYDAssignment!.id,
        MYDActivityID: MYDActivity!.id,
        currentStepIndex: newStepIndex,
      });
    }
  };

  /**
   * If possible, move back to the previous step in the activity
   * or return to the MYD practice detail screen.
   */
  const back = () => {
    if (currentStepIndex === 0) {
      exit();
    } else {
      const newStepIndex = currentStepIndex - 1;
      navigation.push('MYDEngagement', {
        MYDAssignmentID: MYDAssignment!.id,
        MYDActivityID: MYDActivity!.id,
        currentStepIndex: newStepIndex,
      });
    }
  };

  const exit = () => {
    navigation.navigate('MYDPracticeDetail');
  };

  const syncUserInput = (userInput: { stepID: string; response: any }) => {
    dispatch(mydActions.updateUserActivityResponse(userInput));
  };

  return (
    <CurrentScreen
      step={currentStep}
      nextAction={next}
      backAction={back}
      cancelAction={exit}
      syncInput={syncUserInput}
    />
  );
}

export default MYDActivityEngagementScreen;
