import React, { useRef, useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  View,
  InteractionManager,
} from 'react-native';

import MasterStyles from '../../../styles/MasterStyles';
import { CalendarDay } from '../../../types';

type WorkflowsCalendarDayProps = {
  dayObject: CalendarDay;
  allEngagementDataProcessed: boolean;
  MYDData?: boolean;
  currentlySelectedDay: number;
  onDaySelection: (dayIndex: number) => void;
  availableWidth: number;
};

export default function WorkflowsCalendarDay({
  dayObject,
  allEngagementDataProcessed,
  MYDData = false,
  currentlySelectedDay,
  onDaySelection,
  availableWidth,
}: WorkflowsCalendarDayProps) {
  const loadingAnimationValue = useRef(new Animated.Value(0)).current;
  const engagementsAnimationValue = useRef(new Animated.Value(0)).current;
  const [loadingAnimationComplete, setLoadingAnimationComplete] = useState(
    false
  );

  useEffect(() => {
    if (!allEngagementDataProcessed) {
      setLoadingAnimationComplete(false);
      engagementsAnimationValue.setValue(0);
      Animated.sequence([
        Animated.timing(loadingAnimationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          isInteraction: true,
        }),
        Animated.timing(loadingAnimationValue, {
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
      loadingAnimationValue.setValue(0);

      /**
       * Running after interactions results in having
       * all of the day animations in sync.
       */
      InteractionManager.runAfterInteractions(() =>
        Animated.timing(engagementsAnimationValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start()
      );
    }
  }, [allEngagementDataProcessed, loadingAnimationComplete]);

  const renderDayNumeral = () =>
    typeof dayObject.dayIndex !== 'undefined' && (
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
    );

  const renderDayWhileProcessingData = () => (
    <View
      style={[
        {
          height: '100%',
          width: '100%',
          backgroundColor:
            dayObject.dayIndex === currentlySelectedDay
              ? MasterStyles.officialColors.mermaidShade1
              : typeof dayObject.dayIndex === 'undefined'
              ? 'white'
              : MasterStyles.officialColors.dirtySnow,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: (availableWidth - 7) / 2,
        },
      ]}
    >
      <Animated.View
        key='animatedOverlay'
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          opacity: loadingAnimationValue,
          borderRadius: (availableWidth - 7) / 2,
          borderWidth: typeof dayObject.dayIndex !== 'undefined' ? 1 : 0,
          borderColor: MasterStyles.officialColors.density,
        }}
      />
      {renderDayNumeral()}
    </View>
  );

  const renderDayWithEngagements = () => (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor:
          dayObject.dayIndex === currentlySelectedDay
            ? MasterStyles.officialColors.mermaidShade1
            : MasterStyles.officialColors.dirtySnow,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: (availableWidth - 7) / 2,
      }}
    >
      <Animated.View
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          opacity: engagementsAnimationValue,
          backgroundColor:
            dayObject.dayIndex === currentlySelectedDay
              ? MasterStyles.officialColors.mermaidShade1
              : MasterStyles.colors.white,
          borderWidth: 1,
          borderColor: MasterStyles.officialColors.mermaidShade2,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: (availableWidth - 7) / 2,
        }}
      />
      {renderDayNumeral()}
    </View>
  );

  const renderDayWithoutEngagements = () => (
    <View
      style={[
        {
          height: '100%',
          width: '100%',
          backgroundColor:
            typeof dayObject.dayIndex === 'undefined'
              ? 'white'
              : dayObject.dayIndex === currentlySelectedDay
              ? MasterStyles.officialColors.mermaidShade1
              : MasterStyles.officialColors.dirtySnow,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: (availableWidth - 7) / 2,
        },
      ]}
    >
      {renderDayNumeral()}
    </View>
  );

  return (
    <TouchableOpacity
      disabled={typeof dayObject.dayIndex === 'undefined'}
      onPress={() => onDaySelection(dayObject.dayIndex!)}
      style={[
        {
          height: availableWidth - 7,
          width: availableWidth - 7,
          display: availableWidth ? 'flex' : 'none',
          marginTop: 8,
        },
      ]}
    >
      {allEngagementDataProcessed && loadingAnimationComplete
        ? dayObject.engagements.length || MYDData
          ? renderDayWithEngagements()
          : renderDayWithoutEngagements()
        : renderDayWhileProcessingData()}
    </TouchableOpacity>
  );
}
