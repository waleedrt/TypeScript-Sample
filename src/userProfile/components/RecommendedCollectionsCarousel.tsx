import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
// @ts-ignore
import Carousel from 'react-native-snap-carousel';
import { StackNavigationProp } from '@react-navigation/stack';

// Definitions
import { UserProfileStackRouteOptions } from '../../main/navigators/UserProfileStackNavigator';
import MasterStyles from '../../styles/MasterStyles';
import { WorkflowCollectionType } from '../../workflows/types';

// Components
import UserProfileMYDCard from '../../myd/components/UserProfileMYDCard';
import UserProfileWorkflowCollectionCard from '../../workflows/components/UserProfileWorkflowCollectionCard';

// Hooks
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';
import useCanonicalDesignAdjustments from '../../hooks/useCanonicalDesignAdjustments';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexBasis: 240,
    minHeight: 240,
  },
});

/**
 * RecommendedCollectionsCarousel
 *
 * This component is used to display the recommended
 * collections (and possibly MYD) that a user is
 * encouraged to engage in.
 */
function RecommendedCollectionsCarousel({
  navigation,
  workflowCollections,
}: {
  navigation: StackNavigationProp<
    UserProfileStackRouteOptions,
    'WellbeingProfile'
  >;
  workflowCollections: Array<
    | WorkflowCollectionType
    | {
        category: 'MYD';
      }
  >;
}) {
  const pendingAPIOperations = useGlobalPendingAPIOperations();
  const designAdjustments = useCanonicalDesignAdjustments();

  const idealCardDimensions = {
    width: 300,
    height: 200,
  };

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
      return <UserProfileMYDCard navigation={navigation} />;
    } else {
      return (
        <UserProfileWorkflowCollectionCard
          workflowCollection={item}
          navigation={navigation}
        />
      );
    }
  };

  return (
    <View style={[styles.container]}>
      <Carousel
        containerCustomStyle={MasterStyles.common.horizontalPadding25}
        data={workflowCollections}
        sliderWidth={width}
        itemWidth={idealCardDimensions.width * designAdjustments.width}
        itemHeight={idealCardDimensions.height * designAdjustments.height}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeSlideAlignment='start'
        removeClippedSubviews
        enableMomentum
        renderItem={renderItem}
      />
    </View>
  );
}

export default RecommendedCollectionsCarousel;
