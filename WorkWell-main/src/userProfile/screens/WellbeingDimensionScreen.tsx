import React from 'react';
import { View, ScrollView, StatusBar, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import MasterStyles from '../../styles/MasterStyles';
import GradientScreenTitle from '../../components/GradientScreenTitle';
import SectionHeader from '../../components/SectionHeader';

import useWellbeingProfileData from '../hooks/useWellbeingProfileData';
import useLatestWellbeingInsightsData from '../hooks/useLatestWellbeingInsightsData';
import SubdimensionCarousel from '../components/SubdimensionCarousel';
import WellbeingDimension from '../components/DimensionView';
import { UserProfileStackRouteOptions } from '../../main/navigators/UserProfileStackNavigator';
import { RouteProp } from '@react-navigation/native';

/**
 * The WellbeingDimensionScreen is presented to the user when they
 * click on one of the dimensions from the "Wellbeing Profile" tab of the app.
 *
 * On this screen, they can learn more about Wellbeing Model
 * and see personal results and recommendations if they
 * have taken the survey.
 */
function WellbeingDimensionScreen({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<
    UserProfileStackRouteOptions,
    'WellbeingDimension'
  >;
  route: RouteProp<UserProfileStackRouteOptions, 'WellbeingDimension'>;
}) {
  const dimensionName = route.params.dimensionName;
  const profileData = useWellbeingProfileData();
  const insightsData = useLatestWellbeingInsightsData();

  const currentDimensionData = profileData.current![
    dimensionName.toLowerCase()
  ];
  const previousDimensionData = profileData.previous
    ? profileData.previous[dimensionName.toLowerCase()]
    : null;

  const dimensionDescriptionSection = (
    <View style={MasterStyles.common.horizontalPadding25}>
      <SectionHeader
        text='About This Dimension'
        color={MasterStyles.officialColors.brightSkyShade2}
        containerStyle={{ paddingBottom: 10 }}
      />
      <Text style={MasterStyles.fontStyles.generalContentDark}>
        {currentDimensionData.description}
      </Text>
    </View>
  );

  const dimensionInsights = !insightsData ? (
    <></>
  ) : (
    <View style={MasterStyles.common.horizontalPadding25}>
      <SectionHeader
        text={`${dimensionName} Insights`}
        color={MasterStyles.officialColors.brightSkyShade2}
        containerStyle={{ paddingTop: 35, paddingBottom: 10 }}
      />
      {insightsData[dimensionName.toLowerCase()].map((insight, index) => (
        <View key={index}>
          <Text
            style={[
              MasterStyles.fontStyles.generalContentSmallDark,
              {
                color: MasterStyles.officialColors.graphite,
                fontWeight: '500',
              },
            ]}
          >{`Insight ${index + 1}`}</Text>
          <Text
            style={[
              MasterStyles.fontStyles.generalContentSmallDark,
              { paddingBottom: 15 },
            ]}
          >
            {insight}
          </Text>
        </View>
      ))}
    </View>
  );

  const subdimensions = (
    <View>
      <SectionHeader
        text={`${dimensionName} Subdimensions`}
        color={MasterStyles.officialColors.brightSkyShade2}
        containerStyle={{
          paddingTop: 35,
          paddingBottom: 10,
          paddingHorizontal: 25,
        }}
      />
      <SubdimensionCarousel
        currentDimensionData={currentDimensionData}
        previousDimensionData={previousDimensionData}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle='light-content' animated />
      <View style={{ flex: 1 }}>
        <GradientScreenTitle
          text={dimensionName}
          onIconPress={() => navigation.goBack()}
          icon='close'
          colorSets={[
            [
              MasterStyles.officialColors.mermaidShade2,
              MasterStyles.officialColors.brightSkyShade2,
            ],
          ]}
          positionSets={[{ start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }]}
        />
        <ScrollView>
          <WellbeingDimension
            currentDimensionData={currentDimensionData}
            previousDimensionData={previousDimensionData}
          />
          {dimensionDescriptionSection}
          {dimensionInsights}
          {subdimensions}
        </ScrollView>
      </View>
    </View>
  );
}

export default WellbeingDimensionScreen;
