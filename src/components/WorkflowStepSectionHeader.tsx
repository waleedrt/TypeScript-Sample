import React from 'react';
import { Text, View, StyleSheet, LayoutChangeEvent } from 'react-native';

// Definitions
import MasterStyles from '../styles/MasterStyles';

// Components
import XButton from './XButton';

const styles = StyleSheet.create({
  subtext: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '300',
    color: MasterStyles.colors.white,
    paddingRight: 25,
    paddingBottom: 5,
  },
  divider: {
    borderBottomColor: MasterStyles.colors.white,
    width: '100%',
  },
});

type WorkflowStepSectionHeaderType = {
  text: string;
  subtext?: string;
  cancelAction: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
  layoutIndex: number;
};

WorkflowStepSectionHeader.defaultProps = {
  cancelAction: () => null,
  onLayout: (event: LayoutChangeEvent) => null,
};

/**
 * For Workflow Steps with section headers
 */
export default function WorkflowStepSectionHeader({
  text,
  subtext,
  cancelAction,
  onLayout,
  layoutIndex,
}: WorkflowStepSectionHeaderType) {
  return (
    <View onLayout={onLayout} style={{ marginBottom: 20 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginHorizontal: 25,
          paddingBottom: subtext ? 10 : 5,
        }}
      >
        <Text
          style={[
            MasterStyles.fontStyles.contentHeader,
            { flex: 1, marginRight: 50 },
            layoutIndex !== 0
              ? {
                  fontSize: MasterStyles.fontStyles.contentHeader.fontSize - 3,
                }
              : null,
          ]}
        >
          {text}
        </Text>
        {layoutIndex === 0 ? <XButton onPress={cancelAction} /> : null}
      </View>
      <View
        style={
          layoutIndex === 0 ? { paddingLeft: 25 } : { paddingHorizontal: 25 }
        }
      >
        {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
        <View
          style={[
            styles.divider,
            layoutIndex === 0
              ? { borderBottomWidth: 2 }
              : { borderBottomWidth: 1 },
          ]}
        />
      </View>
    </View>
  );
}
