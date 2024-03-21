import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import Moment from 'moment';

import MasterStyles from '../../../styles/MasterStyles';
import { MYDProcessedHistory } from '../../types';
import { CalendarDay } from '../../../types';

const happySymbol = require('../../../../assets/myd/symbols/happy.png');
const neutralSymbol = require('../../../../assets/myd/symbols/neutral.png');
const sadSymbol = require('../../../../assets/myd/symbols/sad.png');

export default function MYDCalendarDay(
  currentYear: number,
  currentMonth: number,
  dayObject: CalendarDay,
  currentlySelectedDay: number,
  onDaySelection: (dayIndex: number) => void,
  mydHistory: MYDProcessedHistory
) {
  const renderCalendarDayImage = (dayObject: CalendarDay) => {
    const fullDate = Moment(
      `${currentYear}-${currentMonth + 1}-${dayObject.dayIndex + 1}`,
      'YYYY-MM-DD'
    ).format('YYYY-MM-DD');

    if (!mydHistory[fullDate]) return <></>;

    let image = null;

    if (mydHistory[fullDate].averageWellbeing) {
      if (mydHistory[fullDate].averageWellbeing! >= 3.5) {
        image = happySymbol;
      }

      if (
        mydHistory[fullDate].averageWellbeing! >= 2 &&
        mydHistory[fullDate].averageWellbeing! < 3.5
      ) {
        image = neutralSymbol;
      }

      if (
        mydHistory[fullDate].averageWellbeing !== null &&
        mydHistory[fullDate].averageWellbeing! < 2
      ) {
        image = sadSymbol;
      }
    }

    return image ? (
      <Image source={image} style={{ marginTop: 5, height: 25, width: 25 }} />
    ) : (
      <></>
    );
  };

  return (
    <TouchableOpacity
      key={dayObject.dayIndex}
      style={[
        {
          height: 55,
          backgroundColor: dayObject.dayIndex !== null ? '#F7F7F7' : 'white',
          display: 'flex',
          flex: 1,
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 5,
          width: '95%',
          marginTop: 5,
          alignItems: 'center',
        },
        currentlySelectedDay === dayObject.dayIndex
          ? { borderColor: MasterStyles.officialColors.cloudy }
          : { borderColor: MasterStyles.colors.white },
      ]}
      disabled={dayObject.dayIndex === null}
      onPress={() => onDaySelection(dayObject.dayIndex)}
    >
      {dayObject.dayIndex !== null ? (
        <>
          <Text
            style={{
              color: MasterStyles.officialColors.cloudy,
              alignSelf: 'flex-end',
              paddingTop: 1,
              paddingRight: 3,
              fontSize: 10,
            }}
          >
            {dayObject.dayIndex + 1}
          </Text>
          {renderCalendarDayImage(dayObject)}
        </>
      ) : null}
    </TouchableOpacity>
  );
}
