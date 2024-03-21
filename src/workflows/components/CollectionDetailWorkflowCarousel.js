import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CollectionDetailWorkflowCard from './CollectionDetailWorkflowCard';
import MasterStyles from '../../styles/MasterStyles';

const { width } = Dimensions.get('window');

/**
 * Component which displays all the workflows of a collection
 * in a horizontal carousel.
 */
export default function CollectionDetailWorkflowCarousel({
  navigation,
  route,
  workflowCollection,
  workflowCollectionEngagement,
}) {
  // Ensure that the workflows are ordered. This may not be guaranteed by the API
  const sortedWorkflowCollectionMembers = workflowCollection.workflowcollectionmember_set.sort(
    (member1, member2) => member1.order - member2.order
  );

  return (
    <Carousel
      containerCustomStyle={MasterStyles.common.horizontalPadding25}
      data={sortedWorkflowCollectionMembers}
      sliderWidth={width}
      itemWidth={225}
      itemHeight={125}
      inactiveSlideScale={1}
      inactiveSlideOpacity={1}
      activeSlideAlignment='start'
      removeClippedSubviews
      enableMomentum
      renderItem={({ item, index }) => (
        <CollectionDetailWorkflowCard
          workflow={item}
          workflowCollection={workflowCollection}
          workflowCollectionEngagement={workflowCollectionEngagement}
          navigation={navigation}
          route={route}
          index={index}
          animationDelay={500}
        />
      )}
    />
  );
}

CollectionDetailWorkflowCarousel.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  workflowCollection: PropTypes.object.isRequired,
  workflowCollectionEngagement: PropTypes.object.isRequired,
};
