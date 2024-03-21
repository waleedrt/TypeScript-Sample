import React, { useState, useRef, useEffect } from 'react';
import { Text, ScrollView, View, Image } from 'react-native';

import MasterStyles from '../../styles/MasterStyles';
import PreviousNextButtonBar from '../../components/PreviousNextButtonBar';
import consentData from '../../constants/consent';

type ConsentReviewModalContentProps = {
  containerHeight: number;
  toggleVisibility: () => void;
  isVisible: boolean;
};

/**
 * This component is accessible via the account settings screen
 * and allows the user to review the IRB consent form that
 * their agreed to when they first joined the study.
 */
function ConsentReviewModalContent({
  containerHeight,
  toggleVisibility,
  isVisible,
}: ConsentReviewModalContentProps) {
  const [step, setStep] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollView = useRef<ScrollView>(null);

  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => {
        setStep(0);
      }, 500);
    }
  }, [isVisible]);

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const renderConsentPiece = () => {
    return (
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
          <Image
            source={consentData[step].image!}
            style={{ marginBottom: 15 }}
          />
        ) : (
          <></>
        )}
        <Text
          style={[MasterStyles.fontStyles.modalTitle, { paddingBottom: 25 }]}
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
  };

  const ActionBar = () => {
    const previousText = step === 0 ? 'Cancel' : 'Back';
    const nextText = step === 5 ? 'Done' : 'Next';

    const previousAction = step !== 0 ? previousStep : toggleVisibility;
    const nextAction =
      step !== 5
        ? nextStep
        : () => {
            setTimeout(() => setStep(0), 1000);
            toggleVisibility();
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
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: MasterStyles.colors.white }}>
      <ScrollView
        style={[
          {
            height: containerHeight,
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
          if (scrollView.current)
            scrollView.current.scrollTo({ x: 0, y: 0, animated: false });
        }}
        scrollEnabled={scrollViewHeight + 50 > containerHeight}
      >
        {renderConsentPiece()}
        <View
          style={
            scrollViewHeight + 50 <= containerHeight
              ? { position: 'absolute', bottom: -20, left: 25, width: '100%' }
              : { width: '100%' }
          }
        >
          <ActionBar />
        </View>
      </ScrollView>
    </View>
  );
}

export default ConsentReviewModalContent;
