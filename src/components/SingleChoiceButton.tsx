import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';

import MasterStyles from '../styles/MasterStyles';
import { WorkflowEngagementQuestionOptionType } from '../workflows/types';

const availableImages: { [key: string]: number } = {
  'icons/faceVeryPositive.png': require('../../assets/icons/faceVeryPositive.png'),
  'icons/facePositive.png': require('../../assets/icons/facePositive.png'),
  'icons/faceNeutral.png': require('../../assets/icons/faceNeutral.png'),
  'icons/faceNegative.png': require('../../assets/icons/faceNegative.png'),
  'icons/faceVeryNegative.png': require('../../assets/icons/faceVeryNegative.png'),
  'icons/singleChoice.png': require('../../assets/icons/singleChoice.png'),
  'icons/singleChoiceUnselected.png': require('../../assets/icons/singleChoiceUnselected.png'),
  'icons/singleChoiceSelected.png': require('../../assets/icons/singleChoiceSelected.png')
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15
  },
  unselectedImage: {
    opacity: 0.5
  },
  text:
    Platform.OS === 'ios'
      ? {
          fontFamily: 'System',
          fontSize: 20,
          color: MasterStyles.colors.white,
          paddingLeft: 10
        }
      : {
          fontFamily: 'OpenSans-Regular',
          fontSize: 18,
          color: MasterStyles.colors.white,
          paddingLeft: 10
        },
  unSelected: {
    color: MasterStyles.colors.semiTransparentWhite
  }
});

/**
 * SingleChoiceButton
 *
 * A component that is used to render an option for a single choice question.
 */
export default function SingleChoiceButton({
  option,
  selectedOption,
  onPress
}: {
  option: WorkflowEngagementQuestionOptionType;
  selectedOption: WorkflowEngagementQuestionOptionType | null;
  onPress: () => void;
}) {
  /**
   * Determine if the default images should be used or if
   * the user has specified something else.
   */
  const imageSource = () => {
    if (option.image) {
      return option.image.startsWith('http')
        ? { uri: option.image }
        : availableImages[option.image];
    } else {
      return selectedOption === option
        ? availableImages['icons/singleChoiceSelected.png']
        : selectedOption !== option
        ? availableImages['icons/singleChoiceUnselected.png']
        : availableImages['icons/singleChoice.png'];
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image
        source={imageSource()}
        style={
          option.image
            ? option === selectedOption
              ? null
              : styles.unselectedImage
            : null
        }
        resizeMode='contain'
      />
      <Text
        style={[
          styles.text,
          selectedOption === option || selectedOption === null
            ? null
            : styles.unSelected
        ]}
      >
        {option.content}
      </Text>
    </TouchableOpacity>
  );
}

SingleChoiceButton.propTypes = {
  option: PropTypes.object.isRequired,
  selectedOption: PropTypes.object,
  onPress: PropTypes.func.isRequired
};
