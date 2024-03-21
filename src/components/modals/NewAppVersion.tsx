import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Linking from 'expo-linking';
import * as Analytics from 'expo-firebase-analytics';
import Constants from 'expo-constants';

import StylizedButton from '../StylizedButton';
import MasterStyles from '../../styles/MasterStyles';
import { RootReduxType } from '../../../config/configureStore';
import SolidTopModalWithCustomHeaderText, {
  ModalContentComponentProps,
} from './SolidTopModalWithCustomHeaderText';
import ScrollViewWithBottomControls from '../layout/ScrollViewWithBottomControls';
import GradientStyleButton from '../GradientStyleButton';
import { ignoreAppUpdate } from '../../main/actionCreators';

export default function NewAppVersion() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const appVersions = useSelector(
    (state: RootReduxType) => state.main.appVersions
  );
  const ignoredUpdates = useSelector(
    (state: RootReduxType) => state.main.ignoredUpdates
  );
  const dispatch = useDispatch();

  /**
   * Display/Hide the Modal
   */
  useEffect(() => {
    // If no data is available, stop processing.
    if (!appVersions || !appVersions.length) return;

    const supportedVersions = appVersions
      .filter((version) => version.status === 'SUPPORTED')
      .map((version) => version.version_code);

    // console.log('SUPPORTED VERSIONS', supportedVersions);

    // If the current build is supported, stop.
    // Note, the first line of the if statement is to
    // handle an edge case that shouldn't be possible
    // where version is missing in the manifest.
    if (
      supportedVersions.includes(Constants.manifest.version ?? 'development') ||
      supportedVersions.includes('development')
    ) {
      // console.log('Current Build is Supported');
    } else {
      const nonIgnoredAppUpdates = supportedVersions.filter(
        (version) => !ignoredUpdates.includes(version)
      );

      // console.log('IGNORED VERSIONS', nonIgnoredAppUpdates);

      nonIgnoredAppUpdates.length
        ? // Not sure why, but setTimeout is need for iOS in some circumstances.
          setTimeout(() => setIsModalOpen(true), 500)
        : setIsModalOpen(false);
    }
  }, [appVersions, ignoredUpdates]);

  return (
    <SolidTopModalWithCustomHeaderText
      isVisible={isModalOpen}
      cancelAction={() => {
        Analytics.logEvent('app_update_dismissed');
        dispatch(ignoreAppUpdate(appVersions));
      }}
      completionAction={() => {
        Analytics.logEvent('app_update_app_store_visit');
        Platform.OS === 'ios'
          ? Linking.openURL('https://apps.apple.com/us/app/id1434428613')
          : Linking.openURL(
              'https://play.google.com/store/apps/details?id=edu.nd.workwell'
            );
      }}
      animationIn='bounceIn'
      animationInDuration={2000}
      animationOut='bounceOut'
      animationOutDuration={1000}
      gradientStart={MasterStyles.officialColors.brightSkyShade2}
      gradientEnd={MasterStyles.officialColors.mermaidShade2}
      contentComponent={ErrorModalContent}
    />
  );
}

function ErrorModalContent({
  acceptAction,
  cancelAction,
  containerHeight,
}: ModalContentComponentProps) {
  const user = useSelector((state: RootReduxType) => state.auth.user);

  return (
    <View style={{ flex: 1 }}>
      <ScrollViewWithBottomControls
        initialContainerHeight={containerHeight}
        contentComponent={
          <View
            key='content'
            style={{ flex: 1, ...MasterStyles.common.horizontalPadding25 }}
          >
            <View key='titleAndSubtitle' style={{ paddingBottom: 35 }}>
              <Text
                style={{
                  ...MasterStyles.fontStyles.modalTitle,
                  textAlign: 'left',
                }}
              >
                New Version Available
              </Text>

              <Text
                style={{
                  ...MasterStyles.fontStyles.modalBody,
                  textAlign: 'left',
                }}
              >
                Hi {user.first_name},{'\n\n'}
                We wanted to let you know there is a new version of the app
                available. {'\n\n'}
                We highly recommend you upgrade your app now. If you choose not
                to upgrade, you may experience bugs or the app may stop working.
                {'\n\n'}
                You won't see this message again until another update is
                available.
              </Text>
            </View>
          </View>
        }
        controlsComponent={
          <View style={MasterStyles.common.horizontalPadding25}>
            <GradientStyleButton
              onPress={acceptAction}
              noMargin
              text='Go to app store'
              textColor={MasterStyles.colors.whiteOpaque}
              gradientStart={MasterStyles.officialColors.brightSkyShade2}
              gradientEnd={MasterStyles.officialColors.mermaidShade2}
              additionalContainerStyles={{ maxHeight: 50, marginBottom: 10 }}
            />
            <StylizedButton
              noMargin
              text='Ignore'
              outlineColor={MasterStyles.officialColors.cloudy}
              textColor={MasterStyles.officialColors.cloudy}
              onPress={cancelAction}
            />
          </View>
        }
      ></ScrollViewWithBottomControls>
    </View>
  );
}
