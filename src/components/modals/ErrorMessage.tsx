import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Sentry from 'sentry-expo';

// Definitions
import MasterStyles from '../../styles/MasterStyles';
import { RootReduxType } from '../../../config/configureStore';

// Components
import StylizedButton from '../StylizedButton';
import SolidTopModalWithCustomHeaderText from './SolidTopModalWithCustomHeaderText';

// Redux
import authActions from '../../auth/actionCreators';
import {
  clearError as clearWorkflowsError,
  clearWorkflowHistoryError,
} from '../../workflows/redux/actionCreators';
import { clearUserProfileError } from '../../userProfile/actionCreators';

/**
 * Error messages from the API may take the following
 * forms in the Redux store.
 *
 * status: 403
 * {
 *  "detail": "Authentication credentials were not provided."
 * }
 *
 * status: 404
 * {
 *  "detail": "Not found."
 * }
 *
 * status: 409
 * {
 *  "detail":<something>
 * }
 *
 * status: 400
 * {
 *  "field_one" : ["list of things", "wrong with it"],
 *  "field_two" : ["list of things", "wrong with it"],
 *  "non_field_errors" : ["list of object level errors"]
 * }
 */

type ErrorMessageProps = {
  errorTitle: string;
  errorSubtitle: string;
  stateSegmentOfInterest:
    | 'main'
    | 'auth'
    | 'chronologicalUserProfile'
    | 'myd'
    | 'workflows'
    | 'workflowHistory';
  extraErrorMessages: { [key: string]: string };
};

ErrorMessage.defaultProps = {
  errorTitle: "Uh oh. There's been an error.",
  errorSubtitle:
    'Something went wrong when processing your last action. Details below.',
  extraErrorMessages: {},
};

export default function ErrorMessage({
  errorTitle,
  errorSubtitle,
  stateSegmentOfInterest,
  extraErrorMessages,
}: ErrorMessageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [
    internallyStoredErrorObject,
    setInternallyStoredErrorObject,
  ] = useState(null);

  /**
   * Grab all "error" keys from the various segments of the
   * Redux store. This doesn't mean there are errors. It just
   * identifies the parts of the store to look in.
   * */
  const errorObjects = useSelector((state: RootReduxType) => {
    const errors: { [key: string]: any } = {};

    Object.entries(state).forEach((entry) => {
      const [storeSegmentName, storeSegmentState] = entry;

      if (Object.keys(storeSegmentState).includes('error')) {
        errors[storeSegmentName] = storeSegmentState.error;
      }
    });

    return errors;
  });

  const user = useSelector((state: RootReduxType) => state.auth.user);

  const dispatch = useDispatch();

  /**
   * When an error is found in the Redux segment being
   * watched, store this internally.
   *
   * The reason we do this is because future successful
   * API calls will overwrite erase the error from the
   * Redux store.
   *
   * This can often happen when there are multiple
   * concurrent API requests. By storing the error locally
   * we can avoid losing this information.
   */
  useEffect(() => {
    if (errorObjects[stateSegmentOfInterest]) {
      setInternallyStoredErrorObject(errorObjects[stateSegmentOfInterest]);
      Sentry.captureEvent({
        message: 'An error modal was displayed to an end-user.',
        contexts: { errorInfo: errorObjects },
        user: { id: user.id ? user.id.toString() : 'Unknown' },
      });
    }
  }, [errorObjects[stateSegmentOfInterest]]);

  /**
   * Display/Hide the Modal
   */
  useEffect(() => {
    internallyStoredErrorObject
      ? // Not sure why, but setTimeout is need for iOS in some circumstances.
        setTimeout(() => setIsModalOpen(true), 500)
      : setIsModalOpen(false);
  }, [internallyStoredErrorObject]);

  return (
    <SolidTopModalWithCustomHeaderText
      isVisible={isModalOpen}
      cancelAction={() => null}
      completionAction={() => {
        setInternallyStoredErrorObject(null);
        setTimeout(() => {
          dispatch(clearUserProfileError());
          dispatch(authActions.clearError());
          dispatch(clearWorkflowsError());
          dispatch(clearWorkflowHistoryError());
        }, 750);
      }}
      animationIn='bounceIn'
      animationInDuration={2000}
      animationOut='bounceOut'
      animationOutDuration={1000}
      gradientStart={MasterStyles.officialColors.error}
      gradientEnd={MasterStyles.officialColors.groundSunflower4}
      contentComponent={ErrorModalContent}
      extraProps={{
        errorTitle,
        errorSubtitle,
        errorObject: internallyStoredErrorObject,
        extraErrorMessages,
      }}
    />
  );
}

function ErrorModalContent({
  acceptAction,
  containerHeight,
  extraProps,
}: {
  acceptAction: () => void;
  containerHeight: number;
  extraProps: {
    errorTitle: string;
    errorSubtitle: string;
    errorObject: any;
    extraErrorMessages: { [key: string]: string };
  };
}) {
  const [contentHeight, setContentHeight] = useState(0);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useEffect(() => {
    contentHeight + controlsHeight > containerHeight
      ? setScrollViewHeight(contentHeight + controlsHeight)
      : setScrollViewHeight(containerHeight);

    // console.log(
    //   'ErrorMessage: ',
    //   contentHeight,
    //   controlsHeight,
    //   containerHeight
    // );
  }, [contentHeight, controlsHeight, containerHeight]);

  const renderSimpleError = () => {
    return (
      <Text
        style={{
          ...MasterStyles.fontStyles.modalBody,
          textAlign: 'left',
        }}
      >
        {extraProps.errorObject.payload.detail}
      </Text>
    );
  };

  const renderComplexError = () => {
    return Object.entries(extraProps.errorObject!.payload).map(
      ([errorField, errorValues] = entry) => (
        <View style={{ marginBottom: 15 }} key={errorField}>
          <Text
            style={{
              ...MasterStyles.fontStyles.modalBody,
              textTransform: 'capitalize',
              textAlign: 'left',
              color: MasterStyles.officialColors.graphite,
              fontWeight: '500',
              fontFamily:
                Platform.OS === 'ios' ? 'System' : 'OpenSans-SemiBold',
            }}
          >
            {errorField.split('_').join(' ')}
          </Text>
          {errorValues.map((errorValue: string, index: number) => (
            <View key={index}>
              <Text
                style={{
                  ...MasterStyles.fontStyles.modalBody,
                  textAlign: 'left',
                }}
              >
                {`${errorValue} ${
                  extraProps.extraErrorMessages[errorField] ?? ''
                }`}
              </Text>
            </View>
          ))}
        </View>
      )
    );
  };

  return extraProps.errorObject ? (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ height: containerHeight }}
        contentContainerStyle={{
          minHeight: containerHeight,
          ...MasterStyles.common.horizontalPadding25,
          // backgroundColor: 'green',
        }}
        scrollEnabled={scrollViewHeight > containerHeight}
      >
        <View
          key='content'
          onLayout={(event) =>
            setContentHeight(event.nativeEvent.layout.height)
          }
          style={{ flex: 1 }}
        >
          <View key='titleAndSubtitle' style={{ paddingBottom: 35 }}>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalTitle,
                textAlign: 'left',
              }}
            >
              {extraProps.errorTitle}
            </Text>
            <Text
              style={{
                ...MasterStyles.fontStyles.modalBody,
                textAlign: 'left',
              }}
            >
              {extraProps.errorSubtitle}
            </Text>
          </View>
          {Object.keys(extraProps.errorObject.payload).includes('detail')
            ? renderSimpleError()
            : renderComplexError()}
        </View>
        <View
          onLayout={(event) =>
            setControlsHeight(event.nativeEvent.layout.height)
          }
        >
          <StylizedButton
            onPress={acceptAction}
            text='Ok'
            textColor={MasterStyles.officialColors.graphite}
            outlineColor={MasterStyles.officialColors.graphite}
            additionalContainerStyles={{ maxHeight: 50 }}
          />
        </View>
      </ScrollView>
    </View>
  ) : (
    <View style={{ flex: 1 }} />
  );
}
