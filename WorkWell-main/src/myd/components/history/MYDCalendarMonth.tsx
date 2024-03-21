import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Moment from 'moment';

import MasterStyles from '../../../styles/MasterStyles';
import { MYDProcessedHistory } from '../../types';
import { DAYS_OF_THE_WEEK } from '../../../constants/dateTime';
import MYDCalendarWeekdayColumn from './MYDCalendarWeekdayColumn';
import { YearCalendar, CalendarDay } from '../../../types';

// Images
const chevronLeft = require('../../../../assets/icons/general/chevronLeftRectangleBorder.png');
const chevronRight = require('../../../../assets/icons/general/chevronRightRectangleBorder.png');

type MYDCalendarMonthProps = {
  calendar: YearCalendar;
  currentYear: number;
  currentMonth: number;
  firstDayOfTheMonth: CalendarDay;
  currentlySelectedDay: number;
  onDaySelection: (dayIndex: number) => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  mydHistory: MYDProcessedHistory;
};

/**
 * Return a grid representing the current calendar month.
 */
export default function MYDCalendarMonth({
  calendar,
  currentYear,
  currentMonth,
  firstDayOfTheMonth,
  currentlySelectedDay,
  onDaySelection,
  mydHistory,
  goToPreviousMonth,
  goToNextMonth,
}: MYDCalendarMonthProps) {
  const [componentWidth, setComponentWidth] = useState(0);

  return (
    <View
      style={{ marginTop: 25, ...MasterStyles.common.horizontalMargins25 }}
      onLayout={(event) => setComponentWidth(event.nativeEvent.layout.width)}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={goToPreviousMonth}
          style={{
            flexBasis: componentWidth / 7,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Image source={chevronLeft} />
        </TouchableOpacity>
        <Text
          style={{
            ...MasterStyles.fontStyles.contentSubheader,
            flex: 1,
            textAlign: 'center',
          }}
        >
          {calendar[currentMonth].monthName} {currentYear}
        </Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          disabled={
            currentMonth === Moment().month() && currentYear === Moment().year()
          }
          style={{
            flexBasis: componentWidth / 7,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Image source={chevronRight} />
        </TouchableOpacity>
        {/* <Text style={MasterStyles.fontStyles.contentSubheader}>
          {calendar[currentMonth].monthName}
        </Text>
        <Text style={MasterStyles.fontStyles.contentSubheader}>
          {currentYear}
        </Text> */}
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        {Object.keys(DAYS_OF_THE_WEEK).map((dayOfWeek) =>
          MYDCalendarWeekdayColumn(
            calendar,
            currentYear,
            currentMonth,
            +dayOfWeek,
            firstDayOfTheMonth,
            currentlySelectedDay,
            onDaySelection,
            mydHistory
          )
        )}
      </View>
    </View>
  );
}
