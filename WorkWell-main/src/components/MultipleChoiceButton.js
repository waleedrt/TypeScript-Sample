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

const multipleChoiceUnselected = require('../../assets/icons/multipleChoiceUnselected.png');
const multipleChoiceSelected = require('../../assets/icons/multipleChoiceSelected.png');

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15
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

export default function MultipleChoiceButton({
  option,
  selectedOptions,
  onPress
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image
        source={
          selectedOptions.includes(option.content)
            ? multipleChoiceSelected
            : multipleChoiceUnselected
        }
      />
      <Text
        style={[
          styles.text,
          selectedOptions.length && !selectedOptions.includes(option.content)
            ? styles.unSelected
            : null
        ]}
      >
        {option.content}
      </Text>
    </TouchableOpacity>
  );
}

MultipleChoiceButton.propTypes = {
  option: PropTypes.object.isRequired,
  selectedOptions: PropTypes.array.isRequired
};
