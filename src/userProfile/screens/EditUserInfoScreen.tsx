import React, { useState, useEffect, useReducer, useRef } from 'react';
import { View, Dimensions, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import { updateUser } from '../../auth/actionCreators';
import { UPDATE_USER } from '../../auth/actionTypes';
import useRegisterReduxAPISideEffect from '../../hooks/useRegisterReduxAPISideEffect';

import MasterStyles from '../../styles/MasterStyles';

import FullScreenGradient from '../../components/FullScreenGradient';
import GradientScreenTitle from '../../components/GradientScreenTitle';
import InfoMessageSmall from '../../components/InfoMessageSmall';
import StylizedButton from '../../components/StylizedButton';
import InputField from '../../components/highQuality/InputField';
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';
import { RootReduxType } from '../../../config/configureStore';
import { NavigationStackProp } from 'react-navigation-stack';
import ScrollViewWithBottomControls from '../../components/layout/ScrollViewWithBottomControls';

const deviceHeight = Dimensions.get('window').height;

function userDataReducer(
  state: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    username: string;
    errors: { [fieldName: string]: string };
  },
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case 'updateFirstName':
      return { ...state, firstName: action.payload };
    case 'updateLastName':
      return { ...state, lastName: action.payload };
    case 'updateEmailAddress':
      // Updates to email address should also update username.
      return {
        ...state,
        emailAddress: action.payload,
        username: action.payload,
      };
    case 'updateConfirmEmailAddress':
      return { ...state, confirmEmailAddress: action.payload };
    case 'updateErrors':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.element]: action.payload.message,
        },
      };
    case 'APIRefresh':
      return { ...state, ...action.payload };
    case 'clearErrors':
      return { ...state, errors: {} };
    default:
      throw new Error('Received an action type that is not supportd.');
  }
}

/**
 * The EditUserInfoScreen component is accessed
 * via the Account Settings screen and can be used
 * to update various aspects of the user's account.
 */
export default function EditUserInfoScreen({
  navigation,
}: {
  navigation: NavigationStackProp;
}) {
  const [formDirty, setFormDirty] = useState(false);
  const [hasUserDataBeenUpdated, setHasUserDataBeenUpdated] = useState(false);
  const [screenTitleHeight, setScreenTitleHeight] = useState(0);

  const userData = useSelector((state: RootReduxType) => state.auth.user);
  const pendingAPIActions = useGlobalPendingAPIOperations();

  const [state, localDispatch] = useReducer(userDataReducer, {
    firstName: userData.first_name,
    lastName: userData.last_name,
    username: userData.username,
    emailAddress: userData.email,
    confirmEmailAddress: userData.email,
    timezone: userData.timezone,
    errors: {},
  });

  const dispatch = useDispatch();
  const registerAPICallback = useRegisterReduxAPISideEffect(pendingAPIActions);

  // Update Form Errors
  useEffect(() => {
    state.emailAddress !== state.confirmEmailAddress
      ? localDispatch({
          type: 'updateErrors',
          payload: {
            element: 'confirmEmailAddress',
            message: "Addresses Don't Match",
          },
        })
      : localDispatch({
          type: 'clearErrors',
        });
  }, [state.emailAddress, state.confirmEmailAddress]);

  // Reset form whenever an update is received
  // via the API
  useEffect(() => {
    localDispatch({
      type: 'APIRefresh',
      payload: userData,
    });
  }, [userData]);

  const safeAreaInsets = useSafeArea();

  const form = (
    <View
      style={[
        MasterStyles.common.horizontalMargins25,
        { marginTop: 25, marginBottom: 50 },
      ]}
    >
      {userData.username !== userData.email ? (
        <>
          <InputField
            label='Username'
            value={userData.username}
            containerStyles={{ marginBottom: 5 }}
            editable={false}
            onChangeText={() => null}
          />
          <InfoMessageSmall
            message='If you change your email address, your username will also be updated to match.'
            containerStyleOverrides={{ marginBottom: 15 }}
          />
        </>
      ) : null}

      <InputField
        label={
          userData.username !== userData.email
            ? 'Email Address'
            : 'Email Address / Username'
        }
        value={state.emailAddress}
        onChangeText={(text) => {
          setFormDirty(true);
          localDispatch({ type: 'updateEmailAddress', payload: text });
        }}
        containerStyles={{ marginBottom: 15 }}
        keyboardType='email-address'
        textContentType='emailAddress'
        autoCapitalize='none'
        editable={hasUserDataBeenUpdated ? false : true}
      />
      <InputField
        label='Confirm Email Address'
        value={state.confirmEmailAddress}
        onChangeText={(text) => {
          setFormDirty(true);
          localDispatch({ type: 'updateConfirmEmailAddress', payload: text });
        }}
        containerStyles={{ marginBottom: 15 }}
        keyboardType='email-address'
        textContentType='emailAddress'
        autoCapitalize='none'
        errorMessage={state.errors?.confirmEmailAddress}
        editable={hasUserDataBeenUpdated ? false : true}
      />
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <InputField
          label='First Name'
          value={state.firstName}
          onChangeText={(text) => {
            setFormDirty(true);
            localDispatch({ type: 'updateFirstName', payload: text });
          }}
          containerStyles={{ flex: 1, marginRight: 20 }}
          editable={hasUserDataBeenUpdated ? false : true}
        />
        <InputField
          label='Last Name'
          value={state.lastName}
          onChangeText={(text) => {
            setFormDirty(true);
            localDispatch({ type: 'updateLastName', payload: text });
          }}
          containerStyles={{ flex: 1 }}
          editable={hasUserDataBeenUpdated ? false : true}
        />
      </View>
    </View>
  );

  const preUpdateActionButtons = (
    <View
      style={{
        paddingBottom: safeAreaInsets.bottom ? safeAreaInsets.bottom + 25 : 50,
        ...MasterStyles.common.horizontalPadding25,
      }}
    >
      <StylizedButton
        text='Update Personal Info'
        outlineColor={MasterStyles.colors.white}
        noMargin
        disabled={!formDirty || Object.keys(state.errors).length !== 0}
        onPress={() => {
          dispatch(updateUser(state));
          registerAPICallback([UPDATE_USER.ACTION], () =>
            setHasUserDataBeenUpdated(true)
          );
        }}
      />
      <StylizedButton
        text='Discard Changes'
        outlineColor={MasterStyles.colors.white}
        onPress={() => navigation.goBack()}
        noMargin
        additionalContainerStyles={{ marginTop: 20 }}
      />
    </View>
  );

  const postUpdateActionButtons = (
    <View
      style={{
        paddingBottom: safeAreaInsets.bottom ? safeAreaInsets.bottom + 25 : 50,
        ...MasterStyles.common.horizontalPadding25,
      }}
    >
      <InfoMessageSmall message='Your personal information has been successfully updated.' />
      <StylizedButton
        text='Return to Previous Screen'
        outlineColor={MasterStyles.colors.white}
        onPress={() => navigation.goBack()}
        noMargin
        additionalContainerStyles={{ marginTop: 20 }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FullScreenGradient
        animationActive={false}
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.mermaidShade2,
          ],
        ]}
        positionSets={[{ start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }]}
      />
      <StatusBar barStyle='light-content' animated />
      <GradientScreenTitle
        text='About Me'
        onIconPress={() => navigation.goBack()}
        icon='close'
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.brightSkyShade2,
          ],
        ]}
        positionSets={[{ start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }]}
        onLayout={(event) =>
          setScreenTitleHeight(event.nativeEvent.layout.height)
        }
      />
      <ScrollViewWithBottomControls
        initialContainerHeight={deviceHeight - screenTitleHeight}
        contentComponent={form}
        controlsComponent={
          hasUserDataBeenUpdated
            ? postUpdateActionButtons
            : preUpdateActionButtons
        }
      />
    </View>
  );
}
