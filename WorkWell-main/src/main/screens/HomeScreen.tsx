//  3rd Party Libraries
import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView, View, StatusBar, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Type Definitions & CSS Definitions
import { RootReduxType } from '../../../config/configureStore';
import MasterStyles from '../../styles/MasterStyles';
import { WorkflowCollectionType } from '../../workflows/types';
import { HomeStackRouteOptions } from '../navigators/HomeTabStackNavigator';

// Components
import SimpleTextHeader from '../../components/SimpleTextHeader';
import FullScreenGradient from '../../components/FullScreenGradient';
import HomeScreenCollectionCard from '../../workflows/components/HomeScreenCollectionCard';
import HomeScreenMYDCard from '../../myd/components/HomeScreenMYDCard';
import SectionHeader from '../../components/SectionHeader';
import ErrorMessage from '../../components/modals/ErrorMessage';

// Custom Hooks
import useSubscribedCollections from '../../workflows/hooks/useSubscribedCollections';
import useAssignedCollections from '../../workflows/hooks/useAssignedCollections';
import useMYDParticipantInfo from '../../myd/hooks/useMYDParticipantInfo';

// Redux Stuff
import {
  loadWorkflowCollections,
  loadWorkflowCollectionSubscriptions,
  loadWorkflowCollectionAssignments,
  clearWorkflowsPushNotification,
  loadWorkflowCollectionRecommendations,
} from '../../workflows/redux/actionCreators';
import { loadEnrollment } from '../../myd/actionCreators';
import useRenewAuthTokenOnFocus from '../../hooks/useRenewAuthTokenOnFocus';
import InactiveCollections from '../../components/modals/InactiveCollections';
import { getSupportedAppVersions } from '../actionCreators';
import NewAppVersion from '../../components/modals/NewAppVersion';

/**
 * The HomeScreen component is the first screen displayed to the user
 * after completing authentication. It is also where the user is redirected
 * upon completing a practice.
 */
export default function HomeScreen({
  navigation,
}: {
  navigation: StackNavigationProp<HomeStackRouteOptions, 'Home'>;
}) {
  const [
    assignedCollectionsDisplayed,
    setAssignedCollectionsDisplayed,
  ] = useState(0);
  const [
    subscribedCollectionsDisplayed,
    setSubscribedCollectionsDisplayed,
  ] = useState(0);

  const [componentHasFocus, setComponentHasFocus] = useState(false);

  const dispatch = useDispatch();

  const workflowsPushNotification = useSelector((state: RootReduxType) => {
    return state.workflows.pushNotification;
  });

  const MYDPushNotification = useSelector((state: RootReduxType) => {
    return state.myd.pushNotification;
  });

  const workflowCollections = useSelector(
    (state: RootReduxType) => state.workflows.collections
  );

  const pendingWorkflowAPIActions = useSelector((state: RootReduxType) => [
    ...state.workflows.pendingActions,
    ...state.auth.pendingActions,
  ]);

  const pendingMYDAPIActions = useSelector((state: RootReduxType) => [
    ...state.auth.pendingActions,
    ...state.myd.pendingActions,
  ]);

  const subscribedCollections = useSubscribedCollections();
  const assignedCollections = useAssignedCollections();
  const MYDParticipantInfo = useMYDParticipantInfo();

  const validAuthToken = useRenewAuthTokenOnFocus();

  const appState = useSelector((state: RootReduxType) => state.main.appState);

  useFocusEffect(
    useCallback(() => {
      // console.log('HomeScreen Hook', validAuthToken);
      if (!validAuthToken) {
        console.log('WAITING: Home Screen');
      } else if (validAuthToken && appState === 'active') {
        console.log('DONE WAITING: HOME SCREEN');
        dispatch(loadWorkflowCollections());
        dispatch(loadWorkflowCollectionAssignments());
        dispatch(loadWorkflowCollectionSubscriptions());
        dispatch(loadWorkflowCollectionRecommendations());
        dispatch(loadEnrollment());
        dispatch(getSupportedAppVersions());
        setAssignedCollectionsDisplayed(0);
        setSubscribedCollectionsDisplayed(0);
        setComponentHasFocus(true);
      }
      return () => setComponentHasFocus(false);
    }, [validAuthToken, appState])
  );

  // Handle Workflow Collection Push Notifications
  useEffect(() => {
    if (
      componentHasFocus &&
      workflowsPushNotification &&
      pendingWorkflowAPIActions.length === 0 &&
      workflowCollections.length !== 0
    ) {
      console.log('Handling Workflow Collection Push Notification', appState);
      const isReferencedCollectionLoaded = workflowCollections.find(
        (collection) =>
          collection.detail ===
          workflowsPushNotification.event_details.workflow_collection_url
      );

      if (isReferencedCollectionLoaded) {
        navigation.navigate('CollectionDetail', {
          id: workflowsPushNotification.event_details.workflow_collection_url,
        });
      }
      dispatch(clearWorkflowsPushNotification());
    }
  }, [
    componentHasFocus,
    workflowsPushNotification,
    workflowCollections.length,
    pendingWorkflowAPIActions.length,
  ]);

  // Handle MYD Push Notifications
  useEffect(() => {
    if (
      componentHasFocus &&
      MYDPushNotification &&
      pendingMYDAPIActions.length === 0
    ) {
      navigation.navigate('MYDPracticeDetail');
    }
  }, [MYDPushNotification, pendingMYDAPIActions.length, componentHasFocus]);

  /**
   * Render individual "buttons".
   *
   * A given button will only be rendered if all buttons
   * with lower indexes have already loaded.
   */
  const renderItem = ({
    item,
    index,
    onLoad,
    previousItemsLoaded,
  }: {
    item: WorkflowCollectionType;
    index: number;
    onLoad: () => void;
    previousItemsLoaded: number;
  }) => {
    return previousItemsLoaded >= index ? (
      <HomeScreenCollectionCard
        key={index}
        workflowCollection={item}
        navigation={navigation}
        onLoad={onLoad}
      />
    ) : null;
  };

  /**
   * Render Collection Assignments
   */
  const renderCollectionAssignments = () => {
    return !pendingWorkflowAPIActions.length && assignedCollections?.length ? (
      <>
        <Animatable.View animation='fadeIn' useNativeDriver duration={1000}>
          <SectionHeader
            text='Research Surveys'
            color={MasterStyles.colors.white}
            containerStyle={{ paddingTop: 15, paddingBottom: 10 }}
            additionalTextStyles={MasterStyles.fontStyles.contentHeaderThin}
          />
          {assignedCollections.map((assignedCollection, index) => {
            return renderItem({
              item: assignedCollection,
              index,
              onLoad: () =>
                setAssignedCollectionsDisplayed(
                  assignedCollectionsDisplayed + 1
                ),
              previousItemsLoaded: assignedCollectionsDisplayed,
            });
          })}
        </Animatable.View>
      </>
    ) : null;
  };

  /**
   * Render Collection Subscriptions
   */
  const renderCollectionSubscriptions = () =>
    !pendingWorkflowAPIActions.length &&
    !pendingMYDAPIActions.length &&
    (subscribedCollections?.length || MYDParticipantInfo?.active) &&
    assignedCollectionsDisplayed === assignedCollections?.length ? (
      <>
        <Animatable.View animation='fadeIn' useNativeDriver duration={1000}>
          <SectionHeader
            text='Favorite Wellbeing Practices'
            color={MasterStyles.colors.white}
            containerStyle={{ paddingTop: 15, paddingBottom: 10 }}
            additionalTextStyles={MasterStyles.fontStyles.contentHeaderThin}
          />
          {MYDParticipantInfo && MYDParticipantInfo.active && (
            <HomeScreenMYDCard navigation={navigation} />
          )}
          {subscribedCollections?.map((subscribedCollection, index) => {
            return renderItem({
              item: subscribedCollection,
              index,
              onLoad: () =>
                setSubscribedCollectionsDisplayed(
                  subscribedCollectionsDisplayed + 1
                ),
              previousItemsLoaded: subscribedCollectionsDisplayed,
            });
          })}
        </Animatable.View>
      </>
    ) : null;

  const noPracticesOrSurveys = (
    <Animatable.View
      animation='fadeIn'
      useNativeDriver
      duration={1000}
      style={{
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={MasterStyles.fontStyles.generalContent}>
        Your favorite wellbeing practices and research surveys will appear here
        on your home page.
      </Text>
      <Text
        style={[MasterStyles.fontStyles.generalContent, { paddingTop: 25 }]}
      >
        Visit the practice library to select your first favorite practice to get
        started!
      </Text>
    </Animatable.View>
  );

  const renderContent = () => {
    const doesUserHaveThingsToDo =
      assignedCollections?.length ||
      subscribedCollections?.length ||
      (MYDParticipantInfo && MYDParticipantInfo.active);

    if (
      pendingWorkflowAPIActions.length ||
      pendingMYDAPIActions.length ||
      !componentHasFocus
    ) {
      return null;
    } else {
      return doesUserHaveThingsToDo ? (
        <>
          {renderCollectionAssignments()}
          {renderCollectionSubscriptions()}
        </>
      ) : (
        noPracticesOrSurveys
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ErrorMessage stateSegmentOfInterest='workflows' />
      <NewAppVersion />
      <InactiveCollections
        onOpen={() => setComponentHasFocus(false)}
        onClose={() => {
          console.log('Calling onClose');
          dispatch(loadWorkflowCollections());
          dispatch(loadWorkflowCollectionAssignments());
          dispatch(loadWorkflowCollectionSubscriptions());
          dispatch(loadWorkflowCollectionRecommendations());
          setAssignedCollectionsDisplayed(0);
          setSubscribedCollectionsDisplayed(0);
          setComponentHasFocus(true);
        }}
      />
      <StatusBar
        barStyle='light-content'
        animated
        translucent={true}
        backgroundColor={MasterStyles.colors.blackOpaque}
      />
      <FullScreenGradient
        colorSets={[
          [
            MasterStyles.officialColors.brightSkyShade2,
            MasterStyles.officialColors.mermaidShade2,
          ],
        ]}
        loopAnimation={false}
        animationActive={pendingWorkflowAPIActions.length > 0}
        animationDuration={1999}
        positionSets={[
          { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
          // { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }
        ]}
      />
      <View style={{ flex: 1 }}>
        <SimpleTextHeader text='Home' />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            { paddingBottom: 100 }, // Adjust for the menu bar at the bottom of the screen.
            MasterStyles.common.horizontalMargins25,
          ]}
        >
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
}
