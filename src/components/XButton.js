/**
 * A simple X icon meant to be used to exit from a given action/screen.
 */

import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

const lightIcon = require('../../assets/icons/closeLayerLight.png');
const darkIcon = require('../../assets/icons/closeLayerDark.png');

function XButton({ onPress, containerStyle, dark = false }) {
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} hitSlop={{ left: 5, right: 5, top: 5, bottom: 5 }}>
      <Image source={dark ? darkIcon : lightIcon} />
    </TouchableOpacity>
  );
}

XButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dark: PropTypes.bool
};

export default XButton;
