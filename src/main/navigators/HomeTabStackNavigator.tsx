import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Analytics from 'expo-firebase-analytics';

import CollectionDetailScreen from '../../workflows/components/screens/CollectionDetailScreen';
import CollectionEngagementScreen from '../../workflows/components/screens/CollectionEngagementScreen';
import HomeScreen from '../screens/HomeScreen';
import MYDPracticeDetailScreen from '../../myd/components/MYDPracticeDetailScreen';
import MYDActivityEngagementScreen from '../../myd/components/MYDActivityEngagementScreen';
import MYDHistoryCalendarScreen from '../../myd/screens/MYDHistoryCalendarScreen';
import IndividualWorkflowHistoryScreen from '../../workflows/components/history/IndividualWorkflowHistoryScreen';

export type HomeStackRouteOptions = {
  Home: undefined;
  CollectionDetail: { id: string };
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
  MYDPracticeDetail: undefined;
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
};

const HomeStack = createStackNavigator<HomeStackRouteOptions>();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName='Home' headerMode='none'>
      <HomeStack.Screen
        name='Home'
        component={HomeScreen}
        listeners={{ focus: () => Analytics.setCurrentScreen('Home') }}
      />
      <HomeStack.Screen
        name='CollectionDetail'
        component={CollectionDetailScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('CollectionDetail'),
        }}
      />
      <HomeStack.Screen
        name='IndividualWorkflowHistory'
        component={IndividualWorkflowHistoryScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('IndividualWorkflowHistory'),
        }}
      />
      <HomeStack.Screen
        name='CollectionEngagement'
        component={CollectionEngagementScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('CollectionEngagement'),
        }}
      />
      <HomeStack.Screen
        name='MYDPracticeDetail'
        component={MYDPracticeDetailScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('MYDPracticeDetail'),
        }}
      />
      <HomeStack.Screen
        name='MYDEngagement'
        component={MYDActivityEngagementScreen}
        listeners={{ focus: () => Analytics.setCurrentScreen('MYDEngagement') }}
      />
      <HomeStack.Screen
        name='MYDHistoryCalendar'
        component={MYDHistoryCalendarScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('MYDHistoryCalendar'),
        }}
      />
    </HomeStack.Navigator>
  );
}
