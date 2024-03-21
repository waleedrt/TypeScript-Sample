import React from 'react';
import {
  View,
  Dimensions,
  LayoutChangeEvent,
  Text,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient as LinearGradientSvg,
  Path,
  Stop,
  Text as SVGText,
  TSpan,
} from 'react-native-svg';
import MasterStyles from '../../styles/MasterStyles';
import useWellbeingProfileData from '../hooks/useWellbeingProfileData';
import WellbeingOverlay from './WellbeingProfileOverlay';
import { StackNavigationProp } from '@react-navigation/stack';
import { UserProfileStackRouteOptions } from '../../main/navigators/UserProfileStackNavigator';
const deviceWidth = Dimensions.get('window').width;

const width = 2560;
const height = 2560;
const strokeWidth = 20;
const outerRadius = 1100;
const innerRadius = 400;
const dotRadius = 10;
const root2 = 1.4142135623731;
const textSize = 90;
const darkCircleRadius = innerRadius + (outerRadius - innerRadius) / 5;

type PlotCoordinate = {
  x: number;
  y: number;
};

type WellbeingProfileProps = {
  onLayout: (event: LayoutChangeEvent) => void;
};

/**
 * The WellbeingProfile component displays the user's latest
 * wellbeing dimension data in the iconic circle/donut shape.
 */
export default function WellbeingProfile({ onLayout }: WellbeingProfileProps) {
  const profileData = useWellbeingProfileData();
  const navigation = useNavigation<
    StackNavigationProp<UserProfileStackRouteOptions, 'WellbeingProfile'>
  >();

  const fadedBackgroundCircle = <Circle r={outerRadius} fillOpacity={0.45} />;

  const dimensionWedge = (
    start: PlotCoordinate,
    end: PlotCoordinate,
    score = 5
  ) => {
    const r = innerRadius + (score * (outerRadius - innerRadius)) / 5;
    return (
      <Path
        d={[
          'M',
          0,
          0,
          'L',
          (start.x * r) / root2,
          (start.y * r) / root2,
          'A',
          r,
          r,
          90,
          0,
          1,
          (end.x * r) / root2,
          (end.y * r) / root2,
          'Z',
        ].join(' ')}
      />
    );
  };

  const DimensionWedges = () => (
    <G>
      {dimensionWedge(
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        profileData.current?.resilience.score ?? 0
      )}
      {dimensionWedge(
        { x: -1, y: 1 },
        { x: -1, y: -1 },
        profileData.current?.happiness.score ?? 0
      )}
      {dimensionWedge(
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        profileData.current?.thriving.score ?? 0
      )}
      {dimensionWedge(
        { x: 1, y: 1 },
        { x: -1, y: 1 },
        profileData.current?.authenticity.score ?? 0
      )}
    </G>
  );

  const clickableDimensionWedgeOverlay = (
    start: PlotCoordinate,
    end: PlotCoordinate,
    dimensionName: string
  ) => {
    return (
      <Path
        d={[
          'M',
          0,
          0,
          'L',
          (start.x * outerRadius) / root2,
          (start.y * outerRadius) / root2,
          'A',
          outerRadius,
          outerRadius,
          90,
          0,
          1,
          (end.x * outerRadius) / root2,
          (end.y * outerRadius) / root2,
          'Z',
        ].join(' ')}
        // START HERE - IS DISABLE & onPress both necessary?
        disabled={!profileData.current}
        onPress={() => {
          if (profileData.current) {
            navigation.navigate('WellbeingDimension', {
              dimensionName: dimensionName,
            });
          }
        }}
      />
    );
  };

  const clickableDimensionWedgeOverlays = (
    <G fillOpacity={0}>
      {clickableDimensionWedgeOverlay(
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        'Resilience'
      )}
      {clickableDimensionWedgeOverlay(
        { x: -1, y: 1 },
        { x: -1, y: -1 },
        'Happiness'
      )}
      {clickableDimensionWedgeOverlay(
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        'Thriving'
      )}
      {clickableDimensionWedgeOverlay(
        { x: 1, y: 1 },
        { x: -1, y: 1 },
        'Authenticity'
      )}
    </G>
  );

  const outerRing = (
    <Circle
      r={width / 2 - strokeWidth / 2}
      stroke='#e9e9e9'
      strokeWidth={strokeWidth}
      strokeDasharray='40 20'
      fillOpacity={0}
    />
  );

  const electrons = (
    <G fillOpacity={0} opacity={0.2}>
      <Ellipse ry={800} rx={innerRadius - 30} strokeWidth={80} stroke='white' />
      <Ellipse
        ry={800}
        rx={innerRadius - 30}
        strokeWidth={80}
        stroke='white'
        transform='rotate(60)'
      />
      <Ellipse
        ry={800}
        rx={innerRadius - 30}
        strokeWidth={80}
        stroke='white'
        transform='rotate(-60)'
      />
    </G>
  );

  const darkCircleAroundWhiteCenter = (
    <Circle r={darkCircleRadius} fill='#4f4c4d' fillOpacity={0.55} />
  );

  const dissectingLines = (
    <>
      <Line
        x1={-outerRadius / root2}
        y1={outerRadius / root2}
        x2={outerRadius / root2}
        y2={-outerRadius / root2}
        strokeWidth={40}
        stroke='white'
      />
      <Line
        x1={-outerRadius / root2}
        y1={-outerRadius / root2}
        x2={outerRadius / root2}
        y2={outerRadius / root2}
        strokeWidth={40}
        stroke='white'
      />
      <G id='dots'>
        {[-1, 1].map((x_sign) => {
          return [-1, 1].map((y_sign) => {
            return [1, 2, 3, 4, 5].map((i) => {
              return (
                <Circle
                  r={dotRadius}
                  x={
                    x_sign *
                    (innerRadius / root2 +
                      (i * (outerRadius - innerRadius)) / (5 * root2))
                  }
                  y={
                    y_sign *
                    (innerRadius / root2 +
                      (i * (outerRadius - innerRadius)) / (5 * root2))
                  }
                  key={'' + x_sign + y_sign + i}
                />
              );
            });
          });
        })}
      </G>
    </>
  );

  const innermostCircle = (
    <Circle r={innerRadius} fill='white' fillOpacity={1} />
  );

  const extraMoop = 100;
  const textOverlay = (
    <SVGText
      fill='white'
      fillOpacity={1}
      textAnchor='middle'
      fontSize={textSize}
    >
      <TSpan x={-(outerRadius + darkCircleRadius) / 2} y={textSize / 2}>
        HAPPINESS
      </TSpan>
      <TSpan x={(outerRadius + darkCircleRadius) / 2} y={textSize / 2}>
        THRIVING
      </TSpan>
      <TSpan
        x={0}
        y={-(outerRadius + darkCircleRadius) / 2 + textSize / 2 + extraMoop}
      >
        RESILIENCE
      </TSpan>
      <TSpan
        x={0}
        y={(outerRadius + darkCircleRadius) / 2 + textSize / 2 + extraMoop}
      >
        AUTHENTICITY
      </TSpan>
    </SVGText>
  );

  return (
    <>
      <View
        onLayout={onLayout}
        style={[
          {
            maxWidth: deviceWidth - 50,
            maxHeight: deviceWidth - 50,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50,
            marginBottom: 75,
          },
          MasterStyles.common.verticalMargins25,
          MasterStyles.common.horizontalMargins25,
        ]}
      >
        <Svg
          height={deviceWidth}
          width='100%'
          // @ts-ignore
          viewBox={[-width / 2, -height + width / 2, width, height]}
          style={{ top: -10, position: 'absolute' }}
        >
          <Defs>
            <LinearGradientSvg
              gradientUnits='userSpaceOnUse'
              x1={-outerRadius}
              x2={outerRadius}
              id='grad'
            >
              <Stop offset='0' stopColor='#00a650' />
              <Stop offset='1' stopColor='#00adef' />
            </LinearGradientSvg>
          </Defs>
          <G fill='url(#grad)'>
            {fadedBackgroundCircle}
            <DimensionWedges />
            {electrons}
            {darkCircleAroundWhiteCenter}
            {dissectingLines}
          </G>
          {textOverlay}
          {innermostCircle}
        </Svg>
        <WellbeingOverlay />
        <Svg
          height={deviceWidth}
          width='100%'
          // @ts-ignore
          viewBox={[-width / 2, -height + width / 2, width, height]}
          style={{ top: -10, position: 'absolute' }}
        >
          {clickableDimensionWedgeOverlays}
        </Svg>
      </View>
      <View style={{ position: 'relative', top: -20, paddingBottom: 15 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            color: MasterStyles.officialColors.cloudy,
            textAlign: 'center',
            ...(Platform.OS === 'ios'
              ? { fontFamily: 'System' }
              : { fontFamily: 'OpenSans-SemiBold' }),
          }}
        >
          SELECT A DIMENSION TO LEARN MORE
        </Text>
      </View>
    </>
  );
}
