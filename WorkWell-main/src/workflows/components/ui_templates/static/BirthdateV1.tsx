import React, { useEffect, useState } from 'react';
import { View, Picker } from 'react-native';
import { range } from 'lodash';

import useSortedQuestionsAndAnswerOptions from '../../../hooks/useSortedQuestionsAndAnswerOptions';
import useBackgroundImage from '../../../hooks/useBackgroundImage';
import useCheckForRequiredAnswers from '../../../hooks/useCheckForRequiredAnswers';
import WorkflowStepSectionHeader from '../../../../components/WorkflowStepSectionHeader';
import ExpandableSectionWithSelectedValueDisplay from '../../../../components/ExpandableSectionWithSelectedValueDisplay';
import MasterStyles from '../../../../styles/MasterStyles';
import GenericStepRenderer from '../../GenericStepRenderer';
import Button100x30 from '../../../../components/Button100x30';
import Button30x25 from '../../../../components/Button35x30';
import usePreviouslyGivenAnswers from '../../../hooks/usePreviouslyGivenAnswers';
import {
  DynamicUITemplateType,
  WorkflowEngagementQuestionNodeType,
} from '../../../types';
import useDateBasedQuestionReducer from '../../../hooks/useDateBasedQuestionReducer';

/**
 * BirthdateV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'birthdate_v1'
 */
export default function BirthdateV1({
  step,
  backAction,
  nextAction,
  cancelAction,
  syncInput,
}: DynamicUITemplateType) {
  const questionHierarchy = useSortedQuestionsAndAnswerOptions(step);
  const backgroundImageURL = useBackgroundImage(step);
  const [state, dispatch] = useDateBasedQuestionReducer();
  const requiredAnswersProvided = useCheckForRequiredAnswers(step, state);
  usePreviouslyGivenAnswers(questionHierarchy, dispatch);

  const [selectedMonth, setSelectedMonth] = useState<{
    order: number;
    name: string;
    days: number;
  } | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const MONTHS = [
    {
      name: 'January',
      order: 1,
      days: 31,
    },
    {
      name: 'February',
      order: 2,
      days: 29,
    },
    {
      name: 'March',
      order: 3,
      days: 31,
    },
    {
      name: 'April',
      order: 4,
      days: 30,
    },
    {
      name: 'May',
      order: 5,
      days: 31,
    },
    {
      name: 'June',
      order: 6,
      days: 30,
    },
    {
      name: 'July',
      order: 7,
      days: 31,
    },
    {
      name: 'August',
      order: 8,
      days: 31,
    },
    {
      name: 'September',
      order: 9,
      days: 30,
    },
    {
      name: 'October',
      order: 10,
      days: 31,
    },
    {
      name: 'November',
      order: 11,
      days: 30,
    },
    {
      name: 'December',
      order: 12,
      days: 31,
    },
  ];

  // Whenever all three pieces of required data (month, day, year)
  // are available, send a message to the reducer.
  useEffect(() => {
    if (selectedMonth && selectedDay && selectedYear) {
      dispatch({
        type: 'QUESTION_RESPONSE',
        node: questionHierarchy[0],
        answer: {
          month: selectedMonth.order,
          day: selectedDay,
          year: selectedYear,
        },
      });
    }
  }, [selectedMonth, selectedDay, selectedYear]);

  // Whenever state is mutated, issue a call to syncInput
  useEffect(() => {
    syncInput(state);

    // Handle the special case where state has been reloaded
    // from a previous answer and we need to mutate the UI
    // to reflect this.
    if (
      state.questions.length &&
      !selectedDay &&
      !selectedMonth &&
      !selectedYear
    ) {
      setSelectedMonth(
        MONTHS.find(
          (month) => month.order === state.questions[0].response.month
        )!
      );
      setSelectedDay(state.questions[0].response.day);
      setSelectedYear(state.questions[0].response.year);
      null;
    }
  }, [state]);

  const monthSelectionWidget = (
    <ExpandableSectionWithSelectedValueDisplay
      text='Month'
      expanded={selectedMonth ? false : true}
      visible={true}
      selectedValueComponent={
        selectedMonth
          ? () => (
              <Button100x30
                text={selectedMonth.name}
                key={selectedMonth.name}
                disabled={true}
              />
            )
          : () => null
      }
      onPress={() => {
        setSelectedMonth(null);
        setSelectedDay(null);
      }}
    >
      <View
        style={{
          display: selectedMonth ? 'none' : 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingBottom: 10,
        }}
      >
        {MONTHS.map((month) => (
          <Button100x30
            text={month.name}
            key={month.name}
            onPress={() => setSelectedMonth(month)}
            containerStyle={{ marginRight: 10, marginBottom: 10 }}
          />
        ))}
      </View>
    </ExpandableSectionWithSelectedValueDisplay>
  );

  const daySelectionWidget = (
    <ExpandableSectionWithSelectedValueDisplay
      visible={selectedMonth !== null}
      text='Day'
      expanded={selectedMonth && !selectedDay ? true : false}
      selectedValueComponent={() =>
        selectedDay ? (
          <Button30x25 text={selectedDay} key={selectedDay} disabled={true} />
        ) : null
      }
      onPress={() => setSelectedDay(null)}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {selectedMonth
          ? range(1, selectedMonth!.days + 1).map((value) => (
              <Button30x25
                text={value}
                key={value}
                onPress={() => setSelectedDay(value)}
                containerStyle={{ marginRight: 10, marginBottom: 10 }}
              />
            ))
          : null}
      </View>
    </ExpandableSectionWithSelectedValueDisplay>
  );

  const renderYearSelectionWidget = () => {
    // Extract the limits for what birth years can
    // be selected by a user from the step.
    const yearLow = Number(
      step.workflowsteptext_set.find(
        (text) => text.ui_identifier === 'question_1_year_low'
      )!.content
    );
    const yearHigh = Number(
      step.workflowsteptext_set.find(
        (text) => text.ui_identifier === 'question_1_year_high'
      )!.content
    );

    return (
      <View>
        <ExpandableSectionWithSelectedValueDisplay
          text='Year'
          expanded={selectedMonth !== null && selectedDay !== null}
          visible={selectedMonth !== null && selectedDay !== null}
        >
          <Picker
            itemStyle={{
              color: 'white',
              shadowColor: 'white',
              textDecorationColor: 'white',
              textShadowColor: 'white',
            }}
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={{
              borderRadius: 20,
              shadowColor: 'white',
              textDecorationColor: 'white',
              textShadowColor: 'white',
            }}
          >
            {range(yearLow, yearHigh).map((year) => (
              <Picker.Item value={year} label={year.toString()} key={year} />
            ))}
          </Picker>
        </ExpandableSectionWithSelectedValueDisplay>
      </View>
    );
  };

  const nodeRenderer = (
    nodesToRender: Array<WorkflowEngagementQuestionNodeType>
  ) => {
    return nodesToRender.map((node, index) => (
      <View key={index} style={{ paddingBottom: 50 }}>
        <WorkflowStepSectionHeader
          text={node.question.content}
          cancelAction={cancelAction}
          layoutIndex={index}
        />
        <View style={MasterStyles.common.horizontalPadding25}>
          {monthSelectionWidget}
          {daySelectionWidget}
          {renderYearSelectionWidget()}
        </View>
      </View>
    ));
  };

  return (
    <GenericStepRenderer
      nodeRenderer={() => nodeRenderer(questionHierarchy)}
      backAction={backAction}
      nextAction={nextAction}
      backgroundImage={backgroundImageURL}
      requiredAnswersProvided={requiredAnswersProvided}
    />
  );
}
