import React from 'react';
import PropTypes, { number } from 'prop-types';
import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import BackgroundThemeImage from '../../components/BackgroundThemeImage';
import MasterStyles from '../../styles/MasterStyles';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    width,
    height,
    zIndex: -90,
    position: 'absolute'
  }
});

function FullScreenBackground({
  backgroundImage,
  gradientStart = MasterStyles.officialColors.brightSkyShade2,
  gradientEnd = MasterStyles.officialColors.groundSunflower2
}) {
  return backgroundImage ? (
    <BackgroundThemeImage
      background={backgroundImage}
      localBackground={typeof backgroundImage === 'number' ? true : false}
      gradientStart={gradientStart}
      gradientEnd={gradientEnd}
    />
  ) : (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      style={styles.gradient}
    />
  );
}

FullScreenBackground.propTypes = {
  backgroundImage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default FullScreenBackground;
