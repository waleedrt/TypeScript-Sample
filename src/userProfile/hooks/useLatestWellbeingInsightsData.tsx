import { useSelector } from 'react-redux';
import { RootReduxType } from '../../../config/configureStore';

export default function useLatestWellbeingInsightsData() {
  const wellbeingInsights = useSelector(
    (state: RootReduxType) => state.chronologicalUserProfile.wellbeingInsights
  );

  const latestWellbeingInsightsRecord = wellbeingInsights.find(
    (dataSegment) => dataSegment.end === null
  );

  /**
   * If there is no current Wellbeing Insights record,
   * there is no need to proceed further.
   */
  if (!latestWellbeingInsightsRecord) return null;

  return latestWellbeingInsightsRecord.datagroups[0].subgroups.reduce(
    (previousValue: { [code: string]: [string, string] }, currentValue) => {
      return {
        ...previousValue,
        [currentValue.code]: currentValue.data,
      };
    },
    {}
  );
}
