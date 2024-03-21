import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Analytics from 'expo-firebase-analytics';

import CollectionDetailScreen from '../../workflows/components/screens/CollectionDetailScreen';
import CollectionEngagementScreen from '../../workflows/components/screens/CollectionEngagementScreen';
import MYDPracticeDetailScreen from '../../myd/components/MYDPracticeDetailScreen';
import MYDActivityEngagementScreen from '../../myd/components/MYDActivityEngagementScreen';
import EditUserInfoScreen from '../../userProfile/screens/EditUserInfoScreen';
import AccountSettingsScreen from '../../userProfile/screens/AccountSettingsScreen';
import WellbeingDimensionScreen from '../../userProfile/screens/WellbeingDimensionScreen';
import WellbeingProfileScreen from '../../userProfile/screens/WellbeingProfileScreen';
import MYDHistoryCalendarScreen from '../../myd/screens/MYDHistoryCalendarScreen';
import IndividualWorkflowHistoryScreen from '../../workflows/components/history/IndividualWorkflowHistoryScreen';

export type UserProfileStackRouteOptions = {
  UserProfileCollectionDetail: { id: string };
  IndividualWorkflowHistory: {
    workflowCollectionURL: string;
    currentYear?: number;
    currentMonth?: number;
    currentDay?: number;
  };
  CollectionEngagement: {
    workflowID: string | undefined;
    workflowStepID?: string;
    engagementStartedFrom?: string;
  };
  UserProfileMYDPracticeDetail: undefined;
  MYDEngagement: {
    MYDAssignmentID: string;
    MYDActivityID: string;
    currentStepIndex?: number;
  };
  MYDHistoryCalendar:
    | undefined
    | {
        currentYear: number;
        currentMonth: number;
        currentDay: number;
      };
  // Unique Routes
  WellbeingProfile: undefined;
  WellbeingDimension: { dimensionName: string };
  Settings: undefined;
  AboutMe: undefined;
};

const UserProfileStack = createStackNavigator<UserProfileStackRouteOptions>();
export default function UserProfileStackScreen() {
  return (
    <UserProfileStack.Navigator
      initialRouteName='WellbeingProfile'
      headerMode='none'
    >
      <UserProfileStack.Screen
        name='WellbeingProfile'
        component={WellbeingProfileScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('WellbeingProfile'),
        }}
      />
      <UserProfileStack.Screen
        name='WellbeingDimension'
        component={WellbeingDimensionScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('WellbeingDimension'),
        }}
      />
      <UserProfileStack.Screen
        name='Settings'
        component={AccountSettingsScreen}
        listeners={{ focus: () => Analytics.setCurrentScreen('Settings') }}
      />
      <UserProfileStack.Screen
        name='AboutMe'
        component={EditUserInfoScreen}
        listeners={{ focus: () => Analytics.setCurrentScreen('AboutMe') }}
      />

      <UserProfileStack.Screen
        name='UserProfileCollectionDetail'
        component={CollectionDetailScreen}
        listeners={{
          focus: () =>
            Analytics.setCurrentScreen('UserProfileCollectionDetail'),
        }}
      />
      <UserProfileStack.Screen
        name='IndividualWorkflowHistory'
        component={IndividualWorkflowHistoryScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('IndividualWorkflowHistory'),
        }}
      />
      <UserProfileStack.Screen
        name='CollectionEngagement'
        component={CollectionEngagementScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('CollectionEngagement'),
        }}
      />
      <UserProfileStack.Screen
        name='UserProfileMYDPracticeDetail'
        component={MYDPracticeDetailScreen}
        listeners={{
          focus: () =>
            Analytics.setCurrentScreen('UserProfileMYDPracticeDetail'),
        }}
      />
      <UserProfileStack.Screen
        name='MYDEngagement'
        component={MYDActivityEngagementScreen}
        listeners={{ focus: () => Analytics.setCurrentScreen('MYDEngagement') }}
      />
      <UserProfileStack.Screen
        name='MYDHistoryCalendar'
        component={MYDHistoryCalendarScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('MYDHistoryCalendar'),
        }}
      />
    </UserProfileStack.Navigator>
  );
}
