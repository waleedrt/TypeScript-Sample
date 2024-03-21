import React, { useState } from 'react';
import { View, StatusBar, Platform, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import { useSafeArea } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import MasterStyles from '../../styles/MasterStyles';
import GradientScreenTitle from '../../components/GradientScreenTitle';
import StylizedButton from '../../components/StylizedButton';
import SolidTopModal from '../../components/modals/SolidTopModal';
import LogoutModal from '../components/LogoutModal';
import { initLogout } from '../../auth/actionCreators';
import FullScreenGradient from '../../components/FullScreenGradient';
import ConsentReviewModalContent from '../components/ConsentReviewModalContent';
import { UserProfileStackRouteOptions } from '../../main/navigators/UserProfileStackNavigator';
import RibbonModal from '../../components/modals/RibbonModal';

/**
 * The AccountSettingsScreen is displayed to users when they
 * click on the gear icon from Wellbeing Profile screen.
 *
 * From this screen, the user is able to edit the account information,
 * review the IRB consent form, and log out.
 */
function AccountSettingsScreen({
  navigation,
}: {
  navigation: StackNavigationProp<UserProfileStackRouteOptions, 'Settings'>;
}) {
  const [isLogoutModalVisible, setisLogoutModalVisible] = useState(false);
  const [isConsentModalVisible, setIsConsentModalVisible] = useState(false);

  const dispatch = useDispatch();
  const safeAreaInsets = useSafeArea();

  const accountControls = (
    <View style={[MasterStyles.common.horizontalPadding25, { paddingTop: 5 }]}>
      <View>
        <StylizedButton
          text='About Me'
          textColor={MasterStyles.colors.white}
          noMargin
          noPadding
          image={require('../../../assets/icons/chevronRightLight.png')}
          imageOnLeft={false}
          uppercase={false}
          additionalTextStyles={
            Platform.OS === 'ios'
              ? { fontWeight: '400' }
              : { fontFamily: 'OpenSans-Regular' }
          }
          onPress={() => navigation.navigate('AboutMe')}
        />
      </View>
      <View>
        <StylizedButton
          text='Consent'
          textColor={MasterStyles.colors.white}
          noMargin
          noPadding
          image={require('../../../assets/icons/chevronRightLight.png')}
          imageOnLeft={false}
          uppercase={false}
          additionalTextStyles={
            Platform.OS === 'ios'
              ? { fontWeight: '400' }
              : { fontFamily: 'OpenSans-Regular' }
          }
          onPress={() => setIsConsentModalVisible(true)}
        />
      </View>
      <View>
        <StylizedButton
          text='Log Out'
          textColor={MasterStyles.colors.white}
          noMargin
          noPadding
          image={require('../../../assets/icons/chevronRightLight.png')}
          imageOnLeft={false}
          uppercase={false}
          additionalTextStyles={
            Platform.OS === 'ios'
              ? { fontWeight: '400' }
              : { fontFamily: 'OpenSans-Regular' }
          }
          onPress={() => setisLogoutModalVisible(true)}
        />
      </View>
    </View>
  );

  const modals = (
    <>
      <SolidTopModal
        isVisible={isLogoutModalVisible}
        cancelAction={() => setisLogoutModalVisible(false)}
        completionAction={() => dispatch(initLogout())}
        contentComponent={LogoutModal}
      />
      <RibbonModal
        isVisible={isConsentModalVisible}
        toggleVisibility={() =>
          setIsConsentModalVisible(!isConsentModalVisible)
        }
        ContentComponent={ConsentReviewModalContent}
      />
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle='light-content' animated />
      <FullScreenGradient
        animationActive={true}
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.mermaidShade2,
          ],
        ]}
        positionSets={[
          { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }, // LEFT TO RIGHT
          // { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }, // TOP TO BOTTOM
          // { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } }, // RIGHT TO LEFT
          // { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } } // TOP TO BOTTOM
          // { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0 } }
        ]}
      />
      <GradientScreenTitle
        text='Account Settings'
        onIconPress={() => navigation.goBack()}
        icon='close'
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.brightSkyShade2,
          ],
        ]}
        positionSets={[{ start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }]}
      />
      {modals}
      {accountControls}
      <View
        style={{
          ...MasterStyles.common.horizontalMargins25,
          position: 'absolute',
          bottom: safeAreaInsets.bottom ? safeAreaInsets.bottom + 25 : 25,
        }}
      >
        <Text
          style={{
            ...MasterStyles.fontStyles.generalContentSmall,
            fontSize: 10,
          }}
        >
          Application Version {Constants.nativeAppVersion},{' '}
          {Constants.nativeBuildVersion}
        </Text>
        <Text
          style={{
            ...MasterStyles.fontStyles.generalContentSmall,
            fontSize: 10,
          }}
        >
          Build {Constants.manifest.revisionId}
        </Text>
      </View>
    </View>
  );
}

export default AccountSettingsScreen;
