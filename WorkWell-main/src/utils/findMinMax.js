export function findMinMax(arr, idx) {
  let min = arr[0][idx];
  let max = arr[0][idx];

  for (let i = 1, len = arr.length; i < len; i += 1) {
    const v = arr[i].y;
    min = (v < min) ? v : min;
    max = (v > max) ? v : max;
  }

  return [min, max];
}

export function findMinMaxIndex(arr, idx) {
  let min = 0;
  let max = 0;

  for (let i = 0; i < arr.length; i += 1) {
    const v = arr[i][idx];
    min = (v < arr[min][idx]) ? i : min;
    max = (v > arr[max][idx]) ? i : max;
  }

  return [min, max];
}
