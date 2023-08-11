import { defaultCompareFn } from './defaultCompareFn';

export const union = <T>(a: T[], b: T[], compareFn?: (a: T, b: T) => number): T[] => {
  const cfn = compareFn ?? defaultCompareFn;
  const notOmmited: readonly T[] = [...a, ...b].sort(cfn);
  const ommited: T[] = [];

  notOmmited.forEach((item) => {
    if (ommited.length === 0) {
      ommited.push(item);
      return;
    }
    if (cfn(item, ommited[ommited.length - 1]) === 0) {
      return;
    }
    ommited.push(item);
  });

  return ommited;
};
