import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import * as Analytics from 'expo-firebase-analytics';

// Definitions
import { RootReduxType } from '../../config/configureStore';

// Components
import TabBar from './components/TabBarComponent';
import UserProfileStackScreen from './navigators/UserProfileStackNavigator';
import LibraryStackScreen from './navigators/LibraryTabStackNavigator';
import HomeStackScreen from './navigators/HomeTabStackNavigator';
import HistoryStackScreen from './navigators/HistoryTabStackNavigator';

// Hooks
import useHandlePushNotification from './hooks/useHandlePushNotifications';
import useRenewAuthTokenOnAppRefocus from '../hooks/useRenewAuthTokenOnAppRefocus';

// Redux
import { enableNotifications, getNotificationDevices } from './actionCreators';
import { updateUserTimezone, loadUser } from '../auth/actionCreators';

/**
 * Helper function to determine if Tabbar should be visible on.
 *
 * NOTE: This is not currently working with the current versions
 * of React Navigation for custom tabbars. So this functionality
 * has been pushed inside of the component.
 *
 */
// @ts-ignore
const isTabBarVisible = (route) => {
  return route.state ? (route.state.index === 0 ? true : false) : true;
};

export type TabRouteOptions = {
  HomeStack: undefined;
  LibraryStack: undefined;
  ProfileStack: undefined;
  HistoryStack: undefined;
};

const Tab = createBottomTabNavigator<TabRouteOptions>();
export default function TabNavigator() {
  const dispatch = useDispatch();

  const devicesRegisteredToUser = useSelector((state: RootReduxType) => {
    return state.main.notificationDevices;
  });

  const expoPushToken = useSelector(
    (state: RootReduxType) => state.main.expoPushToken
  );

  const user = useSelector((state: RootReduxType) => state.auth.user);

  useHandlePushNotification();
  useRenewAuthTokenOnAppRefocus();

  /**
   * Actions that should only be run once per authenticated app session.
   */
  useEffect(() => {
    // console.log('APP LOAD');
    dispatch(updateUserTimezone());
    dispatch(loadUser());
  }, []);

  /**
   * Send Non-PII User Info to Firebase
   */
  useEffect(() => {
    if (user.referral_code) {
      Analytics.setUserProperty('referral_code', user.referral_code);
    }
    if (user.timezone) {
      Analytics.setUserProperty('timezone', user.timezone);
    }
  }, [user]);

  /**
   * Register user's device for push notifications.
   * NOTE: The evaluation of whether or not a user has granted permission
   * to receive push notifications in in `App.js`. If they have not
   * granted permission, expoPushToken will never be set.
   */
  useEffect(() => {
    if (!expoPushToken) return;

    if (!devicesRegisteredToUser) {
      console.log('Load Notification Devices');
      dispatch(getNotificationDevices());
    } else if (devicesRegisteredToUser) {
      const alreadyEnabled = devicesRegisteredToUser!.some(
        (device) => device.user_target_id === expoPushToken
      );
      if (!alreadyEnabled) {
        console.log(
          "Register user's device for notifications. Token:",
          expoPushToken
        );
        dispatch(enableNotifications(expoPushToken));
      } else {
        console.log(
          "User's device is already registered for notifications. Token:",
          expoPushToken
        );
      }
    }
  }, [expoPushToken, devicesRegisteredToUser]);

  return (
    <Tab.Navigator
      initialRouteName='HomeStack'
      tabBar={({ navigation, state }) => {
        // @ts-ignore
        return <TabBar navigation={navigation} state={state} />;
      }}
    >
      <Tab.Screen
        name='HomeStack'
        component={HomeStackScreen}
        // options={({ route }) => ({
        //   tabBarVisible: isTabBarVisible(route),
        // })}
      />
      <Tab.Screen
        name='LibraryStack'
        component={LibraryStackScreen}
        // options={({ route }) => ({
        //   tabBarVisible: isTabBarVisible(route),
        // })}
      />
      <Tab.Screen
        name='ProfileStack'
        component={UserProfileStackScreen}
        // options={({ route }) => ({
        //   tabBarVisible: isTabBarVisible(route),
        // })}
      />
      <Tab.Screen
        name='HistoryStack'
        component={HistoryStackScreen}
        // options={({ route }) => ({
        //   tabBarVisible: isTabBarVisible(route),
        // })}
      />
    </Tab.Navigator>
  );
}
