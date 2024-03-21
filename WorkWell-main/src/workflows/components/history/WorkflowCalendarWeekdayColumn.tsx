import React, { useState, useRef, useEffect, useReducer } from 'react';
import { View, Text, Animated, LayoutChangeEvent } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Moment from 'moment';

import MasterStyles from '../../../styles/MasterStyles';
import { DAYS_OF_THE_WEEK } from '../../../constants/dateTime';
import IndividualWorkflowCalendarDay from './IndividualWorkflowCalendarDay';
import { YearCalendar, CalendarDay } from '../../../types';
import WorkflowsCalendarDay from './WorkflowsCalendarDay';
import useMYDHistory from '../../../myd/hooks/useMYDHistory';

type WorkflowCalendarWeekdayColumnProps = {
  engagementHistory: { calendar: YearCalendar; dataProcessed: boolean };
  currentYear: number;
  currentMonth: number; // Test 3
  weekdayIndex: number;
  firstDayOfTheMonth: CalendarDay;
  currentlySelectedDay: number;
  onDaySelection: (dayIndex: number) => void;
};

/**
 * Generate a single "weekday" column for the calendar grid.
 */
export default function WorkflowCalendarWeekdayColumn({
  engagementHistory,
  currentYear,
  currentMonth,
  weekdayIndex,
  firstDayOfTheMonth,
  currentlySelectedDay,
  onDaySelection,
}: WorkflowCalendarWeekdayColumnProps) {
  // Grab MYD History as that is needed for HistoryOverviewScreen
  const MYDHistory = useMYDHistory();

  /**
   * We don't know ahead of time how much width each
   * column, so we store the value here after initial
   * component layout.
   */
  const [columnWidth, setColumnWidth] = useState(0);

  const fadeInAnimation = useRef(new Animated.Value(0)).current;

  const route = useRoute();

  // Fade-In column after width is determined.
  useEffect(() => {
    if (columnWidth)
      Animated.timing(fadeInAnimation, {
        toValue: 1,
        duration: 1000,
        delay: weekdayIndex * 100,
        useNativeDriver: true,
      }).start();
  }, [columnWidth]);

  // Extract all CalendarDay objects for the specified weekday
  // into an array.
  let dayObjectsForWeekday = engagementHistory.calendar[
    currentMonth
  ].daysInMonth.filter((dayObject) => dayObject.dayOfWeek === weekdayIndex);

  const DayComponentToUse =
    route.name === 'IndividualWorkflowHistory'
      ? IndividualWorkflowCalendarDay
      : WorkflowsCalendarDay;

  /**
   * Insert deformed CalendarDay objects into the array
   * to account for members calendar rows which come before
   * the first day of the month.
   *
   * There may be better ways to do this.
   */
  if (dayObjectsForWeekday[0].dayOfWeek < firstDayOfTheMonth!.dayOfWeek) {
    dayObjectsForWeekday = [
      { dayOfWeek: weekdayIndex, engagements: [] },
      ...dayObjectsForWeekday,
    ];
  }

  return (
    <View style={{ flex: 1 }} key={weekdayIndex}>
      <View
        key='Day of the Weeker Header'
        style={{
          borderBottomWidth: 1,
          borderBottomColor: MasterStyles.officialColors.cloudy,
          borderStyle: 'solid',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            ...MasterStyles.fontStyles.generalContentDarkInfoHighlight,
            color: MasterStyles.officialColors.graphite,
          }}
        >
          {DAYS_OF_THE_WEEK[weekdayIndex]}
        </Text>
      </View>

      <Animated.View
        key='Individual Calendar Day Buttons'
        style={{
          display: 'flex',
          alignItems: 'center',
          opacity: fadeInAnimation,
        }}
        onLayout={(event: LayoutChangeEvent) => {
          if (columnWidth !== event.nativeEvent.layout.width) {
            setColumnWidth(event.nativeEvent.layout.width);
          }
        }}
      >
        {/* Generate Day Component for each member of the column. */}
        {dayObjectsForWeekday.map((dayObject, index) => (
          <DayComponentToUse
            key={`${dayObject.dayOfWeek},${index}`}
            dayObject={dayObject}
            allEngagementDataProcessed={engagementHistory.dataProcessed}
            MYDData={
              typeof dayObject.dayIndex !== 'undefined' &&
              MYDHistory[
                Moment(
                  `${currentYear}-${currentMonth + 1}-${
                    dayObject.dayIndex + 1
                  }`,
                  'YYYY-MM-DD'
                ).format('YYYY-MM-DD')
              ]
                ? true
                : false
            }
            currentlySelectedDay={currentlySelectedDay}
            onDaySelection={onDaySelection}
            availableWidth={columnWidth}
          />
        ))}
      </Animated.View>
    </View>
  );
}
