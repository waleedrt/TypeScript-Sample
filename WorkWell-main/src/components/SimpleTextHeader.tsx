import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import MasterStyles from '../styles/MasterStyles';

const styles = StyleSheet.create({
  container: {
    flexBasis: 100,
    minHeight: 100,
  },
  text: {
    position: 'absolute',
    top: 60,
  },
  divider: {
    borderBottomColor: MasterStyles.colors.white,
    borderBottomWidth: 2,
    position: 'absolute',
    top: 98,
    width: Dimensions.get('window').width - 50,
    left: 25,
    right: 25,
  },
});

type SimpleTextHeaderProps = {
  text: string;
  dividerBleedLeft?: boolean;
  dividerBleedRight?: boolean;
};

export default function SimpleTextHeader({
  text,
  dividerBleedLeft = false,
  dividerBleedRight = false,
}: SimpleTextHeaderProps) {
  return (
    <View>
      <View style={[styles.container, MasterStyles.common.horizontalPadding25]}>
        <Text
          style={[
            styles.text,
            MasterStyles.fontStyles.screenTitle,
            MasterStyles.common.horizontalPadding25,
          ]}
        >
          {text}
        </Text>
      </View>
      <View
        style={[
          styles.divider,
          dividerBleedLeft
            ? {
                width: Dimensions.get('window').width - 25,
                right: 25,
              }
            : null,
          dividerBleedRight
            ? {
                width: Dimensions.get('window').width - 25,
                left: 25,
              }
            : null,
        ]}
      />
    </View>
  );
}

SimpleTextHeader.propTypes = {
  text: PropTypes.string.isRequired,
  dividerBleedLeft: PropTypes.bool,
  dividerBleedRight: PropTypes.bool,
};
