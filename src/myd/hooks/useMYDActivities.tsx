import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootReduxType } from '../../../config/configureStore';
import { MYDActivityType, MYDAssignmentType } from '../types';

/**
 * Generate sorted version of the MYD activities
 * and assignments from the Redux store. Be careful
 * about changing this as we've taken care to arrange
 * activities not by the strict chronology
 * but how they map to the user's specification of morning,
 * afternoon, and end of day.
 */
export default function useSortedMYDActivitiesAndAssignments(): [
  MYDActivityType[] | null,
  MYDAssignmentType[] | null
] {
  const [sortedAssignments, setSortedAssignments] = useState<Array<
    MYDAssignmentType
  > | null>(null);
  const [sortedActivities, setSortedActivities] = useState<Array<
    MYDActivityType
  > | null>(null);

  const unsortedAssignments = useSelector(
    (state: RootReduxType) => state.myd.assignments
  );
  const unsortedActivities = useSelector(
    (state: RootReduxType) => state.myd.activities
  );

  useEffect(() => {
    if (!unsortedActivities.length || !unsortedAssignments.length) {
      return; // Not ready to process data.
    }

    const sortedActivities: Array<MYDActivityType> = [];

    // Put activities into `inProcessSortedActivities` in the correct order.
    ['morning', 'afternoon', 'end of day'].forEach((scheduleBlock) => {
      const matchingActivity = unsortedActivities.find(
        (activity) => activity.schedule_block.toLowerCase() === scheduleBlock
      );

      if (matchingActivity) sortedActivities.push(matchingActivity);
    });

    const sortedAssignments = sortedActivities.reduce(
      (reductionArray: Array<MYDAssignmentType>, activity: MYDActivityType) => {
        const matchingAssignment = unsortedAssignments.find(
          (assignment) => assignment.activity === activity.detail
        );

        return matchingAssignment
          ? [...reductionArray, matchingAssignment]
          : reductionArray;
      },
      []
    );
    setSortedActivities(sortedActivities);
    setSortedAssignments(sortedAssignments);
  }, [unsortedActivities.length, unsortedAssignments.length]);

  // Note to self, useEffect is triggered after the initial render.
  // So the initial valus of sortedActivities & sortedAssignments is
  // always going to be an empty array.
  return [sortedActivities, sortedAssignments];
}
