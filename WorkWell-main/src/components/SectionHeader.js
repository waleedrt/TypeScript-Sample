import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import MasterStyles from '../styles/MasterStyles';

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    width: '100%'
  }
});

export default function SectionHeader({
  text,
  color,
  centered = false,
  divider = false,
  containerStyle = {},
  additionalTextStyles = {}
}) {
  return (
    <View style={containerStyle}>
      <Text
        style={[
          MasterStyles.fontStyles.contentHeaderDark,
          { color: color },
          centered ? { textAlign: 'center' } : null,
          additionalTextStyles
        ]}
      >
        {text}
      </Text>
      {divider ? (
        <View style={[styles.divider, { borderBottomColor: color }]} />
      ) : null}
    </View>
  );
}

SectionHeader.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  centered: PropTypes.bool,
  divider: PropTypes.bool,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  additionalTextStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
