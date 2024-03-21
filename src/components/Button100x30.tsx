import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

import MasterStyles from '../styles/MasterStyles';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: MasterStyles.colors.semiTransparentWhite
  },
  text: {
    fontFamily: 'System',
    fontSize: 16,
    color: MasterStyles.colors.white,
    fontWeight: '400'
  },
  unSelected: {
    color: MasterStyles.colors.semiTransparentWhite
  }
});

type Button100x30Props = {
  text: string | number;
  disabled?: boolean;
  onPress?: () => void;
  containerStyle?: ViewStyle;
};

/**
 * A simple, stylized, 100x30 button that you
 * can be disabled and further styled.
 */
export default function Button100x30({
  text,
  onPress = () => null,
  containerStyle = {},
  disabled = false
}: Button100x30Props) {
  return (
    <TouchableOpacity
      style={[styles.button, containerStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text]}>{text}</Text>
    </TouchableOpacity>
  );
}
