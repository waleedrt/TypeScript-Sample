// Inspired by Immutable Update Patterns
// https://github.com/reduxjs/redux/blob/master/docs/recipes/reducers/ImmutableUpdatePatterns.md

export function updateItem(array, itemUpdates, idx = 'id') {
  return array.map(item => {
    if (item[idx] !== itemUpdates[idx]) {
      // This isn't the item we care about - keep it as-is
      return item;
    }

    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      ...itemUpdates
    };
  });
}

export function insertItem(array, newItem) {
  const newArray = array.slice();
  newArray.splice(newArray.length, 0, newItem);
  return newArray;
}

export function updateOrInsertItem(array, itemUpdates, idx = 'id') {
  const itemExists = array.find(item => item[idx] === itemUpdates[idx]);
  if (itemExists) {
    return updateItem(array, itemUpdates, idx);
  }
  return insertItem(array, itemUpdates);
}

export function removeItem(array, itemToRemove, idx = 'id') {
  return array.filter(item => item[idx] !== itemToRemove[idx]);
}
