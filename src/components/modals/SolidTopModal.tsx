import React, { useState, ReactNode } from 'react';
import { View, Image } from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';

import MasterStyles from '../../styles/MasterStyles';
import ModalStyles from '../../styles/ModalStyles';

interface ModalContentComponentProps {
  cancelAction: () => void;
  acceptAction: () => void;
  containerHeight: number;
  extraProps: any;
}

type SolidTopModalProps = {
  isVisible: boolean;
  cancelAction: () => void;
  completionAction: () => void;
  contentComponent: (props: ModalContentComponentProps) => ReactNode;
  gradientStart: string;
  gradientEnd: string;
  animationIn: 'fadeIn' | 'bounceIn';
  animationOut: 'fadeOut' | 'bounceOut';
  animationInDuration: number;
  animationOutDuration: number;
  extraProps: object;
};

SolidTopModal.defaultProps = {
  gradientStart: MasterStyles.officialColors.brightSkyShade2,
  gradientEnd: MasterStyles.officialColors.mermaidShade2,
  animationIn: 'fadeIn',
  animationOut: 'fadeOut',
  animationInDuration: 1000,
  animationOutDuration: 500,
  extraProps: {},
};

/**
 * A Modal component with the WorkWell icon centered in
 * a blue->green banner locked to the top of the modal.
 */
function SolidTopModal({
  isVisible,
  cancelAction,
  completionAction,
  contentComponent,
  gradientStart,
  gradientEnd,
  animationIn,
  animationOut,
  animationInDuration,
  animationOutDuration,
  extraProps,
}: SolidTopModalProps) {
  const [modalHeight, setModalHeight] = useState<number>(0);

  return (
    <Modal
      isVisible={isVisible}
      style={{ flex: 1 }}
      animationIn={animationIn}
      animationOut={animationOut}
      animationInTiming={animationInDuration}
      animationOutTiming={animationOutDuration}
      backdropTransitionOutTiming={0}
    >
      <View
        style={ModalStyles.modal}
        onLayout={(event) =>
          setModalHeight(event.nativeEvent.layout.height - 150)
        }
      >
        <LinearGradient
          key='modalGraphicHeader'
          colors={[gradientStart, gradientEnd]}
          start={[0, 1]}
          end={[1, 1]}
          style={{
            minHeight: 120,
            position: 'absolute',
            zIndex: -10,
            width: '100%',
            borderRadius: 10,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../../assets/logo/logo-white.png')}
            style={{
              maxHeight: 40,
              resizeMode: 'contain',
              marginBottom: 10,
            }}
          />
        </LinearGradient>

        <View
          key='contentContainer'
          style={{
            position: 'absolute',
            flex: 1,
            top: 100,
            zIndex: 10,
            width: '100%',
            backgroundColor: MasterStyles.colors.white,
          }}
        >
          <View style={[{ paddingTop: 25, flex: 1 }]}>
            {contentComponent({
              cancelAction: cancelAction,
              acceptAction: completionAction,
              containerHeight: modalHeight,
              extraProps,
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default SolidTopModal;
