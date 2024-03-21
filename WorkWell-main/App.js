import React, { useState, useEffect, useRef } from 'react';
import { Image, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
} from 'react-redux';
import { AppLoading, Notifications } from 'expo';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import { PersistGate } from 'redux-persist/integration/react';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Analytics from 'expo-firebase-analytics';
import * as Sentry from 'sentry-expo';

// Components
import MainScreenNavigator from './src/main/navigator';
import { AuthScreen } from './src/auth';

// Redux
import { resetMYDState } from './src/myd/actionCreators';
import { resetWorkflowsState, resetWorkflowHistoryState } from './src/workflows/redux/actionCreators';
import { resetUserProfileState } from './src/userProfile/actionCreators';
import { clearError as clearAuthError, clearPendingActions } from './src/auth/actionCreators';
import { partialResetOnAppStart as mainPartialResetOnAppStart } from "./src/main/actionCreators";
import {
  clearPushNotification,
  setPushNotification,
  setAppState,
  setExpoPushToken
} from './src/main/actionCreators';

// Misc
import { store, persistor } from './config/configureStore';
import appConfiguration from "./config/config";
import { defaultImages as workflowImages } from './src/workflows/images';
import { defaultImages as mydBackgroundImages } from './src/myd/images';
import { Audio } from 'expo-av';

// Initialize Sentry
Sentry.init({
  dsn: appConfiguration.sentry.dsn,
  enableInExpoDevelopment: true,
  debug: true,
  environment: appConfiguration.environment,
  normalizeDepth: 0,
  release: Constants.manifest.revisionId
});

const fontello = require('./assets/fonts/fontello.ttf');

// Preloaded Images
const logoWhite = require('./assets/logo/logoWhite.png');
const authScreenBackground = require('./assets/launch/AuthScreen.jpg');
const mydCollectionDetail = require('./assets/myd/CollectionDetail.jpg')
const mydHomeScreenCard = require('./assets/myd/MapYourDayHomeScreen_Title.jpg')
const mydLibraryScreenCard = require('./assets/myd/MapYourDayLibrary_Title.jpg')

// Consent Icons
const consentPhone = require('./assets/icons/phone.png');
const consentClipboard = require('./assets/icons/clipboard.png');
const consentFlag = require('./assets/icons/flag.png');
const consentLock = require('./assets/icons/lockJackie.png');
const consentPeople = require('./assets/icons/peopleGraph.png');
const consentStop = require('./assets/icons/stop.png');

// General Icons
const infoIcon = require('./assets/icons/general/info.png');
const closeLayerLight = require('./assets/icons/closeLayerLight.png');
const closeLayerDark = require('./assets/icons/closeLayerDark.png');
const singleChoice = require('./assets/icons/singleChoice.png');
const singleChoiceUnselected = require('./assets/icons/singleChoiceUnselected.png');
const singleChoiceSelected = require('./assets/icons/singleChoiceSelected.png');
const multipleChoiceUnselected = require('./assets/icons/multipleChoiceUnselected.png');
const multipleChoiceSelected = require('./assets/icons/multipleChoiceSelected.png');

// Face Icons
const faceVeryNegative = require('./assets/icons/faceVeryNegative.png');
const faceNegative = require('./assets/icons/faceNegative.png');
const faceNeutral = require('./assets/icons/faceNeutral.png');
const facePositive = require('./assets/icons/facePositive.png');
const faceVeryPositive = require('./assets/icons/faceVeryPositive.png');

// Tabbar Icons
const home = require('./assets/icons/tabBar/home.png');
const library = require('./assets/icons/tabBar/library.png');
const user = require('./assets/icons/tabBar/user.png');

const Stack = createStackNavigator();

function cacheImage(image) {
  if (typeof image === 'string') {
    return Image.prefetch(image);
  }
  return Asset.fromModule(image).downloadAsync();
}

export default function AppContainer(props) {
  return (
    <NavigationContainer>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App {...props} />
        </PersistGate>
      </ReduxProvider>
    </NavigationContainer>
  );
}



function App(props) {
  const [isReady, setIsReady] = useState(false);

  const notificationListener = useRef();
  const notificationResponseListener = useRef()

  const userLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const oAuthTokenStatus = useSelector((state) => state.auth.tokens.status);

  // Mounting / Unmounting Effect
  useEffect(() => {

    // Clear any previously unhandled push notifications.
    dispatch(clearPushNotification());

    // Ensure that app state is effectively reset
    // This helps with app updates that change
    // the shape of the redux store.
    // TODO: This may be more complicated than it needs to be
    // could simplify be not persisting all keys for Redux.
    dispatch(resetUserProfileState());
    dispatch(resetMYDState());
    dispatch(resetWorkflowsState());
    dispatch(resetWorkflowHistoryState())
    dispatch(clearAuthError());
    dispatch(mainPartialResetOnAppStart());
    dispatch(clearPendingActions());
    dispatch(setAppState('active'));

    checkPushNotificationPermissionsAndGetToken();

    notificationListener.current = Notifications.addListener((notification) => {
      // We have chosen to ignore push notifications that are received
      // while the app is in use.
      if (notification.origin === 'received') return;
      dispatch(setPushNotification(notification.data))
    })
  }, []);

  const dispatch = useDispatch();

  /**
   * Determine if permissions have been granted for push notifications
   * and add a handler for incoming notifications if it has been.
   */
  const checkPushNotificationPermissionsAndGetToken = async () => {

    // Are we working in the simulator?
    if (!Constants.isDevice) {
      console.log('Cannot use push notifications in a simulator.')
      return
    }

    // Get Existing Permissions (possible undetermined at first)
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      // This appears to only prompt the user the first time the app is loaded
      // even though you would imagine this to happen every time given code structure
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      // Android Specific Setup Code
      if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
          name: 'default',
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        });
      }

      const token = await Notifications.getExpoPushTokenAsync()
      dispatch(setExpoPushToken(token));
    }
  };



  const loadResourcesAsync = async () => {
    await Font.loadAsync({ fontello: fontello });
    await Font.loadAsync(Entypo.font);
    await Font.loadAsync({
      Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
    });
    await Font.loadAsync({
      Roboto_medium: require('./assets/fonts/Roboto-Medium.ttf'),
    });

    await Font.loadAsync({
      'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
    });
    await Font.loadAsync({
      'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    });
    await Font.loadAsync({
      'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    });
    await Font.loadAsync({
      'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    });
    await Font.loadAsync({
      'OpenSans-ExtraBold': require('./assets/fonts/OpenSans-ExtraBold.ttf'),
    });

    workflowImages.forEach(async (image) => await cacheImage(image));
    mydBackgroundImages.forEach(async (image) => await cacheImage(image));

    // Random Images
    await cacheImage(mydCollectionDetail)
    await cacheImage(mydHomeScreenCard)
    await cacheImage(mydLibraryScreenCard)
    await cacheImage(logoWhite);
    await cacheImage(authScreenBackground);

    //  Icons
    await cacheImage(singleChoice);
    await cacheImage(singleChoiceSelected);
    await cacheImage(singleChoiceUnselected);
    await cacheImage(multipleChoiceSelected);
    await cacheImage(multipleChoiceUnselected);
    await cacheImage(consentPhone);
    await cacheImage(consentClipboard);
    await cacheImage(consentFlag);
    await cacheImage(consentLock);
    await cacheImage(consentPeople);
    await cacheImage(consentStop);
    await cacheImage(infoIcon);
    await cacheImage(closeLayerLight);
    await cacheImage(closeLayerDark);
    await cacheImage(faceVeryNegative);
    await cacheImage(faceNegative);
    await cacheImage(faceNeutral);
    await cacheImage(facePositive);
    await cacheImage(faceVeryPositive);
    await cacheImage(home);
    await cacheImage(library);
    await cacheImage(user);

    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
    });
  };

  const handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    // Sentry.warn(error); // CANT SEEM TO USE THIS HERE ON ANDROID
    console.log(error);
  };

  const handleFinishLoading = () => {
    setIsReady(true);
  };

  return (
    <SafeAreaProvider>
      {!isReady ? (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={handleFinishLoading}
        />
      ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!userLoggedIn | ['Invalid', 'Failure'].includes(oAuthTokenStatus) ? (
              /** Display AuthScreen if User Isn't Logged In or has Invalid oAuth Tokens */
              <Stack.Screen
                name='Login'
                component={AuthScreen}
                listeners={{
                  focus: () => Analytics.setCurrentScreen('LoginScreen'),
                }}
              />
            ) : (
                /** Otherwise load the main navigator */
                <Stack.Screen name='Main' component={MainScreenNavigator} />
              )}
          </Stack.Navigator>
        )}
    </SafeAreaProvider>
  );
}
