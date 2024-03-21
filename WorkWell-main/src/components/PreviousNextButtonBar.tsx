import React from 'react';
import { View, LayoutChangeEvent, ViewStyle } from 'react-native';

import MasterStyles from '../styles/MasterStyles';
import StylizedButton from './StylizedButton';

interface PreviousNextButtonBarProps {
  previousAction: () => void;
  nextAction: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
  previousText: string;
  previousTextColor: string;
  previousColor?: string;
  previousOutlineColor?: string;
  previousDisabled: boolean;
  nextText: string;
  nextTextColor: string;
  nextColor?: string;
  nextOutlineColor?: string;
  nextDisabled: boolean;
  additionalStyles: ViewStyle;
}

PreviousNextButtonBar.defaultProps = {
  previousTextColor: MasterStyles.colors.white,
  previousColor: null,
  previousOutlineColor: null,
  previousDisabled: false,
  nextTextColor: MasterStyles.colors.white,
  nextColor: null,
  nextOutlineColor: null,
  nextDisabled: false,
  additionalStyles: {},
  onLayout: (event: LayoutChangeEvent) => null,
};

export default function PreviousNextButtonBar({
  previousAction,
  previousTextColor,
  previousColor,
  previousOutlineColor,
  previousText,
  previousDisabled,
  nextAction,
  nextTextColor,
  nextColor,
  nextOutlineColor,
  nextText,
  nextDisabled,
  additionalStyles,
  onLayout,
}: PreviousNextButtonBarProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 25,
        },

        additionalStyles,
      ]}
      onLayout={onLayout}
    >
      <StylizedButton
        text={previousText}
        onPress={previousAction}
        noMargin
        backgroundColor={previousColor}
        outlineColor={previousOutlineColor}
        textColor={previousTextColor}
        disabled={previousDisabled}
      />
      <View style={{ width: '5%' }} />
      <StylizedButton
        text={nextText}
        onPress={nextAction}
        noMargin
        backgroundColor={nextColor}
        outlineColor={nextOutlineColor}
        textColor={nextTextColor}
        disabled={nextDisabled}
      />
    </View>
  );
}
