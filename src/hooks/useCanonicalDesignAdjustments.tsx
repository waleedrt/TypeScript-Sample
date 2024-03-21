import { useMemo } from 'react';
import { Dimensions } from 'react-native';

/**
 * Custom hook which provides percentage calculations on how the
 * current device screen size varies from the canonical design size.
 */
export default function useCanonicalDesignAdjustments() {
  const canonical_phone_dimensions = {
    width: 375,
    height: 812
  };

  const actual_phone_dimensions = Dimensions.get('window');

  return useMemo(
    () => ({
      height:
        actual_phone_dimensions.height / canonical_phone_dimensions.height,
      width: actual_phone_dimensions.width / canonical_phone_dimensions.width
    }),
    [actual_phone_dimensions]
  );
}
