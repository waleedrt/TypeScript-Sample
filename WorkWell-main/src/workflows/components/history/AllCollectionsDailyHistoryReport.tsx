import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, InteractionManager } from 'react-native';
import Moment from 'moment';

import MasterStyles from '../../../styles/MasterStyles';
import { YearCalendar } from '../../../types';
import HistoryWorkflowCollectionCard from './HistoryWorkflowCollectionCard';
import useMYDHistory from '../../../myd/hooks/useMYDHistory';
import HistoryMYDCard from './HistoryMYDCard';

type AllCollectionsDailyHistoryReportProps = {
  /** 4 Digit Year, ex. 2020 */
  currentYear: number;
  /** Zero Indexed Current Month */
  currentMonth: number;
  /** Zero Indexed Current Day */
  currentDay: number;
  collectionEngagementHistory: {
    calendar: YearCalendar;
    dataProcessed: boolean;
  };
};

/**
 * Display all Workflow Collections (and MYD) that
 * are completed on a given day.
 */
export default function AllCollectionsDailyHistoryReport({
  currentYear,
  currentMonth,
  currentDay,
  collectionEngagementHistory,
}: AllCollectionsDailyHistoryReportProps) {
  const entryHeaderOpacity = useRef(new Animated.Value(0)).current;
  const entryOpacity = useRef(new Animated.Value(0)).current;

  // Get a list of unique collection URIs completed on the currently selected day.
  const uniqueCollectionEngagementsForDay = [
    ...new Set(
      collectionEngagementHistory.calendar[currentMonth].daysInMonth[
        currentDay
      ].engagements.map((engagement) => engagement.collection)
    ),
  ];

  // Does the user have MYD data for currently selected day?
  const MYDHistoryForCurrentDay = useMYDHistory()[
    Moment(
      `${currentYear}-${currentMonth + 1}-${currentDay + 1}`,
      'YYYY-MM-DD'
    ).format('YYYY-MM-DD')
  ];

  useEffect(() => {
    if (collectionEngagementHistory.dataProcessed) {
      InteractionManager.runAfterInteractions(() =>
        Animated.timing(entryOpacity, {
          toValue: 1,
          duration: 1000,
          isInteraction: false,
          useNativeDriver: true,
        }).start()
      );
    } else {
      entryOpacity.setValue(0);
    }
  }, [collectionEngagementHistory.dataProcessed]);

  return (
    <Animated.View
      onLayout={() =>
        Animated.timing(entryHeaderOpacity, {
          toValue: 1,
          duration: 1000,
          isInteraction: false,
          useNativeDriver: true,
        }).start()
      }
      style={{
        ...MasterStyles.common.horizontalPadding25,
        opacity: entryHeaderOpacity,
      }}
    >
      <View
        key='Date and Link to View All History'
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 25,
        }}
      >
        <Text style={MasterStyles.fontStyles.contentHeaderDark}>
          {collectionEngagementHistory.calendar[currentMonth].monthName}{' '}
          {currentDay + 1}
        </Text>
        {/* <Text
          style={{
            ...MasterStyles.fontStyles.generalContentInfoHighlightRegular,
            color: MasterStyles.officialColors.mermaidShade3,
          }}
        >
          View Journal Logs &gt;
        </Text> */}
      </View>
      <View
        key='divider'
        style={{
          height: 1,
          backgroundColor: MasterStyles.officialColors.cloudy,
        }}
      />
      <Animated.View
        key='All Workflows Collections with Engagments for Today + MYD'
        style={{
          paddingTop: 25,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          display: collectionEngagementHistory.dataProcessed ? 'flex' : 'none',
          opacity: entryOpacity,
        }}
      >
        {/* const entryHeaderOpacity = useRef(new Animated.Value(0)).current; */}
        {MYDHistoryForCurrentDay || uniqueCollectionEngagementsForDay.length ? (
          <>
            {MYDHistoryForCurrentDay && (
              <HistoryMYDCard
                currentYear={currentYear}
                currentMonth={currentMonth}
                currentDay={currentDay}
                randomizer={Math.random() * 1}
              />
            )}
            {uniqueCollectionEngagementsForDay.length
              ? uniqueCollectionEngagementsForDay.map((engagement, index) => (
                  <HistoryWorkflowCollectionCard
                    workflowCollectionURI={engagement}
                    currentYear={currentYear}
                    currentMonth={currentMonth}
                    currentDay={currentDay}
                    layoutIndex={MYDHistoryForCurrentDay ? index + 1 : index}
                    randomizer={Math.random() * (index + 1)}
                    key={index}
                  />
                ))
              : null}
          </>
        ) : (
          <View key='engagementsCompleted'>
            <Text style={MasterStyles.fontStyles.contentMinorheader}>
              You did not complete any activities on this date.
            </Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}
