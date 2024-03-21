import React, {
  useEffect,
  useState,
  useRef,
  Component,
  ReactNode,
} from 'react';
import { Animated, ViewStyle, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

class GradientHelper extends Component {
  render() {
    const {
      style,
      color1,
      color2,
      startX,
      startY,
      endX,
      endY,
      onLayout,
      children,
    } = this.props;

    return (
      <LinearGradient
        colors={[color1, color2]}
        start={{
          x: startX,
          y: startY,
        }}
        end={{
          x: endX,
          y: endY,
        }}
        style={style}
        onLayout={onLayout}
      >
        {children}
      </LinearGradient>
    );
  }
}

const AnimatedGradientHelper = Animated.createAnimatedComponent(GradientHelper);

type AnimatedLinearGradientProps = {
  colorSets: Array<[string, string]>;
  positionSets: Array<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  }>;
  style?: ViewStyle;
  onLayout?: (event: LayoutChangeEvent) => void;
  animationDuration?: number;
  loopAnimation?: boolean;
  children: ReactNode;
};

/**
 * Not sure if this component is necessary.
 */
const AnimatedLinearGradient = ({
  colorSets,
  positionSets,
  style,
  onLayout = () => null,
  animationDuration = 2000,
  loopAnimation = false,
  children,
}: AnimatedLinearGradientProps) => {
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const positionAnimation = useRef(new Animated.Value(0)).current;

  const [colorSetIndexes, setColorSetIndexes] = useState({
    current: 0,
    next: 1,
  });
  const [positionSetIndexes, setPositionSetIndexes] = useState({
    current: 0,
    next: 1,
  });

  const gradientStartColor = useRef<string | Animated.AnimatedInterpolation>(
    colorSets[0][0]
  );
  const gradientEndColor = useRef<string | Animated.AnimatedInterpolation>(
    colorSets[0][1]
  );
  const gradientPositionXStart = useRef<
    number | Animated.AnimatedInterpolation
  >(positionSets[0].start.x);
  const gradientPositionXEnd = useRef<number | Animated.AnimatedInterpolation>(
    positionSets[0].end.x
  );
  const gradientPositionYStart = useRef<
    number | Animated.AnimatedInterpolation
  >(positionSets[0].start.y);
  const gradientPositionYEnd = useRef<number | Animated.AnimatedInterpolation>(
    positionSets[0].end.y
  );

  // Animate Gradient Colors
  useEffect(() => {
    colorAnimation.setValue(0);

    // There is only a single color set, so there is nothing to animate here.
    if (colorSets.length > 1) {
      // There are multiple color sets, so we should animate them.
      /**
       * Set gradientStartColor/gradientEndColor to be dynamic
       * derivitives of color animation rather than a static value.
       * */
      gradientStartColor.current = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          colorSets[colorSetIndexes.current][0],
          colorSets[colorSetIndexes.next][0],
        ],
      });
      gradientEndColor.current = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          colorSets[colorSetIndexes.current][1],
          colorSets[colorSetIndexes.next][1],
        ],
      });

      // Move to Next Color Set
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: false,
      }).start(() => {
        if (colorSets.length > colorSetIndexes.next + 1) {
          setColorSetIndexes({
            current: colorSetIndexes.next,
            next: colorSetIndexes.next + 1,
          });
        } else if (loopAnimation) {
          setColorSetIndexes({
            current: colorSetIndexes.next,
            next: 0,
          });
        }
      });
    }
  }, [colorSetIndexes]);

  // Animate Gradient Start/End Position
  useEffect(() => {
    positionAnimation.setValue(0);

    if (positionSets.length > 1) {
      // Multiple Position Sets Present: Should Animated
      gradientPositionXStart.current = positionAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          positionSets[positionSetIndexes.current].start.x,
          positionSets[positionSetIndexes.next].start.x,
        ],
      });

      gradientPositionYStart.current = positionAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          positionSets[positionSetIndexes.current].start.y,
          positionSets[positionSetIndexes.next].start.y,
        ],
      });

      gradientPositionXEnd.current = positionAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          positionSets[positionSetIndexes.current].end.x,
          positionSets[positionSetIndexes.next].end.x,
        ],
      });

      gradientPositionYEnd.current = positionAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          positionSets[positionSetIndexes.current].end.y,
          positionSets[positionSetIndexes.next].end.y,
        ],
      });

      Animated.timing(positionAnimation, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: false,
      }).start(() => {
        if (positionSets.length > positionSetIndexes.next + 1) {
          // console.log('STEP 4: Move to Next Color Set');
          setPositionSetIndexes({
            current: positionSetIndexes.next,
            next: positionSetIndexes.next + 1,
          });
        } else if (loopAnimation) {
          setPositionSetIndexes({
            current: positionSetIndexes.next,
            next: 0,
          });
        }
      });
    }
  }, [positionSetIndexes]);

  return (
    <AnimatedGradientHelper
      color1={gradientStartColor.current}
      color2={gradientEndColor.current}
      startX={gradientPositionXStart.current}
      startY={gradientPositionYStart.current}
      endX={gradientPositionXEnd.current}
      endY={gradientPositionYEnd.current}
      style={style}
      onLayout={onLayout}
      children={children}
    />
  );
};

export default AnimatedLinearGradient;
