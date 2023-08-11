const { randomBytes } = await import('node:crypto');

/**
 * Generate 32bit ID and return as 8 characters,
 * @returns generated id in `string`
 */
export const generateShortToken = (): string => {
  const buffer = randomBytes(4);
  const string = buffer.toString('hex');
  return string;
};
