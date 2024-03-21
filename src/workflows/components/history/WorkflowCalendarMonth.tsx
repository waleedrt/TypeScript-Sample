import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Moment from 'moment';

// Definitions
import MasterStyles from '../../../styles/MasterStyles';
import { DAYS_OF_THE_WEEK } from '../../../constants/dateTime';
import { YearCalendar, CalendarDay } from '../../../types';

// Components
import WorkflowCalendarWeekdayColumn from './WorkflowCalendarWeekdayColumn';
import { useSelector } from 'react-redux';
import { RootReduxType } from '../../../../config/configureStore';

// Images
const chevronLeft = require('../../../../assets/icons/general/chevronLeftRectangleBorder.png');
const chevronRight = require('../../../../assets/icons/general/chevronRightRectangleBorder.png');

type WorkflowCalendarMonthProps = {
  engagementHistory: { calendar: YearCalendar; dataProcessed: boolean };
  currentYear: number;
  currentMonth: number;
  firstDayOfTheMonth: CalendarDay;
  currentlySelectedDay: number;
  onDaySelection: (dayIndex: number) => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
};

/**
 * Return a grid representing the current calendar month.
 */
export default function WorkflowCalendarMonth({
  engagementHistory,
  currentYear,
  currentMonth,
  firstDayOfTheMonth,
  currentlySelectedDay,
  onDaySelection,
  goToNextMonth,
  goToPreviousMonth,
}: WorkflowCalendarMonthProps) {
  const [componentWidth, setComponentWidth] = useState(0);

  const pendingActions = useSelector(
    (state: RootReduxType) => state.workflowHistory.pendingActions
  );

  return (
    <View
      style={{ marginTop: 25, ...MasterStyles.common.horizontalMargins25 }}
      onLayout={(event) => setComponentWidth(event.nativeEvent.layout.width)}
    >
      <View
        key='controls'
        style={{
          display: componentWidth ? 'flex' : 'none',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          hitSlop={{ bottom: 10, top: 10 }}
          onPress={goToPreviousMonth}
          disabled={pendingActions.length !== 0}
          style={{
            flexBasis: componentWidth / 7,
            display: 'flex',
            alignItems: 'center',
            opacity: pendingActions.length ? 0.5 : 1,
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
          {engagementHistory.calendar[currentMonth].monthName} {currentYear}
        </Text>
        <TouchableOpacity
          hitSlop={{ bottom: 10, top: 10 }}
          onPress={goToNextMonth}
          disabled={
            (currentMonth === Moment().month() &&
              currentYear === Moment().year()) ||
            pendingActions.length !== 0
          }
          style={{
            flexBasis: componentWidth / 7,
            display: 'flex',
            alignItems: 'center',
            opacity: pendingActions.length ? 0.5 : 1,
          }}
        >
          <Image source={chevronRight} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: componentWidth ? 'flex' : 'none',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        {Object.keys(DAYS_OF_THE_WEEK).map((dayOfWeek) =>
          WorkflowCalendarWeekdayColumn({
            engagementHistory,
            currentYear,
            currentMonth,
            weekdayIndex: +dayOfWeek,
            firstDayOfTheMonth,
            currentlySelectedDay,
            onDaySelection,
          })
        )}
      </View>
    </View>
  );
}
