/**
 * InstructionalV1
 *
 * This component is one of many screens that may be displayed
 * to the user during an engagement with a WorkflowCollection.
 *
 * For this screen to be displayed, the `ui_template` specified
 * in the current Workflow's current step must be 'reflection_v1'
 */
import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import useSortedTextNodes, {
  TextNodeType,
} from '../../../hooks/useSortedTextNodes';
import useBackgroundImage from '../../../hooks/useBackgroundImage';
import WorkflowStepSectionHeader from '../../../../components/WorkflowStepSectionHeader';
import GenericStepRenderer from '../../GenericStepRenderer';
import MasterStyles from '../../../../styles/MasterStyles';
import { DynamicUITemplateType } from '../../../types';
import XButton from '../../../../components/XButton';

export default function InstructionalV1({
  step,
  backAction,
  nextAction,
  cancelAction,
}: DynamicUITemplateType) {
  const textHierarchy = useSortedTextNodes(step);
  const backgroundImageURL = useBackgroundImage(step);

  const nodeRenderer = (nodesToRender: Array<TextNodeType>) => {
    return nodesToRender.map((node, index) => (
      <View
        key={index}
        style={{ paddingTop: index !== 0 && node.header ? 50 : 0 }}
      >
        {node.header ? (
          <WorkflowStepSectionHeader
            text={node.header.content}
            cancelAction={cancelAction}
            layoutIndex={index}
          />
        ) : null}
        <View style={MasterStyles.common.horizontalPadding25}>
          {node.texts.map((text, textIndex) =>
            // The XButton should be displayed on the first stepText
            // if the first node being evaluated doesn't have a header
            // component.
            node.header || index !== 0 || textIndex !== 0 ? (
              <Text
                style={[
                  MasterStyles.fontStyles.generalContent,
                  { paddingBottom: 10 },
                ]}
                key={text.ui_identifier}
              >
                {text.content}
              </Text>
            ) : (
              <View
                key={text.ui_identifier}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Text
                  style={[
                    MasterStyles.fontStyles.generalContent,
                    { flex: 1, paddingBottom: 10 },
                  ]}
                >
                  {text.content}
                </Text>
                <XButton
                  containerStyle={{ paddingLeft: 25 }}
                  onPress={cancelAction}
                />
              </View>
            )
          )}
        </View>
      </View>
    ));
  };

  return (
    <GenericStepRenderer
      nodeRenderer={() => nodeRenderer(textHierarchy)}
      backAction={backAction}
      nextAction={nextAction}
      backgroundImage={backgroundImageURL}
    />
  );
}

InstructionalV1.propTypes = {
  workflow: PropTypes.object.isRequired,
  step: PropTypes.object.isRequired,
  cancelAction: PropTypes.func.isRequired,
  nextAction: PropTypes.func.isRequired,
  backAction: PropTypes.func.isRequired,
};
