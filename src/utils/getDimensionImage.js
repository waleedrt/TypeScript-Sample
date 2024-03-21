import {
  dimensionMap,
  dimensionImageBuckets,
  dimensionImages
} from '../constants/dimensionConstants';

/**
 * Return the correct dimension image when given an object with
 * the dimension's code and score.
 *
 * @param {Object} dimensionData An object containing the dimension score along with other data.
 */
export default function getDimensionImage(dimensionData) {
  const dimensionNumber = dimensionMap[dimensionData.code];
  const dimensionScore = dimensionData.data.data;
  const level = dimensionImageBuckets.find(bucket => bucket > dimensionScore);
  return dimensionImages[level][dimensionNumber];
}
