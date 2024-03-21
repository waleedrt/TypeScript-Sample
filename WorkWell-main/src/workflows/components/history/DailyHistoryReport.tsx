import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  Animated,
  InteractionManager,
} from 'react-native';
import Moment from 'moment';

import MasterStyles from '../../../styles/MasterStyles';
import { YearCalendar } from '../../../types';
import { historySingleEngagementType } from '../../types';

// Images
const headphones = require('../../../../assets/icons/general/headphonesCircle.png');
const pencil = require('../../../../assets/icons/general/pencilCircle.png');

type DailyHistoryReportProps = {
  currentMonth: number;
  currentDay: number;
  collectionEngagementHistory: {
    calendar: YearCalendar;
    dataProcessed: boolean;
  };
};

/**
 * Display the details of completed workflows in a
 * provided collection engagement history.
 */
export default function DailyHistoryReport({
  currentMonth,
  currentDay,
  collectionEngagementHistory,
}: DailyHistoryReportProps) {
  const animationValue = useRef(new Animated.Value(0)).current;

  /**
   * This will seem unnecessary to first time readers. Essentially,
   * because of the order in which hooks are evaluated in relationship
   * to component renders, we need artificially create something that
   * we can use to tell when the month has changed without need to run a hook.
   *
   * We do this by comparing the currently passed in `currentMonth` with
   * an internally stored representation that is set by a useEffect hook
   * below. If the passed in value doesn't match our internal representation
   * that means the month has changed and we can use that to update rendering
   * before our local hooks run.
   */
  const [internallyStoredMonth, setInternallyStoredMonth] = useState<
    number | null
  >(null);

  const engagementsForDay =
    collectionEngagementHistory.calendar[currentMonth].daysInMonth[currentDay]
      .engagements;

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (collectionEngagementHistory.dataProcessed) {
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          isInteraction: false,
        }).start();
      }
    });

    return () => {
      task.cancel();
      animationValue.setValue(0);
    };
  }, [collectionEngagementHistory.dataProcessed]);

  useEffect(() => {
    if (currentMonth !== internallyStoredMonth)
      setInternallyStoredMonth(currentMonth);
  }, [currentMonth]);

  const renderSingleEngagementHistory = (
    engagementHistory: historySingleEngagementType
  ) => {
    return engagementHistory.workflowsCompleted.map((completedWorkflow) => {
      // Determine which icon to use to represent this workflow.
      // TODO: Update this for surveys and potentially multi-type workflows
      const icon = completedWorkflow.stepTypes.find((stepType) =>
        stepType.includes('audio')
      )
        ? headphones
        : pencil;

      return (
        <View
          key={completedWorkflow.finished!}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 10,
          }}
        >
          <View key='dataColumn' style={{ flex: 1 }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                flex: 1,
                paddingBottom: 5,
              }}
            >
              <Image
                source={icon}
                style={{
                  height: 35,
                  width: 35,
                  marginRight: 10,
                }}
              />
              <View>
                <Text
                  style={{
                    ...MasterStyles.fontStyles.contentMinorheader,
                    fontWeight: '700',
                    flex: 1,
                    textAlignVertical: 'top',
                  }}
                >
                  {completedWorkflow.name}
                </Text>
                <Text
                  style={{
                    ...(Platform.OS === 'ios'
                      ? {
                          fontSize: 12,
                          fontFamily: 'System',
                          fontWeight: '300',
                        }
                      : { fontSize: 12, fontFamily: 'OpenSans-Regular' }),
                    color: MasterStyles.officialColors.graphite,
                  }}
                >
                  {Moment(completedWorkflow.finished).format('h:mm A')}
                </Text>
              </View>
            </View>
            {/* Display the question/answer for each available step data. 
            Obviously, this will only apply to steps with inputs.*/}
            {completedWorkflow.stepData.map((singleStepData, index) => {
              // Don't display questions with no user answer.
              if (!singleStepData.answer) return null;

              return (
                <View
                  key={index}
                  style={{
                    paddingBottom: 10,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        ...(Platform.OS === 'ios'
                          ? {
                              fontSize: 14,
                              fontFamily: 'System',
                              fontWeight: '500',
                            }
                          : { fontSize: 13, fontFamily: 'OpenSans-SemiBold' }),
                        color: MasterStyles.officialColors.graphite,
                      }}
                    >
                      {singleStepData.question}
                    </Text>
                  </View>
                  <Text
                    style={{
                      ...(Platform.OS === 'ios'
                        ? {
                            fontSize: 14,
                            fontFamily: 'System',
                            fontWeight: '300',
                          }
                        : { fontSize: 13, fontFamily: 'OpenSans-Regular' }),
                      color: MasterStyles.officialColors.graphite,
                    }}
                  >
                    {singleStepData.answer}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    });
  };

  if (
    !engagementsForDay ||
    !collectionEngagementHistory.dataProcessed ||
    currentMonth !== internallyStoredMonth
  ) {
    return null;
  } else if (!engagementsForDay.length) {
    return (
      <Animated.View
        key='engagementsCompleted'
        style={{ paddingTop: 15, opacity: animationValue }}
      >
        <Text style={MasterStyles.fontStyles.contentMinorheader}>
          You did not complete any practices in this collection on this date.
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      key='engagementsCompleted'
      style={{
        paddingTop: 15,
        opacity: animationValue,
      }}
    >
      {engagementsForDay.map((engagement) =>
        renderSingleEngagementHistory(engagement)
      )}
    </Animated.View>
  );
}
