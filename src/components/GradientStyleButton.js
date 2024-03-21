import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';

import MasterStyles from '../styles/MasterStyles';

export default function GradientStyleButton({
  text,
  onPress,
  textColor = MasterStyles.colors.white,
  gradientStart = MasterStyles.officialColors.brightSkyShade2,
  gradientEnd = MasterStyles.officialColors.mermaidShade2,
  disabled = false,
  noMargin = false,
  noPadding = false,
  additionalContainerStyles = {}
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={disabled}>
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        start={[0, 1]}
        end={[1, 1]}
        style={[
          MasterStyles.common.genericButton,
          { flex: 1, flexGrow: 1 },
          disabled ? { opacity: 0.5 } : { opacity: 1 },
          noMargin ? { marginTop: 0, marginBottom: 0 } : null,
          noPadding ? { padding: 0 } : MasterStyles.common.horizontalPadding25,
          additionalContainerStyles
        ]}
      >
        <Text
          style={[
            MasterStyles.fontStyles.buttonFont,
            { color: textColor },
            MasterStyles.common.horizontalMargins25
          ]}
        >
          {text.toUpperCase()}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

GradientStyleButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  textColor: PropTypes.string,
  gradientStart: PropTypes.string,
  gradientEnd: PropTypes.string,
  disabled: PropTypes.bool,
  noMargin: PropTypes.bool,
  noPadding: PropTypes.bool,
  additionalContainerStyles: PropTypes.object
};
