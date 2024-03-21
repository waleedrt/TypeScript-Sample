import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  View,
  Dimensions,
  Platform,
  AppState,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { startAsync } from 'expo-auth-session';

import authActions from '../actionCreators';
import MasterStyles from '../../styles/MasterStyles';
import config from '../../../config/config';
import Consent from '../../components/Consent';
import SolidTopModal from '../../components/modals/SolidTopModal';
import StylizedButton from '../../components/StylizedButton';
import UserRegistrationForm from '../components/UserRegistrationForm';
import ErrorMessage from '../../components/modals/ErrorMessage';
import { RootReduxType } from '../../../config/configureStore';
import ScrollingBackground from '../../components/layout/ScrollingBackground';
import ScrollViewWithBottomControls from '../../components/layout/ScrollViewWithBottomControls';

const whiteLogo = require('../../../assets/logo/logoWhite.png');

function toQueryString(params: {
  state: string;
  response_type: string;
  client_id: string;
}) {
  return `?${Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')}`;
}

const { width, height } = Dimensions.get('window');

/**
 * The AuthScreen component is displayed to users that
 * are not currently signed in to the app.
 */
function AuthScreen() {
  const [userData, setUserData] = useState<{
    email: string;
    password: string;
    referralCode: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [safeAreaViewHeight, setSafeAreaViewHeight] = useState(0);

  const [imageHeight, setImageHeight] = useState(0);
  const [newUser, setNewUser] = useState(false);

  /**
   * Android Quirk: We have to wait for content sizing to finish
   * before displaying the page content or you get weird flashing effects.
   */
  const [contentSizingFinished, setContentSizingFinished] = useState(
    Platform.OS === 'ios' ? true : false
  );

  const scrollViewRef = useRef(null);
  const safeAreaRef = useRef(null);

  const isRegistered = useSelector(
    (state: RootReduxType) => state.auth.isRegistered
  );

  const dispatch = useDispatch();
  const safeAreaInsets = useSafeArea();

  /**
   * Set the desired height of the Workwell logo image container.
   */
  useEffect(() => {
    setImageHeight(safeAreaViewHeight / 2);
  }, [safeAreaViewHeight]);

  // Start the Login Process After Registration
  useEffect(() => {
    if (isRegistered) {
      login();
    }
  }, [isRegistered]);

  const login = async () => {
    const state = new Date().valueOf().toString();
    const authUrl = `${config.apiUrl}api_v3/oauth2/authorize/${toQueryString({
      state,
      response_type: 'code',
      client_id: config.clientID,
    })}`;

    // console.log(authUrl);

    const authSessionResult = await startAsync({ authUrl });

    if (authSessionResult.type !== 'success') {
      return;
    }
    if (authSessionResult.params.state !== state) {
      throw new Error(
        `State mismatch: result: ${authSessionResult.params.state} request: ${state}`
      );
    }
    dispatch(authActions.initLogin(authSessionResult.params.code));
  };

  const initialLayout = (
    <ScrollViewWithBottomControls
      scrollViewRef={scrollViewRef}
      initialContainerHeight={height}
      contentComponent={
        <View
          key='image'
          style={{
            height: imageHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // opacity: signUpOrLogInViewOpacity,
          }}
        >
          <Image source={whiteLogo} />
        </View>
      }
      controlsComponent={
        <View
          style={{
            paddingBottom: safeAreaInsets.bottom + 25 || 25,
            // opacity: signUpOrLogInViewOpacity,
            ...MasterStyles.common.horizontalPadding25,
          }}
        >
          <StylizedButton
            text='SIGN UP'
            backgroundColor={MasterStyles.officialColors.mermaid}
            onPress={() => setNewUser(true)}
            noMargin
          />
          <StylizedButton
            text='LOG IN'
            outlineColor={MasterStyles.colors.white}
            onPress={login}
          />
        </View>
      }
    />
  );

  return (
    <View
      style={{ flex: 1 }}
      // The following is a hack to get around the double login problem currently
      // in Android. This is a known Expo bug and will hopefully be resolved by Summer 2020
      key={AppState.currentState}
      onLayout={(event) =>
        setSafeAreaViewHeight(event.nativeEvent.layout.height)
      }
      ref={safeAreaRef}
    >
      <StatusBar translucent={false} />
      <ErrorMessage
        stateSegmentOfInterest='auth'
        errorSubtitle='We encountered an error when attempting to create your account. Here are some details.'
        extraErrorMessages={{
          email:
            'This means you already have an account. To login, click on the "back" button to return to the previous screen and then select login. From here you will be asked for your username/password. If you don\'t know them, just select the "Forgotten your password or username" button.',
          referral_code:
            'If you were not given one but are a clergy or ministry worker, use LILLY. All other professions should use TRT.',
        }}
      />
      <SolidTopModal
        isVisible={isConsentModalOpen}
        cancelAction={() => setIsConsentModalOpen(false)}
        completionAction={() => {
          dispatch(authActions.register(userData));
          setIsConsentModalOpen(false);
        }}
        contentComponent={Consent}
      />
      <View
        style={{
          width,
          height,
          position: 'absolute',
          zIndex: 0,
        }}
      >
        <ScrollingBackground
          image={require('../../../assets/launch/AuthScreen.jpg')}
        />
      </View>

      {!newUser ? (
        initialLayout
      ) : (
        <UserRegistrationForm
          setUserData={setUserData}
          backAction={() => setNewUser(false)}
          submitAction={() => setIsConsentModalOpen(true)}
        />
      )}
    </View>
  );
}

export default AuthScreen;
