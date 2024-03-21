/**
 * BackgroundThemeImage
 *
 * This component is used to display a full-screen background image.
 */
import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';

import MasterStyles from '../styles/MasterStyles';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -100,
  },
  gradient: {
    width,
    height,
    zIndex: -85,
    position: 'absolute',
    opacity: 0.91,
  },
  image: {
    width,
    height,
    flex: 1,
    zIndex: -89,
    position: 'absolute',
    opacity: 1,
  },
});

function BackgroundThemeImage(props) {
  const { background, localBackground, gradientStart, gradientEnd } = props;

  return (
    <View style={styles.wrapper}>
      {background && !localBackground && (
        <Image
          source={{ uri: background }}
          style={styles.image}
          resizeMode='cover'
        />
      )}
      {background && localBackground && (
        <Image source={background} style={styles.image} resizeMode='cover' />
      )}
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        style={styles.gradient}
      />
    </View>
  );
}

BackgroundThemeImage.propTypes = {
  background: PropTypes.any,
  localBackground: PropTypes.bool,
  gradientStart: PropTypes.string,
  gradientEnd: PropTypes.string,
};

BackgroundThemeImage.defaultProps = {
  background: null,
  localBackground: false,
  gradientStart: MasterStyles.officialColors.brightSkyShade2,
  gradientEnd: MasterStyles.officialColors.groundSunflower2,
};

export default BackgroundThemeImage;
