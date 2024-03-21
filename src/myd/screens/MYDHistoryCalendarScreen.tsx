import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import Carousel from 'react-native-snap-carousel';
import Moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';

// Definitions
import MasterStyles from '../../styles/MasterStyles';
import { HomeStackRouteOptions } from '../../main/navigators/HomeTabStackNavigator';
import { CalendarDay } from '../../types';
import { RootReduxType } from '../../../config/configureStore';

// Components
import GradientScreenTitle from '../../components/GradientScreenTitle';
import MYDCalendarMonth from '../components/history/MYDCalendarMonth';
import ErrorMessage from '../../components/modals/ErrorMessage';

// Hooks
import useCalendarGenerator from '../../hooks/useCalendarGenerator';
import useMYDHistory from '../hooks/useMYDHistory';
import { RouteProp } from '@react-navigation/native';
import { HistoryTabStackRouteOptions } from '../../main/navigators/HistoryTabStackNavigator';
import { LibraryStackRouteOptions } from '../../main/navigators/LibraryTabStackNavigator';
import { UserProfileStackRouteOptions } from '../../main/navigators/UserProfileStackNavigator';
import { requestMYDHistoryPDF } from '../actionCreators';

// Images
const happySymbol = require('../../../assets/myd/symbols/happy.png');
const neutralSymbol = require('../../../assets/myd/symbols/neutral.png');
const sadSymbol = require('../../../assets/myd/symbols/sad.png');
const emailIcon = require('../../../assets/icons/general/mail.png');

const deviceWidth = Dimensions.get('window').width;

function MYDHistoryCalendarScreen({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<HomeStackRouteOptions, 'MYDHistoryCalendar'>;
  route: RouteProp<
    HomeStackRouteOptions &
      HistoryTabStackRouteOptions &
      LibraryStackRouteOptions &
      UserProfileStackRouteOptions,
    'MYDHistoryCalendar'
  >;
}) {
  // Carousel Stuff
  const carouselRef = useRef(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const [currentMonth, setCurrentMonth] = useState(
    route.params?.currentMonth ?? Moment().month()
  );
  const [currentYear, setCurrentYear] = useState(
    route.params?.currentYear ?? Moment().year()
  );
  const [currentDay, setCurrentDay] = useState(
    route.params?.currentDay ?? Moment().date() - 1
  );
  const calendar = useCalendarGenerator(currentYear);
  const MYDHistory = useMYDHistory();

  const firstDayOfTheMonth = useMemo(
    () =>
      calendar[currentMonth].daysInMonth.find(
        (dayObject) => dayObject.dayIndex === 0
      ),
    [calendar, currentMonth]
  );

  const dispatch = useDispatch();
  const emailPDFStatus = useSelector(
    (state: RootReduxType) => state.myd.historyPDFEmailRequest
  );

  useEffect(() => {
    if (currentDay !== currentCarouselIndex && carouselRef.current) {
      // @ts-ignore
      carouselRef.current.snapToItem(currentDay);
    }
  }, [currentDay, currentCarouselIndex]);

  const renderCalendarEntry = ({ item }: { item: CalendarDay }) => {
    const fullDate = Moment(
      `${currentYear}-${currentMonth + 1}-${item.dayIndex + 1}`,
      'YYYY-MM-DD'
    ).format('YYYY-MM-DD');

    let image = null;
    if (MYDHistory[fullDate] && MYDHistory[fullDate].averageWellbeing) {
      if (MYDHistory[fullDate].averageWellbeing! >= 3.5) {
        image = happySymbol;
      }

      if (
        MYDHistory[fullDate].averageWellbeing! >= 2 &&
        MYDHistory[fullDate].averageWellbeing! < 3.5
      ) {
        image = neutralSymbol;
      }

      if (
        MYDHistory[fullDate].averageWellbeing !== null &&
        MYDHistory[fullDate].averageWellbeing! < 2
      ) {
        image = sadSymbol;
      }
    }

    const leftColumn = (
      <View
        style={{
          marginRight: image ? 20 : 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Image source={image} />
      </View>
    );

    const rightColumn = () => {
      if (fullDate > Moment().format('YYYY-MM-DD')) {
        return (
          <View style={{ flex: 1 }}>
            <Text style={MasterStyles.fontStyles.generalContentSmallDark}>
              No information available as this date has not yet occurred.
            </Text>
          </View>
        );
      }

      if (
        MYDHistory[fullDate] &&
        (MYDHistory[fullDate].positiveEvent ||
          MYDHistory[fullDate].negativeEvent)
      ) {
        return (
          <View style={{ flex: 1 }}>
            {MYDHistory[fullDate].positiveEvent ? (
              <View style={{ paddingBottom: 15 }}>
                <Text style={MasterStyles.fontStyles.contentMinorheader}>
                  Positive Event
                </Text>
                <Text style={MasterStyles.fontStyles.generalContentSmallDark}>
                  {MYDHistory[fullDate].positiveEvent}
                </Text>
              </View>
            ) : null}

            {MYDHistory[fullDate].negativeEvent ? (
              <View>
                <Text style={MasterStyles.fontStyles.contentMinorheader}>
                  Negative Event
                </Text>
                <Text style={MasterStyles.fontStyles.generalContentSmallDark}>
                  {MYDHistory[fullDate].negativeEvent}
                </Text>
              </View>
            ) : null}
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <Text style={MasterStyles.fontStyles.generalContentSmallDark}>
              {fullDate === Moment().format('YYYY-MM-DD')
                ? "You haven't completed the end of day activity yet for today."
                : "You didn't complete the end of day activity on this date."}
            </Text>
          </View>
        );
      }
    };

    return (
      <View
        style={[
          MasterStyles.common.horizontalPadding25,
          {
            marginTop: 15,
            marginBottom: 25,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
          },
        ]}
      >
        {leftColumn}
        {rightColumn()}
      </View>
    );
  };

  const calendarEntriesCarousel = useMemo(
    () => (
      <Carousel
        ref={carouselRef}
        data={calendar[currentMonth].daysInMonth}
        sliderWidth={deviceWidth}
        itemWidth={deviceWidth}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeSlideAlignment='start'
        renderItem={renderCalendarEntry}
        initialNumToRender={calendar[currentMonth].daysInMonth.length}
        onBeforeSnapToItem={(slideIndex: number) =>
          setCurrentCarouselIndex(slideIndex)
        }
        onSnapToItem={(slideIndex: number) => setCurrentDay(slideIndex)}
        firstItem={currentDay}
        onLayout={() => setCurrentCarouselIndex(currentDay)}
      />
    ),
    [currentMonth]
  );

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
      <StatusBar barStyle='light-content' animated />
      <ErrorMessage stateSegmentOfInterest='myd' />
      <GradientScreenTitle
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.mermaidShade2,
          ],
        ]}
        positionSets={[{ start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }]}
        text='Practice History'
        subText='Mapping Your Days'
        icon='close'
        onIconPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {firstDayOfTheMonth ? (
          <>
            {MYDCalendarMonth({
              calendar,
              currentYear,
              currentMonth,
              firstDayOfTheMonth,
              currentlySelectedDay: currentDay,
              onDaySelection: setCurrentDay,
              mydHistory: MYDHistory,
              goToNextMonth: selectNextMonth,
              goToPreviousMonth: selectPreviousMonth,
            })}
            <View
              style={{
                ...MasterStyles.common.horizontalPadding25,
                marginTop: 25,
              }}
            >
              <View
                key='Date and Link to View All History'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Text style={{ ...MasterStyles.fontStyles.contentSubheader }}>
                  {calendar[currentMonth].monthName} {currentDay + 1}
                </Text>
                <TouchableOpacity
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                  }}
                  onPress={() => dispatch(requestMYDHistoryPDF())}
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
            </View>
            {calendarEntriesCarousel}
          </>
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
}

export default MYDHistoryCalendarScreen;
