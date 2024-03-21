import React from 'react';
import { View, ViewStyle } from 'react-native';
import MasterStyles from '../../styles/MasterStyles';
import StylizedButton from '../StylizedButton';

const playIcon = require('../../../assets/icons/play.png');
const pauseIcon = require('../../../assets/icons/pause.png');

type MediaStepActionBar = {
  previousAction: () => void;
  previousTextColor: string;
  previousColor: string | null;
  previousOutlineColor: string | null;
  previousText: string;
  previousDisabled: boolean;
  nextAction: () => void;
  nextTextColor: string;
  nextColor: string | null;
  nextOutlineColor: string | null;
  nextText: string;
  nextDisabled: boolean;
  mediaIconColor: string;
  mediaIconBackgroundColor: string | null;
  mediaIconOutlineColor: string | null;
  mediaState: string; // = MediaStepActionBar.PAUSED,
  mediaLoading: boolean;
  mediaToggle: () => void;
  containerStyles?: ViewStyle;
};

export default function MediaStepActionBar({
  previousAction,
  previousTextColor,
  previousColor,
  previousOutlineColor,
  previousText,
  previousDisabled,
  nextAction,
  nextTextColor,
  nextColor,
  nextOutlineColor,
  nextText,
  nextDisabled,
  mediaIconColor,
  mediaIconBackgroundColor,
  mediaIconOutlineColor,
  mediaState,
  mediaLoading,
  mediaToggle,
  containerStyles = {},
}: MediaStepActionBar) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        },
        containerStyles,
      ]}
    >
      <StylizedButton
        image={mediaState === MediaStepActionBar.PAUSED ? playIcon : pauseIcon}
        onPress={mediaToggle}
        noMargin
        backgroundColor={mediaIconBackgroundColor}
        outlineColor={mediaIconOutlineColor}
        textColor={mediaIconColor}
        disabled={mediaLoading}
        additionalContainerStyles={{ maxWidth: 75 }}
      />
      <View style={{ width: 25 }} />
      <StylizedButton
        text={previousText}
        onPress={previousAction}
        noMargin
        backgroundColor={previousColor}
        outlineColor={previousOutlineColor}
        textColor={previousTextColor}
        disabled={previousDisabled}
      />
      <View style={{ width: 10 }} />
      <StylizedButton
        text={nextText}
        onPress={nextAction}
        noMargin
        backgroundColor={nextColor}
        outlineColor={nextOutlineColor}
        textColor={nextTextColor}
        disabled={nextDisabled}
      />
    </View>
  );
}

MediaStepActionBar.PAUSED = 'paused';
MediaStepActionBar.PLAYING = 'playing';

MediaStepActionBar.defaultProps = {
  previousTextColor: MasterStyles.colors.white,
  previousColor: null,
  previousOutlineColor: null,
  previousDisabled: false,
  nextTextColor: MasterStyles.colors.white,
  nextColor: null,
  nextOutlineColor: null,
  nextDisabled: false,
  mediaIconColor: MasterStyles.colors.white,
  mediaIconBackgroundColor: null,
  mediaIconOutlineColor: null,
  mediaState: MediaStepActionBar.PAUSED,
  mediaLoading: false,
  mediaToggle: () => null,
};
