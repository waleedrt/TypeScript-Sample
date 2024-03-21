import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Analytics from 'expo-firebase-analytics';

import CollectionDetailScreen from '../../workflows/components/screens/CollectionDetailScreen';
import CollectionEngagementScreen from '../../workflows/components/screens/CollectionEngagementScreen';
import MYDPracticeDetailScreen from '../../myd/components/MYDPracticeDetailScreen';
import MYDActivityEngagementScreen from '../../myd/components/MYDActivityEngagementScreen';
import MYDHistoryCalendarScreen from '../../myd/screens/MYDHistoryCalendarScreen';
import LibraryScreen from '../screens/LibraryScreen';
import IndividualWorkflowHistoryScreen from '../../workflows/components/history/IndividualWorkflowHistoryScreen';

export type LibraryStackRouteOptions = {
  LibraryCollectionDetail: { id: string };
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
  LibraryMYDPracticeDetail: undefined;
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
  Library: undefined;
};

const LibraryStack = createStackNavigator<LibraryStackRouteOptions>();

export default function LibraryStackScreen() {
  return (
    <LibraryStack.Navigator initialRouteName='Library' headerMode='none'>
      <LibraryStack.Screen
        name='Library'
        component={LibraryScreen}
        listeners={{ focus: () => Analytics.setCurrentScreen('Library') }}
      />
      <LibraryStack.Screen
        name='LibraryCollectionDetail'
        component={CollectionDetailScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('LibraryCollectionDetail'),
        }}
      />
      <LibraryStack.Screen
        name='IndividualWorkflowHistory'
        component={IndividualWorkflowHistoryScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('IndividualWorkflowHistory'),
        }}
      />
      <LibraryStack.Screen
        name='CollectionEngagement'
        component={CollectionEngagementScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('CollectionEngagement'),
        }}
      />
      <LibraryStack.Screen
        name='LibraryMYDPracticeDetail'
        component={MYDPracticeDetailScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('LibraryMYDPracticeDetail'),
        }}
      />
      <LibraryStack.Screen
        name='MYDEngagement'
        component={MYDActivityEngagementScreen}
        listeners={{ focus: () => Analytics.setCurrentScreen('MYDEngagement') }}
      />
      <LibraryStack.Screen
        name='MYDHistoryCalendar'
        component={MYDHistoryCalendarScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('MYDHistoryCalendar'),
        }}
      />
    </LibraryStack.Navigator>
  );
}
