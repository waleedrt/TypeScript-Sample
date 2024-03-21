import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Platform
} from 'react-native';

import MasterStyles from '../styles/MasterStyles';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: MasterStyles.colors.semiTransparentWhite
  },
  selectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 30,
    borderRadius: 5,
    backgroundColor: MasterStyles.colors.whiteOpaque
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '400'
  }
});
type Button35x30Props = {
  text: string | number;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  containerStyle?: ViewStyle;
};

/**
 * A simple, stylized, 35x30 button that you
 * can be disabled and further styled.
 */
export default function Button35x30({
  text,
  onPress = () => null,
  containerStyle = {},
  selected = false,
  disabled = false
}: Button35x30Props) {
  return (
    <TouchableOpacity
      style={
        selected
          ? [styles.selectedButton, containerStyle]
          : [styles.button, containerStyle]
      }
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          selected
            ? { color: MasterStyles.officialColors.density }
            : { color: MasterStyles.colors.white }
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
