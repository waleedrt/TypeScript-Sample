import React, { useState } from 'react';
import { View, Text, ViewStyle, Platform } from 'react-native';
import MasterStyles from '../styles/MasterStyles';

type ProgressBarProps = {
  percentComplete?: number;
  height?: number;
  additionalStyles?: ViewStyle;
};

/**
 * A simple progress bar component.
 */
export default function ProgressBar({
  percentComplete = 0,
  height = 10,
  additionalStyles = {},
}: ProgressBarProps) {
  const [componentWidth, setComponentWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  return (
    <View
      onLayout={(event) => setComponentWidth(event.nativeEvent.layout.width)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...additionalStyles,
      }}
    >
      <View
        key='progressBar'
        style={{
          borderColor: 'white',
          borderWidth: 1,
          height: height,
          borderRadius: 5,
          flexBasis: componentWidth - textWidth,
        }}
      >
        <View
          style={{
            position: 'relative',
            bottom: 1,
            left: -1,
            backgroundColor: MasterStyles.colors.whiteOpaque,
            height: height,
            borderRadius: 5,
            width: (componentWidth - textWidth) * percentComplete,
            opacity: percentComplete ? 1 : 0,
          }}
        ></View>
      </View>
      <Text
        key='progressBarText'
        onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
        style={{
          paddingLeft: 20,
          textAlign: 'right',
          ...(Platform.OS === 'ios'
            ? {
                fontSize: 11,
                color: 'white',
                fontFamily: 'System',
                fontWeight: '300',
              }
            : {
                fontSize: 11,
                color: 'white',
                fontFamily: 'OpenSans-Light',
              }),
        }}
      >
        {(percentComplete * 100).toFixed(1)}% Complete
      </Text>
    </View>
  );
}
