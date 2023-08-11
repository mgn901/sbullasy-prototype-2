import { defaultCompareFn } from './defaultCompareFn';

export const intersection = <T>(a: T[], b: T[], compareFn?: (a: T, b: T) => number): T[] => {
  const cfn = compareFn ?? defaultCompareFn;
  const as = [...a].sort(cfn);
  const bs = [...b].sort(cfn);
  const matched: T[] = [];

  for (let i = 0, j = 0; i < a.length && j < b.length; ) {
    const result = cfn(as[i], bs[j]);
    if (result <= -1) i += 1;
    else if (result >= 1) j += 1;
    else {
      matched.push(as[i]);
      i += 1;
      j += 1;
    }
  }

  return matched;
};
