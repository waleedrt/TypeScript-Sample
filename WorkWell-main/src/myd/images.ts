export const defaultImages = [
  require('../../assets/myd/default-1.jpg'),
  require('../../assets/myd/default-2.jpg'),
  require('../../assets/myd/default-3.jpg'),
  require('../../assets/myd/default-4.jpg'),
  require('../../assets/myd/default-5.jpg'),
  require('../../assets/myd/default-6.jpg'),
  require('../../assets/myd/default-7.jpg')
];

export const randomBackgroundImage = () => {
  const randomIndex = Math.floor(
    Math.random() * Math.floor(defaultImages.length)
  );
  return defaultImages[randomIndex];
};
