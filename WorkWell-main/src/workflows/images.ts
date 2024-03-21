export const defaultImages = [
  require('../../assets/workflows/default-1.jpg'),
  require('../../assets/workflows/default-2.jpg'),
  require('../../assets/workflows/default-3.jpg'),
  require('../../assets/workflows/default-4.jpg'),
  require('../../assets/workflows/default-5.jpg'),
  require('../../assets/workflows/default-6.jpg'),
];

export const defaultIndividualWorkflowImages = [
  require('../../assets/workflows/genericWorkflowCard1.jpg'),
  require('../../assets/workflows/genericWorkflowCard2.jpg'),
  require('../../assets/workflows/genericWorkflowCard3.jpg'),
  require('../../assets/workflows/genericWorkflowCard4.jpg'),
  require('../../assets/workflows/genericWorkflowCard5.jpg'),
  require('../../assets/workflows/genericWorkflowCard6.jpg'),
  require('../../assets/workflows/genericWorkflowCard7.jpg'),
  require('../../assets/workflows/genericWorkflowCard8.jpg'),
  require('../../assets/workflows/genericWorkflowCard9.jpg'),
  require('../../assets/workflows/genericWorkflowCard10.jpg'),
  require('../../assets/workflows/genericWorkflowCard11.jpg'),
  require('../../assets/workflows/genericWorkflowCard12.jpg'),
];

export const randomWorkflowBackgroundImage = () => {
  const randomIndex = Math.floor(
    Math.random() * Math.floor(defaultImages.length)
  );
  return defaultImages[randomIndex];
};
