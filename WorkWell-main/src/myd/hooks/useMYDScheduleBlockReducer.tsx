import { useReducer } from 'react';

type ScheduleActionType = {
  type: 'setStartTime' | 'setEndTime';
  scheduleBlock: string;
  time: string;
};

// NOTE: We don't use the type defined in index.ts
// because scheduleBlock is rendered as schedule_block by
// the Python API
type JavascriptMYDEnrollmentScheduleBlock = {
  scheduleBlock: string;
  start: string;
  end: string;
};

type ScheduleBlockStateType = {
  [key: string]: JavascriptMYDEnrollmentScheduleBlock;
  Morning: JavascriptMYDEnrollmentScheduleBlock;
  Afternoon: JavascriptMYDEnrollmentScheduleBlock;
  'End of day': JavascriptMYDEnrollmentScheduleBlock;
};

const scheduleReducer = (
  state: ScheduleBlockStateType,
  { type, scheduleBlock, time }: ScheduleActionType
) => {
  switch (type) {
    case 'setStartTime':
      return {
        ...state,
        [scheduleBlock]: { ...state[scheduleBlock], start: time }
      };
    case 'setEndTime':
      return {
        ...state,
        [scheduleBlock]: { ...state[scheduleBlock], end: time }
      };
    default:
      throw new Error();
  }
};

/**
 * A custom hook for managing a given user's unique
 * MYD schedule block definitions.
 */
export default function useMYDScheduleBlockReducer() {
  return useReducer(scheduleReducer, {
    Morning: {
      scheduleBlock: 'Morning',
      start: '08:00:00',
      end: '12:00:00'
    },
    Afternoon: {
      scheduleBlock: 'Afternoon',
      start: '12:00:00',
      end: '16:00:00'
    },
    'End of day': {
      scheduleBlock: 'End of day',
      start: '16:00:00',
      end: '18:00:00'
    }
  });
}
