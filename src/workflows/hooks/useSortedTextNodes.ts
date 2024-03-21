import { useState, useEffect } from 'react';

import { WorkflowStepType, WorkflowStepTextType } from '../types';

export type TextNodeType = {
  order: number;
  header: WorkflowStepTextType | undefined;
  texts: Array<WorkflowStepTextType>;
};

/**
 * Organize text elements sent from API into a hierarchy
 * representing the different sections of the screen.
 */
const useSortedTextNodes = (step: WorkflowStepType): Array<TextNodeType> => {
  const [textNodes, setTextNodes] = useState<Array<TextNodeType>>([]);

  useEffect(() => {
    const unsortedTextElements = step.workflowsteptext_set;
    const sectionHeaders = unsortedTextElements
      .filter(text => text.ui_identifier.endsWith('header'))
      .map(text => ({
        ...text,
        section: Number(text.ui_identifier.split('_')[1])
      }));
    const sectionTexts = unsortedTextElements
      .filter(text => text.ui_identifier.includes('text'))
      .map(text => ({
        ...text,
        section: Number(text.ui_identifier.split('_')[1])
      }));

    const unsortedTextNodes = sectionTexts.reduce(
      (reduction: Array<TextNodeType>, currentText) => {
        const sectionNumber = Number(currentText.ui_identifier.split('_')[1]);

        if (!reduction.find(node => node.order === sectionNumber)) {
          reduction.push({
            order: sectionNumber,
            header: sectionHeaders.find(
              header => header.section === sectionNumber
            ),
            texts: sectionTexts
              .filter(text => text.section === sectionNumber)
              .sort(
                (elementOne, elementTwo) =>
                  elementOne.section - elementTwo.section
              )
          });
        }

        return reduction;
      },
      []
    );

    setTextNodes(
      unsortedTextNodes.sort((node1, node2) => node1.order - node2.order)
    );
  }, [step]);

  return textNodes;
};

export default useSortedTextNodes;
