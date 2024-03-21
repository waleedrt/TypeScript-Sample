import React from 'react';
import { Dimensions, LayoutChangeEvent } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient as LinearGradientSvg,
  Path,
  Rect,
  Stop,
  Text as SVGText,
  TSpan,
} from 'react-native-svg';
import MasterStyles from '../../styles/MasterStyles';

const deviceWidth = Dimensions.get('window').width;

const width = 2600;
const height = 2560;
const outerRadius = 1100;
const innerRadius = 400;
const dotRadius = 10;
const root2 = 1.4142135623731;

type DimensionData = {
  label: string;
  score: number;
  description: string;
  subdimensions: Array<{
    code: string;
    label: string;
    score: number;
    description: string;
  }>;
};

type WellbeingDimensionProps = {
  currentDimensionData: DimensionData;
  previousDimensionData: DimensionData | null;
  onLayout: (event: LayoutChangeEvent) => void;
};

WellbeingDimension.defaultProps = {
  onLayout: () => null,
};

export default function WellbeingDimension({
  currentDimensionData,
  previousDimensionData,
  onLayout,
}: WellbeingDimensionProps) {
  const portholeWidth = 1300;
  const fontSize = 0.08 * portholeWidth;
  const DASHED_BREATHING_ROOM = 0.02 * portholeWidth;
  const wave_y = portholeWidth * (0.5 - currentDimensionData.score / 5);
  const wave_amplitude =
    portholeWidth *
    0.5 *
    Math.min(
      0.2,
      currentDimensionData.score / 5,
      1 - currentDimensionData.score / 5
    );
  const text_x =
    portholeWidth * -0.5 * Math.sqrt(1 - ((wave_y / portholeWidth) * 2) ** 2);

  let past_wave_y;
  let past_wave_amplitude;
  let past_text_x;

  if (previousDimensionData) {
    past_wave_y = portholeWidth * (0.5 - previousDimensionData.score / 5);
    past_wave_amplitude =
      portholeWidth *
      0.5 *
      Math.min(
        0.2,
        previousDimensionData.score / 5,
        1 - previousDimensionData.score / 5
      );
    past_text_x =
      portholeWidth *
      0.5 *
      Math.sqrt(1 - ((past_wave_y / portholeWidth) * 2) ** 2);
  }

  const fadedBackgroundCircle = <Circle r={outerRadius} fill={'#e4e5e6'} />;

  const electrons = (
    <G fillOpacity={0} opacity={0.2} strokeWidth={90} stroke='white'>
      <Ellipse ry={outerRadius - 45} rx={500} />
      <Ellipse ry={outerRadius - 45} rx={500} transform='rotate(60)' />
      <Ellipse ry={outerRadius - 45} rx={500} transform='rotate(-60)' />
    </G>
  );

  const dissectingLines = (
    <G>
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
    </G>
  );

  return (
    <Svg
      style={[
        {
          display: 'flex',
          maxWidth: deviceWidth - 50,
          maxHeight: deviceWidth - 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          marginTop: 50,
          marginBottom: 50,
        },
        MasterStyles.common.verticalMargins25,
        MasterStyles.common.horizontalMargins25,
      ]}
      height={deviceWidth}
      width='100%'
      // @ts-ignore
      viewBox={[-width / 2, -height + width / 2, width, height]}
      onLayout={onLayout}
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
        <ClipPath id='porthole'>
          <Circle r={portholeWidth / 2} />
        </ClipPath>
      </Defs>
      <G fill='url(#grad)'>
        {fadedBackgroundCircle}
        {electrons}
        {dissectingLines}
      </G>
      <G clipPath='url(#porthole)'>
        <Rect
          x={-portholeWidth / 2}
          y={-portholeWidth / 2}
          width={portholeWidth}
          height={portholeWidth}
          fill={'#209989'}
          fillOpacity={1}
        />
        <Path
          fill={'#1C6F6F'}
          d={[
            'M',
            portholeWidth * (-0.5 - 0.2 * 0.62),
            wave_y,
            'q',
            portholeWidth * 0.1,
            wave_amplitude,
            portholeWidth * 0.2,
            0,
            't',
            portholeWidth * 0.2,
            0,
            portholeWidth * 0.2,
            0,
            portholeWidth * 0.2,
            0,
            portholeWidth * 0.2,
            0,
            portholeWidth * 0.2,
            0,
            'V',
            portholeWidth * 1,
            'H',
            portholeWidth * -1,
            'z',
          ].join(' ')}
        />
        {previousDimensionData ? (
          <Path
            fillOpacity={0}
            stroke='black'
            strokeWidth={10}
            d={[
              'M',
              portholeWidth * (-0.5 - 0.2 * 0.24),
              past_wave_y,
              'q',
              portholeWidth * 0.1,
              past_wave_amplitude,
              portholeWidth * 0.2,
              0,
              't',
              portholeWidth * 0.2,
              0,
              portholeWidth * 0.2,
              0,
              portholeWidth * 0.2,
              0,
              portholeWidth * 0.2,
              0,
              portholeWidth * 0.2,
              0,
            ].join(' ')}
          />
        ) : null}
      </G>
      <G>
        <SVGText
          y={wave_y + (fontSize * 0.35) / 2}
          x={portholeWidth * (-1 / 2 - 0.2)}
          textAnchor='end'
          fontSize={fontSize}
          fill={'black'}
        >
          TODAY
        </SVGText>
        <Line
          stroke={'#219594'}
          strokeWidth={13}
          strokeLinecap={'round'}
          strokeDasharray={'26,26'}
          x1={portholeWidth * (-1 / 2 - 0.2) + DASHED_BREATHING_ROOM}
          y1={wave_y}
          x2={text_x - DASHED_BREATHING_ROOM}
          y2={wave_y}
        />
        {previousDimensionData ? (
          <G>
            <SVGText
              x={portholeWidth * (1 / 2 + 0.2)}
              y={past_wave_y - fontSize * 0.2}
              textAnchor='start'
              fontSize={fontSize}
              fill={'black'}
            >
              <TSpan>LAST</TSpan>
              <TSpan x={portholeWidth * (1 / 2 + 0.2)} dy={fontSize}>
                TIME
              </TSpan>
            </SVGText>
            <Line
              stroke={'#219594'}
              strokeWidth={13}
              strokeLinecap={'round'}
              strokeDasharray={'26,26'}
              x1={portholeWidth * (1 / 2 + 0.2) - DASHED_BREATHING_ROOM}
              y1={past_wave_y}
              x2={past_text_x + DASHED_BREATHING_ROOM}
              y2={past_wave_y}
            />
          </G>
        ) : null}
      </G>
    </Svg>
  );
}
