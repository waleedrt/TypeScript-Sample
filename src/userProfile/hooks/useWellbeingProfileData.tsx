import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootReduxType } from '../../../config/configureStore';
import { WellbeingSurveyDimensionResult } from '../types';

export type useWellbeingProfileDataProcessedDimensions = {
  [code: string]: useWellbeingProfileDataProcessedDimension;
};

export type useWellbeingProfileDataProcessedDimension = {
  label: string;
  score: number;
  description: string;
  subdimensions: Array<{
    code: string;
    label: string;
    score: number;
    description: string;
  }>;
};

const reducer = (
  previousValue: useWellbeingProfileDataProcessedDimensions,
  currentValue: WellbeingSurveyDimensionResult
) => {
  return {
    ...previousValue,
    [currentValue.code]: {
      label: currentValue.label,
      score: (currentValue.data / 100) * 5,
      description: currentValue.description,
      subdimensions: currentValue.subgroups.map((subdimension) => ({
        code: subdimension.code,
        label: subdimension.label,
        score: (subdimension.data / 100) * 5,
        description: subdimension.description,
      })),
    },
  };
};

/**
 * A custom hook which extracts the current and previous
 * sets of Wellbeing data from the Redux store for the user
 * if they exist.
 */
export default function useWellbeingProfileData() {
  const wellbeingData = useSelector(
    (state: RootReduxType) => state.chronologicalUserProfile.wellbeing
  );

  return useMemo(() => {
    const wellbeingDataOfInterest: {
      current: useWellbeingProfileDataProcessedDimensions | null;
      previous: useWellbeingProfileDataProcessedDimensions | null;
    } = {
      current: null,
      previous: null,
    };

    if (!wellbeingData.length) {
      return wellbeingDataOfInterest;
    }

    const latestWellbeingData = wellbeingData.find(
      (dataSegment) => dataSegment.end === null
    );

    // No need to proceed further if we can't find current
    // wellbeing data.
    if (!latestWellbeingData) {
      return wellbeingDataOfInterest;
    }

    const previousWellbeingData = wellbeingData.find(
      (dataSegment) => dataSegment.end === latestWellbeingData.start
    );

    wellbeingDataOfInterest.current = latestWellbeingData.datagroups[0].subgroups.reduce(
      reducer,
      {}
    );

    if (previousWellbeingData) {
      wellbeingDataOfInterest.previous = previousWellbeingData.datagroups[0].subgroups.reduce(
        reducer,
        {}
      );
    }

    return wellbeingDataOfInterest;
  }, [wellbeingData]);
}
