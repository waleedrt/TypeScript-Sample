import React, { useState } from 'react';
import { View, Image } from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';

import MasterStyles from '../../styles/MasterStyles';
import ModalStyles from '../../styles/ModalStyles';
import XButton from '../XButton';

type contentComponentProps = {
  containerHeight: number;
  toggleVisibility: () => void;
  isVisible: boolean;
};

type RibbonModalProps = {
  isVisible: boolean;
  toggleVisibility: () => void;
  ContentComponent: (props: contentComponentProps) => JSX.Element | null;
};

/**
 * A Modal component with the WorkWell icon centered in
 * a blue->green banner locked near the top of the modal.
 *
 * Also includes an X button to close the modal.
 */
function RibbonModal({
  isVisible,
  toggleVisibility,
  ContentComponent,
}: RibbonModalProps) {
  const [modalHeight, setModalHeight] = useState(0);
  const [ribbonAndXButtonHeight, setRibbonAndXButtonHeight] = useState(0);

  return (
    <Modal
      isVisible={isVisible}
      style={{ flex: 1 }}
      animationIn='fadeIn'
      animationOut='fadeOut'
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
    >
      <View
        style={ModalStyles.modal}
        onLayout={(event) => {
          setModalHeight(event.nativeEvent.layout.height);
        }}
      >
        <View
          style={{ width: '100%' }}
          onLayout={(event) => {
            setRibbonAndXButtonHeight(event.nativeEvent.layout.height);
          }}
        >
          <XButton
            dark={true}
            containerStyle={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexBasis: 35,
              width: '100%',
              paddingRight: 10,
            }}
            onPress={toggleVisibility}
          />
          <LinearGradient
            key='modalGraphicHeader'
            colors={[
              MasterStyles.officialColors.brightSkyShade2,
              MasterStyles.officialColors.mermaidShade2,
            ]}
            start={[0, 1]}
            end={[1, 1]}
            style={{
              flexBasis: 100,
              maxHeight: 100,
              width: '100%',
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
              }}
            />
          </LinearGradient>
        </View>

        <View
          style={{
            paddingTop: 25,
            paddingBottom: 25,
            flex: 1,
          }}
        >
          <ContentComponent
            containerHeight={modalHeight - ribbonAndXButtonHeight - 50}
            toggleVisibility={toggleVisibility}
            isVisible={isVisible}
          />
        </View>
      </View>
    </Modal>
  );
}

export default RibbonModal;
