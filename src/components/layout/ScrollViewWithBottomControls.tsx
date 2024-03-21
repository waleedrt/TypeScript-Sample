import React, {
  ReactNode,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';
import {
  ScrollView,
  View,
  Animated,
  LayoutChangeEvent,
  Platform,
  ViewStyle,
  StatusBar,
  Dimensions,
} from 'react-native';

import useKeyboardEventCallbacks from '../../hooks/useKeyboardEventCallbacks';

const deviceHeight = Dimensions.get('window').height;

type ScrollViewWithBottomControlsProps = {
  initialContainerHeight: number;
  scrollViewRef?: MutableRefObject<ScrollView> | null | undefined;
  contentComponent: ReactNode;
  controlsComponent: ReactNode;
  additionalScrollViewStyles: ViewStyle;
  accountForAndroidStatusBarHeight: boolean;
};

ScrollViewWithBottomControls.defaultProps = {
  additionalScrollViewStyles: {},
  accountForAndroidStatusBarHeight: true,
  initialContainerHeight: deviceHeight,
};

export default function ScrollViewWithBottomControls({
  initialContainerHeight,
  scrollViewRef,
  contentComponent,
  controlsComponent,
  additionalScrollViewStyles,
  accountForAndroidStatusBarHeight,
}: ScrollViewWithBottomControlsProps) {
  const [scrollingEnabled, setScrollingEnabled] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);

  const [scrollViewContainerHeight, setScrollViewContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const controlsAnimatedOpacity = useRef(new Animated.Value(1)).current;
  const interalScrollViewRef = useRef<ScrollView>(null);

  /**
   * If the parent component passes a scrollViewRef prop
   * in, sync our internalScrollViewRef value to it so that
   * the scrollView can be controlled by the parent.
   */
  useEffect(() => {
    if (interalScrollViewRef.current && scrollViewRef) {
      scrollViewRef.current = interalScrollViewRef.current;
    }
  }, [interalScrollViewRef.current, scrollViewRef]);

  // Determine the correct height of the scrollview and
  // whether or not to enable scrolling.
  useEffect(() => {
    // Early Exit if we don't yet have necessary info
    if (!initialContainerHeight || !contentHeight || !controlsHeight) {
      setLayoutReady(false);
      return;
    }

    // console.log('MEASUREMENTS');
    // console.log('initialContainerHeight', initialContainerHeight);
    // console.log('contentHeight', contentHeight);
    // console.log('controlsHeight', controlsHeight);
    // console.log('keyboardHeight', keyboardHeight);
    // console.log('androidStatusBarHeight', StatusBar.currentHeight);

    if (
      contentHeight + controlsHeight + keyboardHeight >=
      initialContainerHeight -
        (accountForAndroidStatusBarHeight ? StatusBar.currentHeight ?? 0 : 0)
    ) {
      if (Platform.OS === 'ios') {
        setScrollViewContainerHeight(
          contentHeight + controlsHeight + keyboardHeight
        );
      } else {
        setScrollViewContainerHeight(
          contentHeight + controlsHeight + keyboardHeight
          // Might need to account for Android status bar height here.
        );
      }
      setScrollingEnabled(true);
    } else {
      setScrollViewContainerHeight(
        initialContainerHeight -
          (accountForAndroidStatusBarHeight ? StatusBar.currentHeight ?? 0 : 0)
      );
      setScrollingEnabled(false);
    }

    setLayoutReady(true);
  }, [initialContainerHeight, contentHeight, controlsHeight, keyboardHeight]);

  // Setup keyboard callbacks
  useKeyboardEventCallbacks({
    keyboardWillShowCallback: (event) => {
      Animated.timing(controlsAnimatedOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    keyboardDidShowCallback: (event) => {
      setKeyboardHeight(event.endCoordinates.height);

      Platform.OS === 'ios'
        ? Animated.timing(controlsAnimatedOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }).start()
        : Animated.sequence([
            Animated.timing(controlsAnimatedOpacity, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(controlsAnimatedOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
    },
    keyboardWillHideCallback: () => {
      if (interalScrollViewRef?.current) {
        interalScrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
      Animated.timing(controlsAnimatedOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    keyboardDidHideCallback: () => {
      setKeyboardHeight(0);
      Platform.OS === 'ios'
        ? Animated.timing(controlsAnimatedOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }).start()
        : Animated.sequence([
            Animated.timing(controlsAnimatedOpacity, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(controlsAnimatedOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
    },
  });

  return (
    <ScrollView
      ref={interalScrollViewRef}
      style={{
        flex: 1,
        ...additionalScrollViewStyles,
      }}
      contentContainerStyle={{
        minHeight: scrollViewContainerHeight,
      }}
      scrollEnabled={scrollingEnabled}
    >
      <View
        key='content'
        onLayout={(event) => {
          setContentHeight(event.nativeEvent.layout.height);
        }}
      >
        {contentComponent}
      </View>
      <Animated.View
        key='controls'
        style={
          scrollingEnabled
            ? {
                opacity: layoutReady ? controlsAnimatedOpacity : 0,
              }
            : {
                position: 'absolute',
                width: '100%',
                bottom: 0,
                opacity: layoutReady ? controlsAnimatedOpacity : 0,
              }
        }
        onLayout={(event: LayoutChangeEvent) => {
          setControlsHeight(event.nativeEvent.layout.height);
        }}
      >
        {controlsComponent}
      </Animated.View>
    </ScrollView>
  );
}
