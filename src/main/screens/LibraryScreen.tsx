import React, { useState, useCallback } from 'react';
import { View, ScrollView, StatusBar, InteractionManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Moment from 'moment';

// Definitions
import MasterStyles from '../../styles/MasterStyles';
import { RootReduxType } from '../../../config/configureStore';

// Components
import FullScreenGradient from '../../components/FullScreenGradient';
import SimpleTextHeader from '../../components/SimpleTextHeader';
import LibraryCollectionsCarousel from '../../workflows/components/LibraryCollectionsCarousel';
import InfoMessageSmall from '../../components/InfoMessageSmall';

// Hooks
import useRecommendedCollections from '../../workflows/hooks/useRecommendedCollections';

// Redux
import { loadWorkflowCollectionRecommendations } from '../../workflows/redux/actionCreators';
import { StackNavigationProp } from '@react-navigation/stack';
import { LibraryStackRouteOptions } from '../navigators/LibraryTabStackNavigator';

const COLLECTION_CATEGORIES = [
  'Daily Wellbeing',
  'Self Discovery',
  'Positive Relationships',
];

/**
 * LibraryScreen
 *
 * This component allows users to browse all available
 * WorkflowCollections based on their assigned labels.
 *
 * Just like the HomeScreen component, a user travels from this screen
 * to CollectionDetailScreen components.
 *
 * Note that we inject the MYD practice into this component as well.
 */
function LibraryScreen({
  navigation,
}: {
  navigation: StackNavigationProp<LibraryStackRouteOptions, 'Library'>;
}) {
  const workflowCollections = useSelector(
    (state: RootReduxType) => state.workflows.collections
  );

  const oAuthTokenStatus = useSelector((state: RootReduxType) => {
    return state.auth.tokens.status;
  });

  const dispatch = useDispatch();

  const [componentHasFocus, setComponentHasFocus] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (oAuthTokenStatus !== 'Received') {
        console.log('WAITING: Library Screen');
      } else {
        console.log('DONE WAITING: Library Screen');
        setComponentHasFocus(true);
        dispatch(loadWorkflowCollectionRecommendations());
      }

      return () => setComponentHasFocus(false);
    }, [oAuthTokenStatus])
  );

  const recommendedCollections = useRecommendedCollections(true);

  const renderRecommendedCollections = () => {
    return recommendedCollections?.length ? (
      <LibraryCollectionsCarousel
        text={'Recommended for You'}
        index={0}
        navigation={navigation}
        workflowCollections={recommendedCollections}
      />
    ) : (
      <InfoMessageSmall
        message='Unlock personalized recommendations by completing your Wellbeing
    Assessment'
        containerStyleOverrides={[
          MasterStyles.common.horizontalMargins25,
          { paddingBottom: 25 },
        ]}
      />
    );
  };

  /**
   * Render a Workflow Carousel component for each of the
   * defined WorkflowCollection categories.
   */
  const renderWorkCollectionCarousels = () => {
    return COLLECTION_CATEGORIES.map((category, index) => (
      <LibraryCollectionsCarousel
        index={index + 1}
        key={category}
        text={category}
        navigation={navigation}
        workflowCollections={
          category !== 'Daily Wellbeing'
            ? workflowCollections
                .filter((collection) => collection.tags.includes(category))
                .sort((a, b) => Moment(b.created_date).diff(a.created_date))
            : recommendedCollections?.length
            ? [
                ...workflowCollections
                  .filter((collection) => collection.tags.includes(category))
                  .sort((a, b) => Moment(b.created_date).diff(a.created_date)),
                { category: 'MYD' },
              ]
            : [
                { category: 'MYD' },
                ...workflowCollections
                  .filter((collection) => collection.tags.includes(category))
                  .sort((a, b) => Moment(b.created_date).diff(a.created_date)),
              ]
        }
      />
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle='light-content'
        animated
        translucent={true}
        backgroundColor={MasterStyles.colors.blackOpaque}
      />
      <FullScreenGradient
        animationActive={false}
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.groundSunflower2,
          ],
        ]}
        positionSets={[{ start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }]}
      />
      <View style={{ flex: 1 }}>
        <SimpleTextHeader text='Library' dividerBleedRight />
        {componentHasFocus ? (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 25 }}
          >
            {renderRecommendedCollections()}
            {renderWorkCollectionCarousels()}
          </ScrollView>
        ) : null}
      </View>
    </View>
  );
}

export default LibraryScreen;
