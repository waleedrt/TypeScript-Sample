/**
 * This component provides a full screen vertical gradient.
 * It takes the start and end colors of the gradient as props.
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import AnimatedLinearGradient from './highQuality/AnimatedLinearGradient';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -100
  },
  gradient: {
    width,
    height,
    zIndex: -90,
    position: 'absolute'
  }
});

function FullScreenGradient({
  startColor = null,
  endColor = null,
  colorSets = null,
  positionSets = null,
  animationDuration = 2000,
  loopAnimation,
  animationActive
}) {
  return (
    <View style={styles.wrapper}>
      <AnimatedLinearGradient
        colorSets={colorSets ? colorSets : [[startColor, endColor]]}
        positionSets={positionSets}
        style={styles.gradient}
        animationDuration={animationDuration}
        loopAnimation={loopAnimation}
        animationActive={animationActive}
      />
    </View>
  );
}

FullScreenGradient.propTypes = {
  colorSets: PropTypes.array.isRequired,
  positionSets: PropTypes.array.isRequired,
  animationDuration: PropTypes.number,
  loopAnimation: PropTypes.bool
};

export default FullScreenGradient;
