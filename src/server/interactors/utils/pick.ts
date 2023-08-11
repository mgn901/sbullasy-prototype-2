export const pick = <T extends object, K extends keyof T & (string | number | symbol)>(
  object: T,
  keys: K[],
): Pick<T, K> => keys.reduce((result, key) => ({ ...result, key: object[key] }), {}) as Pick<T, K>;
