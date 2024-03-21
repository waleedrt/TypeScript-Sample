// Maps stepType provided to one of the names of the step screens
// we implemented (these may change in the future, but wanted screens
// to remain the same)
export function convertStepType(stepType) {
  if (!stepType) return '';
  const split = stepType.split('_');
  const string = split[0];
  // const version = split[1];
  switch (string) {
    case 'instruction':
      return 'instruction';
    case 'reflection':
      return 'entry';
    case 'video':
      return 'video';
    case 'audio':
      return 'audio';
    case 'guided':
      return 'step';
    case 'affirmation':
      return 'affirmation';
    case 'scale':
      return 'scale';
    case 'myd':
      return convertStepType(split[1]); // scale
    default:
      return '';
  }
}

// Helper function to sort objects in array by object key
// ex: [{id: 3},{id: 1},{id: 2}] ==> [{id: 1},{id: 2},{id: 3}]
export function sortSteps(array, key = 'order') {
  if (!array || !array.length) { return array; }
  return array.sort((a, b) => {
    const x = a[key]; const y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
