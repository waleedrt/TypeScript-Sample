import React, { useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  LayoutChangeEvent,
  ViewStyle,
  Animated,
} from 'react-native';

// Definitions
import MasterStyles from '../styles/MasterStyles';

// Components
import XButton from './XButton';
import SettingsButton from './SettingsButton';
import AnimatedLinearGradient from './highQuality/AnimatedLinearGradient';

// Hooks
import useCanonicalDesignAdjustments from '../hooks/useCanonicalDesignAdjustments';

type GradientScreenTitleProps = {
  text: string;
  subText?: string;
  colorSets: Array<[string, string]>;
  positionSets: Array<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  }>;
  icon?: 'close' | 'settings';
  onIconPress?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  contentContainerStyle?: ViewStyle;
  animationDuration?: number;
  loopAnimation?: boolean;
};

export default function GradientScreenTitle({
  text,
  subText,
  colorSets,
  positionSets,
  icon = undefined,
  onIconPress = () => null,
  onLayout = () => null,
  contentContainerStyle = {},
  animationDuration = 2000,
  loopAnimation = false,
}: GradientScreenTitleProps) {
  const designAdjustments = useCanonicalDesignAdjustments();

  const subTextOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(subTextOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(subTextOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [subText]);

  const styles = StyleSheet.create({
    container: {
      flexBasis: subText
        ? 125 * designAdjustments.height
        : 110 * designAdjustments.height,
      minHeight: subText
        ? 125 * designAdjustments.height
        : 110 * designAdjustments.height,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    divider: {
      borderBottomColor: MasterStyles.colors.white,
      borderBottomWidth: 3,
      position: 'absolute',
      bottom: 5,
      width: '100%',
    },
  });

  let Icon;
  switch (icon) {
    case 'close':
      Icon = XButton;
      break;

    case 'settings':
      Icon = SettingsButton;
      break;

    default:
      break;
  }

  return (
    <AnimatedLinearGradient
      style={{ ...styles.container, ...contentContainerStyle }}
      onLayout={(event: LayoutChangeEvent) => {
        onLayout(event);
      }}
      colorSets={colorSets}
      positionSets={positionSets}
      animationDuration={animationDuration}
      loopAnimation={loopAnimation}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...MasterStyles.common.horizontalMargins25,
          paddingBottom: subText ? 0 : 10,
        }}
      >
        <Text
          style={{
            ...MasterStyles.fontStyles.screenTitle,
          }}
        >
          {text}
        </Text>
        {onIconPress && Icon && <Icon onPress={onIconPress} />}
      </View>
      {subText && (
        <Animated.Text
          style={{
            color: 'white',
            ...MasterStyles.fontStyles.generalContentInfoHighlightRegular,
            opacity: subTextOpacity,
            marginLeft: 25,
            marginRight: 50,
            paddingLeft: 1,
            paddingBottom: 10,
          }}
        >
          {subText}
        </Animated.Text>
      )}
      <View style={styles.divider} />
    </AnimatedLinearGradient>
  );
}
