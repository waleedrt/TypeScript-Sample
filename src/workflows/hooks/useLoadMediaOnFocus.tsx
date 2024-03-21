import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { WorkflowStepAudioType } from '../types';

/**
 * Use the Expo Audio module to load and setup an audio file.
 *
 * @param audioUrl - The URL of the audio file to load.
 * @param audioObjectUpdateHandler - A function that will
 * be responsible for handling updates to the audio file.
 */
const loadAudio = async (
  audioUrl: string,
  audioObjectUpdateHandler: () => void,
  audioObjectRef: React.MutableRefObject<Audio.Sound>
) => {
  try {
    const soundObject = new Audio.Sound();
    soundObject.setOnPlaybackStatusUpdate(audioObjectUpdateHandler);
    await soundObject.loadAsync({ uri: audioUrl });
    audioObjectRef.current = soundObject;
    soundObject.getStatusAsync;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Unload an expo Audio object from memory.
 *
 * @param {object} mediaObjectRef
 */
const clearMedia = async (mediaObjectRef) => {
  mediaObjectRef.current.setOnPlaybackStatusUpdate(null);
  await mediaObjectRef.current.unloadAsync(); // must unload after nulling playback
};

/**
 * Custom hook which will load/unload an audio file when
 * the component gains/loses React Navigation focus.
 */
export default function useLoadAudioOnFocus(
  audioObject: WorkflowStepAudioType | undefined,
  audioObjectUpdateHandler: any,
  audioObjectRef: any
) {
  useFocusEffect(
    useCallback(() => {
      if (audioObject) {
        loadAudio(audioObject.url, audioObjectUpdateHandler, audioObjectRef);
        return () => clearMedia(audioObjectRef);
      }
    }, [])
  );
}
