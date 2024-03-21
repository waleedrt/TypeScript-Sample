import React, { useRef, useEffect, useState } from 'react';
import { TouchableOpacity, Text, Platform, Animated } from 'react-native';

import MasterStyles from '../../../styles/MasterStyles';
import { CalendarDay } from '../../../types';

type IndividualWorkflowCalendarDayProps = {
  dayObject: CalendarDay;
  allEngagementDataProcessed: boolean;
  currentlySelectedDay: number;
  onDaySelection: (dayIndex: number) => void;
  availableWidth: number;
};

/**
 * Renders the individual "day" circles for individual workflow history
 * screens.
 *
 * NOTE: We are NOT able to use hooks here because a variable number of
 * this components are rendered depending on the days of the month and
 * when the number of render components changes, so does the order of
 * hook evaluations which throws an error.
 */
export default function IndividualWorkflowCalendarDay({
  dayObject,
  allEngagementDataProcessed,
  currentlySelectedDay,
  onDaySelection,
  availableWidth,
}: IndividualWorkflowCalendarDayProps) {
  const loadingIndicatorAnimationValue = useRef(new Animated.Value(0)).current;
  const engagementIndicatorAnimationValue = useRef(new Animated.Value(0))
    .current;
  const [loadingAnimationComplete, setLoadingAnimationComplete] = useState(
    false
  );

  useEffect(() => {
    return () => {
      loadingIndicatorAnimationValue.stopAnimation();
      engagementIndicatorAnimationValue.stopAnimation();
    };
  }, []);

  useEffect(() => {
    if (!allEngagementDataProcessed) {
      engagementIndicatorAnimationValue.setValue(0);
      setLoadingAnimationComplete(false);
      Animated.sequence([
        Animated.timing(loadingIndicatorAnimationValue, {
          delay: loadingAnimationComplete ? 0 : dayObject.dayOfWeek * 100,
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          isInteraction: true,
        }),
        Animated.timing(loadingIndicatorAnimationValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          isInteraction: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setLoadingAnimationComplete(true);
      });
    }

    if (allEngagementDataProcessed && loadingAnimationComplete) {
      if (dayObject.engagements.length) {
        loadingIndicatorAnimationValue.setValue(0);
        Animated.timing(engagementIndicatorAnimationValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          isInteraction: false,
        }).start();
      }
    }
  }, [allEngagementDataProcessed, loadingAnimationComplete]);

  const renderLoadingIndicator = () => {
    return (
      <Animated.View
        style={{
          width: availableWidth / 4,
          height: availableWidth / 4,
          backgroundColor:
            dayObject.dayIndex === currentlySelectedDay
              ? 'white'
              : MasterStyles.officialColors.cloudy,
          borderRadius: availableWidth / 8,
          position: 'absolute',
          top: 0,
          right: 0,
          opacity:
            typeof dayObject.dayIndex !== 'undefined'
              ? loadingIndicatorAnimationValue
              : 0,
        }}
      />
    );
  };

  const renderEngagementIndicator = () => {
    if (dayObject.engagements.length)
      return (
        <Animated.View
          style={{
            width: availableWidth / 4,
            height: availableWidth / 4,
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor:
              dayObject.dayIndex === currentlySelectedDay
                ? 'white'
                : MasterStyles.officialColors.mermaidShade1,
            borderWidth: 1,
            borderColor: MasterStyles.officialColors.mermaidShade1,
            borderRadius: availableWidth / 8,
            opacity: engagementIndicatorAnimationValue,
          }}
        />
      );
  };

  return (
    <TouchableOpacity
      style={[
        {
          height: availableWidth - 7,
          width: availableWidth - 7,
          backgroundColor:
            typeof dayObject.dayIndex === 'undefined'
              ? 'white'
              : dayObject.dayIndex === currentlySelectedDay
              ? MasterStyles.officialColors.mermaidShade1
              : MasterStyles.officialColors.dirtySnow,
          display: availableWidth ? 'flex' : 'none',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: (availableWidth - 7) / 2,
          marginTop: 8,
        },
      ]}
      disabled={typeof dayObject.dayIndex === 'undefined'}
      onPress={() => onDaySelection(dayObject.dayIndex!)}
    >
      {typeof dayObject.dayIndex !== 'undefined' ? (
        <>
          <Text
            style={{
              ...MasterStyles.fontStyles.generalContentDarkInfoHighlight,
              color:
                dayObject.dayIndex === currentlySelectedDay
                  ? 'white'
                  : MasterStyles.officialColors.density,
            }}
          >
            {dayObject.dayIndex + 1}
          </Text>
        </>
      ) : null}

      {allEngagementDataProcessed && loadingAnimationComplete
        ? renderEngagementIndicator()
        : renderLoadingIndicator()}
    </TouchableOpacity>
  );
}
