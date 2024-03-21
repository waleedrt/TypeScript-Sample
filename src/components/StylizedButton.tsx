import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native';

import MasterStyles from '../styles/MasterStyles';

type StylizedButtonProps = {
  text: string | null;
  image: number | null;
  onPress: () => void;
  backgroundColor?: string;
  textColor: string;
  disabled: boolean;
  noMargin: boolean;
  noPadding: boolean;
  outlineColor?: string;
  additionalContainerStyles: ViewStyle;
  additionalTextStyles: TextStyle;
  imageOnLeft: boolean;
  uppercase: boolean;
};

StylizedButton.defaultProps = {
  text: null,
  image: null,
  textColor: MasterStyles.colors.white,
  disabled: false,
  noMargin: false,
  noPadding: false,
  additionalContainerStyles: {},
  additionalTextStyles: {},
  imageOnLeft: true,
  uppercase: true,
};

/**
 * A highly customizable button.
 *
 * Can adjust colors, add outlines and images, and
 * adjust text styling.
 */
export default function StylizedButton({
  text,
  image,
  onPress,
  backgroundColor,
  textColor,
  disabled,
  noMargin,
  noPadding,
  outlineColor,
  additionalContainerStyles,
  additionalTextStyles,
  imageOnLeft,
  uppercase,
}: StylizedButtonProps) {
  return (
    <TouchableOpacity
      style={[
        MasterStyles.common.genericButton,
        { flex: 1, flexGrow: 1 },
        disabled ? { opacity: 0.5 } : { opacity: 1 },
        noMargin ? { marginTop: 0, marginBottom: 0 } : null,
        outlineColor
          ? {
              borderColor: outlineColor,
              borderWidth: 1,
            }
          : null,
        backgroundColor ? { backgroundColor: backgroundColor } : null,
        text && image
          ? { justifyContent: 'space-between' }
          : { justifyContent: 'center' },
        imageOnLeft
          ? { flexDirection: 'row' }
          : { flexDirection: 'row-reverse' },
        noPadding ? null : MasterStyles.common.horizontalPadding25,
        additionalContainerStyles,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {image ? (
        <Image source={image} style={{ height: 30, width: 30 }} />
      ) : null}
      {text ? (
        <Text
          style={[
            MasterStyles.fontStyles.buttonFont,
            { color: textColor },
            !image
              ? { textAlign: 'center' }
              : imageOnLeft
              ? { textAlign: 'right' }
              : { textAlign: 'left' },
            additionalTextStyles,
          ]}
        >
          {uppercase ? text.toUpperCase() : text}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
