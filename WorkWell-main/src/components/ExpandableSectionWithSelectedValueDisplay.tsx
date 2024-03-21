import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import MasterStyles from '../styles/MasterStyles';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  text: {
    fontFamily: 'System',
    fontSize: 20,
    color: MasterStyles.colors.white
  }
});

type ExpandableSectionWithSelectedValueDisplayProps = {
  text: string;
  expanded: boolean;
  selectedValueComponent?: () => React.ReactNode;
  visible: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

export default function ExpandableSectionWithSelectedValueDisplay({
  text,
  selectedValueComponent = () => null,
  expanded,
  visible,
  onPress = () => null,
  children
}: ExpandableSectionWithSelectedValueDisplayProps) {
  return !visible ? (
    <></>
  ) : (
    <View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={styles.text}>{text}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center'
          }}
        >
          {selectedValueComponent()}
          <Entypo
            name={expanded ? 'chevron-small-down' : 'chevron-small-right'}
            size={36}
            color='white'
            style={{ marginTop: -5, marginBottom: -5 }}
          />
        </View>
      </TouchableOpacity>
      {expanded ? children : null}
    </View>
  );
}
