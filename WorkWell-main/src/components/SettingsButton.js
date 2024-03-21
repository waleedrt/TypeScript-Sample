/**
 * A simple gear icon meant to be used to access "settings" from a given screen.
 */

import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

const settingsIcon = require('../../assets/icons/settings.png');

function SettingsButton({ onPress, containerStyle }) {
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image source={settingsIcon} />
    </TouchableOpacity>
  );
}

SettingsButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dark: PropTypes.bool
};

export default SettingsButton;
