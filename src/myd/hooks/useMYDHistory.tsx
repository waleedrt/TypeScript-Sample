import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Moment from 'moment';
import { RootReduxType } from '../../../config/configureStore';
import {
  MYDHistoryDailyReflectionEntry,
  MYDHistoryDailyAverageWellbeingEntry,
  MYDProcessedHistory
} from '../types';

/**
 * Custom hook to extract and transform MYD History
 * data from the Redux store.
 */
export default function useMYDHistory() {
  const rawMYDHistoryFromCUP = useSelector(
    (state: RootReduxType) => state.myd.participantHistory
  );

  const mydHistory = useMemo(
    () =>
      rawMYDHistoryFromCUP.reduce(
        (MYDHistoryByDate: MYDProcessedHistory, currentCUPEntry) => {
          const dataAttributesofInterest =
            currentCUPEntry.datagroups[0].subgroups;

          const dailyAverageWellbeingSubgroup = dataAttributesofInterest.find(
            attribute => attribute.code === 'daily_average_wellbeing'
          ) as MYDHistoryDailyAverageWellbeingEntry;

          const dailyReflectionSubgroup = dataAttributesofInterest.find(
            attribute => attribute.code === 'daily_reflection'
          ) as MYDHistoryDailyReflectionEntry;

          const formattedEntryData = {
            averageWellbeing: dailyAverageWellbeingSubgroup
              ? dailyAverageWellbeingSubgroup.data
              : null,
            negativeEvent: dailyReflectionSubgroup
              ? dailyReflectionSubgroup.data.negative
              : null,
            positiveEvent: dailyReflectionSubgroup
              ? dailyReflectionSubgroup.data.positive
              : null
          };

          MYDHistoryByDate[
            Moment(currentCUPEntry['start'])
              .format('YYYY-MM-DD')
              .toString()
          ] = formattedEntryData;
          return MYDHistoryByDate;
        },
        {}
      ),
    [rawMYDHistoryFromCUP]
  );

  return mydHistory;
}
