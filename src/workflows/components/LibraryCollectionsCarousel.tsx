import React from 'react';
import { Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
// @ts-ignore
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';

import MasterStyles from '../../styles/MasterStyles';
import LibraryWorkflowCollectionCard from './LibraryWorkflowCollectionCard';
import LibraryMYDCard from '../../myd/components/LibraryMYDCard';
import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';
import { WorkflowCollectionType } from '../types';
import { RootReduxType } from '../../../config/configureStore';
import SectionHeader from '../../components/SectionHeader';
import { StackNavigationProp } from '@react-navigation/stack';
import { LibraryStackRouteOptions } from '../../main/navigators/LibraryTabStackNavigator';

const { width } = Dimensions.get('window');

type LibraryCollectionsCarouselProps = {
  index: number;
  text: string;
  navigation: StackNavigationProp<LibraryStackRouteOptions, 'Library'>;
  workflowCollections: Array<WorkflowCollectionType | { category: string }>;
};

/**
 * LibraryCollectionsCarousel
 *
 * This component is nested repeatedly
 * in the LibraryScreen to display various categories of
 * WorkflowCollections to the user.
 *
 * IMPORTANT NOTE: If the "text" prop received by this component
 * === 'Daily Wellbeing' we inject some data about MYD into the array
 * of items being presented to make MYD available from the library.
 */
function LibraryCollectionsCarousel({
  index,
  text,
  navigation,
  workflowCollections,
}: LibraryCollectionsCarouselProps) {
  const pendingAPIOperations = useSelector(
    (state: RootReduxType) => state.workflows.pendingActions
  );
  const designAdjustments = useCanonicalDesignAdjustments();

  /**
   * Either render a LibraryWorkflowCollectionCard or LibraryMYDCard.
   */
  const renderItem = ({
    item,
  }: {
    item:
      | WorkflowCollectionType
      | {
          category: 'MYD';
        };
  }) => {
    if (item.category === 'MYD') {
      return <LibraryMYDCard navigation={navigation} />;
    } else {
      return (
        <LibraryWorkflowCollectionCard
          workflowCollection={item}
          navigation={navigation}
        />
      );
    }
  };

  return pendingAPIOperations.length ? null : (
    <Animatable.View
      animation='fadeIn'
      duration={1000}
      delay={index * 500}
      style={{ marginBottom: 25, opacity: 0 }}
    >
      <SectionHeader
        text={text}
        color={MasterStyles.colors.white}
        containerStyle={[
          MasterStyles.common.horizontalPadding25,
          { paddingBottom: 10 },
        ]}
        additionalTextStyles={MasterStyles.fontStyles.contentHeaderThin}
      />
      <Carousel
        containerCustomStyle={MasterStyles.common.horizontalPadding25}
        data={workflowCollections}
        sliderWidth={width}
        itemWidth={300 * designAdjustments.width}
        itemHeight={200 * designAdjustments.height}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeSlideAlignment='start'
        removeClippedSubviews
        enableMomentum
        renderItem={renderItem}
      />
    </Animatable.View>
  );
}

export default LibraryCollectionsCarousel;
