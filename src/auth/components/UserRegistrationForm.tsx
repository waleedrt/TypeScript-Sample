import React, { useEffect, useState, useRef, useReducer } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

// Definitions
import MasterStyles from '../../styles/MasterStyles';

// Components
import InputField from '../../components/highQuality/InputField';
import ScrollViewWithBottomControls from '../../components/layout/ScrollViewWithBottomControls';
import StylizedButton from '../../components/StylizedButton';

// Hooks
import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';

const { width, height } = Dimensions.get('window');

type UserRegistrationFormProps = {
  setUserData: (data: {
    email: string;
    password: string;
    referralCode: string;
    firstName: string;
    lastName: string;
  }) => void;
  backAction: () => void;
  submitAction: () => void;
};

type actionType = {
  type: 'addError' | 'removeError';
  field:
    | 'email'
    | 'password'
    | 'passwordConfirmation'
    | 'referralCode'
    | 'firstName'
    | 'lastName';
  error?: string;
};

const formErrorsReducer = (
  state: Array<actionType>,
  action: actionType
): Array<actionType> => {
  switch (action.type) {
    case 'addError':
      return [
        ...state.filter((storedAction) => storedAction.field !== action.field),
        action,
      ];
    case 'removeError':
      return state.filter(
        (storedAction) => storedAction.field !== action.field
      );
  }
};

/**
 * This component is displayed to new users during the
 * sign-up process.
 */
export default function UserRegistrationForm({
  setUserData,
  backAction,
  submitAction,
}: UserRegistrationFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordObscured, setPasswordObscured] = useState(true);

  const [formErrors, dispatchToFormErrorsReducer] = useReducer(
    formErrorsReducer,
    []
  );

  const scrollViewRef = useRef<ScrollView>(null);
  const safeAreaInsets = useSafeArea();

  // Animation Values
  const backgroundMuteOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  const designAdjustments = useCanonicalDesignAdjustments();

  // Sync data back to parent component.
  useEffect(() => {
    setUserData({ email, password, referralCode, firstName, lastName });
  }, [email, password, referralCode, firstName, lastName]);

  // Mounting Animation
  useEffect(() => {
    Animated.stagger(250, [
      Animated.timing(backgroundMuteOpacity, {
        toValue: 0.35,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Password Errors
  useEffect(() => {
    // Passwords don't match
    if (password !== passwordConfirmation) {
      dispatchToFormErrorsReducer({
        type: 'addError',
        error: 'Passwords must match',
        field: 'passwordConfirmation',
      });
    } else {
      dispatchToFormErrorsReducer({
        type: 'removeError',
        field: 'passwordConfirmation',
      });
    }
  }, [password, passwordConfirmation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View
        key='backgroundMuter'
        style={{
          position: 'absolute',
          height: height,
          width: width,
          backgroundColor: 'black',
          opacity: backgroundMuteOpacity,
        }}
      />
      <ScrollViewWithBottomControls
        scrollViewRef={scrollViewRef}
        initialContainerHeight={
          height - safeAreaInsets.top - safeAreaInsets.bottom
        }
        contentComponent={
          <Animated.View
            style={{
              marginTop: 100 * designAdjustments.height - safeAreaInsets.top,
              opacity: formOpacity,
              ...MasterStyles.common.horizontalPadding25,
            }}
          >
            <Text style={MasterStyles.fontStyles.contentHeader}>Welcome</Text>
            <Text
              style={{
                paddingBottom: 25,
                ...MasterStyles.fontStyles.generalContentSmall,
              }}
            >
              We’re grateful for your interest in joining our research. Just
              fill out this form to create an account!
            </Text>
            <InputField
              label='Referral Code'
              value={referralCode}
              placeholder='123456'
              onChangeText={(text) => setReferralCode(text)}
              containerStyles={[{ flex: 1, opacity: 0.85 }]}
            />
            <Text
              style={{
                color: 'white',
                paddingTop: 5,
                ...(Platform.OS === 'ios'
                  ? { fontSize: 12 }
                  : {
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 12,
                      letterSpacing: -0.5,
                    }),
              }}
            >
              If you don't already have a referral code, clergy and ministry
              workers use LILLY and all other professions use TRT.
            </Text>

            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <InputField
                label='First Name'
                value={firstName}
                placeholder='Jamie'
                onChangeText={(text) => setFirstName(text)}
                containerStyles={[{ flex: 1, opacity: 0.85 }]}
                textContentType='givenName'
              />

              <View style={{ flexBasis: 20 }}></View>

              <InputField
                label='Last Name'
                value={lastName}
                placeholder='Smith'
                onChangeText={(text) => setLastName(text)}
                containerStyles={{ flex: 1, opacity: 0.85 }}
              />
            </View>

            <InputField
              label='Email Address / Username'
              value={email}
              placeholder='jsmith@email.com'
              onChangeText={(text) => setEmail(text)}
              containerStyles={{ marginTop: 20, opacity: 0.85 }}
              keyboardType='email-address'
              textContentType='emailAddress'
              autoCapitalize='none'
            />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <InputField
                label='Password'
                value={password}
                textContentType='password'
                secureTextEntry={passwordObscured}
                placeholder='********'
                onChangeText={(text) => setPassword(text)}
                autoCapitalize='none'
                containerStyles={{ marginTop: 20, opacity: 0.85, flex: 1 }}
                errorMessage={
                  formErrors.find((error) => error.field === 'password')?.error
                }
              />
              <TouchableOpacity
                style={{ paddingHorizontal: 10, paddingTop: 20 }}
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 5 }}
                onPress={() => setPasswordObscured(!passwordObscured)}
              >
                <Image
                  source={
                    passwordObscured
                      ? require('../../../assets/icons/general/eye.png')
                      : require('../../../assets/icons/general/eyeSlashed.png')
                  }
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: 'white',
                paddingTop: 5,
                ...(Platform.OS === 'ios'
                  ? { fontSize: 12 }
                  : {
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 12,
                      letterSpacing: -0.5,
                    }),
              }}
            >
              Password must have at least 8 characters and cannot be only
              numbers. Additionally, to safeguard your data, commonly used
              passwords will be rejected.
            </Text>
            <InputField
              label='Password Confirmation'
              value={passwordConfirmation}
              textContentType='password'
              secureTextEntry={passwordObscured}
              placeholder='********'
              onChangeText={(text) => setPasswordConfirmation(text)}
              autoCapitalize='none'
              containerStyles={{ marginTop: 20, opacity: 0.85 }}
              errorMessage={
                formErrors.find(
                  (error) => error.field === 'passwordConfirmation'
                )?.error
              }
            />
          </Animated.View>
        }
        controlsComponent={
          <Animated.View
            style={{
              flexDirection: 'row',
              opacity: formOpacity,
              ...MasterStyles.common.horizontalPadding25,
              paddingBottom: 25,
              paddingTop: 50,
            }}
          >
            <StylizedButton
              text='BACK'
              outlineColor={MasterStyles.colors.white}
              onPress={() =>
                Animated.stagger(500, [
                  Animated.timing(formOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                  }),
                  Animated.timing(backgroundMuteOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                  }),
                ]).start(() => backAction())
              }
              additionalContainerStyles={{
                flex: 1,
                flexGrow: 1,
                marginRight: 20,
                height: 50,
              }}
              noMargin
            />
            <StylizedButton
              disabled={
                formErrors.length !== 0 ||
                !referralCode ||
                !firstName ||
                !lastName ||
                !email ||
                !password ||
                !passwordConfirmation
              }
              text='SIGN UP'
              backgroundColor={MasterStyles.officialColors.mermaid}
              onPress={submitAction}
              additionalContainerStyles={{ flex: 2, flexGrow: 2, height: 50 }}
              noMargin
            />
          </Animated.View>
        }
      />
    </SafeAreaView>
  );
}
