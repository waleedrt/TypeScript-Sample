import React, { useState, useRef, useCallback } from 'react';
import { View, StatusBar, Dimensions, Text } from 'react-native';
import { Video } from 'expo-av';

import MasterStyles from '../../../../styles/MasterStyles';
import XButton from '../../../../components/XButton';
import MediaStepActionBar from '../../../../components/navigation/MediaStepActionBar';
import FullScreenBackground from '../../FullScreenBackground';
import { DynamicUITemplateType } from '../../../types';
import useGlobalPendingAPIOperations from '../../../../hooks/useGlobalPendingAPIOperations';
import { useSafeArea } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import WorkflowCollectionProgressBar from '../../WorkflowCollectionProgressBar';

// If you are ever have problems getting your videos to load
// and are wondering if it is a bad video on our side you can
// use this random stand-in video from Vimeo.
// const WORKING_URI =
//   'https://d3el26csp1xekx.cloudfront.net/v/wm-5b62695ef732b6005ab0f188.mp4';
const { width, height } = Dimensions.get('window');

/**
 * VideoScreen
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'video_v1'
 */
export default function VideoScreenV1({
  step,
  backAction,
  nextAction,
  cancelAction,
}: DynamicUITemplateType) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoEverStarted, setVideoEverStarted] = useState(false);
  const videoObjectRef = useRef<Video>(null);
  const pendingAPIActions = useGlobalPendingAPIOperations();

  const videoURL = step.workflowstepvideo_set.find(
    (videoObject) => videoObject.ui_identifier === 'video_file'
  )?.url;

  const videoDescriptionStepText = step.workflowsteptext_set.find(
    (stepText) => stepText.ui_identifier === 'video_description'
  );

  const videoPreviewStepImage = step.workflowstepimage_set.find(
    (stepImage) => stepImage.ui_identifier === 'video_preview'
  );

  const safeAreaInsets = useSafeArea();

  const [userHasPressedControl, setUserHasPressedControl] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setUserHasPressedControl(false);
      return () => {
        setUserHasPressedControl(true);
        pauseVideo();
      };
    }, [])
  );

  /**
   * Pause the nested video component.
   */
  const pauseVideo = () => {
    if (videoObjectRef.current) {
      videoObjectRef.current.pauseAsync();
      setVideoPlaying(false);
    }
  };

  /**
   * Play the nested video component.
   */
  const playVideo = () => {
    if (videoObjectRef.current) {
      setVideoPlaying(true);
      setVideoEverStarted(true);
      videoObjectRef.current.playAsync();
    }
  };

  /**
   * Toggle between play/pause states.
   */
  const togglePlayback = () => {
    videoPlaying ? pauseVideo() : playVideo();
  };

  /**
   * Monitor the status of the nested video component.
   */
  const monitorVideoStatus = (status: { isLoaded: boolean }) => {
    status.isLoaded ? setVideoLoaded(true) : setVideoLoaded(false);
  };

  // Note: Items are positioned absolutely since there
  // should be no chance for the content to be vertically
  // greater than the available area.
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle='light-content' animated hidden={true} />
      <XButton
        containerStyle={{
          flexBasis: 50,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          position: 'absolute',
          top: safeAreaInsets.top || 25,
          right: 25,
        }}
        onPress={cancelAction}
      />
      {!videoLoaded || !videoEverStarted ? (
        <FullScreenBackground
          backgroundImage={
            videoPreviewStepImage ? videoPreviewStepImage.url : null
          }
          gradientStart={
            videoPreviewStepImage
              ? MasterStyles.officialColors.brightSkyShade1
              : MasterStyles.officialColors.brightSkyShade2
          }
          gradientEnd={
            videoPreviewStepImage
              ? MasterStyles.officialColors.groundSunflower4
              : MasterStyles.officialColors.groundSunflower2
          }
        />
      ) : null}
      {videoURL ? (
        <Video
          source={{ uri: videoURL }}
          resizeMode={Video.RESIZE_MODE_COVER}
          ref={videoObjectRef}
          onPlaybackStatusUpdate={monitorVideoStatus}
          style={{
            width,
            height,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -200,
          }}
        />
      ) : null}

      <View
        style={[
          MasterStyles.common.horizontalPadding25,
          { width: '100%' },
          {
            position: 'absolute',
            bottom: safeAreaInsets.bottom ? safeAreaInsets.bottom + 25 : 25,
          },
        ]}
      >
        {(!videoLoaded || !videoEverStarted) && videoDescriptionStepText ? (
          <View style={{ paddingBottom: 25 }}>
            <Text style={MasterStyles.fontStyles.generalContent}>
              {videoDescriptionStepText.content}
            </Text>
          </View>
        ) : null}
        <WorkflowCollectionProgressBar />
        <MediaStepActionBar
          containerStyles={{ paddingVertical: 0 }}
          previousText='Back'
          previousAction={() => {
            setUserHasPressedControl(true);
            backAction();
          }}
          previousDisabled={
            pendingAPIActions.length !== 0 || userHasPressedControl
          }
          previousOutlineColor={MasterStyles.colors.white}
          nextText='Next'
          nextAction={() => {
            setUserHasPressedControl(true);
            nextAction();
          }}
          nextDisabled={pendingAPIActions.length !== 0 || userHasPressedControl}
          nextOutlineColor={MasterStyles.colors.white}
          mediaIconOutlineColor={MasterStyles.colors.white}
          mediaToggle={togglePlayback}
          mediaState={
            videoPlaying
              ? MediaStepActionBar.PLAYING
              : MediaStepActionBar.PAUSED
          }
        />
      </View>
    </View>
  );
}
