import React from 'react';
import { View, Image, Text } from 'react-native';
// import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import { createIconSetFromFontello } from 'react-native-vector-icons';

import OnboardingStyles from '../../styles/OnboardingStyles';
import fontelloConfig from '../../../assets/fonts/config.json';
import logoWhite from '../../../assets/workwell-full-logo-white.png';
import MasterStyles from '../../styles/MasterStyles';
import FullScreenBackground from '../../workflows/components/FullScreenBackground';
import StylizedButton from '../../components/StylizedButton';

const CustomIcon = createIconSetFromFontello(fontelloConfig, 'fontello');

export default class OnboardingItem extends React.PureComponent {
  static propTypes = {
    info: PropTypes.array.isRequired,
    action: PropTypes.func,
  };

  static defaultProps = {
    action: null,
  };

  render() {
    const {
      action,
      info: [img, icon, header, description],
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <FullScreenBackground
          gradientEnd={MasterStyles.officialColors.brightSkyShade3}
          gradientStart={MasterStyles.officialColors.groundSunflower}
          backgroundImage={img}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image style={OnboardingStyles.whiteLogo} source={logoWhite} />
          </View>
          <View
            style={{
              flex: 3,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ display: 'flex', alignItems: 'center' }}>
              {/* <Icon style={OnboardingStyles.iconContainer}>
                <CustomIcon style={OnboardingStyles.icon} name={icon} />
              </Icon> */}
              <Text style={OnboardingStyles.header}>{header}</Text>
              <Text style={OnboardingStyles.description}>{description}</Text>
            </View>
            {action && (
              <StylizedButton
                text='Start Your Journey'
                outlineColor={MasterStyles.colors.white}
                additionalContainerStyles={{
                  maxHeight: 50,
                  marginBottom: 200,
                }}
                onPress={action}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}
