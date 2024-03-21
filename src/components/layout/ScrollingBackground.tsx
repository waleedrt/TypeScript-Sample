import React, { useState, useEffect, RefObject, useRef } from 'react';
import { ScrollView, Animated, Dimensions, Easing } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

type ScrollingBackgroundProps = {
  image: number | string;
};

export default function ScrollingBackground({
  image,
}: ScrollingBackgroundProps) {
  const [imageHeight, setImageHeight] = useState(0);

  const positionAnimation = useRef(new Animated.Value(0)).current;
  const blurAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {}, [deviceHeight, imageHeight]);

  return (
    <>
      <Animated.Image
        source={image}
        style={{
          transform: [{ translateY: positionAnimation }],
          opacity: blurAnimation,
        }}
        onLayout={(event) => {
          setImageHeight(event.nativeEvent.layout.height);
        }}
        onLoadEnd={() => {
          Animated.parallel([
            Animated.timing(positionAnimation, {
              toValue: -(imageHeight - deviceHeight),
              duration: 15000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(blurAnimation, {
              toValue: 0,
              duration: 10000,
              useNativeDriver: true,
            }),
          ]).start();
        }}
      />
      <Animated.Image
        source={image}
        blurRadius={5}
        style={{
          position: 'absolute',
          zIndex: -100,
          transform: [{ translateY: positionAnimation }],
        }}
      />
    </>
  );
}
