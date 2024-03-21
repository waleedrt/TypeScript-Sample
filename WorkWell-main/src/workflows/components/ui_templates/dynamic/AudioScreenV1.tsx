import React, { useState, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Text, Image, StatusBar } from 'react-native';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

// Definitions
import MasterStyles from '../../../../styles/MasterStyles';
import { DynamicUITemplateType } from '../../../types';

// Components
import FullScreenBackground from '../../FullScreenBackground';
import XButton from '../../../../components/XButton';
import PreviousNextButtonBar from '../../../../components/PreviousNextButtonBar';

// Hooks
import useBackgroundImage from '../../../hooks/useBackgroundImage';
import useWaitingOnAPI from '../../../hooks/useWaitingOnAPI';
import useLoadAudioOnFocus from '../../../hooks/useLoadMediaOnFocus';

// Utilities
import getMMSSFromMillis from '../../../../utils/getMMSSFromMillis';

const playIcon = require('../../../../../assets/userControl/icons/play.png');
const pauseIcon = require('../../../../../assets/userControl/icons/pause.png');
const skipForward = require('../../../../../assets/userControl/icons/forward30.png');
const skipBackward = require('../../../../../assets/userControl/icons/back15.png');

/**
 * AudioScreenV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'audio_v1'
 */
function AudioScreen({
  step,
  backAction,
  nextAction,
  cancelAction,
}: DynamicUITemplateType) {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [
    audioPlaybackUIStatusMessage,
    setAudioPlaybackUIStatusMessage,
  ] = useState('Loading...');
  const audioObjectRef = useRef<Audio.Sound>(null);
  const [totalAudioDuration, setTotalAudioDuration] = useState(0);
  const [currentAudioPosition, setCurrentAudioPosition] = useState(0);
  const [audioPercentagePlayed, setAudioPercentagePlayed] = useState(0);
  const [hasUserStartedPlayback, setHasUserStartedPlayback] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const backgroundImageURL = useBackgroundImage(step);
  const pendingAPIActions = useWaitingOnAPI();

  const safeAreaInsets = useSafeArea();

  const [userHasPressedControl, setUserHasPressedControl] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setUserHasPressedControl(false);
      activateKeepAwake();
      return () => {
        setUserHasPressedControl(true);
        deactivateKeepAwake();
      };
    }, [])
  );

  /**
   * Function that is called repeatedly when the status of the Expo Sound
   * object changes. The parameter it receives `status` is a dictionary
   * with a very large number of attributes.
   *
   * I've typed this object as any, since it has a union type
   * which requires so much extra code to type correctly
   * that it isn't worth it.
   *
   * Please see the expo documentation for reference:
   * https://docs.expo.io/versions/v36.0.0/sdk/av/#playback-status
   */
  const audioObjectUpdateHandler = (status: any) => {
    if (status.isLoaded === false && hasUserStartedPlayback) {
      setAudioPlaybackUIStatusMessage('Loading...');
    } else {
      setAudioLoaded(true);

      if (
        typeof status.positionMillis === 'number' &&
        typeof status.durationMillis === 'number'
      ) {
        setAudioPercentagePlayed(status.positionMillis / status.durationMillis);
        setTotalAudioDuration(status.durationMillis);
        setCurrentAudioPosition(status.positionMillis);
      }

      if (hasUserStartedPlayback) {
        setAudioPlaybackUIStatusMessage('');
      } else {
        const statusText = status.isBuffering ? 'Buffering...' : '';
        setAudioPlaybackUIStatusMessage(statusText);
      }
    }
  };

  useLoadAudioOnFocus(
    step.workflowstepaudio_set.find(
      (audioElement) => audioElement.ui_identifier === 'audio_file'
    ),
    audioObjectUpdateHandler,
    audioObjectRef
  );

  const audioDescription = step.workflowsteptext_set.find(
    (text) => text.ui_identifier === 'audio_description'
  )?.content;

  /**
   * Start playing the audio file.
   * Playback may not start immediately after calling this function
   * for reasons such as buffering. Make sure to update your UI based
   * on the isPlaying and isBuffering properties of the PlaybackStatus
   * (described below).
   */
  const startPlayback = () => {
    if (audioObjectRef.current) {
      audioObjectRef.current.playAsync();
      setAudioPlaying(true);
      setHasUserStartedPlayback(true);
      setAudioPlaybackUIStatusMessage('');
    }
  };

  /**
   * Pause playback of the audio file.
   */
  const pausePlayback = () => {
    if (audioObjectRef.current) {
      setAudioPlaying(false);
      audioObjectRef.current.pauseAsync();
    }
  };

  /**
   * Method attached to UI button to toggle playback/pause.
   */
  const togglePlayback = () => {
    audioPlaying ? pausePlayback() : startPlayback();
  };

  /**
   * Move 15 seconds backwards in the audio file.
   */
  const moveBackward15Seconds = () => {
    if (audioObjectRef.current)
      audioObjectRef.current.setPositionAsync(currentAudioPosition - 15000);
  };

  /**
   * Move 30 seconds forward in the audio file.
   */
  const moveFoward30Seconds = () => {
    if (audioObjectRef.current)
      audioObjectRef.current.setPositionAsync(currentAudioPosition + 30000);
  };

  const renderAudioControls = () => {
    return (
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <View
          key='audioControls'
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 250,
            justifyContent: 'space-around',
          }}
        >
          <TouchableOpacity onPress={() => moveBackward15Seconds()}>
            <Image source={skipBackward} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayback()}>
            <Image source={audioPlaying ? pauseIcon : playIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => moveFoward30Seconds()}>
            <Image source={skipForward} />
          </TouchableOpacity>
        </View>
        <View key='progressBar' style={{ marginTop: 10, width: 200 }}>
          <View
            style={{
              position: 'absolute',
              borderColor: 'white',
              borderWidth: 1,
              backgroundColor: 'white',
              height: 10,
              width: audioPercentagePlayed * 200,
              borderRadius: 5,
              opacity: audioPercentagePlayed * 25,
            }}
          />
          <View
            style={{
              position: 'absolute',
              borderColor: 'white',
              borderWidth: 1,
              height: 10,
              width: 200,
              borderRadius: 5,
            }}
          />
          <View
            key='Timestamps'
            style={{
              flexDirection: 'row',
              marginTop: 15,
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                ...MasterStyles.fontStyles.generalContentSmall,
                fontSize: 12,
              }}
            >
              {getMMSSFromMillis(currentAudioPosition)}
            </Text>
            <Text
              style={{
                ...MasterStyles.fontStyles.generalContentSmall,
                fontSize: 12,
              }}
            >
              {audioPlaybackUIStatusMessage}
            </Text>
            <Text
              style={{
                ...MasterStyles.fontStyles.generalContentSmall,
                fontSize: 12,
              }}
            >
              {getMMSSFromMillis(totalAudioDuration)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: safeAreaInsets.top || 25 }}>
      <FullScreenBackground backgroundImage={backgroundImageURL} />
      <StatusBar barStyle='light-content' animated hidden={true} />
      <XButton
        containerStyle={{
          flexBasis: 50,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingRight: 25,
        }}
        onPress={cancelAction}
      />
      <View
        style={{
          flex: 1,
          paddingTop: 100,
          alignItems: 'center',
          marginBottom: 50,
        }}
      >
        {renderAudioControls()}
      </View>
      <View
        style={[
          MasterStyles.common.horizontalPadding25,
          { width: '100%' },
          { position: 'absolute', bottom: safeAreaInsets.bottom },
        ]}
      >
        {audioDescription ? (
          <Text
            style={{
              // paddingBottom: 25,
              ...MasterStyles.fontStyles.generalContent,
            }}
          >
            {audioDescription}
          </Text>
        ) : (
          <></>
        )}
        <PreviousNextButtonBar
          previousText='Back'
          previousAction={() => {
            setUserHasPressedControl(true);
            backAction();
          }}
          previousDisabled={pendingAPIActions || userHasPressedControl}
          previousOutlineColor={MasterStyles.colors.white}
          nextText='Next'
          nextAction={() => {
            setUserHasPressedControl(true);
            nextAction();
          }}
          nextDisabled={pendingAPIActions || userHasPressedControl}
          nextOutlineColor={MasterStyles.colors.white}
        />
      </View>
    </View>
  );
}

export default AudioScreen;
