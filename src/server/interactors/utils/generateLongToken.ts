const { randomBytes } = await import('node:crypto');

/**
 * Generate 384bit token and return as 64 characters,
 * @returns generated id in `string`
 */
export const generateLongToken = (): string => {
  const buffer = randomBytes(48);
  const string = buffer.toString('base64url');
  return string;
};
