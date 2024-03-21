import React from 'react';
import { Image, View, Text } from 'react-native';
import PropTypes from 'prop-types';

import MasterStyles from '../styles/MasterStyles';
const infoIcon = require('../../assets/icons/general/info.png');

/**
 * InfoMessageSmall
 *
 * This component is used to display a small
 * informational message to the user.
 *
 * It is generally meant to be temporary and
 * not a permanent member of a screen.
 */
function InfoMessageSmall({
  message,
  textColor = MasterStyles.colors.white,
  iconColor = MasterStyles.colors.white,
  containerStyleOverrides = {},
  iconStyleOverrides = {},
  textStyleOverrides = {}
}) {
  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start'
        },
        containerStyleOverrides
      ]}
    >
      <Image
        source={infoIcon}
        style={[
          {
            height: 30,
            width: 30,
            marginRight: 10,
            tintColor: iconColor
          },
          iconStyleOverrides
        ]}
      />
      <Text
        style={[
          MasterStyles.fontStyles.generalContentSmall,
          { flex: 1, color: textColor },
          textStyleOverrides
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

InfoMessageSmall.propTypes = {
  message: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  iconColor: PropTypes.string,
  containerStyleOverrides: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  iconStyleOverrides: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyleOverrides: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default InfoMessageSmall;
