/**
 * Binarycally searches element in array or last element lower than searched
 * @param getter Function to convert array element to comparable with searched element
 */
export const binSearch = <T>(
  arr: T[],
  el: number,
  getter: (i: number) => number
): number => {
  let s = 0,
    e = arr.length - 1;

  while (s <= e) {
    const c = (s + e) >> 1;
    if (el > getter(c)) s = c + 1;
    else if (el < getter(c)) e = c - 1;
    else return c;
  }

  return s - 1;
};
