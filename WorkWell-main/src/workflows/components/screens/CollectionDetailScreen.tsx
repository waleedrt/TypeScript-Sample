import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect, RouteProp } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';

// Definitions
import MasterStyles from '../../../styles/MasterStyles';
import { RootReduxType } from '../../../../config/configureStore';
import { HomeStackRouteOptions } from '../../../main/navigators/HomeTabStackNavigator';
import { LibraryStackRouteOptions } from '../../../main/navigators/LibraryTabStackNavigator';
import { UserProfileStackRouteOptions } from '../../../main/navigators/UserProfileStackNavigator';

// Components
import GradientStyleButton from '../../../components/GradientStyleButton';
import CollectionDetailWorkflowCarousel from '../CollectionDetailWorkflowCarousel';
import RibbonModal from '../../../components/modals/RibbonModal';
import NotificationsSetup from '../NotificationsSetup';
import CollectionDetailImageHeader from '../CollectionDetailImageHeader';
import ScrollViewWithBottomControls from '../../../components/layout/ScrollViewWithBottomControls';

// Hooks
import useUpdateCollectionAssignment from '../../hooks/useUpdateCollectionAssignment';
import useCreateOrLoadCollectionEngagement from '../../hooks/useCreateOrLoadCollectionEngagement';
import useCollectionDetail from '../../hooks/useCollectionDetail';
import useCollectionEngagement from '../../hooks/useCollectionEngagement';

// Redux
import {
  clearWorkflowCollectionEngagement,
  partialResetAfterPracticeEngagement,
  setCurrentWorkflowCollectionURL,
  loadWorkflowCollectionEngagementHistory,
  clearWorkflowHistoryForSingleCollection,
} from '../../redux/actionCreators';

const styles = StyleSheet.create({
  collectionAuthor:
    Platform.OS === 'ios'
      ? {
          fontSize: 10,
          color: MasterStyles.officialColors.density,
        }
      : {
          fontFamily: 'OpenSans-Regular',
          fontSize: 10,
          color: MasterStyles.officialColors.density,
        },
});

/**
 * CollectionDetailScreen
 *
 * This component is displayed to users when they select a Workflow Collection
 * from any of the navigation tabs.
 *
 * Because this screen is a member of all three StackNavigators, the type definition
 * is complex.
 */
function CollectionDetailScreen({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<
    HomeStackRouteOptions &
      LibraryStackRouteOptions &
      UserProfileStackRouteOptions,
    | 'CollectionDetail'
    | 'LibraryCollectionDetail'
    | 'UserProfileCollectionDetail'
  >;
  route: RouteProp<
    HomeStackRouteOptions &
      LibraryStackRouteOptions &
      UserProfileStackRouteOptions,
    | 'CollectionDetail'
    | 'LibraryCollectionDetail'
    | 'UserProfileCollectionDetail'
  >;
}) {
  // Get the URL of the Workflow Collection from Navigation Prop
  const workflowCollectionURL = route.params.id;

  const [
    isNotificationsModalVisible,
    setIsNotificationsModalVisible,
  ] = useState(false);
  const [componentHasFocus, setComponentHasFocus] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const dispatch = useDispatch();
  const safeAreaInsets = useSafeArea();

  /**
   * Pull out relevant information from the redux store for
   * interacting with the collection.
   */
  const workflowCollectionDetail = useCollectionDetail();
  const workflowCollectionEngagement = useCollectionEngagement();

  const workflowCollectionSubscription = useSelector((state: RootReduxType) =>
    state.workflows.collectionSubscriptions?.find(
      (subscription) =>
        subscription.workflow_collection === workflowCollectionURL
    )
  );

  const collectionAssignment = useSelector((state: RootReduxType) =>
    state.workflows.collectionAssignments?.find(
      (assignment) =>
        assignment.workflow_collection === workflowCollectionDetail?.self_detail
    )
  );

  const collectionEngagementHistory = useSelector((state: RootReduxType) =>
    state.workflowHistory.collectionEngagementHistory?.filter(
      (engagement) =>
        engagement.workflowcollectionengagementdetail_set.length > 0
    )
  );

  /**
   * Mounting/Unmounting Actions
   */
  useEffect(() => {
    dispatch(partialResetAfterPracticeEngagement());
    dispatch(setCurrentWorkflowCollectionURL(workflowCollectionURL));

    return () => {
      dispatch(clearWorkflowHistoryForSingleCollection());
    };
  }, []);

  // FOCUS / BLUR EFFECTS
  useFocusEffect(
    useCallback(() => {
      dispatch(clearWorkflowCollectionEngagement());
      setComponentHasFocus(true);

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
      }

      return () => {
        setComponentHasFocus(false);
      };
    }, [])
  );

  // Load Collection Engagement History
  useEffect(() => {
    if (workflowCollectionDetail)
      dispatch(
        loadWorkflowCollectionEngagementHistory({
          collectionUUID: workflowCollectionDetail.id,
        })
      );
  }, [workflowCollectionDetail]);

  useUpdateCollectionAssignment();

  const engagementReady = useCreateOrLoadCollectionEngagement(
    componentHasFocus
  );

  const toggleModal = () => {
    setIsNotificationsModalVisible(!isNotificationsModalVisible);
  };

  const renderCollectionHeaderAndDescription = () => {
    if (!workflowCollectionDetail) return null;

    const workflowAuthor = workflowCollectionDetail.authors[0];

    return (
      <Animatable.View
        animation='fadeIn'
        delay={500}
        style={[
          {
            paddingTop: 20,
            paddingBottom: 50,
            display: 'flex',
          },
          MasterStyles.common.horizontalPadding25,
        ]}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...MasterStyles.fontStyles.contentHeaderDark,
              }}
            >
              {workflowCollectionDetail.name}
            </Text>
            <Text style={styles.collectionAuthor}>
              {`Created by ${workflowAuthor.user.first_name} ${workflowAuthor.user.last_name}`}
            </Text>
          </View>
          <TouchableOpacity
            key='historyButton'
            onPress={() =>
              navigation.navigate('IndividualWorkflowHistory', {
                workflowCollectionURL: workflowCollectionDetail.self_detail,
              })
            }
            disabled={
              !collectionEngagementHistory ||
              collectionEngagementHistory.length === 0
            }
            style={{
              display:
                workflowCollectionDetail.category === 'ACTIVITY'
                  ? 'flex'
                  : 'none',
              opacity:
                collectionEngagementHistory &&
                collectionEngagementHistory.length > 0
                  ? 1
                  : 0,
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 25,
            }}
          >
            <View
              style={{
                backgroundColor: MasterStyles.officialColors.density,
                borderRadius: 15,
                height: 30,
                width: 30,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../../../assets/icons/historySmall.png')}
                style={{
                  height: 25,
                  resizeMode: 'contain',
                  tintColor: 'white',
                }}
              />
            </View>
            <Text style={styles.collectionAuthor}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingTop: 20 }}>
          <Text style={MasterStyles.fontStyles.generalContentSmallDark}>
            {workflowCollectionDetail.description}
          </Text>
          {collectionAssignment ? (
            <Text
              style={{
                paddingTop: 10,
                ...MasterStyles.fontStyles.generalContentDarkInfoHighlight,
              }}
            >
              {`This survey will expire on ${moment(
                collectionAssignment?.assigned_on
              )
                .add(30, 'days')
                .format('MMMM DD')}.`}
            </Text>
          ) : (
            <></>
          )}
        </View>
      </Animatable.View>
    );
  };

  const renderWorkflowCarousel = () => {
    return engagementReady &&
      workflowCollectionDetail &&
      workflowCollectionEngagement ? (
      <View style={[{ flexBasis: 125, justifyContent: 'space-between' }]}>
        <CollectionDetailWorkflowCarousel
          workflowCollection={workflowCollectionDetail}
          workflowCollectionEngagement={workflowCollectionEngagement}
          navigation={navigation}
          route={route}
        />
      </View>
    ) : null;
  };

  /**
   * Render the appropriate action button for the workflow collection.
   * - For activity type workflow collections, this will be an
   *   `ADD TO FAVORITIES` button.
   * - For survey type workflow collections, this will be a
   *   `START SURVEY` or `CONTINUE SURVEY` button.
   */
  const renderActionButton = () => {
    if (
      !engagementReady ||
      !workflowCollectionDetail ||
      !workflowCollectionEngagement
    )
      return null;

    const doesEngagementHaveAnyExistingDetails = workflowCollectionEngagement.workflowcollectionengagementdetail_set!
      .length
      ? true
      : false;

    return (
      <Animatable.View
        animation='fadeInUp'
        delay={750}
        style={[
          MasterStyles.common.horizontalPadding25,
          { flexBasis: 100, marginTop: 20 },
        ]}
      >
        {workflowCollectionDetail.category === 'SURVEY' ? (
          <GradientStyleButton
            noMargin
            text={
              doesEngagementHaveAnyExistingDetails
                ? 'Continue Survey'
                : 'Begin Survey'
            }
            onPress={() => {
              navigation.push('CollectionEngagement', {
                // NOTE: Allowable use of nullish operator since we know collection
                // engagement will have a next workflow value.
                workflowID: workflowCollectionEngagement.state.next_workflow?.split(
                  '/'
                )[6],
                workflowStepID: workflowCollectionEngagement.state
                  .next_step_id!,
                engagementStartedFrom: route.name,
              });
            }}
          />
        ) : (
          <GradientStyleButton
            noMargin
            text={
              !workflowCollectionSubscription ||
              !workflowCollectionSubscription.active
                ? 'Add to Favorites'
                : 'Adjust Preferences'
            }
            onPress={() => {
              setIsNotificationsModalVisible(true);
            }}
          />
        )}
      </Animatable.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar hidden={true} animated />
      <RibbonModal
        isVisible={isNotificationsModalVisible}
        toggleVisibility={toggleModal}
        ContentComponent={NotificationsSetup}
      />
      <ScrollViewWithBottomControls
        contentComponent={
          <>
            <CollectionDetailImageHeader
              workflowCollectionDetails={workflowCollectionDetail}
            />
            {renderCollectionHeaderAndDescription()}
          </>
        }
        controlsComponent={
          <View
            style={{
              paddingBottom: safeAreaInsets.bottom
                ? safeAreaInsets.bottom + 25
                : 25,
            }}
          >
            {renderWorkflowCarousel()}
            {renderActionButton()}
          </View>
        }
      />
    </View>
  );
}

export default CollectionDetailScreen;
