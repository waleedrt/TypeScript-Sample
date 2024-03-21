import React from 'react';
import { View, Text } from 'react-native';

import MasterStyles from '../../../styles/MasterStyles';
import { MYDProcessedHistory } from '../../types';
import { DAYS_OF_THE_WEEK } from '../../../constants/dateTime';
import MYDCalendarDay from './MYDCalendarDay';
import { YearCalendar, CalendarDay } from '../../../types';

/**
 * Generate a single "weekday" column for the calendar grid.
 */
export default function MYDCalendarWeekdayColumn(
  calendar: YearCalendar,
  currentYear: number,
  currentMonth: number,
  weekdayIndex: number,
  firstDayOfTheMonth: CalendarDay,
  currentlySelectedDay: number,
  onDaySelection: (dayIndex: number) => void,
  mydHistory: MYDProcessedHistory
) {
  let dayObjectsForWeekday = calendar[currentMonth].daysInMonth.filter(
    (dayObject) => dayObject.dayOfWeek === weekdayIndex
  );

  if (dayObjectsForWeekday[0].dayOfWeek < firstDayOfTheMonth!.dayOfWeek) {
    dayObjectsForWeekday = [
      { dayIndex: null, dayOfWeek: weekdayIndex },
      ...dayObjectsForWeekday,
    ];
  }

  return (
    <View style={{ flex: 1 }} key={weekdayIndex}>
      {/* Day of the Week Header */}
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: MasterStyles.officialColors.cloudy,
          borderStyle: 'solid',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: MasterStyles.officialColors.graphite,
          }}
        >
          {DAYS_OF_THE_WEEK[weekdayIndex]}
        </Text>
      </View>
      {/* Individual Calendar Buttons */}
      <View style={{ display: 'flex', alignItems: 'center' }}>
        {dayObjectsForWeekday.map((dayObject) =>
          MYDCalendarDay(
            currentYear,
            currentMonth,
            dayObject,
            currentlySelectedDay,
            onDaySelection,
            mydHistory
          )
        )}
      </View>
    </View>
  );
}
