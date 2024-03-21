import { useMemo } from 'react';
import moment from 'moment';
import { YearCalendar } from '../types';

/**
 * A custom hook which generates a object from which you
 * can extract various pieces of information for each
 * month and/or day for the specified year. useMemo is used
 * here to eliminiate unnecessary invocations.
 */
export default function useCalendarGenerator(year: number) {
  return useMemo(() => {
    const calendar: YearCalendar = {
      0: {
        monthName: 'January',
        daysInMonth: [],
      },
      1: {
        monthName: 'February',
        daysInMonth: [],
      },
      2: { monthName: 'March', daysInMonth: [] },
      3: { monthName: 'April', daysInMonth: [] },
      4: { monthName: 'May', daysInMonth: [] },
      5: { monthName: 'June', daysInMonth: [] },
      6: { monthName: 'July', daysInMonth: [] },
      7: { monthName: 'August', daysInMonth: [] },
      8: { monthName: 'September', daysInMonth: [] },
      9: { monthName: 'October', daysInMonth: [] },
      10: { monthName: 'November', daysInMonth: [] },
      11: { monthName: 'December', daysInMonth: [] },
    };

    Object.entries(calendar).forEach(([key, value]) => {
      const momentObject = moment().year(year).month(key);

      // Determine how many days there are in the current month
      const numberOfDaysInMonth = momentObject.daysInMonth();

      // For each day in the month, we want to add an entry to
      // value.daysInMonth
      [...Array(numberOfDaysInMonth).keys()].forEach((dayIndex) =>
        value.daysInMonth.push({
          dayIndex,
          dayOfWeek: momentObject.date(dayIndex + 1).weekday(),
          engagements: [],
        })
      );
    });
    return calendar;
  }, [year]);
}
