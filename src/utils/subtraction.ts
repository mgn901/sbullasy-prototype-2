import { defaultCompareFn } from './defaultCompareFn';

export const subtraction = <T>(
  minuend: T[],
  subtrahend: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const cfn = compareFn ?? defaultCompareFn;
  const m = [...minuend].sort(cfn);
  const s = [...subtrahend].sort(cfn);
  const matched: T[] = [];

  for (let i = 0, j = 0; i < m.length && j < s.length; ) {
    const result = cfn(m[i], s[j]);

    if (result < 0) {
      matched.push(m[i]);
      i += 1;
    } else if (result > 0) {
      j += 1;
    } else {
      i += 1;
      j += 1;
    }

    if (j === s.length) {
      const rest = m.slice(i);
      while (cfn(rest[0], s[j - 1]) === 0 || cfn(rest[0], matched[matched.length - 1]) === 0) {
        rest.shift();
      }
      matched.push(...rest);
    }
  }

  return matched;
};
