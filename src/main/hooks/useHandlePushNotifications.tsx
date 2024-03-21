import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

// Definitions
import { RootReduxType } from '../../../config/configureStore';

// Redux
import { clearPushNotification } from '../actionCreators';
import { setPushNotification as setMYDPushNotification } from '../../myd/actionCreators';
import { setWorkflowsPushNotification } from '../../workflows/redux/actionCreators';
import { SimplifiedExpoPushNotification } from '../../types';

/**
 * A custom hook for handling push notification in the Redux store.
 *
 * There are essentially two parts of this hook, separated into two
 * different internal useEffect hooks.
 *
 * The first useEffect is responsible for ensuring that
 * (1) oAuth tokens are up to date and (2) returning the
 * user to the root of the HomeStack navigator.
 *
 * The second useEffect will either navigate directly
 * to the Workflow Collection associated with the notification
 * OR publish the push notification into MYD's segment
 * of the Redux store for further processing if the push
 * notification is for MYD.
 */
export default function useHandlePushNotification() {
  const [
    localPushNotificationStorage,
    setLocalPushNotificationStorage,
  ] = useState<SimplifiedExpoPushNotification | null>(null);

  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const pushNotification = useSelector(
    (state: RootReduxType) => state.main.pushNotification
  );

  const authTokenStatus = useSelector(
    (state: RootReduxType) => state.auth.tokens.status
  );

  const oAuthTokenExpiration = useSelector((state: RootReduxType) => {
    return state.auth.tokens.expires;
  });

  useEffect(() => {
    // Early Exit: If there is no push notification
    if (!pushNotification) return;

    // FIND OUT WHAT STEPS TO TAKE TO GET BACK TO THE HOME SCREEN
    // If route.state then use has clicked at least one tab.
    // - route.state.index shows which is the active tab
    //   - 0 HomeStack
    //   - 1 LibraryStack
    //   - 2 ProfileStack
    // If route.state.routes[route.state.index].state then user has visited at least one screen beyond index 0
    let userHasClickedTabs = false;
    let userHasInteractedWithCurrentTabStack = false;

    if (route.hasOwnProperty('state')) {
      // This means a user has at least clicked one or more tabs.
      userHasClickedTabs = true;
      const currentTabIndex = route.state.index;

      if (
        route.state.routes[currentTabIndex].hasOwnProperty('state') &&
        route.state.routes[currentTabIndex].state.index !== 0
      ) {
        // In this scenario, we know that the user has at least visited one
        // screen beyond index 0 in the current TabStack.
        userHasInteractedWithCurrentTabStack = true;
      }
    }

    console.log('POOP', pushNotification);

    if (!userHasClickedTabs || !userHasInteractedWithCurrentTabStack) {
      navigation.navigate('HomeStack');
      setLocalPushNotificationStorage(pushNotification);
      dispatch(clearPushNotification());
    } else if (userHasClickedTabs && userHasInteractedWithCurrentTabStack) {
      navigation.popToTop();
      navigation.navigate('HomeStack');
      setLocalPushNotificationStorage(pushNotification);
      dispatch(clearPushNotification());
    }
  }, [pushNotification, route]);

  useEffect(() => {
    // Ensure we have a locally stored push notification to handle.
    if (localPushNotificationStorage) {
      // Early Exit: Wait for Home Screen to Refresh Token if Necessary
      if (
        moment(oAuthTokenExpiration as string).diff(moment(), 'seconds') < 16000
      ) {
        console.log('useHandlePushNotification: Wait for New OAuth Token');
        return;
      } else {
        console.log(
          'useHandlePushNotification: Route Push Notification for Further Handling'
        );
      }

      switch (localPushNotificationStorage.event) {
        // Handle MYD Notifications
        case 'MYDActivity':
          dispatch(setMYDPushNotification(localPushNotificationStorage));
          break;

        // Handle Workflow Collection Subscription Notifications
        case 'WorkflowSubscriptionReminder':
          dispatch(setWorkflowsPushNotification(localPushNotificationStorage));
          break;

        default:
          break;
      }
      setLocalPushNotificationStorage(null);
    }
  }, [localPushNotificationStorage, authTokenStatus, oAuthTokenExpiration]);
}
