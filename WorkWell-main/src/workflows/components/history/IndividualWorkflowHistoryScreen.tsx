import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import Moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

// Definitions
import { RootReduxType } from '../../../../config/configureStore';
import MasterStyles from '../../../styles/MasterStyles';
import { HomeStackRouteOptions } from '../../../main/navigators/HomeTabStackNavigator';
import { HistoryTabStackRouteOptions } from '../../../main/navigators/HistoryTabStackNavigator';

// Components
import GradientScreenTitle from '../../../components/GradientScreenTitle';
import WorkflowCalendarMonth from './WorkflowCalendarMonth';
import DailyHistoryReport from './DailyHistoryReport';

// Hooks
import useIndividualCollectionEngagementHistory from '../../hooks/useIndividualCollectionEngagementHistory';

// Redux
import {
  requestCollectionHistoryPDF,
  resetRequestCollectionHistoryPDF,
} from '../../redux/actionCreators/workflowEngagementHistory';
import ErrorMessage from '../../../components/modals/ErrorMessage';

// Images
const emailIcon = require('../../../../assets/icons/general/mail.png');

/**
 * This screen is displayed to users when they are reviewing their
 * engagement history for an individual workflow.
 */
export default function IndividualWorkflowHistoryScreen({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<
    HomeStackRouteOptions,
    'IndividualWorkflowHistory'
  >;
  route: RouteProp<
    HomeStackRouteOptions & HistoryTabStackRouteOptions,
    'IndividualWorkflowHistory'
  >;
}) {
  const entryOpacity = useRef(new Animated.Value(0)).current;

  const [currentMonth, setCurrentMonth] = useState(
    route.params.currentMonth ?? Moment().month()
  );
  const [currentYear, setCurrentYear] = useState(
    route.params.currentYear ?? Moment().year()
  );
  const [currentDay, setCurrentDay] = useState(
    route.params.currentDay ?? Moment().date() - 1
  );

  const collectionEngagementHistory = useIndividualCollectionEngagementHistory({
    workflowCollectionURL: route.params.workflowCollectionURL,
    year: currentYear,
    currentMonth,
  });

  const dispatch = useDispatch();
  const collectionName = useSelector(
    (state: RootReduxType) =>
      state.workflowHistory.collections?.find(
        (collection) =>
          collection.self_detail === route.params.workflowCollectionURL
      )?.name ?? ' '
  );

  const emailPDFStatus = useSelector(
    (state: RootReduxType) => state.workflowHistory.historyPDFEmailRequest
  );

  const firstDayOfTheMonth = useMemo(
    () =>
      collectionEngagementHistory.calendar[currentMonth].daysInMonth.find(
        (dayObject) => dayObject.dayIndex === 0
      ),
    [collectionEngagementHistory, currentMonth]
  );

  // Reset Workflow History on Component Mount
  useEffect(() => {
    Animated.timing(entryOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 1000,
      isInteraction: false,
      useNativeDriver: true,
    }).start();

    return () => {
      dispatch(resetRequestCollectionHistoryPDF());
    };
  }, []);

  const selectNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setCurrentDay(0);
  };

  const selectPreviousMonth = () => {
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
      <StatusBar
        barStyle='light-content'
        animated
        hidden={false}
        showHideTransition='fade'
      />
      <ErrorMessage stateSegmentOfInterest='workflowHistory' />
      <GradientScreenTitle
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.mermaidShade2,
          ],
        ]}
        positionSets={[{ start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }]}
        text='Practice History'
        subText={collectionName.toUpperCase()}
        icon='close'
        onIconPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {firstDayOfTheMonth ? (
          <>
            {WorkflowCalendarMonth({
              engagementHistory: collectionEngagementHistory,
              currentYear,
              currentMonth,
              firstDayOfTheMonth,
              currentlySelectedDay: currentDay,
              onDaySelection: setCurrentDay,
              goToNextMonth: selectNextMonth,
              goToPreviousMonth: selectPreviousMonth,
            })}
            <Animated.View
              style={{
                ...MasterStyles.common.horizontalPadding25,
                marginTop: 25,
                opacity: entryOpacity,
              }}
            >
              <View
                key='Date and Link to View All History'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <Text
                  style={{
                    ...MasterStyles.fontStyles.contentHeaderDark,
                    color: MasterStyles.officialColors.graphite,
                    fontWeight: '700',
                  }}
                >
                  {collectionEngagementHistory.calendar[currentMonth].monthName}{' '}
                  {currentDay + 1}
                </Text>
                <TouchableOpacity
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                  }}
                  onPress={() =>
                    dispatch(
                      requestCollectionHistoryPDF({
                        workflowCollectionURL:
                          route.params.workflowCollectionURL,
                      })
                    )
                  }
                  disabled={emailPDFStatus === 'completed'}
                >
                  <Text
                    style={{
                      ...MasterStyles.fontStyles.detailSemiBold,
                      color: MasterStyles.officialColors.mermaidShade3,
                    }}
                  >
                    {emailPDFStatus === 'completed'
                      ? 'EMAIL REQUESTED'
                      : 'EMAIL HISTORY'}
                  </Text>
                  <Image
                    source={emailIcon}
                    style={{
                      tintColor: MasterStyles.officialColors.mermaidShade3,
                      height: 25,
                      width: 25,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                key='divider'
                style={{
                  height: 1,
                  backgroundColor: MasterStyles.officialColors.cloudy,
                }}
              />
              {DailyHistoryReport({
                currentMonth,
                currentDay,
                collectionEngagementHistory,
              })}
            </Animated.View>
          </>
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
}
