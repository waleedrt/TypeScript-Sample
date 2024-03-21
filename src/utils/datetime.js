/**
 * Utility functions for dealing with dates and times.
 */
import moment from 'moment';

/**
 * Generate all the possible time values (1pm, 1:15pm, 1:30pm, 1:45pm, etc)
 * in 15 minute increments.
 */
export function generateTime15MinuteIncrements() {
  const createTime = (h, m) => {
    const locale = 'en';
    moment.locale(locale);
    return moment({ hour: h, minute: m });
  };

  const times = [];
  for (let hour = 0; hour < 24; hour += 1) {
    times.push(createTime(hour, 0));
    times.push(createTime(hour, 15));
    times.push(createTime(hour, 30));
    times.push(createTime(hour, 45));
  }

  return times;
}
