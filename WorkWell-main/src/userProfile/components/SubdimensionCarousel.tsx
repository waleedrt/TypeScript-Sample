import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
// @ts-ignore
import Carousel, { Pagination } from 'react-native-snap-carousel';

import MasterStyles from '../../styles/MasterStyles';
import {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  Path,
  Rect,
  Svg,
  Text as SVGText,
  TSpan,
} from 'react-native-svg';
import { useWellbeingProfileDataProcessedDimension } from '../hooks/useWellbeingProfileData';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexBasis: 240,
    minHeight: 240,
  },
  categoryText: {
    color: MasterStyles.colors.white,
    fontSize: 24,
  },
});

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(min, val), max);

type SubdimensionCarouselProps = {
  currentDimensionData: useWellbeingProfileDataProcessedDimension;
  previousDimensionData: useWellbeingProfileDataProcessedDimension | null;
};

/**
 * SubdimensionCarousel
 *
 * This component is used to present subdimension information
 * to a user in a carousel that they will be familiar with
 * from other components of the app.
 */
export default function SubdimensionCarousel({
  currentDimensionData,
  previousDimensionData,
}: SubdimensionCarouselProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const mergedCurrentAndPreviousSubdimensionData = currentDimensionData.subdimensions.map(
    (subdimension) => ({
      label: subdimension.label,
      code: subdimension.code,
      description: subdimension.description,
      currentScore: subdimension.score,
      previousScore: previousDimensionData?.subdimensions.find(
        (previousSubdimension) =>
          previousSubdimension.code === subdimension.code
      )?.score,
    })
  );

  const renderItem = ({ item }) => {
    const fontSize = 7;
    const DASHED_BREATHING_ROOM = 3;
    const wave_y = 100 - (item.currentScore * 100) / 5;
    const wave_amplitude = 0.5 * Math.min(20, wave_y, 100 - wave_y);
    const text_x = 50 * (1 - Math.sqrt(1 - ((wave_y / 100) * 2 - 1) ** 2));

    const has_past_data = item.previousScore;
    let past_wave_y;
    let past_wave_amplitude;
    let past_text_x;

    if (has_past_data) {
      past_wave_y = 100 - (item.previousScore * 100) / 5;
      past_wave_amplitude = 0.5 * Math.min(20, past_wave_y, 100 - past_wave_y);
      past_text_x =
        50 * (1 + Math.sqrt(1 - ((past_wave_y / 100) * 2 - 1) ** 2));
    }

    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 25,
          paddingVertical: 25,
          paddingHorizontal: 20,
          borderRadius: 20,
          borderColor: MasterStyles.officialColors.cloudy,
          borderWidth: 1,
          minHeight: 200,
        }}
      >
        <Svg width={'100%'} height={200} viewBox={[-40, -10, 180, 120]}>
          <Defs>
            <ClipPath id='porthole'>
              <Circle r={50} cx={50} cy={50} />
            </ClipPath>
          </Defs>
          <G id='texts'>
            <SVGText
              y={wave_y + fontSize * 0.8}
              x={-15}
              textAnchor='end'
              fontSize={fontSize}
              fill={'black'}
            >
              TODAY
            </SVGText>
            <Line
              stroke={'#219594'}
              strokeWidth={1}
              strokeLinecap={'round'}
              strokeDasharray={'2,2'}
              x1={-15 + DASHED_BREATHING_ROOM}
              y1={wave_y + 3}
              x2={text_x - DASHED_BREATHING_ROOM}
              y2={wave_y + 3}
            />
            {has_past_data ? (
              <G>
                <SVGText
                  x={115}
                  y={past_wave_y - fontSize * 0.1}
                  textAnchor='start'
                  fontSize={fontSize}
                  fill={'black'}
                >
                  <TSpan>LAST</TSpan>
                  <TSpan x={115} dy={fontSize}>
                    TIME
                  </TSpan>
                </SVGText>
                <Line
                  stroke={'#219594'}
                  strokeWidth={1}
                  strokeLinecap={'round'}
                  strokeDasharray={'2,2'}
                  x1={past_text_x + DASHED_BREATHING_ROOM}
                  y1={past_wave_y}
                  x2={115 - DASHED_BREATHING_ROOM}
                  y2={past_wave_y}
                />
              </G>
            ) : null}
          </G>
          <Circle
            r={50 + DASHED_BREATHING_ROOM}
            cx={50}
            cy={50}
            fill={'white'}
            strokeWidth={0}
          />
          <G clipPath='url(#porthole)'>
            <Rect
              width={'100%'}
              height={'100%'}
              fill={'#209989'}
              fillOpacity={1}
            />
            <Path
              fill={'#1C6F6F'}
              d={[
                'M',
                -20 * 0.62,
                wave_y,
                'q',
                10,
                wave_amplitude,
                20,
                0,
                't',
                20,
                0,
                20,
                0,
                20,
                0,
                20,
                0,
                20,
                0,
                'V',
                100,
                'H',
                0,
                'z',
              ].join(' ')}
            />
            {has_past_data ? (
              <Path
                fillOpacity={0}
                stroke='black'
                d={[
                  'M',
                  -20 * 0.24,
                  past_wave_y,
                  'q',
                  10,
                  past_wave_amplitude,
                  20,
                  0,
                  't',
                  20,
                  0,
                  20,
                  0,
                  20,
                  0,
                  20,
                  0,
                  20,
                  0,
                ].join(' ')}
              />
            ) : null}
          </G>
        </Svg>
        <Text
          style={[
            MasterStyles.fontStyles.contentMinorheader,
            { paddingTop: 35, alignSelf: 'flex-start' },
          ]}
        >
          {item.label}
        </Text>
        <Text
          style={[
            MasterStyles.fontStyles.generalContentSmallDark,
            { textAlign: 'left', alignSelf: 'flex-start' },
          ]}
        >
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View
      animation='fadeIn'
      duration={1000}
      style={[styles.container]}
    >
      <Carousel
        data={mergedCurrentAndPreviousSubdimensionData}
        sliderWidth={width}
        itemWidth={width}
        itemHeight={400}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeSlideAlignment='start'
        removeClippedSubviews
        enableMomentum
        renderItem={renderItem}
        onSnapToItem={(index: number) => setActiveSlideIndex(index)}
      />
      <Pagination
        dotsLength={mergedCurrentAndPreviousSubdimensionData.length}
        activeDotIndex={activeSlideIndex}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </Animatable.View>
  );
}

SubdimensionCarousel.propTypes = {
  currentDimensionData: PropTypes.object.isRequired,
  previousDimensionData: PropTypes.object,
};
