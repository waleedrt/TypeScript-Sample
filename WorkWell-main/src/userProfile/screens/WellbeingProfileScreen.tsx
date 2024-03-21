import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Platform,
  InteractionManager,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect, RouteProp } from '@react-navigation/native';

// Components & Styles
import MasterStyles from '../../styles/MasterStyles';
import GradientScreenTitle from '../../components/GradientScreenTitle';
import StylizedButton from '../../components/StylizedButton';
import SectionHeader from '../../components/SectionHeader';
import WellbeingProfile from '../components/WellbeingProfile';
import InfoMessageSmall from '../../components/InfoMessageSmall';

// Hooks
import useRecommendedCollections from '../../workflows/hooks/useRecommendedCollections';
import RecommendedCollectionsCarousel from '../components/RecommendedCollectionsCarousel';
import useCreateOrLoadCollectionEngagement from '../../workflows/hooks/useCreateOrLoadCollectionEngagement';
import useCollectionDetail from '../../workflows/hooks/useCollectionDetail';

// Redux
import {
  setCurrentWorkflowCollectionURL,
  loadWorkflowCollectionRecommendations,
  partialResetAfterPracticeEngagement,
} from '../../workflows/redux/actionCreators';
import {
  loadWellbeingProfileData,
  loadWellbeingInsightsData,
  requestWellbeingResultsPDF,
  resetRequestWellbeingResultsPDF,
} from '../actionCreators';

// Types
import { RootReduxType } from '../../../config/configureStore';
import { WorkflowCollectionType } from '../../workflows/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfileStackRouteOptions } from '../../main/navigators/UserProfileStackNavigator';
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';
import useWellbeingProfileData from '../hooks/useWellbeingProfileData';
import ErrorMessage from '../../components/modals/ErrorMessage';

/**
 * The WellbeingProfileScreen is displayed to users when they
 * select the "Profile" tab of the application.
 *
 * On this screen the user is able to:
 * - View their wellbeing profile
 * - Access detailed reports on each wellbeing dimension
 * - Learn more about the wellbeing model
 * - View and engage in recommended practices
 */
function WellbeingProfileScreen({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<
    UserProfileStackRouteOptions,
    'WellbeingProfile'
  >;
  route: RouteProp<UserProfileStackRouteOptions, 'WellbeingProfile'>;
}) {
  const [componentIsReady, setComponentIsReady] = useState(false);
  const [profileSVGHeight, setProfileSVGHeight] = useState(0);
  const [nonSVGContentHeight, setNonSVGContentHeight] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);

  const wellbeingProfileData = useWellbeingProfileData();

  const profileWorkflowCollections = useSelector((state: RootReduxType) =>
    state.workflows.collections.filter((collection) =>
      collection.tags.includes('Wellbeing Profile')
    )
  );

  const wellbeingProfilePDFRequestStatus = useSelector(
    (state: RootReduxType) =>
      state.chronologicalUserProfile.wellbeingResultsPDFEmailRequest
  );

  const workflowCollectionRecommendations = useRecommendedCollections(true);
  const workflowCollection = useCollectionDetail();
  const oAuthTokenStatus = useSelector((state: RootReduxType) => {
    return state.auth.tokens.status;
  });

  const pendingAPIOperations = useGlobalPendingAPIOperations();

  const dispatch = useDispatch();

  // Focus / Blur Callbacks
  useFocusEffect(
    useCallback(() => {
      if (oAuthTokenStatus !== 'Received') {
        console.log('WAITING: Profile Screen');
      } else {
        console.log('DONE WAITING: Profile Screen');
        dispatch(loadWorkflowCollectionRecommendations());
        dispatch(loadWellbeingProfileData());
        dispatch(loadWellbeingInsightsData());
        dispatch(resetRequestWellbeingResultsPDF());

        InteractionManager.runAfterInteractions(() => {
          dispatch(partialResetAfterPracticeEngagement());
          setDisableButtons(false);
          setComponentIsReady(true);
        });
      }

      return () => {
        dispatch(resetRequestWellbeingResultsPDF());
        setComponentIsReady(false);
      };
    }, [oAuthTokenStatus])
  );

  const engagementReady = useCreateOrLoadCollectionEngagement(componentIsReady);

  // Setup an effect that will load a information workflow once it has finished loading.
  useEffect(() => {
    if (componentIsReady && workflowCollection && engagementReady) {
      console.log('Ready to Start Workflow Engagement');
      const orderedWorkflowCollectionMembers = workflowCollection.workflowcollectionmember_set.sort(
        (memberOne, memberTwo) => memberOne.order - memberTwo.order
      );

      navigation.push('CollectionEngagement', {
        workflowID: orderedWorkflowCollectionMembers[0].workflow.detail.split(
          '/'
        )[6],
        engagementStartedFrom: route.name,
      });
    }
  }, [workflowCollection, engagementReady]);

  useEffect(() => {
    if (
      wellbeingProfilePDFRequestStatus === 'completed' ||
      wellbeingProfilePDFRequestStatus === 'failed'
    )
      setDisableButtons(false);
  }, [wellbeingProfilePDFRequestStatus]);

  const startInformationCollectionEngagement = (
    collection: WorkflowCollectionType
  ) => {
    dispatch(setCurrentWorkflowCollectionURL(collection.detail));
  };

  const divider = (color: string) => (
    <View
      style={[
        {
          borderBottomColor: color,
          borderBottomWidth: 1,
        },
      ]}
    />
  );

  const wellbeingProfileInformationalCollectionsAndEmailSurvey = (
    <View style={MasterStyles.common.horizontalPadding25}>
      <SectionHeader
        text='Want to learn more?'
        color={MasterStyles.officialColors.brightSkyShade2}
        containerStyle={{ paddingBottom: 10 }}
      />
      {profileWorkflowCollections.map((collection) => (
        <View key={collection.code}>
          {divider(MasterStyles.officialColors.cloudy)}
          <StylizedButton
            text={collection.name}
            textColor={MasterStyles.officialColors.graphite}
            noMargin
            noPadding
            image={require('../../../assets/icons/chevronRight.png')}
            imageOnLeft={false}
            uppercase={false}
            additionalTextStyles={
              Platform.OS === 'ios'
                ? { fontWeight: '400' }
                : { fontFamily: 'OpenSans-Regular', letterSpacing: -0.5 }
            }
            disabled={
              disableButtons ||
              !componentIsReady ||
              pendingAPIOperations.length !== 0
            }
            onPress={() => {
              setDisableButtons(true);
              startInformationCollectionEngagement(collection);
            }}
          />
        </View>
      ))}
      {wellbeingProfileData.current && (
        <View key='emailSurveyHistory'>
          {divider(MasterStyles.officialColors.cloudy)}
          {wellbeingProfilePDFRequestStatus === 'completed' ? (
            <Text
              style={{
                ...MasterStyles.fontStyles.buttonFont,
                ...(Platform.OS === 'ios'
                  ? { fontWeight: '400' }
                  : { fontFamily: 'OpenSans-Regular', letterSpacing: -0.5 }),
                color: MasterStyles.officialColors.graphite,
                paddingVertical: 10,
              }}
            >
              Your request is being processed and should arrive in less than 15
              minutes.
            </Text>
          ) : (
            <StylizedButton
              text='Send Full Profile to my Email'
              textColor={MasterStyles.officialColors.graphite}
              noMargin
              noPadding
              image={require('../../../assets/icons/general/mail.png')}
              imageOnLeft={false}
              uppercase={false}
              additionalTextStyles={
                Platform.OS === 'ios'
                  ? { fontWeight: '400' }
                  : { fontFamily: 'OpenSans-Regular', letterSpacing: -0.5 }
              }
              disabled={
                disableButtons ||
                !componentIsReady ||
                pendingAPIOperations.length !== 0
              }
              onPress={() => {
                dispatch(requestWellbeingResultsPDF());
                setDisableButtons(true);
                console.log('Dispatch Action to Send Email');
              }}
            />
          )}
        </View>
      )}
      {divider(MasterStyles.officialColors.cloudy)}
    </View>
  );

  const wellbeingProfileRecommendedCollections = (
    <View>
      <SectionHeader
        text='Recommended Practices'
        color={MasterStyles.officialColors.brightSkyShade2}
        containerStyle={[
          MasterStyles.common.horizontalPadding25,
          { paddingTop: 50, paddingBottom: 10 },
        ]}
      />

      {workflowCollectionRecommendations?.length ? (
        <RecommendedCollectionsCarousel
          navigation={navigation}
          workflowCollections={workflowCollectionRecommendations}
        />
      ) : (
        <InfoMessageSmall
          message='Unlock personalized recommendations by completing your Wellbeing
        Assessment'
          textColor={MasterStyles.officialColors.graphite}
          iconColor={MasterStyles.officialColors.density}
          containerStyleOverrides={[
            MasterStyles.common.horizontalMargins25,
            { paddingBottom: 25 },
          ]}
        />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle='light-content'
        animated
        translucent={true}
        backgroundColor={MasterStyles.colors.blackOpaque}
      />
      <ErrorMessage stateSegmentOfInterest='chronologicalUserProfile' />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <GradientScreenTitle
          text='Wellbeing Profile'
          onIconPress={() => navigation.navigate('Settings')}
          icon='settings'
          colorSets={[
            [
              MasterStyles.officialColors.mermaidShade2,
              MasterStyles.officialColors.brightSkyShade2,
            ],
          ]}
          positionSets={[{ start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }]}
        />
        <ScrollView
          contentContainerStyle={{
            minHeight: profileSVGHeight + nonSVGContentHeight + 215,
          }}
          style={{ flex: 1 }}
        >
          <WellbeingProfile
            onLayout={(event) => {
              setProfileSVGHeight(event.nativeEvent.layout.height);
            }}
          />
          <View
            onLayout={(event) =>
              setNonSVGContentHeight(event.nativeEvent.layout.height)
            }
          >
            {wellbeingProfileInformationalCollectionsAndEmailSurvey}
            {wellbeingProfileRecommendedCollections}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default WellbeingProfileScreen;
