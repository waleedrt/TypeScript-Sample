import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import Moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

// Definitions
import MasterStyles from '../../../styles/MasterStyles';

// Components
import GradientScreenTitle from '../../../components/GradientScreenTitle';
import WorkflowCalendarMonth from './WorkflowCalendarMonth';

// Hooks
import useAllCollectionsEngagementHistory from '../../hooks/useAllCollectionsEngagementHistory';

// Redux
import {
  loadWorkflowCollectionsEngagementHistory,
  clearWorkflowHistoryForAllCollections,
} from '../../redux/actionCreators';
import ErrorMessage from '../../../components/modals/ErrorMessage';
import { RootReduxType } from '../../../../config/configureStore';
import AllCollectionsDailyHistoryReport from './AllCollectionsDailyHistoryReport';
import { loadMYDHistory } from '../../../myd/actionCreators';

/**
 * This screen is displayed to users when they are reviewing their
 * engagement history for ALL activity workflow collections and MYD.
 */
export default function HistoryOverviewScreen() {
  const [currentMonth, setCurrentMonth] = useState(Moment().month());
  const [currentYear, setCurrentYear] = useState(Moment().year());
  const [currentDay, setCurrentDay] = useState(Moment().date() - 1);

  const oAuthTokenStatus = useSelector((state: RootReduxType) => {
    return state.auth.tokens.status;
  });

  const engagementHistory = useAllCollectionsEngagementHistory(currentYear);

  const firstDayOfTheMonth = useMemo(
    () =>
      engagementHistory.calendar[currentMonth].daysInMonth.find(
        (dayObject) => dayObject.dayIndex === 0
      ),
    [engagementHistory, currentMonth]
  );

  const dispatch = useDispatch();
  const componentFocused = useIsFocused();

  // Stuff to do when screen gains/loses focus.
  useFocusEffect(
    useCallback(() => {
      dispatch(clearWorkflowHistoryForAllCollections());
      if (oAuthTokenStatus !== 'Received') {
        console.log('WAITING: Workflows History Screen');
      } else {
        console.log('DONE WAITING: Workflows History Screen');

        // Loading MYD this way causes a lot of unnecessary reload.
        // Possible area for optimization.
        dispatch(loadMYDHistory());
        dispatch(
          loadWorkflowCollectionsEngagementHistory({
            startDateTime: Moment()
              .year(currentYear)
              .month(currentMonth)
              .startOf('month')
              .format(),
            endDateTime: Moment()
              .year(currentYear)
              .month(currentMonth + 1)
              .startOf('month')
              .format(),
          })
        );
      }
    }, [oAuthTokenStatus, currentYear, currentMonth])
  );

  const selectNextMonth = () => {
    dispatch(clearWorkflowHistoryForAllCollections());
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }

    setCurrentDay(0);
  };

  const selectPreviousMonth = () => {
    dispatch(clearWorkflowHistoryForAllCollections());
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }

    setCurrentDay(0);
  };

  return (
    <View style={{ flex: 1 }}>
      <ErrorMessage stateSegmentOfInterest='workflowHistory' />
      <StatusBar barStyle='light-content' animated />
      <GradientScreenTitle
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.mermaidShade2,
          ],
        ]}
        positionSets={[{ start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }]}
        text='History'
      />
      <ScrollView
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {firstDayOfTheMonth && componentFocused ? (
          <>
            <WorkflowCalendarMonth
              engagementHistory={engagementHistory}
              currentYear={currentYear}
              currentMonth={currentMonth}
              firstDayOfTheMonth={firstDayOfTheMonth}
              currentlySelectedDay={currentDay}
              onDaySelection={setCurrentDay}
              goToNextMonth={selectNextMonth}
              goToPreviousMonth={selectPreviousMonth}
            />
            <AllCollectionsDailyHistoryReport
              collectionEngagementHistory={engagementHistory}
              currentYear={currentYear}
              currentMonth={currentMonth}
              currentDay={currentDay}
            />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
