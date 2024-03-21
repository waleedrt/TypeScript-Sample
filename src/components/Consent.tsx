import React, { useState, useRef } from 'react';
import { Text, ScrollView, View, Image } from 'react-native';

import MasterStyles from '../styles/MasterStyles';
import PreviousNextButtonBar from './PreviousNextButtonBar';
import consentData from '../constants/consent';

/**
 * Component that renders the various steps of the IRB Consent Document.
 */
function Consent({
  acceptAction,
  cancelAction,
  containerHeight,
}: {
  acceptAction: () => void;
  cancelAction: () => void;
  containerHeight: number;
}) {
  const [step, setStep] = useState(0);
  const [actionSubmitted, setActionSubmitted] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollView = useRef<ScrollView>(null);

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const renderConsentPiece = (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onLayout={(event) => {
        setScrollViewHeight(event.nativeEvent.layout.height);
      }}
    >
      {consentData[step].image ? (
        // @ts-ignore
        <Image source={consentData[step].image} style={{ marginBottom: 15 }} />
      ) : null}

      <Text
        style={[
          MasterStyles.fontStyles.modalTitle,
          { paddingBottom: 25, textAlign: 'center' },
        ]}
      >
        {consentData[step].title}
      </Text>

      {consentData[step].content.map((contentItem, index) => (
        <Text
          style={[MasterStyles.fontStyles.modalBody, { paddingBottom: 10 }]}
          key={index}
        >
          {contentItem}
        </Text>
      ))}
    </View>
  );

  const ActionBar = () => {
    const previousText = step === 0 ? 'Cancel' : 'Back';
    const nextText = step === 6 ? 'I Agree' : 'Next';

    const previousAction = step !== 0 ? previousStep : cancelAction;
    const nextAction =
      step !== 6
        ? nextStep
        : () => {
            setActionSubmitted(true);
            acceptAction();

            // Reset the step to 0 after the transition out finishes.
            setTimeout(() => {
              setStep(0);
              setActionSubmitted(false);
            }, 1000);
          };

    return (
      <PreviousNextButtonBar
        previousText={previousText}
        previousColor={MasterStyles.colors.white}
        previousTextColor={MasterStyles.officialColors.graphite}
        previousOutlineColor={MasterStyles.officialColors.graphite}
        previousAction={previousAction}
        nextText={nextText}
        nextColor={MasterStyles.colors.white}
        nextTextColor={MasterStyles.officialColors.graphite}
        nextOutlineColor={MasterStyles.officialColors.graphite}
        nextAction={nextAction}
        nextDisabled={actionSubmitted}
        additionalStyles={
          scrollViewHeight + 50 <= containerHeight
            ? { position: 'absolute', bottom: -20, left: 25, width: '100%' }
            : { width: '100%' }
        }
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[
          {
            height: containerHeight,
            backgroundColor: MasterStyles.colors.white,
          },
        ]}
        contentContainerStyle={[
          {
            minHeight: containerHeight,
          },
          MasterStyles.common.horizontalPadding25,
        ]}
        ref={scrollView}
        onContentSizeChange={() => {
          if (scrollView.current) {
            scrollView.current.scrollTo({ x: 0, y: 0, animated: false });
          }
        }}
        scrollEnabled={scrollViewHeight + 50 > containerHeight}
      >
        {renderConsentPiece}
        {ActionBar()}
      </ScrollView>
    </View>
  );
}

export default Consent;
