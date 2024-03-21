import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Analytics from 'expo-firebase-analytics';

import IndividualWorkflowHistoryScreen from '../../workflows/components/history/IndividualWorkflowHistoryScreen';
import HistoryOverviewScreen from '../../workflows/components/history/HistoryOverviewScreen';
import MYDHistoryCalendarScreen from '../../myd/screens/MYDHistoryCalendarScreen';

export type HistoryTabStackRouteOptions = {
  HistoryOverview: undefined;
  IndividualWorkflowHistory: {
    workflowCollectionURL: string;
    currentYear?: number;
    currentMonth?: number;
    currentDay?: number;
  };
  MYDHistoryCalendar:
    | undefined
    | {
        currentYear: number;
        currentMonth: number;
        currentDay: number;
      };
};

const HistoryStack = createStackNavigator<HistoryTabStackRouteOptions>();

export default function HistoryStackScreen() {
  return (
    <HistoryStack.Navigator
      initialRouteName='HistoryOverview'
      headerMode='none'
    >
      <HistoryStack.Screen
        name='HistoryOverview'
        component={HistoryOverviewScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('HistoryOverview'),
        }}
      />
      <HistoryStack.Screen
        name='IndividualWorkflowHistory'
        component={IndividualWorkflowHistoryScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('IndividualWorkflowHistory'),
        }}
      />
      <HistoryStack.Screen
        name='MYDHistoryCalendar'
        component={MYDHistoryCalendarScreen}
        listeners={{
          focus: () => Analytics.setCurrentScreen('MYDHistoryCalendar'),
        }}
      />
    </HistoryStack.Navigator>
  );
}
