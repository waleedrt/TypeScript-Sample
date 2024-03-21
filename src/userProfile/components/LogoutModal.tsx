import React from 'react';
import { Text, View } from 'react-native';
import PreviousNextButtonBar from '../../components/PreviousNextButtonBar';
import MasterStyles from '../../styles/MasterStyles';

type LogoutModalProps = {
  acceptAction: () => void;
  cancelAction: () => void;
  containerHeight: number;
};

function LogoutModal({
  acceptAction,
  cancelAction,
  containerHeight,
}: LogoutModalProps) {
  const renderActionBar = () => {
    return (
      <PreviousNextButtonBar
        previousText='Go Back'
        previousColor={MasterStyles.colors.white}
        previousTextColor={MasterStyles.officialColors.density}
        previousOutlineColor={MasterStyles.officialColors.density}
        previousAction={cancelAction}
        nextText='Log Me Out'
        nextColor={MasterStyles.colors.white}
        nextTextColor={MasterStyles.officialColors.density}
        nextOutlineColor={MasterStyles.officialColors.density}
        nextAction={acceptAction}
      />
    );
  };

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'space-between',
          height: containerHeight,
        },
        MasterStyles.common.horizontalPadding25,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={[MasterStyles.fontStyles.modalTitle, { textAlign: 'left' }]}
        >
          Log Out Confirmation
        </Text>
        <Text
          style={[
            MasterStyles.fontStyles.modalBody,
            { textAlign: 'left', paddingBottom: 10 },
          ]}
        >
          Are you sure that you want to logout of the app?
        </Text>
        <Text
          style={[MasterStyles.fontStyles.modalBody, { textAlign: 'left' }]}
        >
          Once you log out of the app, you will be immediately returned to the
          login page.
        </Text>
      </View>
      {renderActionBar()}
    </View>
  );
}

export default LogoutModal;
