import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
// @ts-ignore
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useDispatch } from 'react-redux';

import { setFirstTimeUsingApp } from '../../main/actionCreators';

import OnboardingItem from '../components/OnboardingItem';
const onboarding1 = require('../../../assets/onboarding1.jpg');
const onboarding2 = require('../../../assets/onboarding2.jpg');
const onboarding3 = require('../../../assets/onboarding3.jpg');

const { width } = Dimensions.get('window');

type onboardingItemType = [number, string, string, string];

const data: Array<onboardingItemType> = [
  [
    onboarding1,
    'practices',
    'Explore practices',
    'Browse our full library of wellbeing practices, shared by experts and trusted guides.',
  ],
  [
    onboarding2,
    'steps',
    'Commit to small steps',
    'Add practices to your personal dashboard, receive notifications, and engage over time.',
  ],
  [
    onboarding3,
    'wellbeing',
    'Unlock your wellbeing profile',
    'Take our assessment and unlock your own results, insights and suggested practices.',
  ],
];

export default function OnboardingScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const dispatch = useDispatch();

  const pagination = () => {
    return (
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'transparent', marginTop: -150 }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        index={0}
        data={data}
        sliderWidth={width}
        itemWidth={width}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        onSnapToItem={(index: number) => setActiveSlide(index)}
        renderItem={({
          item,
          index,
        }: {
          item: onboardingItemType;
          index: number;
        }) => (
          <OnboardingItem
            info={item}
            action={
              index === data.length - 1
                ? dispatch(setFirstTimeUsingApp())
                : undefined
            }
          />
        )}
      />
      {pagination()}
    </View>
  );
}
